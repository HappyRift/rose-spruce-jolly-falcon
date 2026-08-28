import { i as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Sparkles, g as Copy, i as Trash2, m as Hash, o as Send, s as Search, u as Plus } from "../_libs/lucide-react.mjs";
import { _ as useFlintStore, a as activeConversation, c as estimateTokens, d as formatUsd, h as routeRequest, i as activeCombo, l as formatPct, m as resolvedStrategy, n as Button, o as cn, p as quoteCost, u as formatTokens } from "./router-DEGBjKzP.mjs";
import { t as Badge } from "./badge-CgaOjFSa.mjs";
import { t as Switch } from "./switch-Dgm_Dkrs.mjs";
import { n as STRATEGY_META, t as CAVEMAN_LABELS } from "./types-DoWnWxe8.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { r as compressProse } from "./caveman-D2x3NcY1.mjs";
import { t as Slider } from "./slider-BKdanos8.mjs";
import { t as Input } from "./input-DvHDDl8R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BvBp2MkP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function renderInline(text, keyBase) {
	const parts = [];
	const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
	let last = 0;
	let m;
	let i = 0;
	while (m = re.exec(text)) {
		if (m.index > last) parts.push(text.slice(last, m.index));
		const token = m[0];
		if (token.startsWith("`")) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded-sm bg-raised px-1 py-0.5 font-mono text-[0.85em] text-fg",
			children: token.slice(1, -1)
		}, `${keyBase}-c-${i}`));
		else parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-medium text-fg",
			children: token.slice(2, -2)
		}, `${keyBase}-b-${i}`));
		last = m.index + token.length;
		i += 1;
	}
	if (last < text.length) parts.push(text.slice(last));
	return parts;
}
function Markdown({ text, className }) {
	const blocks = text.split(/```/);
	const nodes = [];
	blocks.forEach((block, i) => {
		if (i % 2 === 1) {
			const nl = block.indexOf("\n");
			const code = nl === -1 ? block : block.slice(nl + 1);
			nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "my-2 overflow-x-auto rounded-md bg-inset p-3 font-mono text-xs leading-relaxed text-fg shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code.replace(/\n$/, "") })
			}, `code-${i}`));
			return;
		}
		const lines = block.split("\n");
		let para = [];
		const flush = (k) => {
			if (!para.length) return;
			const joined = para.join(" ");
			nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "my-1.5 leading-relaxed text-fg/90",
				children: renderInline(joined, k)
			}, k));
			para = [];
		};
		lines.forEach((line, li) => {
			const t = line.trim();
			if (!t) {
				flush(`p-${i}-${li}`);
				return;
			}
			if (t.startsWith("- ") || t.startsWith("* ")) {
				flush(`p-${i}-${li}`);
				nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 pl-1 text-fg/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: "–"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: renderInline(t.slice(2), `li-${i}-${li}`) })]
				}, `li-${i}-${li}`));
				return;
			}
			para.push(t);
		});
		flush(`p-${i}-end`);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("text-sm", className),
		children: nodes
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getAiStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("d870e16fb91cb1c9b0e020ad7ad4e18a61b98a647bd524416b43a9ffd41e2f0c"));
var completeChat = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("44d60897f716321c594feb204f2df3c1eb78d3e1de8bee824b991da3b4607e96"));
function localReply(userText, decision, opts) {
	const q = userText.toLowerCase();
	let body;
	if (q.includes("cache") || q.includes("prefix") || q.includes("kv")) body = `Prefix ${decision.prefixHash} ${decision.cacheHit ? "hits" : "misses"} on ${decision.model.name}. Cached ${formatTokens(decision.cachedTokens)}. Switching models mid-thread writes a new hash and pays full input. Sticky executor keeps the KV hot; advisor sees a summary.`;
	else if (q.includes("cost") || q.includes("cheap") || q.includes("price")) body = `Routed ${decision.provider.name} / ${decision.model.name}. Effective ${formatUsd(opts.costUsd)} vs naive ${formatUsd(opts.naiveUsd)}. Cache-aware quote uses read multiplier ${decision.model.cacheReadMult} after ${decision.model.cacheMinTokens} tokens.`;
	else if (q.includes("diff") || q.includes("rtk") || q.includes("compress")) body = `RTK ${opts.rtkSaved > 0 ? `dropped ${formatTokens(opts.rtkSaved)} tool tokens` : "found nothing to crush"}. Filters run before the router. Same answer, smaller prefix, better cache alignment.`;
	else if (q.includes("handoff") || q.includes("advisor") || q.includes("workflow")) body = `Advisor pattern: cheap sticky builder holds the long prefix. Reviewer gets a short brief so the builder cache does not break. Fusion fans out; pipeline sequences plan → build → check.`;
	else body = `Gateway picked ${decision.provider.name} (${decision.model.name}) via ${decision.strategy}. ${decision.reason}. Path: ${decision.path.join(" → ")}.`;
	return compressProse(body, opts.cavemanLevel);
}
var PROMPTS = [
	{
		title: "Keep the KV hot",
		body: "If I switch from Sonnet to Opus mid-thread, what happens to the prefix hash and the bill?"
	},
	{
		title: "Crush this diff",
		body: `diff --git a/src/a.ts b/src/a.ts
index 111..222 100644
--- a/src/a.ts
+++ b/src/a.ts
@@ -1,20 +1,8 @@
-console.log(JSON.stringify(payload, null, 2));
+return rank(nodes);
`
	},
	{
		title: "Advisor handoff",
		body: "Hand this review to a stronger model without breaking the executor cache."
	},
	{
		title: "Cheapest path",
		body: "Route this 8k-token coding turn as cheap as possible but keep a cache-capable model if the prefix is already warm."
	}
];
function ChatView() {
	const conversations = useFlintStore((s) => s.conversations);
	const activeId = useFlintStore((s) => s.activeConversationId);
	const conv = useFlintStore(activeConversation);
	const combos = useFlintStore((s) => s.combos);
	const combo = useFlintStore(activeCombo);
	const strategy = useFlintStore(resolvedStrategy);
	const rtkEnabled = useFlintStore((s) => s.rtkEnabled);
	const cavemanLevel = useFlintStore((s) => s.cavemanLevel);
	const temperature = useFlintStore((s) => s.temperature);
	const sending = useFlintStore((s) => s.sending);
	const providers = useFlintStore((s) => s.providers);
	const [query, setQuery] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)("");
	const [aiOn, setAiOn] = (0, import_react.useState)(null);
	const scroller = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		getAiStatus().then((s) => setAiOn(s.available));
	}, []);
	(0, import_react.useEffect)(() => {
		scroller.current?.scrollTo({
			top: scroller.current.scrollHeight,
			behavior: "smooth"
		});
	}, [conv?.messages.length, sending]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (!q) return conversations;
		return conversations.filter((c) => c.title.toLowerCase().includes(q));
	}, [conversations, query]);
	async function send(text) {
		const trimmed = text.trim();
		if (!trimmed || sending) return;
		setDraft("");
		const appended = useFlintStore.getState().appendUser(trimmed);
		if (!appended) return;
		useFlintStore.getState().setSending(true);
		const state = useFlintStore.getState();
		const liveConv = state.conversations.find((c) => c.id === appended.conversation.id);
		const comboNow = state.combos.find((c) => c.id === liveConv.comboId) ?? state.combos[0];
		const strat = state.strategyOverride === "combo" ? comboNow.strategy : state.strategyOverride;
		const tokensIn = estimateTokens(liveConv.systemPrompt + liveConv.messages.map((m) => m.content).join("\n"));
		const decision = routeRequest({
			combo: comboNow,
			strategy: strat,
			providers: state.providers,
			cache: state.cache,
			systemPrompt: liveConv.systemPrompt,
			messages: liveConv.messages,
			tokensIn,
			tokensOutHint: 180,
			stickyProviderId: liveConv.stickyProviderId,
			stickyModelId: liveConv.stickyModelId,
			lastGoodProviderId: state.lastGoodProviderId
		});
		const started = Date.now();
		let textOut = "";
		let live = false;
		try {
			const res = await completeChat({ data: {
				messages: liveConv.messages.filter((m) => m.role === "user" || m.role === "assistant").map((m) => ({
					role: m.role,
					content: m.content
				})),
				cavemanLevel: state.cavemanLevel,
				temperature: state.temperature,
				systemPrompt: liveConv.systemPrompt
			} });
			if (res.ok) {
				textOut = res.text;
				live = true;
			}
		} catch {}
		if (!textOut) {
			const quote = quoteCost(decision.model, tokensIn, 160, decision.cachedTokens);
			textOut = localReply(trimmed, decision, {
				cavemanLevel: state.cavemanLevel,
				rtkSaved: appended.rtkSaved,
				costUsd: quote.usd,
				naiveUsd: quote.naiveUsd
			});
		}
		useFlintStore.getState().commitAssistant({
			content: textOut,
			conversationId: liveConv.id,
			userId: appended.user.id,
			latencyMs: Date.now() - started,
			live
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[calc(100dvh-3rem)] md:h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden w-[260px] shrink-0 flex-col border-r border-border bg-surface lg:flex",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search threads",
						className: "h-9 pl-8"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "iconSm",
					variant: "secondary",
					"aria-label": "New thread",
					onClick: () => useFlintStore.getState().newChat(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-2 pb-3",
				children: filtered.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => useFlintStore.getState().selectChat(c.id),
					className: cn("mb-1 flex w-full flex-col rounded-md px-2.5 py-2 text-left transition-colors duration-[var(--motion-quick)]", c.id === activeId ? "bg-raised text-fg" : "text-muted hover:bg-raised/60 hover:text-fg"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-sm",
						children: c.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-0.5 font-mono text-[10px] uppercase tracking-wide text-faint",
						children: [
							c.folder,
							" · ",
							c.messages.length,
							" turns"
						]
					})]
				}, c.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-wrap items-center gap-2 border-b border-border px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "sr-only",
							htmlFor: "combo",
							children: "Combo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "combo",
							value: combo?.id ?? "auto",
							onChange: (e) => useFlintStore.getState().setCombo(e.target.value),
							className: "h-9 rounded-md bg-inset px-2 font-mono text-xs text-fg shadow-[var(--shadow-border)]",
							children: combos.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: c.id,
								children: ["/", c.slug]
							}, c.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "muted",
							children: STRATEGY_META[strategy].label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden items-center gap-2 sm:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] uppercase text-muted",
								children: "RTK"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: rtkEnabled,
								onCheckedChange: (v) => useFlintStore.getState().setRtk(v),
								"aria-label": "RTK token saver"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden items-center gap-2 md:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] uppercase text-muted",
								children: CAVEMAN_LABELS[cavemanLevel]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								min: 0,
								max: 5,
								step: 1,
								value: [cavemanLevel],
								onValueChange: (v) => useFlintStore.getState().setCaveman(v[0] ?? 0),
								className: "w-24",
								"aria-label": "Caveman level"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [
								aiOn === true && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "ok",
									children: "Live Grok"
								}),
								aiOn === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "warn",
									children: "Local router"
								}),
								conv && conv.messages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "iconSm",
									"aria-label": "Delete thread",
									onClick: () => useFlintStore.getState().deleteChat(conv.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: scroller,
					className: "min-h-0 flex-1 overflow-y-auto px-3 py-6 sm:px-8",
					children: !conv || conv.messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { onPick: (t) => void send(t) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-2xl flex-col gap-6",
						children: [conv.messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1.5 flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] uppercase tracking-wide text-muted",
											children: m.role
										}),
										m.rawContent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: "ok",
											children: "RTK"
										}),
										m.meta?.cacheHit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											tone: "cache",
											children: ["cache ", formatPct(m.meta.cachedTokens / Math.max(1, m.meta.tokensIn))]
										}),
										m.meta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate font-mono text-[10px] text-faint",
											children: m.meta.path.join(" → ")
										})
									]
								}),
								m.role === "assistant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { text: m.content }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "whitespace-pre-wrap text-sm leading-relaxed text-fg/90",
									children: m.content
								}),
								m.meta && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums",
											children: formatUsd(m.meta.costUsd)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "tabular-nums",
											children: [formatTokens(m.meta.tokensIn), " in"]
										}),
										m.meta.rtkSaved > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-ok",
											children: [
												"−",
												formatTokens(m.meta.rtkSaved),
												" rtk"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 text-cache",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "size-3" }), m.meta.prefixHash]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "inline-flex items-center gap-1 text-faint hover:text-fg",
											onClick: () => void navigator.clipboard.writeText(m.content),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" }), "Copy"]
										})
									]
								})
							]
						}, m.id)), sending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-xs text-muted",
							children: [
								"Routing ",
								combo?.slug ?? "auto",
								" · compressing · hashing prefix"
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "border-t border-border p-3 sm:px-8 sm:pb-5",
					onSubmit: (e) => {
						e.preventDefault();
						send(draft);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-2xl items-end gap-2 rounded-xl bg-surface p-2 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									send(draft);
								}
							},
							rows: 2,
							placeholder: "Message Flint. Tool dumps get RTK. Prefix stays sticky.",
							className: "min-h-12 max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-fg placeholder:text-faint focus:outline-none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "icon",
							disabled: !draft.trim() || sending,
							"aria-label": "Send",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto mt-2 flex max-w-2xl items-center justify-between font-mono text-[10px] text-faint",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							STRATEGY_META[strategy].label,
							" · caveman ",
							CAVEMAN_LABELS[cavemanLevel],
							" · temp",
							" ",
							temperature.toFixed(1)
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [providers.filter((p) => p.healthy && p.enabled).length, " healthy"] })]
					})]
				})
			]
		})]
	});
}
function EmptyState({ onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-2xl flex-col items-start px-2 pt-10 sm:pt-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.18em] text-muted",
				children: "Central gateway"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl leading-none tracking-tight sm:text-5xl",
				children: "Where to."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-md text-sm leading-relaxed text-muted",
				children: "One endpoint. Cross-provider routing, RTK + Caveman, prefix-hash KV math, and advisor-style handoff. Threads stay sticky so cache hits survive the session."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid w-full gap-2 sm:grid-cols-2",
				children: PROMPTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onPick(p.body),
					className: "rounded-lg bg-surface p-3 text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-[var(--motion-quick)] hover:shadow-[var(--shadow-border-hover)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 text-muted" }), p.title]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-2 text-xs text-muted",
						children: p.body
					})]
				}, p.title))
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatView, {});
}
//#endregion
export { Home as component };
