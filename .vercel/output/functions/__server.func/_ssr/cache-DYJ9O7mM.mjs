import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useFlintStore, a as activeConversation, c as estimateTokens, d as formatUsd, f as prefixHash, g as shortHash, l as formatPct, n as Button, p as quoteCost, u as formatTokens } from "./router-DEGBjKzP.mjs";
import { t as Badge } from "./badge-CgaOjFSa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cache-DYJ9O7mM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CachePage() {
	const conv = useFlintStore(activeConversation);
	const cache = useFlintStore((s) => s.cache);
	const providers = useFlintStore((s) => s.providers);
	const [sys, setSys] = (0, import_react.useState)("You are a coding agent. Project: Flint gateway. Always prefer sticky KV.");
	const [turns, setTurns] = (0, import_react.useState)("Review auth middleware.\nAdd tests for forged userId.\nKeep the executor on Sonnet.");
	const chain = (0, import_react.useMemo)(() => {
		const messages = turns.split("\n").map((t) => t.trim()).filter(Boolean).map((content, i) => ({
			role: i % 2 === 0 ? "user" : "assistant",
			content
		}));
		const rows = [];
		let acc = estimateTokens(sys);
		rows.push({
			label: "system",
			hash: prefixHash(sys, messages, 0),
			tokens: acc
		});
		messages.forEach((m, i) => {
			acc += estimateTokens(m.content);
			rows.push({
				label: `${m.role} ${i + 1}`,
				hash: prefixHash(sys, messages, i + 1),
				tokens: acc
			});
		});
		return rows;
	}, [sys, turns]);
	const sonnet = providers.find((p) => p.id === "claude-code")?.models[0];
	const gpt = providers.find((p) => p.id === "openai-api")?.models[0];
	const tokensIn = chain[chain.length - 1]?.tokens ?? 0;
	const cached = tokensIn >= 1024 ? Math.min(tokensIn - 180, chain[chain.length - 2]?.tokens ?? 0) : 0;
	const sticky = sonnet ? quoteCost(sonnet, tokensIn, 200, cached) : null;
	const switched = sonnet && gpt ? quoteCost(gpt, tokensIn, 200, 0) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl space-y-6 p-4 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.18em] text-muted",
					children: "Prefix hashes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl tracking-tight",
					children: "KV cache"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted",
					children: "Each turn hashes the canonical prefix. Hits walk backward in 128-token steps after a 1024-token floor. Change a byte — or the model — and the hash misses. Mid-session switches re-pay the whole prompt."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:col-span-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Hash calculator"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-3 block font-mono text-[10px] uppercase text-muted",
							children: "System"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: sys,
							onChange: (e) => setSys(e.target.value),
							rows: 3,
							className: "mt-1 w-full rounded-md bg-inset p-2 text-sm text-fg shadow-[var(--shadow-border)]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-3 block font-mono text-[10px] uppercase text-muted",
							children: "Turns, one per line"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: turns,
							onChange: (e) => setTurns(e.target.value),
							rows: 5,
							className: "mt-1 w-full rounded-md bg-inset p-2 text-sm text-fg shadow-[var(--shadow-border)]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-4 space-y-2",
							children: chain.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-8 w-1.5 rounded-full bg-cache",
									style: { opacity: .35 + i / Math.max(1, chain.length) * .65 }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm",
											children: row.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[11px] tabular-nums text-muted",
											children: formatTokens(row.tokens)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-[11px] text-cache",
										children: row.hash
									})]
								})]
							}, row.hash + i))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "Sticky vs switch"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: "Same thread. Stay on Sonnet (cache read ×0.1) or jump to GPT-4.1 (cold)."
							}),
							sticky && switched && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-4 space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: "Sticky Sonnet"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-mono tabular-nums text-ok",
											children: formatUsd(sticky.usd)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: "Switch GPT-4.1"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-mono tabular-nums",
											children: formatUsd(switched.usd)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: "Penalty"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-mono tabular-nums text-bad",
											children: formatUsd(Math.max(0, switched.usd - sticky.usd))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: "Cached tokens"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
											className: "font-mono tabular-nums",
											children: [
												formatTokens(cached),
												" (",
												formatPct(cached / Math.max(1, tokensIn)),
												")"
											]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs leading-relaxed text-muted",
								children: "Advisor pattern: keep the executor sticky. Send the reviewer a summary so you never bust the long prefix."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Live entries"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2",
							children: cache.slice(0, 8).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-md bg-inset p-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[11px] text-cache",
											children: shortHash(e.prefixHash)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											tone: "cache",
											children: [e.hits, " hits"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 truncate text-xs text-muted",
										children: e.preview
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 font-mono text-[10px] text-faint",
										children: [
											e.modelId,
											" · ",
											formatTokens(e.tokens),
											" · ttl",
											" ",
											Math.max(0, Math.round((e.expiresAt - Date.now()) / 1e3)),
											"s"
										]
									})
								]
							}, e.key))
						})]
					})]
				})]
			}),
			conv && conv.messages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "This thread"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/",
								children: "Open chat"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: conv.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: conv.messages.filter((m) => m.meta).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							tone: m.meta?.cacheHit ? "cache" : "muted",
							children: [
								m.meta?.prefixHash,
								" ",
								m.meta?.cacheHit ? "hit" : "miss"
							]
						}, m.id))
					})
				]
			})
		]
	});
}
//#endregion
export { CachePage as component };
