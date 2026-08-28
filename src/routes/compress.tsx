import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CAVEMAN_SAMPLE, compressProse } from "@/lib/flint/caveman";
import { formatPct, formatTokens } from "@/lib/flint/cost";
import { compressRtk, RTK_SAMPLES } from "@/lib/flint/rtk";
import { CAVEMAN_LABELS, type CavemanLevel } from "@/lib/flint/types";
import { useFlintStore } from "@/lib/flint/store";

export const Route = createFileRoute("/compress")({ component: CompressPage });

function CompressPage() {
  const rtkEnabled = useFlintStore((s) => s.rtkEnabled);
  const cavemanLevel = useFlintStore((s) => s.cavemanLevel);
  const [sampleId, setSampleId] = useState(RTK_SAMPLES[0]!.id);
  const [input, setInput] = useState(RTK_SAMPLES[0]!.text);
  const [outSample, setOutSample] = useState(CAVEMAN_SAMPLE);

  const rtk = useMemo(() => compressRtk(input, rtkEnabled), [input, rtkEnabled]);
  const cave = useMemo(
    () => compressProse(outSample, cavemanLevel),
    [outSample, cavemanLevel],
  );
  const stackedRatio =
    1 -
    (rtk.compressedTokens * (cave.length / Math.max(1, outSample.length))) /
      Math.max(1, rtk.originalTokens);

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Token savers
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Compress</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          RTK crushes tool dumps before they hit the prefix. Caveman tells the model to
          answer short. Stack them. Same substance, fewer tokens.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <div className="font-mono text-[10px] uppercase text-muted">RTK in</div>
          <div className="mt-1 font-display text-3xl tabular-nums">
            −{formatPct(rtk.savedRatio)}
          </div>
          <p className="mt-1 text-xs text-muted">
            {formatTokens(rtk.originalTokens)} → {formatTokens(rtk.compressedTokens)}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <div className="font-mono text-[10px] uppercase text-muted">Caveman out</div>
          <div className="mt-1 font-display text-3xl tabular-nums">
            {CAVEMAN_LABELS[cavemanLevel]}
          </div>
          <p className="mt-1 text-xs text-muted">
            {formatTokens(outSample.length / 4)} → {formatTokens(cave.length / 4)}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <div className="font-mono text-[10px] uppercase text-muted">Stacked</div>
          <div className="mt-1 font-display text-3xl tabular-nums text-ok">
            −{formatPct(Math.max(0, stackedRatio))}
          </div>
          <p className="mt-1 text-xs text-muted">Input filters + output style</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">RTK</h2>
            <label className="flex items-center gap-2 text-xs text-muted">
              Enabled
              <Switch
                checked={rtkEnabled}
                onCheckedChange={(v) => useFlintStore.getState().setRtk(v)}
              />
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {RTK_SAMPLES.map((s) => (
              <Button
                key={s.id}
                size="sm"
                variant={s.id === sampleId ? "default" : "secondary"}
                onClick={() => {
                  setSampleId(s.id);
                  setInput(s.text);
                }}
              >
                {s.label}
              </Button>
            ))}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            className="mt-3 w-full rounded-md bg-inset p-3 font-mono text-xs text-fg shadow-[var(--shadow-border)]"
          />
          <div className="mt-3 flex flex-wrap gap-1">
            {rtk.filters.length ? (
              rtk.filters.map((f) => (
                <Badge key={f} tone="ok">
                  {f}
                </Badge>
              ))
            ) : (
              <Badge>no filter</Badge>
            )}
          </div>
          <pre className="mt-3 max-h-56 overflow-auto rounded-md bg-inset p-3 font-mono text-xs text-muted">
            {rtk.output}
          </pre>
        </div>

        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <h2 className="font-display text-xl">Caveman</h2>
          <p className="mt-1 text-xs text-muted">
            Injected as a system instruction on live completions. Preview is a local
            rewrite of sample prose.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Slider
              min={0}
              max={5}
              step={1}
              value={[cavemanLevel]}
              onValueChange={(v) =>
                useFlintStore.getState().setCaveman((v[0] ?? 0) as CavemanLevel)
              }
            />
            <span className="w-16 font-mono text-xs text-muted">
              {CAVEMAN_LABELS[cavemanLevel]}
            </span>
          </div>
          <textarea
            value={outSample}
            onChange={(e) => setOutSample(e.target.value)}
            rows={8}
            className="mt-3 w-full rounded-md bg-inset p-3 text-sm text-fg shadow-[var(--shadow-border)]"
          />
          <div className="mt-3 rounded-md bg-inset p-3 text-sm leading-relaxed text-fg">
            {cave}
          </div>
        </div>
      </section>
    </main>
  );
}
