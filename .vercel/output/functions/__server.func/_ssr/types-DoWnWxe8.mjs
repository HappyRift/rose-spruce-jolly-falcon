//#region node_modules/.nitro/vite/services/ssr/assets/types-DoWnWxe8.js
var STRATEGY_META = {
	auto: {
		label: "Auto",
		blurb: "Nine-factor score: health, quota, cost, latency, cache, context, quality, RPM, last-good."
	},
	priority: {
		label: "Priority",
		blurb: "Walk the combo in order. First healthy provider with quota wins."
	},
	"fill-first": {
		label: "Fill first",
		blurb: "Drain the current subscription before spilling to cheaper tiers."
	},
	"round-robin": {
		label: "Round robin",
		blurb: "Spread load evenly across healthy candidates."
	},
	p2c: {
		label: "Power of two",
		blurb: "Sample two healthy nodes, pick the better score."
	},
	"least-used": {
		label: "Least used",
		blurb: "Send the next request to the quietest healthy model."
	},
	"cost-optimized": {
		label: "Cheapest",
		blurb: "Lowest effective dollar cost, including cache-read discounts."
	},
	"cache-optimized": {
		label: "Cache sticky",
		blurb: "Prefer the model with the longest live prefix hash."
	},
	"context-optimized": {
		label: "Context fit",
		blurb: "Keep long threads on windows that actually fit. Relay on overflow."
	},
	headroom: {
		label: "Headroom",
		blurb: "Most remaining quota. Avoids mid-turn 429s."
	},
	lkgp: {
		label: "Last known good",
		blurb: "Stay on the last provider that returned 200."
	},
	"reset-aware": {
		label: "Reset window",
		blurb: "If a quota is about to refill, wait-or-spill based on remaining minutes."
	},
	fusion: {
		label: "Fusion",
		blurb: "Fan out to a panel, then a judge. Costly, high-signal."
	},
	pipeline: {
		label: "Pipeline",
		blurb: "Planner → executor → reviewer with advisor-style handoff."
	},
	random: {
		label: "Random",
		blurb: "Uniform among healthy candidates. Useful as a control."
	}
};
var CAVEMAN_LABELS = {
	0: "Off",
	1: "Trim",
	2: "Lean",
	3: "Caveman",
	4: "Ultra",
	5: "Telegraph"
};
//#endregion
export { STRATEGY_META as n, CAVEMAN_LABELS as t };
