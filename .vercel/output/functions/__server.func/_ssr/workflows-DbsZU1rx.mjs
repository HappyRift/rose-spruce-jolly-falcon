import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useFlintStore, d as formatUsd, n as Button, u as formatTokens } from "./router-DEGBjKzP.mjs";
import { t as Badge } from "./badge-CgaOjFSa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workflows-DbsZU1rx.js
var import_jsx_runtime = require_jsx_runtime();
function WorkflowsPage() {
	const workflows = useFlintStore((s) => s.workflows);
	const runs = useFlintStore((s) => s.runs);
	const providers = useFlintStore((s) => s.providers);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl space-y-6 p-4 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.18em] text-muted",
					children: "A2A via the gateway"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl tracking-tight",
					children: "Handoff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted",
					children: "Agents do not talk to providers. They talk to Flint. The gateway holds the prefix, decides who sees the full thread, and who gets a summary so the executor KV stays hot."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3 md:grid-cols-2",
				children: workflows.map((wf) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-col rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: wf.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 flex-1 text-sm text-muted",
							children: wf.blurb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-4 space-y-2",
							children: wf.steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px] text-faint",
										children: i + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step.role }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										tone: step.sticky ? "cache" : "muted",
										children: [step.handoff, step.sticky ? " · sticky" : ""]
									})
								]
							}, step.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							onClick: () => useFlintStore.getState().runWorkflow(wf.id),
							children: "Run handoff"
						})
					]
				}, wf.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Runs"
			}), runs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "No runs yet. Fire a workflow to see prefix hashes and the advisor discount."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-3",
				children: runs.map((run) => {
					const wf = workflows.find((w) => w.id === run.workflowId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl",
								children: wf?.name ?? run.workflowId
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-mono text-xs tabular-nums text-muted",
								children: [
									formatUsd(run.totalCost),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-faint",
										children: ["vs naive ", formatUsd(run.naiveCost)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-2 text-ok",
										children: ["−", formatUsd(Math.max(0, run.naiveCost - run.totalCost))]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-3 grid gap-2 sm:grid-cols-3",
							children: run.events.map((ev) => {
								const p = providers.find((x) => x.id === ev.providerId);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-md bg-inset p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm",
												children: ev.role
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												tone: ev.cacheHit ? "cache" : "muted",
												children: ev.cacheHit ? "hit" : "cold"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 text-xs text-muted",
											children: [
												p?.name,
												" / ",
												ev.modelId
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-mono text-[10px] text-cache",
											children: ev.prefixHash
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 font-mono text-[10px] text-faint",
											children: [
												formatTokens(ev.tokensIn),
												" in · ",
												formatTokens(ev.cachedTokens),
												" ",
												"cached · ",
												formatUsd(ev.costUsd)
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs text-muted",
											children: ev.note
										})
									]
								}, ev.id);
							})
						})]
					}, run.id);
				})
			})] })
		]
	});
}
//#endregion
export { WorkflowsPage as component };
