import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useFlintStore, d as formatUsd } from "./router-DEGBjKzP.mjs";
import { t as Badge } from "./badge-CgaOjFSa.mjs";
import { t as Switch } from "./switch-Dgm_Dkrs.mjs";
import { t as Progress } from "./progress-i9MBh0tk.mjs";
import { t as Input } from "./input-DvHDDl8R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/providers-CdM2-lVE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TIERS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "subscription",
		label: "Subscription"
	},
	{
		id: "cheap",
		label: "Cheap"
	},
	{
		id: "api",
		label: "API"
	},
	{
		id: "free",
		label: "Free"
	}
];
function ProvidersPage() {
	const providers = useFlintStore((s) => s.providers);
	const [tier, setTier] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const now = Date.now();
	const list = (0, import_react.useMemo)(() => {
		return providers.filter((p) => {
			if (tier !== "all" && p.tier !== tier) return false;
			if (q && !`${p.name} ${p.vendor}`.toLowerCase().includes(q.toLowerCase())) return false;
			return true;
		});
	}, [
		providers,
		tier,
		q
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl space-y-6 p-4 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.18em] text-muted",
						children: "Catalog"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl tracking-tight",
						children: "Providers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-muted",
						children: "Health, quota, cache multipliers. Disable a node and the combo walks the next tier in milliseconds."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Filter",
					className: "sm:max-w-xs"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: TIERS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTier(t.id),
					className: t.id === tier ? "h-8 rounded-md bg-accent px-3 text-xs text-accent-fg" : "h-8 rounded-md bg-raised px-3 text-xs text-muted hover:text-fg",
					children: t.label
				}, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3 md:grid-cols-2",
				children: list.map((p) => {
					const model = p.models[0];
					const resetMin = Math.max(0, Math.round((p.quotaResetAt - now) / 6e4));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-base font-medium",
											children: p.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: "muted",
											children: p.tier
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: p.circuit === "open" ? "bad" : p.circuit === "half" ? "warn" : "ok",
											children: p.circuit
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: p.notes
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: p.enabled,
									onCheckedChange: () => useFlintStore.getState().toggleProvider(p.id),
									"aria-label": `Toggle ${p.name}`
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								className: "mt-4",
								value: p.quotaUsed * 100,
								tone: p.quotaUsed > .85 ? "bad" : p.quotaUsed > .6 ? "warn" : "ok"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-3 grid grid-cols-2 gap-2 font-mono text-[11px] text-muted sm:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-faint",
										children: "Quota"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "tabular-nums text-fg",
										children: [Math.round(p.quotaUsed * 100), "%"]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-faint",
										children: "Reset"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "tabular-nums text-fg",
										children: [resetMin, "m"]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-faint",
										children: "Latency"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "tabular-nums text-fg",
										children: [p.latencyMs, "ms"]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-faint",
										children: "RPM"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "tabular-nums text-fg",
										children: [
											p.rpm,
											"/",
											p.rpmCap
										]
									})] })
								]
							}),
							model && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: model.name }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums",
										children: [
											formatUsd(model.inputPerM),
											" / ",
											formatUsd(model.outputPerM),
											" per M"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"cache ×",
										model.cacheReadMult,
										model.cacheMinTokens >= 1e6 ? " off" : ""
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums",
										children: [(model.context / 1e3).toFixed(0), "k ctx"]
									})
								]
							})
						]
					}, p.id);
				})
			})
		]
	});
}
//#endregion
export { ProvidersPage as component };
