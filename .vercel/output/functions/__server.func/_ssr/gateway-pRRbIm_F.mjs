import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as useFlintStore, d as formatUsd, l as formatPct, u as formatTokens } from "./router-DEGBjKzP.mjs";
import { t as Badge } from "./badge-CgaOjFSa.mjs";
import { t as Progress } from "./progress-i9MBh0tk.mjs";
import { a as CartesianGrid, i as Area, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gateway-pRRbIm_F.js
var import_jsx_runtime = require_jsx_runtime();
var TREND = [
	{
		t: "09:00",
		naive: 1.8,
		flint: .9
	},
	{
		t: "11:00",
		naive: 2.4,
		flint: 1.1
	},
	{
		t: "13:00",
		naive: 3.1,
		flint: 1.2
	},
	{
		t: "15:00",
		naive: 2.7,
		flint: .8
	},
	{
		t: "17:00",
		naive: 3.6,
		flint: 1
	},
	{
		t: "19:00",
		naive: 2.2,
		flint: .6
	}
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl space-y-6 p-4 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.18em] text-muted",
					children: "Control plane"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl tracking-tight",
					children: "Gateway"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm text-muted",
					children: "One OpenAI-compatible hop. Subscriptions drain first, cheap spill next, free last. Cache-aware quotes beat naive input billing."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Saved vs naive",
						value: formatUsd(savedUsd),
						hint: "RTK + KV + spill"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Tokens crushed",
						value: formatTokens(savedTokens),
						hint: "RTK + cache reads"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Cache hit rate",
						value: formatPct(cacheHits / Math.max(1, requests)),
						hint: `${cacheHits} / ${requests}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Healthy nodes",
						value: `${healthy.length}/${providers.length}`,
						hint: open.length ? `${open.length} circuit open` : "all circuits quiet"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Spend, naive vs Flint"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] uppercase text-muted",
							children: "Today"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: TREND,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "rgba(255,255,255,0.06)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "t",
										stroke: "var(--color-faint)",
										fontSize: 11,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "var(--color-faint)",
										fontSize: 11,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--color-surface)",
										border: "1px solid var(--color-border)",
										borderRadius: 8,
										fontSize: 12,
										color: "var(--color-fg)"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "naive",
										stroke: "var(--color-faint)",
										fill: "color-mix(in oklab, var(--color-faint) 25%, transparent)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "flint",
										stroke: "var(--color-ok)",
										fill: "color-mix(in oklab, var(--color-ok) 30%, transparent)"
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Active combo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-mono text-xs text-muted",
							children: ["/", combo?.slug]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-4 space-y-3",
							children: combo?.tiers.map((tier, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 font-mono text-[10px] uppercase text-muted",
								children: [
									"Tier ",
									i + 1,
									" · ",
									i === 0 ? "subscription" : i === 1 ? "cheap" : "free"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: tier.map((s) => {
									const p = providers.find((x) => x.id === s.providerId);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: p?.circuit === "open" ? "bad" : p?.circuit === "half" ? "warn" : "ok",
										children: p?.name ?? s.providerId
									}, s.providerId + s.modelId);
								})
							})] }, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/combos",
							className: "mt-4 inline-block text-sm text-muted underline-offset-4 hover:text-fg hover:underline",
							children: "Edit combos"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Circuits"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: providers.slice(0, 9).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md bg-inset p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: p.circuit === "open" ? "bad" : p.circuit === "half" ? "warn" : "ok",
									children: p.circuit
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								className: "mt-2",
								value: p.quotaUsed * 100,
								tone: p.quotaUsed > .85 ? "bad" : p.quotaUsed > .6 ? "warn" : "ok"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex justify-between font-mono text-[10px] text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular-nums",
									children: [Math.round(p.quotaUsed * 100), "% quota"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular-nums",
									children: [p.latencyMs, "ms"]
								})]
							})
						]
					}, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "Last hops"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 divide-y divide-border rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: log.slice(0, 6).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-2 px-4 py-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: e.status === "ok" ? "ok" : e.status === "fallback" ? "warn" : "bad",
							children: e.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate text-muted",
							children: e.preview
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] text-faint",
							children: e.path.join(" → ")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs tabular-nums",
							children: formatUsd(e.costUsd)
						})
					]
				}, e.id))
			})] })
		]
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-mono text-[10px] uppercase tracking-wide text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 font-display text-3xl tabular-nums tracking-tight",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-faint",
				children: hint
			})
		]
	});
}
//#endregion
export { GatewayPage as component };
