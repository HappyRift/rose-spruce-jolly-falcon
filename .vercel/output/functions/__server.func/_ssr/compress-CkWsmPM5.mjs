import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useFlintStore, l as formatPct, n as Button, r as RTK_SAMPLES, s as compressRtk, u as formatTokens } from "./router-DEGBjKzP.mjs";
import { t as Badge } from "./badge-CgaOjFSa.mjs";
import { t as Switch } from "./switch-Dgm_Dkrs.mjs";
import { t as CAVEMAN_LABELS } from "./types-DoWnWxe8.mjs";
import { r as compressProse, t as CAVEMAN_SAMPLE } from "./caveman-D2x3NcY1.mjs";
import { t as Slider } from "./slider-BKdanos8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compress-CkWsmPM5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CompressPage() {
	const rtkEnabled = useFlintStore((s) => s.rtkEnabled);
	const cavemanLevel = useFlintStore((s) => s.cavemanLevel);
	const [sampleId, setSampleId] = (0, import_react.useState)(RTK_SAMPLES[0].id);
	const [input, setInput] = (0, import_react.useState)(RTK_SAMPLES[0].text);
	const [outSample, setOutSample] = (0, import_react.useState)(CAVEMAN_SAMPLE);
	const rtk = (0, import_react.useMemo)(() => compressRtk(input, rtkEnabled), [input, rtkEnabled]);
	const cave = (0, import_react.useMemo)(() => compressProse(outSample, cavemanLevel), [outSample, cavemanLevel]);
	const stackedRatio = 1 - rtk.compressedTokens * (cave.length / Math.max(1, outSample.length)) / Math.max(1, rtk.originalTokens);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl space-y-6 p-4 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.18em] text-muted",
					children: "Token savers"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl tracking-tight",
					children: "Compress"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm text-muted",
					children: "RTK crushes tool dumps before they hit the prefix. Caveman tells the model to answer short. Stack them. Same substance, fewer tokens."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[10px] uppercase text-muted",
								children: "RTK in"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 font-display text-3xl tabular-nums",
								children: ["−", formatPct(rtk.savedRatio)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									formatTokens(rtk.originalTokens),
									" → ",
									formatTokens(rtk.compressedTokens)
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[10px] uppercase text-muted",
								children: "Caveman out"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-display text-3xl tabular-nums",
								children: CAVEMAN_LABELS[cavemanLevel]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									formatTokens(outSample.length / 4),
									" → ",
									formatTokens(cave.length / 4)
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[10px] uppercase text-muted",
								children: "Stacked"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 font-display text-3xl tabular-nums text-ok",
								children: ["−", formatPct(Math.max(0, stackedRatio))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: "Input filters + output style"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "RTK"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-xs text-muted",
								children: ["Enabled", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: rtkEnabled,
									onCheckedChange: (v) => useFlintStore.getState().setRtk(v)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1.5",
							children: RTK_SAMPLES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: s.id === sampleId ? "default" : "secondary",
								onClick: () => {
									setSampleId(s.id);
									setInput(s.text);
								},
								children: s.label
							}, s.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: input,
							onChange: (e) => setInput(e.target.value),
							rows: 12,
							className: "mt-3 w-full rounded-md bg-inset p-3 font-mono text-xs text-fg shadow-[var(--shadow-border)]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1",
							children: rtk.filters.length ? rtk.filters.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "ok",
								children: f
							}, f)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "no filter" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "mt-3 max-h-56 overflow-auto rounded-md bg-inset p-3 font-mono text-xs text-muted",
							children: rtk.output
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Caveman"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Injected as a system instruction on live completions. Preview is a local rewrite of sample prose."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								min: 0,
								max: 5,
								step: 1,
								value: [cavemanLevel],
								onValueChange: (v) => useFlintStore.getState().setCaveman(v[0] ?? 0)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-16 font-mono text-xs text-muted",
								children: CAVEMAN_LABELS[cavemanLevel]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: outSample,
							onChange: (e) => setOutSample(e.target.value),
							rows: 8,
							className: "mt-3 w-full rounded-md bg-inset p-3 text-sm text-fg shadow-[var(--shadow-border)]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 rounded-md bg-inset p-3 text-sm leading-relaxed text-fg",
							children: cave
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { CompressPage as component };
