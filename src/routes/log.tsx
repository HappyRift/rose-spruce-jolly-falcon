import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { formatTokens, formatUsd } from "@/lib/flint/cost";
import { useFlintStore } from "@/lib/flint/store";

export const Route = createFileRoute("/log")({ component: LogPage });

function LogPage() {
  const log = useFlintStore((s) => s.log);
  const providers = useFlintStore((s) => s.providers);

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Request log
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Hops</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Every completion through the gateway: path, cache, RTK, dollars. Local only.
        </p>
      </header>

      <div className="overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="font-mono text-[10px] uppercase tracking-wide text-muted">
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Path</th>
              <th className="px-4 py-3 font-medium">Preview</th>
              <th className="px-4 py-3 font-medium">Tokens</th>
              <th className="px-4 py-3 font-medium">Cost</th>
            </tr>
          </thead>
          <tbody>
            {log.map((e) => {
              const p = providers.find((x) => x.id === e.providerId);
              return (
                <tr key={e.id} className="border-b border-border/70 last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">
                    {new Date(e.at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        e.status === "ok" ? "ok" : e.status === "fallback" ? "warn" : "bad"
                      }
                    >
                      {e.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs">{p?.name ?? e.providerId}</div>
                    <div className="font-mono text-[10px] text-faint">
                      {e.path.join(" → ")}
                    </div>
                  </td>
                  <td className="max-w-[240px] truncate px-4 py-3 text-muted">{e.preview}</td>
                  <td className="px-4 py-3 font-mono text-xs tabular-nums">
                    {formatTokens(e.tokensIn)}
                    {e.cacheHit ? (
                      <span className="text-cache"> · {formatTokens(e.cachedTokens)} kv</span>
                    ) : null}
                    {e.rtk ? <span className="text-ok"> · rtk</span> : null}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs tabular-nums">
                    {formatUsd(e.costUsd)}
                    {e.savedUsd > 0 && (
                      <div className="text-ok">−{formatUsd(e.savedUsd)}</div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
