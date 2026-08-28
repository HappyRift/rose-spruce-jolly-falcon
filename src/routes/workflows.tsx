import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTokens, formatUsd } from "@/lib/flint/cost";
import { useFlintStore } from "@/lib/flint/store";

export const Route = createFileRoute("/workflows")({ component: WorkflowsPage });

function WorkflowsPage() {
  const workflows = useFlintStore((s) => s.workflows);
  const runs = useFlintStore((s) => s.runs);
  const providers = useFlintStore((s) => s.providers);

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          A2A via the gateway
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Handoff</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Agents do not talk to providers. They talk to Flint. The gateway holds the
          prefix, decides who sees the full thread, and who gets a summary so the
          executor KV stays hot.
        </p>
      </header>

      <ul className="grid gap-3 md:grid-cols-2">
        {workflows.map((wf) => (
          <li
            key={wf.id}
            className="flex flex-col rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
          >
            <h2 className="font-display text-2xl">{wf.name}</h2>
            <p className="mt-1 flex-1 text-sm text-muted">{wf.blurb}</p>
            <ol className="mt-4 space-y-2">
              {wf.steps.map((step, i) => (
                <li key={step.id} className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-[10px] text-faint">{i + 1}</span>
                  <span>{step.role}</span>
                  <Badge tone={step.sticky ? "cache" : "muted"}>
                    {step.handoff}
                    {step.sticky ? " · sticky" : ""}
                  </Badge>
                </li>
              ))}
            </ol>
            <Button
              className="mt-4"
              onClick={() => useFlintStore.getState().runWorkflow(wf.id)}
            >
              Run handoff
            </Button>
          </li>
        ))}
      </ul>

      <section>
        <h2 className="font-display text-2xl">Runs</h2>
        {runs.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            No runs yet. Fire a workflow to see prefix hashes and the advisor discount.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {runs.map((run) => {
              const wf = workflows.find((w) => w.id === run.workflowId);
              return (
                <li
                  key={run.id}
                  className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl">{wf?.name ?? run.workflowId}</h3>
                    <div className="font-mono text-xs tabular-nums text-muted">
                      {formatUsd(run.totalCost)}{" "}
                      <span className="text-faint">vs naive {formatUsd(run.naiveCost)}</span>
                      <span className="ml-2 text-ok">
                        −{formatUsd(Math.max(0, run.naiveCost - run.totalCost))}
                      </span>
                    </div>
                  </div>
                  <ol className="mt-3 grid gap-2 sm:grid-cols-3">
                    {run.events.map((ev) => {
                      const p = providers.find((x) => x.id === ev.providerId);
                      return (
                        <li key={ev.id} className="rounded-md bg-inset p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm">{ev.role}</span>
                            <Badge tone={ev.cacheHit ? "cache" : "muted"}>
                              {ev.cacheHit ? "hit" : "cold"}
                            </Badge>
                          </div>
                          <div className="mt-1 text-xs text-muted">
                            {p?.name} / {ev.modelId}
                          </div>
                          <div className="mt-1 font-mono text-[10px] text-cache">
                            {ev.prefixHash}
                          </div>
                          <div className="mt-1 font-mono text-[10px] text-faint">
                            {formatTokens(ev.tokensIn)} in · {formatTokens(ev.cachedTokens)}{" "}
                            cached · {formatUsd(ev.costUsd)}
                          </div>
                          <p className="mt-2 text-xs text-muted">{ev.note}</p>
                        </li>
                      );
                    })}
                  </ol>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
