export interface RtkResult {
  output: string;
  originalTokens: number;
  compressedTokens: number;
  savedRatio: number;
  filters: string[];
}

function tokens(s: string): number {
  return Math.max(1, Math.ceil(s.length / 4));
}

function looksLikeGitDiff(text: string): boolean {
  return (
    /^diff --git /m.test(text) ||
    /^index [0-9a-f]+\.\./m.test(text) ||
    /^@@ -\d+/m.test(text)
  );
}

function compressGitDiff(text: string): string {
  const lines = text.split("\n");
  const kept: string[] = [];
  for (const line of lines) {
    if (
      line.startsWith("diff --git") ||
      line.startsWith("+++") ||
      line.startsWith("---") ||
      line.startsWith("@@") ||
      line.startsWith("+") ||
      line.startsWith("-") ||
      line.startsWith("rename ") ||
      line.startsWith("new file") ||
      line.startsWith("deleted file")
    ) {
      if (line.startsWith("+++") || line.startsWith("---")) {
        kept.push(line.replace(/\t.*$/, ""));
      } else {
        kept.push(line);
      }
    }
  }
  return kept.join("\n");
}

function looksLikeLs(text: string): boolean {
  return (
    /^total \d+/m.test(text) ||
    /^[d-][rwx-]{9}\s+\d+/m.test(text) ||
    /^drwx/m.test(text)
  );
}

function compressLs(text: string): string {
  const names = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const parts = l.split(/\s+/);
      return parts[parts.length - 1] ?? l;
    });
  return names.join("\n");
}

function looksLikeGrep(text: string): boolean {
  return /^[^:\n]+:\d+:/.test(text) || (text.match(/:[0-9]+:/g) ?? []).length > 4;
}

function compressGrep(text: string): string {
  const byFile = new Map<string, number>();
  const samples: string[] = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^([^:]+):(\d+):(.*)$/);
    if (!m) continue;
    const file = m[1] ?? "";
    byFile.set(file, (byFile.get(file) ?? 0) + 1);
    if (samples.length < 12) samples.push(`${file}:${m[2]}:${(m[3] ?? "").trim()}`);
  }
  const summary = [...byFile.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([f, n]) => `${n}\t${f}`)
    .join("\n");
  return `grep hits\n${summary}\n\nsamples\n${samples.join("\n")}`;
}

function looksLikeTree(text: string): boolean {
  return /[├└│]/.test(text) || /^[\s]*[|`]--/.test(text);
}

function compressTree(text: string): string {
  return text
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => l.replace(/[├└│─|`]+/g, " ").replace(/\s+/g, " ").trim())
    .join("\n");
}

function looksLikeJson(text: string): boolean {
  const t = text.trim();
  return (t.startsWith("{") && t.endsWith("}")) || (t.startsWith("[") && t.endsWith("]"));
}

function compressJson(text: string): string {
  try {
    const parsed: unknown = JSON.parse(text);
    return JSON.stringify(parsed);
  } catch {
    return text;
  }
}

function dedupLines(text: string): string {
  const seen = new Set<string>();
  const out: string[] = [];
  let repeats = 0;
  for (const line of text.split("\n")) {
    const key = line.trim();
    if (!key) {
      out.push(line);
      continue;
    }
    if (seen.has(key)) {
      repeats += 1;
      continue;
    }
    seen.add(key);
    out.push(line);
  }
  if (repeats > 2) out.push(`… ${repeats} duplicate lines dropped`);
  return out.join("\n");
}

function smartTruncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  const head = text.slice(0, Math.floor(maxChars * 0.7));
  const tail = text.slice(-Math.floor(maxChars * 0.25));
  return `${head}\n… [${text.length - maxChars} chars truncated] …\n${tail}`;
}

export function compressRtk(text: string, enabled = true): RtkResult {
  const originalTokens = tokens(text);
  if (!enabled || !text.trim()) {
    return {
      output: text,
      originalTokens,
      compressedTokens: originalTokens,
      savedRatio: 0,
      filters: [],
    };
  }

  let output = text;
  const filters: string[] = [];

  if (looksLikeGitDiff(output)) {
    output = compressGitDiff(output);
    filters.push("git-diff");
  }
  if (looksLikeLs(output)) {
    output = compressLs(output);
    filters.push("ls");
  }
  if (looksLikeGrep(output)) {
    output = compressGrep(output);
    filters.push("grep");
  }
  if (looksLikeTree(output)) {
    output = compressTree(output);
    filters.push("tree");
  }
  if (looksLikeJson(output)) {
    const compact = compressJson(output);
    if (compact.length < output.length) {
      output = compact;
      filters.push("headroom-json");
    }
  }

  const deduped = dedupLines(output);
  if (deduped.length < output.length) {
    output = deduped;
    filters.push("dedup");
  }

  if (output.length > 24_000) {
    output = smartTruncate(output, 24_000);
    filters.push("smart-truncate");
  }

  if (output.length >= text.length) {
    return {
      output: text,
      originalTokens,
      compressedTokens: originalTokens,
      savedRatio: 0,
      filters: [],
    };
  }

  const compressedTokens = tokens(output);
  return {
    output,
    originalTokens,
    compressedTokens,
    savedRatio: (originalTokens - compressedTokens) / originalTokens,
    filters,
  };
}

export const RTK_SAMPLES: { id: string; label: string; text: string }[] = [
  {
    id: "diff",
    label: "git diff",
    text: `diff --git a/src/gateway/router.ts b/src/gateway/router.ts
index 9f3a1c2..b71e0aa 100644
--- a/src/gateway/router.ts
+++ b/src/gateway/router.ts
@@ -12,40 +12,28 @@ import { score } from "./score";
 export function pick(nodes: Node[], want: Want) {
   const healthy = nodes.filter((n) => n.circuit === "closed" && n.quota < 0.95);
-  // verbose debug dump of every candidate
-  console.log("candidates", JSON.stringify(nodes, null, 2));
-  console.log("want", JSON.stringify(want, null, 2));
-  console.log("healthy", healthy.map((n) => n.id));
+  const ranked = healthy
+    .map((n) => ({ n, s: score(n, want) }))
+    .sort((a, b) => b.s - a.s);
+  return ranked[0]?.n ?? null;
 }
 
-function unusedHelper(x: string) {
-  return x.repeat(3);
-}
-
 export function sticky(prev: string | undefined, nodes: Node[]) {
   if (!prev) return null;
   return nodes.find((n) => n.id === prev && n.circuit === "closed") ?? null;
 }
`,
  },
  {
    id: "grep",
    label: "grep -n cache",
    text: `src/lib/cache.ts:12:export function prefixHash(s: string) {
src/lib/cache.ts:18:  return "pfx_" + fnv(s);
src/lib/cache.ts:44:  const hit = index.get(hash);
src/lib/cache.ts:45:  if (hit) hit.hits += 1;
src/gateway/router.ts:88:    const hash = prefixHash(prefix);
src/gateway/router.ts:89:    const cached = lookup(modelId, hash);
src/gateway/router.ts:90:    if (cached) return { ...pick, cachedTokens: cached.tokens };
src/gateway/router.ts:91:    const hash = prefixHash(prefix);
src/gateway/router.ts:92:    const cached = lookup(modelId, hash);
src/routes/chat.tsx:140:  const hash = prefixHash(sys + history);
src/routes/chat.tsx:141:  meta.prefixHash = hash;
src/routes/chat.tsx:142:  meta.cacheHit = Boolean(cached);
src/test/cache.test.ts:9:  expect(prefixHash("a")).toBe(prefixHash("a"));
src/test/cache.test.ts:10:  expect(prefixHash("a")).not.toBe(prefixHash("b"));
`,
  },
  {
    id: "ls",
    label: "ls -l",
    text: `total 184
drwxr-xr-x  12 flint flint  4096 Aug 27 18:01 .
drwxr-xr-x   8 flint flint  4096 Aug 26 09:12 ..
-rw-r--r--   1 flint flint   812 Aug 27 17:44 AGENTS.md
-rw-r--r--   1 flint flint  2190 Aug 27 17:51 package.json
drwxr-xr-x   8 flint flint  4096 Aug 27 18:00 src
drwxr-xr-x   3 flint flint  4096 Aug 27 17:40 src/lib
drwxr-xr-x   4 flint flint  4096 Aug 27 17:58 src/lib/flint
-rw-r--r--   1 flint flint  4412 Aug 27 17:59 src/lib/flint/rtk.ts
-rw-r--r--   1 flint flint  3188 Aug 27 17:59 src/lib/flint/routing.ts
-rw-r--r--   1 flint flint  2801 Aug 27 18:00 src/lib/flint/hash.ts
drwxr-xr-x   6 flint flint  4096 Aug 27 17:50 node_modules
`,
  },
  {
    id: "json",
    label: "tool JSON",
    text: `{
  "ok": true,
  "files": [
    { "path": "src/a.ts", "size": 1204, "sha": "aa" },
    { "path": "src/b.ts", "size": 980, "sha": "bb" },
    { "path": "src/c.ts", "size": 2210, "sha": "cc" },
    { "path": "src/d.ts", "size": 110, "sha": "dd" }
  ],
  "meta": {
    "cwd": "/workspace",
    "took_ms": 42
  }
}`,
  },
];
