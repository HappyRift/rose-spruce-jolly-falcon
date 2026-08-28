import { i as __toESM } from "../_runtime.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as createRootRoute, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Activity, c as Scissors, d as MessageSquare, f as Menu, h as GitBranch, l as Radio, m as Hash, n as Waypoints, p as Layers, r as TriangleAlert, t as X } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-DKvDPruw.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/** Stable FNV-1a. Same string → same 8-hex prefix hash in SSR and browser. */
function fnv1a(input) {
	let h = 2166136261;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0).toString(16).padStart(8, "0");
}
function estimateTokens(text) {
	if (!text) return 0;
	return Math.max(1, Math.ceil(text.length / 4));
}
function canonicalizePrefix(systemPrompt, messages, upTo) {
	const parts = [`system:${systemPrompt.trim()}`];
	const slice = messages.slice(0, Math.max(0, upTo));
	for (const m of slice) parts.push(`${m.role}:${m.content.trim()}`);
	return parts.join("\n␞\n");
}
function prefixHash(systemPrompt, messages, upTo) {
	return `pfx_${fnv1a(canonicalizePrefix(systemPrompt, messages, upTo))}`;
}
/** OpenAI-style: cache hits in 128-token increments after a 1024-token floor. */
function cacheableTokens(total, minTokens) {
	if (total < minTokens) return 0;
	const extra = total - minTokens;
	return minTokens + Math.floor(extra / 128) * 128;
}
function shortHash(hash) {
	const raw = hash.replace(/^pfx_/, "");
	return `${raw.slice(0, 4)}·${raw.slice(-4)}`;
}
function quoteCost(model, tokensIn, tokensOut, cachedTokens) {
	const hittable = cacheableTokens(tokensIn, model.cacheMinTokens);
	const cached = Math.min(cachedTokens, hittable);
	const fresh = Math.max(0, tokensIn - cached);
	const inputUsd = fresh / 1e6 * model.inputPerM;
	const cachedUsd = cached / 1e6 * model.inputPerM * model.cacheReadMult;
	const wroteCache = cached === 0 && tokensIn >= model.cacheMinTokens;
	const writePremium = wroteCache ? tokensIn / 1e6 * model.inputPerM * Math.max(0, model.cacheWriteMult - 1) : 0;
	const outputUsd = tokensOut / 1e6 * model.outputPerM;
	const usd = inputUsd + cachedUsd + writePremium + outputUsd;
	const naiveUsd = tokensIn / 1e6 * model.inputPerM + outputUsd;
	return {
		usd,
		naiveUsd,
		savedUsd: Math.max(0, naiveUsd - usd),
		freshTokens: fresh,
		cachedTokens: cached,
		wroteCache
	};
}
function formatUsd(n) {
	if (n < 1e-4) return "$0.0000";
	if (n < .01) return `$${n.toFixed(4)}`;
	if (n < 1) return `$${n.toFixed(3)}`;
	return `$${n.toFixed(2)}`;
}
function formatTokens(n) {
	if (n < 1e3) return `${Math.round(n)}`;
	if (n < 1e4) return `${(n / 1e3).toFixed(1)}k`;
	if (n < 1e6) return `${Math.round(n / 1e3)}k`;
	return `${(n / 1e6).toFixed(1)}M`;
}
function formatPct(n) {
	if (!Number.isFinite(n)) return "0%";
	return `${Math.round(n * 100)}%`;
}
function hoursFromNow(h) {
	return Date.now() + h * 36e5;
}
var ANTHROPIC_CACHE = {
	cacheReadMult: .1,
	cacheWriteMult: 1.25,
	cacheMinTokens: 1024
};
var OPENAI_CACHE = {
	cacheReadMult: .5,
	cacheWriteMult: 1,
	cacheMinTokens: 1024
};
var XAI_CACHE = {
	cacheReadMult: .25,
	cacheWriteMult: 1,
	cacheMinTokens: 1024
};
var GOOGLE_CACHE = {
	cacheReadMult: .25,
	cacheWriteMult: 1,
	cacheMinTokens: 1024
};
var NO_CACHE = {
	cacheReadMult: 1,
	cacheWriteMult: 1,
	cacheMinTokens: 1e6
};
function seedProviders() {
	return [
		{
			id: "claude-code",
			name: "Claude Code",
			vendor: "Anthropic",
			tier: "subscription",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 420,
			quotaUsed: .62,
			quotaResetAt: hoursFromNow(5.4),
			rpm: 8,
			rpmCap: 40,
			usedCount: 184,
			models: [{
				id: "claude-sonnet",
				name: "Sonnet 4.5",
				context: 2e5,
				inputPerM: 3,
				outputPerM: 15,
				quality: 9,
				...ANTHROPIC_CACHE
			}],
			notes: "OAuth subscription. Drain first. Best KV discount (10% cache reads)."
		},
		{
			id: "codex",
			name: "Codex",
			vendor: "OpenAI",
			tier: "subscription",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 510,
			quotaUsed: .81,
			quotaResetAt: hoursFromNow(2.1),
			rpm: 12,
			rpmCap: 30,
			usedCount: 220,
			models: [{
				id: "gpt-codex",
				name: "GPT Codex",
				context: 128e3,
				inputPerM: 2.5,
				outputPerM: 10,
				quality: 8,
				...OPENAI_CACHE
			}],
			notes: "IDE subscription. High quota pressure — reset-aware routing helps."
		},
		{
			id: "gemini-cli",
			name: "Gemini CLI",
			vendor: "Google",
			tier: "subscription",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 380,
			quotaUsed: .34,
			quotaResetAt: hoursFromNow(11),
			rpm: 6,
			rpmCap: 60,
			usedCount: 96,
			models: [{
				id: "gemini-pro",
				name: "Gemini Pro",
				context: 1e6,
				inputPerM: 1.25,
				outputPerM: 5,
				quality: 8,
				...GOOGLE_CACHE
			}],
			notes: "Huge context window. Overflow relay target."
		},
		{
			id: "copilot",
			name: "GitHub Copilot",
			vendor: "GitHub",
			tier: "subscription",
			enabled: true,
			healthy: true,
			circuit: "half",
			cooldownUntil: Date.now() + 12e3,
			latencyMs: 640,
			quotaUsed: .91,
			quotaResetAt: hoursFromNow(1.2),
			rpm: 18,
			rpmCap: 20,
			usedCount: 310,
			models: [{
				id: "copilot-gpt",
				name: "Copilot GPT",
				context: 64e3,
				inputPerM: 0,
				outputPerM: 0,
				quality: 7,
				...NO_CACHE
			}],
			notes: "Near cap. Circuit half-open after 429s."
		},
		{
			id: "glm",
			name: "GLM Coding",
			vendor: "Zhipu",
			tier: "cheap",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 290,
			quotaUsed: .22,
			quotaResetAt: hoursFromNow(20),
			rpm: 4,
			rpmCap: 80,
			usedCount: 64,
			models: [{
				id: "glm-4.5",
				name: "GLM 4.5",
				context: 128e3,
				inputPerM: .6,
				outputPerM: 2.2,
				quality: 7,
				...OPENAI_CACHE
			}],
			notes: "Tier-2 spill. Strong coding, cheap input."
		},
		{
			id: "minimax",
			name: "MiniMax",
			vendor: "MiniMax",
			tier: "cheap",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 310,
			quotaUsed: .18,
			quotaResetAt: hoursFromNow(18),
			rpm: 3,
			rpmCap: 60,
			usedCount: 41,
			models: [{
				id: "minimax-m2",
				name: "MiniMax M2",
				context: 2e5,
				inputPerM: .2,
				outputPerM: 1.1,
				quality: 7,
				...OPENAI_CACHE
			}],
			notes: "Lowest paid input among coding models."
		},
		{
			id: "kimi",
			name: "Kimi",
			vendor: "Moonshot",
			tier: "cheap",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 360,
			quotaUsed: .47,
			quotaResetAt: hoursFromNow(9),
			rpm: 5,
			rpmCap: 40,
			usedCount: 77,
			models: [{
				id: "kimi-k2",
				name: "Kimi K2",
				context: 256e3,
				inputPerM: .6,
				outputPerM: 2.5,
				quality: 8,
				...OPENAI_CACHE
			}],
			notes: "Flat-ish monthly. Long context, good cache."
		},
		{
			id: "deepseek",
			name: "DeepSeek",
			vendor: "DeepSeek",
			tier: "cheap",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 340,
			quotaUsed: .29,
			quotaResetAt: hoursFromNow(14),
			rpm: 7,
			rpmCap: 100,
			usedCount: 112,
			models: [{
				id: "deepseek-v3",
				name: "DeepSeek V3",
				context: 128e3,
				inputPerM: .27,
				outputPerM: 1.1,
				quality: 8,
				cacheReadMult: .1,
				cacheWriteMult: 1,
				cacheMinTokens: 1024
			}],
			notes: "Aggressive cache-read discount. Excellent spill target."
		},
		{
			id: "groq",
			name: "Groq",
			vendor: "Groq",
			tier: "cheap",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 90,
			quotaUsed: .41,
			quotaResetAt: hoursFromNow(6),
			rpm: 22,
			rpmCap: 120,
			usedCount: 401,
			models: [{
				id: "llama-70b",
				name: "Llama 3.3 70B",
				context: 128e3,
				inputPerM: .05,
				outputPerM: .08,
				quality: 6,
				...NO_CACHE
			}],
			notes: "Fastest. No KV discount — cheap enough that it rarely matters."
		},
		{
			id: "xai",
			name: "xAI",
			vendor: "xAI",
			tier: "api",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 280,
			quotaUsed: .12,
			quotaResetAt: hoursFromNow(22),
			rpm: 2,
			rpmCap: 60,
			usedCount: 28,
			models: [{
				id: "grok-4.5",
				name: "Grok 4.5",
				context: 256e3,
				inputPerM: 3,
				outputPerM: 15,
				quality: 9,
				...XAI_CACHE
			}],
			notes: "Live chat path. Cache-aware, high quality."
		},
		{
			id: "anthropic-api",
			name: "Anthropic API",
			vendor: "Anthropic",
			tier: "api",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 400,
			quotaUsed: .08,
			quotaResetAt: hoursFromNow(24),
			rpm: 1,
			rpmCap: 50,
			usedCount: 19,
			models: [{
				id: "claude-opus",
				name: "Opus 4.5",
				context: 2e5,
				inputPerM: 15,
				outputPerM: 75,
				quality: 10,
				...ANTHROPIC_CACHE
			}],
			notes: "Advisor / reviewer only. Never the sticky executor."
		},
		{
			id: "openai-api",
			name: "OpenAI API",
			vendor: "OpenAI",
			tier: "api",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 430,
			quotaUsed: .15,
			quotaResetAt: hoursFromNow(24),
			rpm: 3,
			rpmCap: 80,
			usedCount: 44,
			models: [{
				id: "gpt-4.1",
				name: "GPT-4.1",
				context: 128e3,
				inputPerM: 2,
				outputPerM: 8,
				quality: 8,
				...OPENAI_CACHE
			}],
			notes: "General API. 50% cache-read discount."
		},
		{
			id: "iflow",
			name: "iFlow",
			vendor: "iFlow",
			tier: "free",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 720,
			quotaUsed: .55,
			quotaResetAt: hoursFromNow(8),
			rpm: 9,
			rpmCap: 20,
			usedCount: 130,
			models: [{
				id: "iflow-chat",
				name: "iFlow Chat",
				context: 32e3,
				inputPerM: 0,
				outputPerM: 0,
				quality: 5,
				...NO_CACHE
			}],
			notes: "Free forever. Last-resort spill."
		},
		{
			id: "qwen",
			name: "Qwen",
			vendor: "Alibaba",
			tier: "free",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 480,
			quotaUsed: .37,
			quotaResetAt: hoursFromNow(10),
			rpm: 5,
			rpmCap: 30,
			usedCount: 88,
			models: [{
				id: "qwen-plus",
				name: "Qwen Plus",
				context: 128e3,
				inputPerM: 0,
				outputPerM: 0,
				quality: 6,
				...NO_CACHE
			}],
			notes: "Free coding-capable spill."
		},
		{
			id: "kiro",
			name: "Kiro",
			vendor: "Kiro",
			tier: "free",
			enabled: true,
			healthy: false,
			circuit: "open",
			cooldownUntil: Date.now() + 45e3,
			latencyMs: 900,
			quotaUsed: .99,
			quotaResetAt: hoursFromNow(.4),
			rpm: 0,
			rpmCap: 10,
			usedCount: 50,
			models: [{
				id: "kiro-free",
				name: "Kiro Free",
				context: 32e3,
				inputPerM: 0,
				outputPerM: 0,
				quality: 5,
				...NO_CACHE
			}],
			notes: "Quota blown. Circuit open until reset."
		},
		{
			id: "opencode",
			name: "OpenCode Free",
			vendor: "OpenCode",
			tier: "free",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 560,
			quotaUsed: .11,
			quotaResetAt: hoursFromNow(30),
			rpm: 2,
			rpmCap: 40,
			usedCount: 14,
			models: [{
				id: "opencode-free",
				name: "OpenCode Free",
				context: 64e3,
				inputPerM: 0,
				outputPerM: 0,
				quality: 5,
				...NO_CACHE
			}],
			notes: "No-auth free tier."
		},
		{
			id: "nim",
			name: "NVIDIA NIM",
			vendor: "NVIDIA",
			tier: "free",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 410,
			quotaUsed: .26,
			quotaResetAt: hoursFromNow(12),
			rpm: 4,
			rpmCap: 40,
			usedCount: 33,
			models: [{
				id: "nim-70b",
				name: "NIM 70B",
				context: 32e3,
				inputPerM: 0,
				outputPerM: 0,
				quality: 6,
				...NO_CACHE
			}],
			notes: "Free hosted. Good embeddings sibling."
		},
		{
			id: "cerebras",
			name: "Cerebras",
			vendor: "Cerebras",
			tier: "api",
			enabled: true,
			healthy: true,
			circuit: "closed",
			cooldownUntil: 0,
			latencyMs: 70,
			quotaUsed: .33,
			quotaResetAt: hoursFromNow(7),
			rpm: 14,
			rpmCap: 90,
			usedCount: 190,
			models: [{
				id: "qwen-cerebras",
				name: "Qwen 3 32B",
				context: 32e3,
				inputPerM: .1,
				outputPerM: .1,
				quality: 6,
				...NO_CACHE
			}],
			notes: "Wafer-scale speed. /fast combo member."
		}
	];
}
function seedCombos() {
	return [
		{
			id: "auto",
			name: "Auto",
			slug: "auto",
			strategy: "auto",
			sticky: true,
			tiers: [
				[
					{
						providerId: "claude-code",
						modelId: "claude-sonnet"
					},
					{
						providerId: "codex",
						modelId: "gpt-codex"
					},
					{
						providerId: "gemini-cli",
						modelId: "gemini-pro"
					}
				],
				[
					{
						providerId: "glm",
						modelId: "glm-4.5"
					},
					{
						providerId: "deepseek",
						modelId: "deepseek-v3"
					},
					{
						providerId: "minimax",
						modelId: "minimax-m2"
					}
				],
				[
					{
						providerId: "qwen",
						modelId: "qwen-plus"
					},
					{
						providerId: "iflow",
						modelId: "iflow-chat"
					},
					{
						providerId: "opencode",
						modelId: "opencode-free"
					}
				]
			]
		},
		{
			id: "coding",
			name: "Coding",
			slug: "coding",
			strategy: "fill-first",
			sticky: true,
			tiers: [
				[{
					providerId: "claude-code",
					modelId: "claude-sonnet"
				}, {
					providerId: "codex",
					modelId: "gpt-codex"
				}],
				[{
					providerId: "glm",
					modelId: "glm-4.5"
				}, {
					providerId: "kimi",
					modelId: "kimi-k2"
				}],
				[{
					providerId: "qwen",
					modelId: "qwen-plus"
				}]
			]
		},
		{
			id: "cheap",
			name: "Cheap",
			slug: "cheap",
			strategy: "cost-optimized",
			sticky: false,
			tiers: [
				[
					{
						providerId: "minimax",
						modelId: "minimax-m2"
					},
					{
						providerId: "deepseek",
						modelId: "deepseek-v3"
					},
					{
						providerId: "groq",
						modelId: "llama-70b"
					}
				],
				[{
					providerId: "glm",
					modelId: "glm-4.5"
				}],
				[{
					providerId: "iflow",
					modelId: "iflow-chat"
				}, {
					providerId: "opencode",
					modelId: "opencode-free"
				}]
			]
		},
		{
			id: "fast",
			name: "Fast",
			slug: "fast",
			strategy: "p2c",
			sticky: false,
			tiers: [
				[{
					providerId: "groq",
					modelId: "llama-70b"
				}, {
					providerId: "cerebras",
					modelId: "qwen-cerebras"
				}],
				[{
					providerId: "minimax",
					modelId: "minimax-m2"
				}],
				[{
					providerId: "nim",
					modelId: "nim-70b"
				}]
			]
		},
		{
			id: "cache",
			name: "Cache",
			slug: "cache",
			strategy: "cache-optimized",
			sticky: true,
			tiers: [
				[{
					providerId: "claude-code",
					modelId: "claude-sonnet"
				}, {
					providerId: "anthropic-api",
					modelId: "claude-opus"
				}],
				[{
					providerId: "deepseek",
					modelId: "deepseek-v3"
				}, {
					providerId: "xai",
					modelId: "grok-4.5"
				}],
				[{
					providerId: "kimi",
					modelId: "kimi-k2"
				}]
			]
		},
		{
			id: "advisor",
			name: "Advisor",
			slug: "advisor",
			strategy: "pipeline",
			sticky: true,
			tiers: [
				[{
					providerId: "glm",
					modelId: "glm-4.5"
				}],
				[{
					providerId: "claude-code",
					modelId: "claude-sonnet"
				}],
				[{
					providerId: "anthropic-api",
					modelId: "claude-opus"
				}]
			]
		}
	];
}
function seedWorkflows() {
	return [
		{
			id: "advisor",
			name: "Advisor",
			blurb: "Sticky cheap executor. Strong model sees a summary, never the full prefix — executor KV stays hot.",
			steps: [{
				id: "exec",
				role: "Executor",
				agent: "glm-worker",
				sticky: true,
				comboId: "cheap",
				handoff: "full"
			}, {
				id: "review",
				role: "Advisor",
				agent: "opus-review",
				sticky: false,
				comboId: "cache",
				handoff: "advisor"
			}]
		},
		{
			id: "pipeline",
			name: "Plan · build · check",
			blurb: "Three-step pipeline. Planner and reviewer take summaries; builder keeps the long prefix.",
			steps: [
				{
					id: "plan",
					role: "Planner",
					agent: "flash-plan",
					sticky: false,
					comboId: "fast",
					handoff: "summary"
				},
				{
					id: "build",
					role: "Builder",
					agent: "sonnet-build",
					sticky: true,
					comboId: "coding",
					handoff: "full"
				},
				{
					id: "check",
					role: "Reviewer",
					agent: "opus-check",
					sticky: false,
					comboId: "advisor",
					handoff: "advisor"
				}
			]
		},
		{
			id: "fusion",
			name: "Fusion panel",
			blurb: "Fan-out to two coding models, judge picks. Burns tokens; use on hard calls only.",
			steps: [
				{
					id: "a",
					role: "Panel A",
					agent: "sonnet",
					sticky: false,
					comboId: "coding",
					handoff: "full"
				},
				{
					id: "b",
					role: "Panel B",
					agent: "kimi",
					sticky: false,
					comboId: "cheap",
					handoff: "full"
				},
				{
					id: "judge",
					role: "Judge",
					agent: "grok-judge",
					sticky: false,
					comboId: "auto",
					handoff: "summary"
				}
			]
		},
		{
			id: "relay",
			name: "Context relay",
			blurb: "When the executor window fills, hand the prefix to Gemini’s 1M context without resetting the thread.",
			steps: [{
				id: "exec",
				role: "Executor",
				agent: "codex",
				sticky: true,
				comboId: "coding",
				handoff: "full"
			}, {
				id: "relay",
				role: "Relay",
				agent: "gemini-1m",
				sticky: true,
				comboId: "auto",
				handoff: "full"
			}]
		}
	];
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}
function findModel(p, modelId) {
	return p.models.find((m) => m.id === modelId) ?? p.models[0];
}
function candidatesOf(combo, providers) {
	const byId = new Map(providers.map((p) => [p.id, p]));
	const out = [];
	combo.tiers.forEach((tier, tierIndex) => {
		for (const slot of tier) {
			const provider = byId.get(slot.providerId);
			if (!provider) continue;
			const model = findModel(provider, slot.modelId);
			if (!model) continue;
			out.push({
				provider,
				model,
				slot,
				tierIndex
			});
		}
	});
	return out;
}
function isUsable(c, now) {
	if (!c.provider.enabled) return false;
	if (c.provider.circuit === "open" && c.provider.cooldownUntil > now) return false;
	if (!c.provider.healthy && c.provider.circuit === "open") return false;
	if (c.provider.quotaUsed >= .98) return false;
	return true;
}
function cacheLookup(cache, modelId, hash, now) {
	return cache.find((e) => e.modelId === modelId && e.prefixHash === hash && e.expiresAt > now);
}
function longestCache(cache, modelId, hashes, now) {
	for (let i = hashes.length - 1; i >= 0; i--) {
		const h = hashes[i];
		if (!h) continue;
		const hit = cacheLookup(cache, modelId, h, now);
		if (hit) return hit;
	}
}
function scoreCandidate(c, req, hashes, now) {
	const p = c.provider;
	const health = p.circuit === "closed" ? 1 : p.circuit === "half" ? .45 : .05;
	const quota = 1 - p.quotaUsed;
	const cost = 1 / (.05 + c.model.inputPerM + c.model.outputPerM * .25);
	const latency = 1 / (50 + p.latencyMs);
	const hit = longestCache(req.cache, c.model.id, hashes, now);
	const cacheScore = hit ? .6 + Math.min(.4, hit.tokens / 2e4) : 0;
	const ctx = req.tokensIn < c.model.context * .85 ? 1 : .1;
	const quality = c.model.quality / 10;
	const rpm = 1 - p.rpm / Math.max(1, p.rpmCap);
	const lkg = req.lastGoodProviderId === p.id ? .25 : 0;
	const sticky = req.stickyModelId === c.model.id && req.stickyProviderId === p.id ? .35 : 0;
	return health * 1.4 + quota * 1.1 + cost * .9 + latency * .7 + cacheScore * 1.6 + ctx * 1.2 + quality * .8 + rpm * .6 + lkg + sticky;
}
function pickUsable(list, now, path) {
	for (const c of list) {
		path.push(c.provider.name);
		if (isUsable(c, now)) return c;
	}
	return null;
}
function routeRequest(req) {
	const now = Date.now();
	const all = candidatesOf(req.combo, req.providers);
	const hashes = [];
	for (let i = 0; i <= req.messages.length; i++) hashes.push(prefixHash(req.systemPrompt, req.messages, i));
	const currentHash = hashes[hashes.length - 1] ?? prefixHash(req.systemPrompt, [], 0);
	const parentHash = hashes.length > 1 ? hashes[hashes.length - 2] ?? null : null;
	const path = [];
	const strategy = req.strategy;
	const usable = all.filter((c) => isUsable(c, now));
	const fallback = () => pickUsable(all, now, path) ?? all[0];
	let chosen;
	if (strategy === "priority" || strategy === "fill-first") chosen = pickUsable(all, now, path) ?? void 0;
	else if (strategy === "round-robin") {
		chosen = usable[usable.reduce((s, c) => s + c.provider.usedCount, 0) % Math.max(1, usable.length)];
		path.push(...usable.map((c) => c.provider.name));
	} else if (strategy === "least-used") {
		chosen = [...usable].sort((a, b) => a.provider.usedCount - b.provider.usedCount)[0];
		path.push(...usable.map((c) => c.provider.name));
	} else if (strategy === "p2c") {
		const shuffled = [...usable].sort(() => Math.random() - .5).slice(0, 2);
		path.push(...shuffled.map((c) => c.provider.name));
		chosen = [...shuffled].sort((a, b) => scoreCandidate(b, req, hashes, now) - scoreCandidate(a, req, hashes, now))[0];
	} else if (strategy === "cost-optimized") {
		chosen = [...usable].sort((a, b) => {
			const ha = longestCache(req.cache, a.model.id, hashes, now);
			const hb = longestCache(req.cache, b.model.id, hashes, now);
			return quoteCost(a.model, req.tokensIn, req.tokensOutHint, ha?.tokens ?? 0).usd - quoteCost(b.model, req.tokensIn, req.tokensOutHint, hb?.tokens ?? 0).usd;
		})[0];
		path.push(...usable.map((c) => c.provider.name));
	} else if (strategy === "cache-optimized") {
		if (req.stickyModelId && req.stickyProviderId) {
			const sticky = usable.find((c) => c.model.id === req.stickyModelId && c.provider.id === req.stickyProviderId);
			if (sticky) chosen = sticky;
		}
		if (!chosen) chosen = [...usable].sort((a, b) => {
			const ha = longestCache(req.cache, a.model.id, hashes, now);
			return (longestCache(req.cache, b.model.id, hashes, now)?.tokens ?? 0) - (ha?.tokens ?? 0);
		})[0];
		path.push(...usable.map((c) => c.provider.name));
	} else if (strategy === "context-optimized") {
		chosen = [...usable].filter((c) => c.model.context > req.tokensIn + 2048).sort((a, b) => a.model.inputPerM - b.model.inputPerM)[0];
		path.push("window-check");
	} else if (strategy === "headroom") {
		chosen = [...usable].sort((a, b) => a.provider.quotaUsed - b.provider.quotaUsed)[0];
		path.push(...usable.map((c) => c.provider.name));
	} else if (strategy === "lkgp") {
		chosen = usable.find((c) => c.provider.id === req.lastGoodProviderId) ?? pickUsable(all, now, path) ?? void 0;
		if (req.lastGoodProviderId) path.unshift("lkgp");
	} else if (strategy === "reset-aware") {
		chosen = [...usable].sort((a, b) => {
			const aFull = a.provider.quotaUsed > .85 ? a.provider.quotaResetAt : 0;
			const bFull = b.provider.quotaUsed > .85 ? b.provider.quotaResetAt : 0;
			if (aFull && !bFull) return 1;
			if (bFull && !aFull) return -1;
			return a.provider.quotaUsed - b.provider.quotaUsed;
		})[0];
		path.push("reset-window");
	} else if (strategy === "random") {
		chosen = usable[Math.floor(Math.random() * Math.max(1, usable.length))];
		path.push("rand");
	} else if (strategy === "fusion") {
		const panel = [...usable].sort((a, b) => scoreCandidate(b, req, hashes, now) - scoreCandidate(a, req, hashes, now)).slice(0, 2);
		chosen = panel[0];
		path.push("fusion", ...panel.map((c) => c.provider.name));
		const hit = chosen ? longestCache(req.cache, chosen.model.id, hashes, now) : void 0;
		const cachedTokens = hit ? Math.min(hit.tokens, cacheableTokens(req.tokensIn, chosen.model.cacheMinTokens)) : 0;
		return {
			provider: (chosen ?? fallback()).provider,
			model: (chosen ?? fallback()).model,
			path,
			strategy,
			cacheHit: Boolean(hit),
			cachedTokens,
			prefixHash: currentHash,
			parentHash,
			reason: "Fan-out to a two-model panel, then judge.",
			fusion: panel.map((c) => ({
				providerId: c.provider.id,
				modelId: c.model.id
			}))
		};
	} else if (strategy === "pipeline") {
		const planner = usable.find((c) => c.tierIndex === 0) ?? usable[0];
		const exec = usable.find((c) => c.tierIndex === 1) ?? usable[1] ?? planner;
		const review = usable.find((c) => c.tierIndex === 2) ?? usable[2] ?? exec;
		chosen = exec ?? planner;
		path.push("pipeline");
		const hit = chosen ? longestCache(req.cache, chosen.model.id, hashes, now) : void 0;
		const cachedTokens = hit ? Math.min(hit.tokens, cacheableTokens(req.tokensIn, chosen.model.cacheMinTokens)) : 0;
		return {
			provider: (chosen ?? fallback()).provider,
			model: (chosen ?? fallback()).model,
			path,
			strategy,
			cacheHit: Boolean(hit),
			cachedTokens,
			prefixHash: currentHash,
			parentHash,
			reason: "Planner summary → sticky executor → advisor review.",
			pipeline: [
				planner && {
					role: "Planner",
					providerId: planner.provider.id,
					modelId: planner.model.id
				},
				exec && {
					role: "Executor",
					providerId: exec.provider.id,
					modelId: exec.model.id
				},
				review && {
					role: "Reviewer",
					providerId: review.provider.id,
					modelId: review.model.id
				}
			].filter(Boolean)
		};
	} else {
		chosen = [...usable].sort((a, b) => scoreCandidate(b, req, hashes, now) - scoreCandidate(a, req, hashes, now))[0];
		path.push("auto-score");
	}
	if (!chosen) chosen = fallback();
	if (!chosen) {
		const p = req.providers[0];
		return {
			provider: p,
			model: p.models[0],
			path: ["empty"],
			strategy,
			cacheHit: false,
			cachedTokens: 0,
			prefixHash: currentHash,
			parentHash,
			reason: "No healthy candidates. Using first catalog model."
		};
	}
	if (req.combo.sticky && req.stickyModelId && req.stickyProviderId) {
		const sticky = usable.find((c) => c.model.id === req.stickyModelId && c.provider.id === req.stickyProviderId);
		if (sticky && (strategy === "auto" || strategy === "cache-optimized" || strategy === "lkgp")) {
			chosen = sticky;
			path.push("sticky");
		}
	}
	const hit = longestCache(req.cache, chosen.model.id, hashes, now);
	const cachedTokens = hit ? Math.min(hit.tokens, cacheableTokens(req.tokensIn, chosen.model.cacheMinTokens)) : 0;
	const reasons = [];
	if (hit) reasons.push(`prefix ${hit.prefixHash} live on ${chosen.model.name}`);
	else reasons.push("cold prefix");
	reasons.push(`${strategy} → ${chosen.provider.name}`);
	return {
		provider: chosen.provider,
		model: chosen.model,
		path: path.length ? path : [chosen.provider.name],
		strategy,
		cacheHit: Boolean(hit),
		cachedTokens,
		prefixHash: currentHash,
		parentHash,
		reason: reasons.join(" · ")
	};
}
function tokens(s) {
	return Math.max(1, Math.ceil(s.length / 4));
}
function looksLikeGitDiff(text) {
	return /^diff --git /m.test(text) || /^index [0-9a-f]+\.\./m.test(text) || /^@@ -\d+/m.test(text);
}
function compressGitDiff(text) {
	const lines = text.split("\n");
	const kept = [];
	for (const line of lines) if (line.startsWith("diff --git") || line.startsWith("+++") || line.startsWith("---") || line.startsWith("@@") || line.startsWith("+") || line.startsWith("-") || line.startsWith("rename ") || line.startsWith("new file") || line.startsWith("deleted file")) {
		if (line.startsWith("+++") || line.startsWith("---")) kept.push(line.replace(/\t.*$/, ""));
		else kept.push(line);
	}
	return kept.join("\n");
}
function looksLikeLs(text) {
	return /^total \d+/m.test(text) || /^[d-][rwx-]{9}\s+\d+/m.test(text) || /^drwx/m.test(text);
}
function compressLs(text) {
	return text.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
		const parts = l.split(/\s+/);
		return parts[parts.length - 1] ?? l;
	}).join("\n");
}
function looksLikeGrep(text) {
	return /^[^:\n]+:\d+:/.test(text) || (text.match(/:[0-9]+:/g) ?? []).length > 4;
}
function compressGrep(text) {
	const byFile = /* @__PURE__ */ new Map();
	const samples = [];
	for (const line of text.split("\n")) {
		const m = line.match(/^([^:]+):(\d+):(.*)$/);
		if (!m) continue;
		const file = m[1] ?? "";
		byFile.set(file, (byFile.get(file) ?? 0) + 1);
		if (samples.length < 12) samples.push(`${file}:${m[2]}:${(m[3] ?? "").trim()}`);
	}
	return `grep hits\n${[...byFile.entries()].sort((a, b) => b[1] - a[1]).map(([f, n]) => `${n}\t${f}`).join("\n")}\n\nsamples\n${samples.join("\n")}`;
}
function looksLikeTree(text) {
	return /[├└│]/.test(text) || /^[\s]*[|`]--/.test(text);
}
function compressTree(text) {
	return text.split("\n").filter((l) => l.trim()).map((l) => l.replace(/[├└│─|`]+/g, " ").replace(/\s+/g, " ").trim()).join("\n");
}
function looksLikeJson(text) {
	const t = text.trim();
	return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function compressJson(text) {
	try {
		const parsed = JSON.parse(text);
		return JSON.stringify(parsed);
	} catch {
		return text;
	}
}
function dedupLines(text) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	let repeats = 0;
	for (const line of text.split("\n")) {
		const key = line.trim();
		if (!key) {
			out.push(line);
			continue;
		}
		if (seen.has(key)) {
			repeats += 1;
			continue;
		}
		seen.add(key);
		out.push(line);
	}
	if (repeats > 2) out.push(`… ${repeats} duplicate lines dropped`);
	return out.join("\n");
}
function smartTruncate(text, maxChars) {
	if (text.length <= maxChars) return text;
	const head = text.slice(0, Math.floor(maxChars * .7));
	const tail = text.slice(-Math.floor(maxChars * .25));
	return `${head}\n… [${text.length - maxChars} chars truncated] …\n${tail}`;
}
function compressRtk(text, enabled = true) {
	const originalTokens = tokens(text);
	if (!enabled || !text.trim()) return {
		output: text,
		originalTokens,
		compressedTokens: originalTokens,
		savedRatio: 0,
		filters: []
	};
	let output = text;
	const filters = [];
	if (looksLikeGitDiff(output)) {
		output = compressGitDiff(output);
		filters.push("git-diff");
	}
	if (looksLikeLs(output)) {
		output = compressLs(output);
		filters.push("ls");
	}
	if (looksLikeGrep(output)) {
		output = compressGrep(output);
		filters.push("grep");
	}
	if (looksLikeTree(output)) {
		output = compressTree(output);
		filters.push("tree");
	}
	if (looksLikeJson(output)) {
		const compact = compressJson(output);
		if (compact.length < output.length) {
			output = compact;
			filters.push("headroom-json");
		}
	}
	const deduped = dedupLines(output);
	if (deduped.length < output.length) {
		output = deduped;
		filters.push("dedup");
	}
	if (output.length > 24e3) {
		output = smartTruncate(output, 24e3);
		filters.push("smart-truncate");
	}
	if (output.length >= text.length) return {
		output: text,
		originalTokens,
		compressedTokens: originalTokens,
		savedRatio: 0,
		filters: []
	};
	const compressedTokens = tokens(output);
	return {
		output,
		originalTokens,
		compressedTokens,
		savedRatio: (originalTokens - compressedTokens) / originalTokens,
		filters
	};
}
var RTK_SAMPLES = [
	{
		id: "diff",
		label: "git diff",
		text: `diff --git a/src/gateway/router.ts b/src/gateway/router.ts
index 9f3a1c2..b71e0aa 100644
--- a/src/gateway/router.ts
+++ b/src/gateway/router.ts
@@ -12,40 +12,28 @@ import { score } from "./score";
 export function pick(nodes: Node[], want: Want) {
   const healthy = nodes.filter((n) => n.circuit === "closed" && n.quota < 0.95);
-  // verbose debug dump of every candidate
-  console.log("candidates", JSON.stringify(nodes, null, 2));
-  console.log("want", JSON.stringify(want, null, 2));
-  console.log("healthy", healthy.map((n) => n.id));
+  const ranked = healthy
+    .map((n) => ({ n, s: score(n, want) }))
+    .sort((a, b) => b.s - a.s);
+  return ranked[0]?.n ?? null;
 }
 
-function unusedHelper(x: string) {
-  return x.repeat(3);
-}
-
 export function sticky(prev: string | undefined, nodes: Node[]) {
   if (!prev) return null;
   return nodes.find((n) => n.id === prev && n.circuit === "closed") ?? null;
 }
`
	},
	{
		id: "grep",
		label: "grep -n cache",
		text: `src/lib/cache.ts:12:export function prefixHash(s: string) {
src/lib/cache.ts:18:  return "pfx_" + fnv(s);
src/lib/cache.ts:44:  const hit = index.get(hash);
src/lib/cache.ts:45:  if (hit) hit.hits += 1;
src/gateway/router.ts:88:    const hash = prefixHash(prefix);
src/gateway/router.ts:89:    const cached = lookup(modelId, hash);
src/gateway/router.ts:90:    if (cached) return { ...pick, cachedTokens: cached.tokens };
src/gateway/router.ts:91:    const hash = prefixHash(prefix);
src/gateway/router.ts:92:    const cached = lookup(modelId, hash);
src/routes/chat.tsx:140:  const hash = prefixHash(sys + history);
src/routes/chat.tsx:141:  meta.prefixHash = hash;
src/routes/chat.tsx:142:  meta.cacheHit = Boolean(cached);
src/test/cache.test.ts:9:  expect(prefixHash("a")).toBe(prefixHash("a"));
src/test/cache.test.ts:10:  expect(prefixHash("a")).not.toBe(prefixHash("b"));
`
	},
	{
		id: "ls",
		label: "ls -l",
		text: `total 184
drwxr-xr-x  12 flint flint  4096 Aug 27 18:01 .
drwxr-xr-x   8 flint flint  4096 Aug 26 09:12 ..
-rw-r--r--   1 flint flint   812 Aug 27 17:44 AGENTS.md
-rw-r--r--   1 flint flint  2190 Aug 27 17:51 package.json
drwxr-xr-x   8 flint flint  4096 Aug 27 18:00 src
drwxr-xr-x   3 flint flint  4096 Aug 27 17:40 src/lib
drwxr-xr-x   4 flint flint  4096 Aug 27 17:58 src/lib/flint
-rw-r--r--   1 flint flint  4412 Aug 27 17:59 src/lib/flint/rtk.ts
-rw-r--r--   1 flint flint  3188 Aug 27 17:59 src/lib/flint/routing.ts
-rw-r--r--   1 flint flint  2801 Aug 27 18:00 src/lib/flint/hash.ts
drwxr-xr-x   6 flint flint  4096 Aug 27 17:50 node_modules
`
	},
	{
		id: "json",
		label: "tool JSON",
		text: `{
  "ok": true,
  "files": [
    { "path": "src/a.ts", "size": 1204, "sha": "aa" },
    { "path": "src/b.ts", "size": 980, "sha": "bb" },
    { "path": "src/c.ts", "size": 2210, "sha": "cc" },
    { "path": "src/d.ts", "size": 110, "sha": "dd" }
  ],
  "meta": {
    "cwd": "/workspace",
    "took_ms": 42
  }
}`
	}
];
var CACHE_TTL_MS = 3e5;
function seedConversations() {
	const now = Date.now();
	const sys = "You are the Flint gateway assistant. Be precise about routing, KV cache, and cost.";
	const c1 = {
		id: "conv_auth",
		title: "Auth middleware review",
		createdAt: now - 86e6,
		updatedAt: now - 36e5,
		comboId: "cache",
		systemPrompt: sys,
		folder: "Review",
		stickyProviderId: "claude-code",
		stickyModelId: "claude-sonnet",
		messages: [
			{
				id: "m1",
				role: "user",
				content: "Review src/lib/auth/middleware.ts. We cannot trust a client-sent user id. Propose the smallest patch.",
				createdAt: now - 37e5
			},
			{
				id: "m2",
				role: "assistant",
				content: "Read `context.userId` from the verified session only. Drop any `userId` field on the request body. Scope every query with that id. Add one test that a forged body id is ignored.",
				createdAt: now - 368e4,
				meta: {
					providerId: "claude-code",
					modelId: "claude-sonnet",
					strategy: "cache-optimized",
					path: ["Claude Code"],
					reason: "sticky prefix on Sonnet",
					tokensIn: 1840,
					tokensOut: 92,
					cachedTokens: 1024,
					prefixHash: prefixHash(sys, [], 0),
					parentHash: null,
					cacheHit: true,
					costUsd: .0041,
					naiveCostUsd: .0069,
					rtkSaved: 0,
					rtkFilters: [],
					cavemanLevel: 3,
					latencyMs: 410
				}
			},
			{
				id: "m3",
				role: "user",
				content: "Write the test names. Keep the executor on the same model.",
				createdAt: now - 362e4
			},
			{
				id: "m4",
				role: "assistant",
				content: "`ignores body userId`\n`scopes select by session userId`\n`expired session returns 401`",
				createdAt: now - 36e5,
				meta: {
					providerId: "claude-code",
					modelId: "claude-sonnet",
					strategy: "cache-optimized",
					path: ["sticky", "Claude Code"],
					reason: "prefix live on Sonnet",
					tokensIn: 2140,
					tokensOut: 48,
					cachedTokens: 1792,
					prefixHash: "pfx_b8e1c2a0",
					parentHash: "pfx_a11d00aa",
					cacheHit: true,
					costUsd: .0022,
					naiveCostUsd: .0071,
					rtkSaved: 0,
					rtkFilters: [],
					cavemanLevel: 3,
					latencyMs: 280
				}
			}
		]
	};
	const c2 = {
		id: "conv_diff",
		title: "Billing router diff",
		createdAt: now - 12e6,
		updatedAt: now - 8e6,
		comboId: "coding",
		systemPrompt: sys,
		folder: "Coding",
		stickyProviderId: "glm",
		stickyModelId: "glm-4.5",
		messages: [{
			id: "d1",
			role: "user",
			rawContent: `diff --git a/src/gateway/router.ts b/src/gateway/router.ts
index 9f3a1c2..b71e0aa 100644
--- a/src/gateway/router.ts
+++ b/src/gateway/router.ts
@@ -12,40 +12,28 @@
-  console.log("candidates", JSON.stringify(nodes, null, 2));
+  const ranked = healthy.map((n) => ({ n, s: score(n, want) })).sort((a, b) => b.s - a.s);
`,
			content: `diff --git a/src/gateway/router.ts b/src/gateway/router.ts
--- a/src/gateway/router.ts
+++ b/src/gateway/router.ts
@@ -12,40 +12,28 @@
-  console.log("candidates", JSON.stringify(nodes, null, 2));
+  const ranked = healthy.map((n) => ({ n, s: score(n, want) })).sort((a, b) => b.s - a.s);`,
			createdAt: now - 82e5
		}, {
			id: "d2",
			role: "assistant",
			content: "Diff is a score sort. Debug dump gone. Good. Watch stable sort when scores tie — pin provider order.",
			createdAt: now - 8e6,
			meta: {
				providerId: "glm",
				modelId: "glm-4.5",
				strategy: "fill-first",
				path: ["Claude Code", "GLM Coding"],
				reason: "subscription quota high · RTK git-diff",
				tokensIn: 420,
				tokensOut: 64,
				cachedTokens: 0,
				prefixHash: "pfx_cc91aa12",
				parentHash: null,
				cacheHit: false,
				costUsd: 4e-4,
				naiveCostUsd: 9e-4,
				rtkSaved: 380,
				rtkFilters: ["git-diff"],
				cavemanLevel: 3,
				latencyMs: 300
			}
		}]
	};
	return [
		{
			id: "conv_new",
			title: "New thread",
			createdAt: now,
			updatedAt: now,
			comboId: "auto",
			systemPrompt: sys,
			folder: "Inbox",
			messages: []
		},
		c1,
		c2
	];
}
function seedCache() {
	const now = Date.now();
	return [
		{
			key: "claude-sonnet:pfx_sys",
			modelId: "claude-sonnet",
			providerId: "claude-code",
			prefixHash: "pfx_a11d00aa",
			tokens: 1792,
			hits: 11,
			createdAt: now - 12e4,
			expiresAt: now + 18e4,
			preview: "system + auth review thread"
		},
		{
			key: "glm-4.5:pfx_diff",
			modelId: "glm-4.5",
			providerId: "glm",
			prefixHash: "pfx_cc91aa12",
			tokens: 1024,
			hits: 3,
			createdAt: now - 8e4,
			expiresAt: now + 22e4,
			preview: "billing router diff"
		},
		{
			key: "grok-4.5:pfx_live",
			modelId: "grok-4.5",
			providerId: "xai",
			prefixHash: "pfx_ee77b010",
			tokens: 1280,
			hits: 2,
			createdAt: now - 4e4,
			expiresAt: now + 26e4,
			preview: "live grok prefix"
		}
	];
}
function seedLog() {
	const now = Date.now();
	return [
		{
			id: "log1",
			at: now - 36e5,
			conversationId: "conv_auth",
			providerId: "claude-code",
			modelId: "claude-sonnet",
			strategy: "cache-optimized",
			path: ["sticky", "Claude Code"],
			tokensIn: 2140,
			tokensOut: 48,
			cachedTokens: 1792,
			costUsd: .0022,
			savedUsd: .0049,
			cacheHit: true,
			rtk: false,
			status: "ok",
			preview: "Write the test names…"
		},
		{
			id: "log2",
			at: now - 8e6,
			conversationId: "conv_diff",
			providerId: "glm",
			modelId: "glm-4.5",
			strategy: "fill-first",
			path: ["Claude Code", "GLM Coding"],
			tokensIn: 420,
			tokensOut: 64,
			cachedTokens: 0,
			costUsd: 4e-4,
			savedUsd: 5e-4,
			cacheHit: false,
			rtk: true,
			status: "fallback",
			preview: "git diff router.ts"
		},
		{
			id: "log3",
			at: now - 12e5,
			providerId: "copilot",
			modelId: "copilot-gpt",
			strategy: "priority",
			path: ["GitHub Copilot", "GLM Coding"],
			tokensIn: 900,
			tokensOut: 0,
			cachedTokens: 0,
			costUsd: 0,
			savedUsd: 0,
			cacheHit: false,
			rtk: false,
			status: "error",
			preview: "429 · circuit half-open"
		}
	];
}
var useFlintStore = create()(persist((set, get) => ({
	hydrated: false,
	providers: seedProviders(),
	combos: seedCombos(),
	workflows: seedWorkflows(),
	conversations: seedConversations(),
	activeConversationId: "conv_new",
	activeComboId: "auto",
	strategyOverride: "combo",
	rtkEnabled: true,
	cavemanLevel: 3,
	temperature: .4,
	cache: seedCache(),
	log: seedLog(),
	runs: [],
	lastGoodProviderId: "claude-code",
	sending: false,
	savedUsd: 12.47,
	savedTokens: 1842e3,
	requests: 418,
	cacheHits: 173,
	setHydrated: (v) => set({ hydrated: v }),
	tick: () => {
		const now = Date.now();
		set((s) => ({
			providers: s.providers.map((p) => {
				let circuit = p.circuit;
				let healthy = p.healthy;
				if (circuit === "open" && p.cooldownUntil <= now) {
					circuit = "half";
					healthy = true;
				} else if (circuit === "half" && p.quotaUsed < .9) circuit = "closed";
				const jitter = (Math.random() - .5) * 8;
				return {
					...p,
					circuit,
					healthy,
					latencyMs: Math.max(40, Math.round(p.latencyMs + jitter)),
					rpm: Math.max(0, p.rpm + (Math.random() > .7 ? Math.random() > .5 ? 1 : -1 : 0))
				};
			}),
			cache: s.cache.filter((c) => c.expiresAt > now)
		}));
	},
	toggleProvider: (id) => set((s) => ({ providers: s.providers.map((p) => p.id === id ? {
		...p,
		enabled: !p.enabled
	} : p) })),
	setCombo: (id) => set((s) => {
		const combo = s.combos.find((c) => c.id === id);
		return {
			activeComboId: id,
			conversations: s.conversations.map((c) => c.id === s.activeConversationId ? {
				...c,
				comboId: id
			} : c),
			strategyOverride: combo ? "combo" : s.strategyOverride
		};
	}),
	setStrategy: (strategyOverride) => set({ strategyOverride }),
	setRtk: (rtkEnabled) => set({ rtkEnabled }),
	setCaveman: (cavemanLevel) => set({ cavemanLevel }),
	setTemperature: (temperature) => set({ temperature }),
	newChat: (folder = "Inbox") => {
		const id = uid("conv");
		const comboId = get().activeComboId;
		const conv = {
			id,
			title: "New thread",
			createdAt: Date.now(),
			updatedAt: Date.now(),
			comboId,
			systemPrompt: "You are the Flint gateway assistant. Be precise about routing, KV cache, and cost.",
			folder,
			messages: []
		};
		set((s) => ({
			conversations: [conv, ...s.conversations],
			activeConversationId: id
		}));
		return id;
	},
	selectChat: (id) => set({ activeConversationId: id }),
	renameChat: (id, title) => set((s) => ({ conversations: s.conversations.map((c) => c.id === id ? {
		...c,
		title
	} : c) })),
	deleteChat: (id) => set((s) => {
		const rest = s.conversations.filter((c) => c.id !== id);
		const next = rest[0] ?? {
			id: uid("conv"),
			title: "New thread",
			createdAt: Date.now(),
			updatedAt: Date.now(),
			comboId: s.activeComboId,
			systemPrompt: "",
			folder: "Inbox",
			messages: []
		};
		const conversations = rest.length ? rest : [next];
		return {
			conversations,
			activeConversationId: conversations[0].id
		};
	}),
	setSystemPrompt: (id, prompt) => set((s) => ({ conversations: s.conversations.map((c) => c.id === id ? {
		...c,
		systemPrompt: prompt
	} : c) })),
	appendUser: (content) => {
		const s = get();
		const conv = s.conversations.find((c) => c.id === s.activeConversationId);
		if (!conv) return null;
		const rtk = compressRtk(content, s.rtkEnabled);
		const user = {
			id: uid("msg"),
			role: "user",
			content: rtk.output,
			rawContent: rtk.filters.length ? content : void 0,
			createdAt: Date.now()
		};
		const next = {
			...conv,
			title: conv.messages.length === 0 ? content.trim().slice(0, 42) || "New thread" : conv.title,
			updatedAt: Date.now(),
			messages: [...conv.messages, user]
		};
		set({ conversations: s.conversations.map((c) => c.id === conv.id ? next : c) });
		return {
			conversation: next,
			user,
			compressed: rtk.output,
			rtkSaved: rtk.originalTokens - rtk.compressedTokens,
			rtkFilters: rtk.filters
		};
	},
	commitAssistant: ({ content, conversationId, latencyMs, live }) => {
		const s = get();
		const conv = s.conversations.find((c) => c.id === conversationId);
		if (!conv) return;
		const combo = s.combos.find((c) => c.id === conv.comboId) ?? s.combos[0];
		const strategy = s.strategyOverride === "combo" ? combo.strategy : s.strategyOverride;
		const tokensIn = estimateTokens(conv.systemPrompt + conv.messages.map((m) => m.content).join("\n"));
		const tokensOut = estimateTokens(content);
		const decision = routeRequest({
			combo,
			strategy,
			providers: s.providers,
			cache: s.cache,
			systemPrompt: conv.systemPrompt,
			messages: conv.messages,
			tokensIn,
			tokensOutHint: tokensOut,
			stickyProviderId: conv.stickyProviderId,
			stickyModelId: conv.stickyModelId,
			lastGoodProviderId: s.lastGoodProviderId
		});
		const quote = quoteCost(decision.model, tokensIn, tokensOut, decision.cachedTokens);
		const lastUser = [...conv.messages].reverse().find((m) => m.role === "user");
		const rtkSaved = lastUser?.rawContent ? estimateTokens(lastUser.rawContent) - estimateTokens(lastUser.content) : 0;
		const rtkFilters = lastUser?.rawContent ? compressRtk(lastUser.rawContent, true).filters : [];
		const meta = {
			providerId: live ? "xai" : decision.provider.id,
			modelId: live ? "grok-4.5" : decision.model.id,
			strategy: decision.strategy,
			path: live ? ["Flint gateway", "xAI Grok 4.5"] : decision.path,
			reason: live ? `${decision.reason} · live completion via Grok` : decision.reason,
			tokensIn,
			tokensOut,
			cachedTokens: decision.cachedTokens,
			prefixHash: decision.prefixHash,
			parentHash: decision.parentHash,
			cacheHit: decision.cacheHit,
			costUsd: quote.usd,
			naiveCostUsd: quote.naiveUsd,
			rtkSaved,
			rtkFilters,
			cavemanLevel: s.cavemanLevel,
			latencyMs,
			fusion: decision.fusion,
			pipeline: decision.pipeline
		};
		const assistant = {
			id: uid("msg"),
			role: "assistant",
			content,
			createdAt: Date.now(),
			meta
		};
		const providerId = meta.providerId;
		const modelId = meta.modelId;
		const now = Date.now();
		const cacheKey = `${modelId}:${decision.prefixHash}`;
		const nextCache = s.cache.filter((e) => e.key !== cacheKey);
		nextCache.unshift({
			key: cacheKey,
			modelId,
			providerId,
			prefixHash: decision.prefixHash,
			tokens: tokensIn,
			hits: (s.cache.find((e) => e.key === cacheKey)?.hits ?? 0) + (decision.cacheHit ? 1 : 0),
			createdAt: now,
			expiresAt: now + CACHE_TTL_MS,
			preview: conv.title
		});
		const log = {
			id: uid("log"),
			at: now,
			conversationId,
			providerId,
			modelId,
			strategy: decision.strategy,
			path: meta.path,
			tokensIn,
			tokensOut,
			cachedTokens: decision.cachedTokens,
			costUsd: quote.usd,
			savedUsd: quote.savedUsd,
			cacheHit: decision.cacheHit,
			rtk: rtkSaved > 0,
			status: decision.path.length > 1 ? "fallback" : "ok",
			preview: (lastUser?.content ?? "").slice(0, 80)
		};
		set({
			conversations: s.conversations.map((c) => c.id === conversationId ? {
				...c,
				updatedAt: now,
				messages: [...c.messages, assistant],
				stickyProviderId: providerId,
				stickyModelId: modelId
			} : c),
			providers: s.providers.map((p) => p.id === providerId ? {
				...p,
				usedCount: p.usedCount + 1,
				rpm: p.rpm + 1,
				quotaUsed: Math.min(.99, p.quotaUsed + tokensIn / 8e6)
			} : p),
			cache: nextCache.slice(0, 80),
			log: [log, ...s.log].slice(0, 200),
			lastGoodProviderId: providerId,
			savedUsd: s.savedUsd + quote.savedUsd,
			savedTokens: s.savedTokens + decision.cachedTokens + rtkSaved,
			requests: s.requests + 1,
			cacheHits: s.cacheHits + (decision.cacheHit ? 1 : 0),
			sending: false
		});
	},
	setSending: (sending) => set({ sending }),
	runWorkflow: (workflowId) => {
		const s = get();
		const wf = s.workflows.find((w) => w.id === workflowId);
		if (!wf) return {
			id: "none",
			workflowId,
			at: Date.now(),
			events: [],
			totalCost: 0,
			naiveCost: 0
		};
		const sys = "workflow handoff via Flint gateway";
		const body = "Implement rate-limit headers on the gateway and add a regression test.";
		const events = [];
		let total = 0;
		let naive = 0;
		let stickyHash = null;
		wf.steps.forEach((step, i) => {
			const combo = s.combos.find((c) => c.id === step.comboId) ?? s.combos[0];
			const messages = step.handoff === "full" ? [{
				role: "user",
				content: body
			}, {
				role: "assistant",
				content: "working"
			}] : step.handoff === "advisor" ? [{
				role: "user",
				content: `Review summary: ${body.slice(0, 80)}`
			}] : [{
				role: "user",
				content: `Plan: ${body.slice(0, 60)}`
			}];
			const tokensIn = step.handoff === "full" ? 4200 + i * 200 : step.handoff === "advisor" ? 640 : 900;
			const decision = routeRequest({
				combo,
				strategy: combo.strategy,
				providers: s.providers,
				cache: s.cache,
				systemPrompt: sys,
				messages,
				tokensIn,
				tokensOutHint: 180,
				stickyProviderId: step.sticky ? events[0]?.providerId : void 0,
				stickyModelId: step.sticky ? events[0]?.modelId : void 0
			});
			const cached = step.sticky && stickyHash && decision.model.id === events[0]?.modelId ? Math.min(tokensIn - 200, 3072) : decision.cachedTokens;
			const quote = quoteCost(decision.model, tokensIn, 180, cached);
			if (step.sticky) stickyHash = decision.prefixHash;
			const ev = {
				id: uid("ev"),
				at: Date.now() + i * 40,
				stepId: step.id,
				role: step.role,
				providerId: decision.provider.id,
				modelId: decision.model.id,
				prefixHash: decision.prefixHash,
				cacheHit: cached > 0,
				tokensIn,
				cachedTokens: cached,
				costUsd: quote.usd,
				naiveCostUsd: quote.naiveUsd,
				note: step.handoff === "advisor" ? "Summary only. Executor prefix untouched." : step.handoff === "summary" ? "Compressed handoff. New prefix." : step.sticky ? "Full prefix. Sticky for KV reuse." : "Full prefix on this agent."
			};
			events.push(ev);
			total += quote.usd;
			naive += quote.naiveUsd;
		});
		const run = {
			id: uid("run"),
			workflowId,
			at: Date.now(),
			events,
			totalCost: total,
			naiveCost: naive
		};
		set({
			runs: [run, ...s.runs].slice(0, 20),
			savedUsd: s.savedUsd + Math.max(0, naive - total),
			requests: s.requests + events.length
		});
		return run;
	},
	updateComboStrategy: (comboId, strategy) => set((s) => ({ combos: s.combos.map((c) => c.id === comboId ? {
		...c,
		strategy
	} : c) })),
	toggleSticky: (comboId) => set((s) => ({ combos: s.combos.map((c) => c.id === comboId ? {
		...c,
		sticky: !c.sticky
	} : c) }))
}), {
	name: "flint-gateway",
	storage: createJSONStorage(() => {
		if (typeof window === "undefined") return {
			getItem: () => null,
			setItem: () => {},
			removeItem: () => {}
		};
		return localStorage;
	}),
	skipHydration: true,
	partialize: (s) => ({
		conversations: s.conversations,
		activeConversationId: s.activeConversationId,
		activeComboId: s.activeComboId,
		strategyOverride: s.strategyOverride,
		rtkEnabled: s.rtkEnabled,
		cavemanLevel: s.cavemanLevel,
		temperature: s.temperature,
		combos: s.combos,
		savedUsd: s.savedUsd,
		savedTokens: s.savedTokens,
		requests: s.requests,
		cacheHits: s.cacheHits,
		log: s.log.slice(0, 50),
		cache: s.cache,
		runs: s.runs
	})
}));
function activeConversation(s) {
	return s.conversations.find((c) => c.id === s.activeConversationId);
}
function activeCombo(s) {
	return s.combos.find((c) => c.id === s.activeComboId);
}
function resolvedStrategy(s) {
	if (s.strategyOverride !== "combo") return s.strategyOverride;
	return activeCombo(s)?.strategy ?? "auto";
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-DEGBjKzP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-bad",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function FlintMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("text-fg", className),
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M16 3 L27 18 L16 29 L5 18 Z",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.6",
			strokeLinejoin: "round"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M16 8 L22 18 L16 24 L10 18 Z",
			fill: "currentColor",
			opacity: "0.9"
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,color,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-raised text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-muted hover:text-fg hover:bg-raised",
			outline: "text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)] bg-transparent",
			danger: "bg-bad/15 text-bad hover:bg-bad/25"
		},
		size: {
			default: "h-10 px-3.5",
			sm: "h-8 px-2.5 text-xs",
			lg: "h-11 px-4",
			icon: "size-10",
			iconSm: "size-8"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Sheet({ open, onOpenChange, title, children, side = "left" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: cn("fixed z-50 flex h-full w-[min(92vw,320px)] flex-col bg-surface shadow-[var(--shadow-pop)]", "data-[state=open]:animate-in data-[state=closed]:animate-out", side === "left" ? "inset-y-0 left-0 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left" : "inset-y-0 right-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-lg text-fg",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "iconSm",
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto p-3",
				children
			})]
		})] })
	});
}
var NAV = [
	{
		to: "/",
		label: "Chat",
		icon: MessageSquare
	},
	{
		to: "/gateway",
		label: "Gateway",
		icon: Radio
	},
	{
		to: "/providers",
		label: "Providers",
		icon: Layers
	},
	{
		to: "/combos",
		label: "Combos",
		icon: GitBranch
	},
	{
		to: "/compress",
		label: "Compress",
		icon: Scissors
	},
	{
		to: "/cache",
		label: "Cache",
		icon: Hash
	},
	{
		to: "/workflows",
		label: "Handoff",
		icon: Waypoints
	},
	{
		to: "/log",
		label: "Log",
		icon: Activity
	}
];
function NavLinks({ pathname, onNavigate, compact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-1",
		children: NAV.map((item) => {
			const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				className: cn("flex items-center gap-3 rounded-md px-2.5 text-sm transition-colors duration-[var(--motion-quick)]", compact ? "h-10 justify-center px-0" : "h-10", active ? "bg-raised text-fg shadow-[var(--shadow-border)]" : "text-muted hover:bg-raised/70 hover:text-fg"),
				"aria-current": active ? "page" : void 0,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }),
					!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }),
					compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: item.label
					})
				]
			}, item.to);
		})
	});
}
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const savedUsd = useFlintStore((s) => s.savedUsd);
	const setHydrated = useFlintStore((s) => s.setHydrated);
	const tick = useFlintStore((s) => s.tick);
	(0, import_react.useEffect)(() => {
		Promise.resolve(useFlintStore.persist.rehydrate()).then(() => setHydrated(true));
	}, [setHydrated]);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(tick, 2500);
		return () => window.clearInterval(id);
	}, [tick]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "sticky top-0 hidden h-dvh w-[220px] shrink-0 flex-col border-r border-border bg-surface p-3 md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "mb-6 flex items-center gap-2.5 px-1 pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlintMark, { className: "size-7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-xl leading-none tracking-tight",
							children: "Flint"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted",
							children: "Gateway"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, { pathname }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto rounded-lg bg-inset p-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[10px] uppercase tracking-wide text-muted",
						children: "Saved vs naive"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 font-mono text-lg tabular-nums text-ok",
						children: formatUsd(savedUsd)
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-12 items-center gap-2 border-b border-border px-3 md:hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "iconSm",
							"aria-label": "Open menu",
							onClick: () => setOpen(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlintMark, { className: "size-5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg",
							children: "Flint"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-auto font-mono text-xs tabular-nums text-ok",
							children: formatUsd(savedUsd)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
					open,
					onOpenChange: setOpen,
					title: "Flint",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {
						pathname,
						onNavigate: () => setOpen(false)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 min-w-0 flex-1",
					children
				})
			]
		})]
	});
}
var styles_default = "/assets/styles-fB9vVh2u.css";
var APP_NAME = "Flint";
var Route$8 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Flint is a cache-aware AI gateway: cross-provider routing, RTK + Caveman compression, prefix-hash KV cost, and agentic handoff."
			},
			{
				name: "theme-color",
				content: "#0c0c0e"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$7 = () => import("./routes-BvBp2MkP.mjs");
var Route$7 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./cache-DYJ9O7mM.mjs");
var Route$6 = createFileRoute("/cache")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./combos-3FoWZLph.mjs");
var Route$5 = createFileRoute("/combos")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./compress-CkWsmPM5.mjs");
var Route$4 = createFileRoute("/compress")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./gateway-pRRbIm_F.mjs");
var Route$3 = createFileRoute("/gateway")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./log-F-_38T6C.mjs");
var Route$2 = createFileRoute("/log")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./providers-CdM2-lVE.mjs");
var Route$1 = createFileRoute("/providers")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./workflows-DbsZU1rx.mjs");
var Route = createFileRoute("/workflows")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	CacheRoute: Route$6.update({
		id: "/cache",
		path: "/cache",
		getParentRoute: () => Route$8
	}),
	CombosRoute: Route$5.update({
		id: "/combos",
		path: "/combos",
		getParentRoute: () => Route$8
	}),
	CompressRoute: Route$4.update({
		id: "/compress",
		path: "/compress",
		getParentRoute: () => Route$8
	}),
	GatewayRoute: Route$3.update({
		id: "/gateway",
		path: "/gateway",
		getParentRoute: () => Route$8
	}),
	LogRoute: Route$2.update({
		id: "/log",
		path: "/log",
		getParentRoute: () => Route$8
	}),
	ProvidersRoute: Route$1.update({
		id: "/providers",
		path: "/providers",
		getParentRoute: () => Route$8
	}),
	WorkflowsRoute: Route.update({
		id: "/workflows",
		path: "/workflows",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { useFlintStore as _, activeConversation as a, estimateTokens as c, formatUsd as d, prefixHash as f, shortHash as g, routeRequest as h, activeCombo as i, formatPct as l, resolvedStrategy as m, Button as n, cn as o, quoteCost as p, RTK_SAMPLES as r, compressRtk as s, router_exports as t, formatTokens as u };
