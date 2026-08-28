import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatPct, formatTokens, formatUsd } from "@/lib/flint/cost";
import { useFlintStore } from "@/lib/flint/store";

export const Route = createFileRoute("/gateway")({ component: GatewayPage });

const TREND = [
  { t: "09:00", naive: 1.8, flint: 0.9 },
  { t: "11:00", naive: 2.4, flint: 1.1 },
  { t: "13:00", naive: 3.1, flint: 1.2 },
  { t: "15:00", naive: 2.7, flint: 0.8 },
  { t: "17:00", naive: 3.6, flint: 1.0 },
  { t: "19:00", naive: 2.2, flint: 0.6 },
];

function GatewayPage() {
  const providers = useFlintStore((s) => s.providers);
  const savedUsd = useFlintStore((s) => s.savedUsd);
  const savedTokens = useFlintStore((s) => s.savedTokens);
  const requests = useFlintStore((s) => s.requests);
  const cacheHits = useFlintStore((s) => s.cacheHits);
  const log = useFlintStore((s) => s.log);
  const combos = useFlintStore((s) => s.combos);
  const activeComboId = useFlintStore((s) => s.activeComboId);
  const healthy = providers.filter((p) => p.enabled && p.healthy && p.circuit !== "open");
  const open = providers.filter((p) => p.circuit === "open");
  const combo = combos.find((c) => c.id === activeComboId);

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Control plane
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Gateway</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          One OpenAI-compatible hop. Subscriptions drain first, cheap spill next, free last.
          Cache-aware quotes beat naive input billing.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Saved vs naive" value={formatUsd(savedUsd)} hint="RTK + KV + spill" />
        <Stat label="Tokens crushed" value={formatTokens(savedTokens)} hint="RTK + cache reads" />
        <Stat
          label="Cache hit rate"
          value={formatPct(cacheHits / Math.max(1, requests))}
          hint={`${cacheHits} / ${requests}`}
        />
        <Stat
          label="Healthy nodes"
          value={`${healthy.length}/${providers.length}`}
          hint={open.length ? `${open.length} circuit open` : "all circuits quiet"}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:col-span-3">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-xl">Spend, naive vs Flint</h2>
            <span className="font-mono text-[10px] uppercase text-muted">Today</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="t" stroke="var(--color-faint)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--color-faint)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "var(--color-fg)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="naive"
                  stroke="var(--color-faint)"
                  fill="color-mix(in oklab, var(--color-faint) 25%, transparent)"
                />
                <Area
                  type="monotone"
                  dataKey="flint"
                  stroke="var(--color-ok)"
                  fill="color-mix(in oklab, var(--color-ok) 30%, transparent)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:col-span-2">
          <h2 className="font-display text-xl">Active combo</h2>
          <p className="mt-1 font-mono text-xs text-muted">/{combo?.slug}</p>
          <ol className="mt-4 space-y-3">
            {combo?.tiers.map((tier, i) => (
              <li key={i}>
                <div className="mb-1 font-mono text-[10px] uppercase text-muted">
                  Tier {i + 1} · {i === 0 ? "subscription" : i === 1 ? "cheap" : "free"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tier.map((s) => {
                    const p = providers.find((x) => x.id === s.providerId);
                    return (
                      <Badge
                        key={s.providerId + s.modelId}
                        tone={
                          p?.circuit === "open"
                            ? "bad"
                            : p?.circuit === "half"
                              ? "warn"
                              : "ok"
                        }
                      >
                        {p?.name ?? s.providerId}
                      </Badge>
                    );
                  })}
                </div>
              </li>
            ))}
          </ol>
          <Link
            to="/combos"
            className="mt-4 inline-block text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
          >
            Edit combos
          </Link>
        </div>
      </section>

      <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-xl">Circuits</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {providers.slice(0, 9).map((p) => (
            <li key={p.id} className="rounded-md bg-inset p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm">{p.name}</span>
                <Badge
                  tone={
                    p.circuit === "open" ? "bad" : p.circuit === "half" ? "warn" : "ok"
                  }
                >
                  {p.circuit}
                </Badge>
              </div>
              <Progress
                className="mt-2"
                value={p.quotaUsed * 100}
                tone={p.quotaUsed > 0.85 ? "bad" : p.quotaUsed > 0.6 ? "warn" : "ok"}
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-muted">
                <span className="tabular-nums">{Math.round(p.quotaUsed * 100)}% quota</span>
                <span className="tabular-nums">{p.latencyMs}ms</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl">Last hops</h2>
        <ul className="mt-3 divide-y divide-border rounded-xl bg-surface shadow-[var(--shadow-border)]">
          {log.slice(0, 6).map((e) => (
            <li key={e.id} className="flex flex-wrap items-center gap-2 px-4 py-3 text-sm">
              <Badge
                tone={e.status === "ok" ? "ok" : e.status === "fallback" ? "warn" : "bad"}
              >
                {e.status}
              </Badge>
              <span className="min-w-0 flex-1 truncate text-muted">{e.preview}</span>
              <span className="font-mono text-[10px] text-faint">
                {e.path.join(" → ")}
              </span>
              <span className="font-mono text-xs tabular-nums">{formatUsd(e.costUsd)}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <div className="font-mono text-[10px] uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 font-display text-3xl tabular-nums tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-faint">{hint}</div>
    </div>
  );
}
