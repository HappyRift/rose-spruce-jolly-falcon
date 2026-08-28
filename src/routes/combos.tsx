import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { formatUsd } from "@/lib/flint/cost";
import { estimateTokens } from "@/lib/flint/hash";
import { routeRequest } from "@/lib/flint/routing";
import { useFlintStore } from "@/lib/flint/store";
import { STRATEGY_META, type Strategy } from "@/lib/flint/types";

export const Route = createFileRoute("/combos")({ component: CombosPage });

const STRATEGIES = Object.keys(STRATEGY_META) as Strategy[];

function CombosPage() {
  const combos = useFlintStore((s) => s.combos);
  const providers = useFlintStore((s) => s.providers);
  const cache = useFlintStore((s) => s.cache);
  const activeComboId = useFlintStore((s) => s.activeComboId);
  const [probe, setProbe] = useState(
    "Implement a circuit breaker around the Anthropic client and log fallbacks.",
  );
  const combo = combos.find((c) => c.id === activeComboId) ?? combos[0]!;

  const decision = useMemo(() => {
    const tokensIn = estimateTokens(probe) + 1800;
    return routeRequest({
      combo,
      strategy: combo.strategy,
      providers,
      cache,
      systemPrompt: "You are a coding agent.",
      messages: [{ role: "user", content: probe }],
      tokensIn,
      tokensOutHint: 220,
    });
  }, [combo, providers, cache, probe]);

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Virtual models
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Combos</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Named fallback chains. Point Cursor or Claude Code at /{combo.slug} and Flint
          walks the tiers.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {combos.map((c) => (
          <Button
            key={c.id}
            size="sm"
            variant={c.id === combo.id ? "default" : "secondary"}
            onClick={() => useFlintStore.getState().setCombo(c.id)}
          >
            /{c.slug}
          </Button>
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl">/{combo.slug}</h2>
              <label className="flex items-center gap-2 text-xs text-muted">
                Sticky KV
                <Switch
                  checked={combo.sticky}
                  onCheckedChange={() => useFlintStore.getState().toggleSticky(combo.id)}
                />
              </label>
            </div>
            <label className="mt-4 block font-mono text-[10px] uppercase text-muted">
              Strategy
            </label>
            <select
              value={combo.strategy}
              onChange={(e) =>
                useFlintStore
                  .getState()
                  .updateComboStrategy(combo.id, e.target.value as Strategy)
              }
              className="mt-1 h-10 w-full rounded-md bg-inset px-2 text-sm text-fg shadow-[var(--shadow-border)]"
            >
              {STRATEGIES.map((s) => (
                <option key={s} value={s}>
                  {STRATEGY_META[s].label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-muted">{STRATEGY_META[combo.strategy].blurb}</p>
          </div>

          <ol className="space-y-3">
            {combo.tiers.map((tier, i) => (
              <li
                key={i}
                className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
              >
                <div className="font-mono text-[10px] uppercase tracking-wide text-muted">
                  Tier {i + 1}
                </div>
                <ul className="mt-3 space-y-2">
                  {tier.map((slot) => {
                    const p = providers.find((x) => x.id === slot.providerId);
                    const m = p?.models.find((x) => x.id === slot.modelId) ?? p?.models[0];
                    return (
                      <li
                        key={slot.providerId + slot.modelId}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-inset px-3 py-2"
                      >
                        <span className="text-sm">
                          {p?.name}{" "}
                          <span className="text-muted">/ {m?.name}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            tone={
                              p?.circuit === "open"
                                ? "bad"
                                : p?.healthy
                                  ? "ok"
                                  : "warn"
                            }
                          >
                            {p?.circuit}
                          </Badge>
                          {m && (
                            <span className="font-mono text-[10px] text-muted">
                              {formatUsd(m.inputPerM)}/M
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:col-span-2">
          <h2 className="font-display text-xl">Probe</h2>
          <p className="mt-1 text-xs text-muted">
            Dry-run the router. No tokens leave the box.
          </p>
          <textarea
            value={probe}
            onChange={(e) => setProbe(e.target.value)}
            rows={5}
            className="mt-3 w-full rounded-md bg-inset p-2 text-sm text-fg shadow-[var(--shadow-border)]"
          />
          <dl className="mt-4 space-y-2 text-sm">
            <Row k="Winner" v={`${decision.provider.name} / ${decision.model.name}`} />
            <Row k="Path" v={decision.path.join(" → ")} />
            <Row k="Prefix" v={decision.prefixHash} />
            <Row k="Cache" v={decision.cacheHit ? `${decision.cachedTokens} tok` : "miss"} />
            <Row k="Why" v={decision.reason} />
          </dl>
          {decision.fusion && (
            <div className="mt-3">
              <div className="font-mono text-[10px] uppercase text-muted">Panel</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {decision.fusion.map((f) => (
                  <Badge key={f.providerId} tone="accent">
                    {f.providerId}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {decision.pipeline && (
            <ol className="mt-3 space-y-1 text-xs text-muted">
              {decision.pipeline.map((s) => (
                <li key={s.role}>
                  {s.role} → {s.providerId}
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{k}</dt>
      <dd className="max-w-[70%] text-right font-mono text-xs text-fg">{v}</dd>
    </div>
  );
}
