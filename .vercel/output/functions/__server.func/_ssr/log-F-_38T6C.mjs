import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useFlintStore, d as formatUsd, u as formatTokens } from "./router-DEGBjKzP.mjs";
import { t as Badge } from "./badge-CgaOjFSa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/log-F-_38T6C.js
var import_jsx_runtime = require_jsx_runtime();
function LogPage() {
	const log = useFlintStore((s) => s.log);
	const providers = useFlintStore((s) => s.providers);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl space-y-6 p-4 sm:p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.18em] text-muted",
				children: "Request log"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl tracking-tight",
				children: "Hops"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm text-muted",
				children: "Every completion through the gateway: path, cache, RTK, dollars. Local only."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[720px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "font-mono text-[10px] uppercase tracking-wide text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "When"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Path"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Preview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Tokens"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-medium",
								children: "Cost"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: log.map((e) => {
					const p = providers.find((x) => x.id === e.providerId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/70 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "whitespace-nowrap px-4 py-3 font-mono text-xs text-muted",
								children: new Date(e.at).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: e.status === "ok" ? "ok" : e.status === "fallback" ? "warn" : "bad",
									children: e.status
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs",
									children: p?.name ?? e.providerId
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-[10px] text-faint",
									children: e.path.join(" → ")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "max-w-[240px] truncate px-4 py-3 text-muted",
								children: e.preview
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 font-mono text-xs tabular-nums",
								children: [
									formatTokens(e.tokensIn),
									e.cacheHit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-cache",
										children: [
											" · ",
											formatTokens(e.cachedTokens),
											" kv"
										]
									}) : null,
									e.rtk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-ok",
										children: " · rtk"
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 font-mono text-xs tabular-nums",
								children: [formatUsd(e.costUsd), e.savedUsd > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-ok",
									children: ["−", formatUsd(e.savedUsd)]
								})]
							})
						]
					}, e.id);
				}) })]
			})
		})]
	});
}
//#endregion
export { LogPage as component };
