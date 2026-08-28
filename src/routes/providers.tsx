import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { formatUsd } from "@/lib/flint/cost";
import { useFlintStore } from "@/lib/flint/store";
import type { Tier } from "@/lib/flint/types";

export const Route = createFileRoute("/providers")({ component: ProvidersPage });

const TIERS: { id: Tier | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "subscription", label: "Subscription" },
  { id: "cheap", label: "Cheap" },
  { id: "api", label: "API" },
  { id: "free", label: "Free" },
];

function ProvidersPage() {
  const providers = useFlintStore((s) => s.providers);
  const [tier, setTier] = useState<Tier | "all">("all");
  const [q, setQ] = useState("");
  const now = Date.now();

  const list = useMemo(() => {
    return providers.filter((p) => {
      if (tier !== "all" && p.tier !== tier) return false;
      if (q && !`${p.name} ${p.vendor}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [providers, tier, q]);

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            Catalog
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">Providers</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Health, quota, cache multipliers. Disable a node and the combo walks the next
            tier in milliseconds.
          </p>
        </div>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter"
          className="sm:max-w-xs"
        />
      </header>

      <div className="flex flex-wrap gap-1.5">
        {TIERS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTier(t.id)}
            className={
              t.id === tier
                ? "h-8 rounded-md bg-accent px-3 text-xs text-accent-fg"
                : "h-8 rounded-md bg-raised px-3 text-xs text-muted hover:text-fg"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="grid gap-3 md:grid-cols-2">
        {list.map((p) => {
          const model = p.models[0];
          const resetMin = Math.max(0, Math.round((p.quotaResetAt - now) / 60_000));
          return (
            <li
              key={p.id}
              className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-medium">{p.name}</h2>
                    <Badge tone="muted">{p.tier}</Badge>
                    <Badge
                      tone={
                        p.circuit === "open" ? "bad" : p.circuit === "half" ? "warn" : "ok"
                      }
                    >
                      {p.circuit}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted">{p.notes}</p>
                </div>
                <Switch
                  checked={p.enabled}
                  onCheckedChange={() => useFlintStore.getState().toggleProvider(p.id)}
                  aria-label={`Toggle ${p.name}`}
                />
              </div>
              <Progress
                className="mt-4"
                value={p.quotaUsed * 100}
                tone={p.quotaUsed > 0.85 ? "bad" : p.quotaUsed > 0.6 ? "warn" : "ok"}
              />
              <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px] text-muted sm:grid-cols-4">
                <div>
                  <dt className="text-faint">Quota</dt>
                  <dd className="tabular-nums text-fg">{Math.round(p.quotaUsed * 100)}%</dd>
                </div>
                <div>
                  <dt className="text-faint">Reset</dt>
                  <dd className="tabular-nums text-fg">{resetMin}m</dd>
                </div>
                <div>
                  <dt className="text-faint">Latency</dt>
                  <dd className="tabular-nums text-fg">{p.latencyMs}ms</dd>
                </div>
                <div>
                  <dt className="text-faint">RPM</dt>
                  <dd className="tabular-nums text-fg">
                    {p.rpm}/{p.rpmCap}
                  </dd>
                </div>
              </dl>
              {model && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
                  <span>{model.name}</span>
                  <span className="tabular-nums">
                    {formatUsd(model.inputPerM)} / {formatUsd(model.outputPerM)} per M
                  </span>
                  <span>
                    cache ×{model.cacheReadMult}
                    {model.cacheMinTokens >= 1_000_000 ? " off" : ""}
                  </span>
                  <span className="tabular-nums">{(model.context / 1000).toFixed(0)}k ctx</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
