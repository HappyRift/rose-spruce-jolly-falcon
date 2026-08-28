/** Stable FNV-1a. Same string → same 8-hex prefix hash in SSR and browser. */
export function fnv1a(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.max(1, Math.ceil(text.length / 4));
}

export function canonicalizePrefix(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  upTo: number,
): string {
  const parts = [`system:${systemPrompt.trim()}`];
  const slice = messages.slice(0, Math.max(0, upTo));
  for (const m of slice) {
    parts.push(`${m.role}:${m.content.trim()}`);
  }
  return parts.join("\n\u241e\n");
}

export function prefixHash(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  upTo: number,
): string {
  return `pfx_${fnv1a(canonicalizePrefix(systemPrompt, messages, upTo))}`;
}

/** OpenAI-style: cache hits in 128-token increments after a 1024-token floor. */
export function cacheableTokens(total: number, minTokens: number): number {
  if (total < minTokens) return 0;
  const extra = total - minTokens;
  const steps = Math.floor(extra / 128);
  return minTokens + steps * 128;
}

export function shortHash(hash: string): string {
  const raw = hash.replace(/^pfx_/, "");
  return `${raw.slice(0, 4)}·${raw.slice(-4)}`;
}
