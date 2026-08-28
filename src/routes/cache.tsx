import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPct, formatTokens, formatUsd, quoteCost } from "@/lib/flint/cost";
import { estimateTokens, prefixHash, shortHash } from "@/lib/flint/hash";
import { activeConversation, useFlintStore } from "@/lib/flint/store";

export const Route = createFileRoute("/cache")({ component: CachePage });

function CachePage() {
  const conv = useFlintStore(activeConversation);
  const cache = useFlintStore((s) => s.cache);
  const providers = useFlintStore((s) => s.providers);
  const [sys, setSys] = useState(
    "You are a coding agent. Project: Flint gateway. Always prefer sticky KV.",
  );
  const [turns, setTurns] = useState(
    "Review auth middleware.\nAdd tests for forged userId.\nKeep the executor on Sonnet.",
  );

  const chain = useMemo(() => {
    const messages = turns
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((content, i) => ({
        role: i % 2 === 0 ? "user" : "assistant",
        content,
      }));
    const rows = [];
    let acc = estimateTokens(sys);
    rows.push({
      label: "system",
      hash: prefixHash(sys, messages, 0),
      tokens: acc,
    });
    messages.forEach((m, i) => {
      acc += estimateTokens(m.content);
      rows.push({
        label: `${m.role} ${i + 1}`,
        hash: prefixHash(sys, messages, i + 1),
        tokens: acc,
      });
    });
    return rows;
  }, [sys, turns]);

  const sonnet = providers.find((p) => p.id === "claude-code")?.models[0];
  const gpt = providers.find((p) => p.id === "openai-api")?.models[0];
  const last = chain[chain.length - 1];
  const tokensIn = last?.tokens ?? 0;
  const cached = tokensIn >= 1024 ? Math.min(tokensIn - 180, chain[chain.length - 2]?.tokens ?? 0) : 0;

  const sticky = sonnet ? quoteCost(sonnet, tokensIn, 200, cached) : null;
  const switched = sonnet && gpt ? quoteCost(gpt, tokensIn, 200, 0) : null;

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Prefix hashes
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">KV cache</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Each turn hashes the canonical prefix. Hits walk backward in 128-token steps
          after a 1024-token floor. Change a byte — or the model — and the hash misses.
          Mid-session switches re-pay the whole prompt.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:col-span-3">
          <h2 className="font-display text-xl">Hash calculator</h2>
          <label className="mt-3 block font-mono text-[10px] uppercase text-muted">
            System
          </label>
          <textarea
            value={sys}
            onChange={(e) => setSys(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md bg-inset p-2 text-sm text-fg shadow-[var(--shadow-border)]"
          />
          <label className="mt-3 block font-mono text-[10px] uppercase text-muted">
            Turns, one per line
          </label>
          <textarea
            value={turns}
            onChange={(e) => setTurns(e.target.value)}
            rows={5}
            className="mt-1 w-full rounded-md bg-inset p-2 text-sm text-fg shadow-[var(--shadow-border)]"
          />
          <ol className="mt-4 space-y-2">
            {chain.map((row, i) => (
              <li key={row.hash + i} className="flex items-center gap-3">
                <div
                  className="h-8 w-1.5 rounded-full bg-cache"
                  style={{ opacity: 0.35 + (i / Math.max(1, chain.length)) * 0.65 }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm">{row.label}</span>
                    <span className="font-mono text-[11px] tabular-nums text-muted">
                      {formatTokens(row.tokens)}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-cache">{row.hash}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-xl">Sticky vs switch</h2>
            <p className="mt-1 text-xs text-muted">
              Same thread. Stay on Sonnet (cache read ×0.1) or jump to GPT-4.1 (cold).
            </p>
            {sticky && switched && (
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Sticky Sonnet</dt>
                  <dd className="font-mono tabular-nums text-ok">{formatUsd(sticky.usd)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Switch GPT-4.1</dt>
                  <dd className="font-mono tabular-nums">{formatUsd(switched.usd)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Penalty</dt>
                  <dd className="font-mono tabular-nums text-bad">
                    {formatUsd(Math.max(0, switched.usd - sticky.usd))}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Cached tokens</dt>
                  <dd className="font-mono tabular-nums">
                    {formatTokens(cached)} ({formatPct(cached / Math.max(1, tokensIn))})
                  </dd>
                </div>
              </dl>
            )}
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Advisor pattern: keep the executor sticky. Send the reviewer a summary so
              you never bust the long prefix.
            </p>
          </div>

          <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-xl">Live entries</h2>
            <ul className="mt-3 space-y-2">
              {cache.slice(0, 8).map((e) => (
                <li key={e.key} className="rounded-md bg-inset p-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-cache">
                      {shortHash(e.prefixHash)}
                    </span>
                    <Badge tone="cache">{e.hits} hits</Badge>
                  </div>
                  <div className="mt-1 truncate text-xs text-muted">{e.preview}</div>
                  <div className="mt-1 font-mono text-[10px] text-faint">
                    {e.modelId} · {formatTokens(e.tokens)} · ttl{" "}
                    {Math.max(0, Math.round((e.expiresAt - Date.now()) / 1000))}s
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {conv && conv.messages.length > 0 && (
        <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">This thread</h2>
            <Button size="sm" variant="secondary" asChild>
              <a href="/">Open chat</a>
            </Button>
          </div>
          <p className="mt-1 text-xs text-muted">{conv.title}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {conv.messages
              .filter((m) => m.meta)
              .map((m) => (
                <Badge key={m.id} tone={m.meta?.cacheHit ? "cache" : "muted"}>
                  {m.meta?.prefixHash} {m.meta?.cacheHit ? "hit" : "miss"}
                </Badge>
              ))}
          </div>
        </section>
      )}
    </main>
  );
}
