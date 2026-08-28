import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useFlintStore, c as estimateTokens, d as formatUsd, h as routeRequest, n as Button } from "./router-DEGBjKzP.mjs";
import { t as Badge } from "./badge-CgaOjFSa.mjs";
import { t as Switch } from "./switch-Dgm_Dkrs.mjs";
import { n as STRATEGY_META } from "./types-DoWnWxe8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/combos-3FoWZLph.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STRATEGIES = Object.keys(STRATEGY_META);
function CombosPage() {
	const combos = useFlintStore((s) => s.combos);
	const providers = useFlintStore((s) => s.providers);
	const cache = useFlintStore((s) => s.cache);
	const activeComboId = useFlintStore((s) => s.activeComboId);
	const [probe, setProbe] = (0, import_react.useState)("Implement a circuit breaker around the Anthropic client and log fallbacks.");
	const combo = combos.find((c) => c.id === activeComboId) ?? combos[0];
	const decision = (0, import_react.useMemo)(() => {
		const tokensIn = estimateTokens(probe) + 1800;
		return routeRequest({
			combo,
			strategy: combo.strategy,
			providers,
			cache,
			systemPrompt: "You are a coding agent.",
			messages: [{
				role: "user",
				content: probe
			}],
			tokensIn,
			tokensOutHint: 220
		});
	}, [
		combo,
		providers,
		cache,
		probe
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl space-y-6 p-4 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.18em] text-muted",
					children: "Virtual models"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl tracking-tight",
					children: "Combos"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 max-w-xl text-sm text-muted",
					children: [
						"Named fallback chains. Point Cursor or Claude Code at /",
						combo.slug,
						" and Flint walks the tiers."
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: combos.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: c.id === combo.id ? "default" : "secondary",
					onClick: () => useFlintStore.getState().setCombo(c.id),
					children: ["/", c.slug]
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-display text-2xl",
									children: ["/", combo.slug]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-xs text-muted",
									children: ["Sticky KV", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: combo.sticky,
										onCheckedChange: () => useFlintStore.getState().toggleSticky(combo.id)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mt-4 block font-mono text-[10px] uppercase text-muted",
								children: "Strategy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: combo.strategy,
								onChange: (e) => useFlintStore.getState().updateComboStrategy(combo.id, e.target.value),
								className: "mt-1 h-10 w-full rounded-md bg-inset px-2 text-sm text-fg shadow-[var(--shadow-border)]",
								children: STRATEGIES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: STRATEGY_META[s].label
								}, s))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: STRATEGY_META[combo.strategy].blurb
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-3",
						children: combo.tiers.map((tier, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-mono text-[10px] uppercase tracking-wide text-muted",
								children: ["Tier ", i + 1]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-2",
								children: tier.map((slot) => {
									const p = providers.find((x) => x.id === slot.providerId);
									const m = p?.models.find((x) => x.id === slot.modelId) ?? p?.models[0];
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex flex-wrap items-center justify-between gap-2 rounded-md bg-inset px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-sm",
											children: [
												p?.name,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted",
													children: ["/ ", m?.name]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												tone: p?.circuit === "open" ? "bad" : p?.healthy ? "ok" : "warn",
												children: p?.circuit
											}), m && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-[10px] text-muted",
												children: [formatUsd(m.inputPerM), "/M"]
											})]
										})]
									}, slot.providerId + slot.modelId);
								})
							})]
						}, i))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Probe"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Dry-run the router. No tokens leave the box."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: probe,
							onChange: (e) => setProbe(e.target.value),
							rows: 5,
							className: "mt-3 w-full rounded-md bg-inset p-2 text-sm text-fg shadow-[var(--shadow-border)]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Winner",
									v: `${decision.provider.name} / ${decision.model.name}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Path",
									v: decision.path.join(" → ")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Prefix",
									v: decision.prefixHash
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Cache",
									v: decision.cacheHit ? `${decision.cachedTokens} tok` : "miss"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Why",
									v: decision.reason
								})
							]
						}),
						decision.fusion && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[10px] uppercase text-muted",
								children: "Panel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex flex-wrap gap-1",
								children: decision.fusion.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "accent",
									children: f.providerId
								}, f.providerId))
							})]
						}),
						decision.pipeline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-3 space-y-1 text-xs text-muted",
							children: decision.pipeline.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								s.role,
								" → ",
								s.providerId
							] }, s.role))
						})
					]
				})]
			})
		]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "max-w-[70%] text-right font-mono text-xs text-fg",
			children: v
		})]
	});
}
//#endregion
export { CombosPage as component };
