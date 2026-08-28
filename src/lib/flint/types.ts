export type Tier = "subscription" | "cheap" | "free" | "api";

export type Circuit = "closed" | "half" | "open";

export type Strategy =
  | "auto"
  | "priority"
  | "fill-first"
  | "round-robin"
  | "p2c"
  | "least-used"
  | "cost-optimized"
  | "cache-optimized"
  | "context-optimized"
  | "headroom"
  | "lkgp"
  | "reset-aware"
  | "fusion"
  | "pipeline"
  | "random";

export type CavemanLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface Model {
  id: string;
  name: string;
  context: number;
  inputPerM: number;
  outputPerM: number;
  cacheReadMult: number;
  cacheWriteMult: number;
  cacheMinTokens: number;
  quality: number;
}

export interface Provider {
  id: string;
  name: string;
  vendor: string;
  tier: Tier;
  enabled: boolean;
  healthy: boolean;
  circuit: Circuit;
  cooldownUntil: number;
  latencyMs: number;
  quotaUsed: number;
  quotaResetAt: number;
  rpm: number;
  rpmCap: number;
  usedCount: number;
  models: Model[];
  notes: string;
}

export interface ComboSlot {
  providerId: string;
  modelId: string;
}

export interface Combo {
  id: string;
  name: string;
  slug: string;
  strategy: Strategy;
  tiers: ComboSlot[][];
  sticky: boolean;
}

export interface MessageMeta {
  providerId: string;
  modelId: string;
  strategy: Strategy;
  path: string[];
  reason: string;
  tokensIn: number;
  tokensOut: number;
  cachedTokens: number;
  prefixHash: string;
  parentHash: string | null;
  cacheHit: boolean;
  costUsd: number;
  naiveCostUsd: number;
  rtkSaved: number;
  rtkFilters: string[];
  cavemanLevel: CavemanLevel;
  latencyMs: number;
  fusion?: { providerId: string; modelId: string }[];
  pipeline?: { role: string; providerId: string; modelId: string }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  rawContent?: string;
  createdAt: number;
  meta?: MessageMeta;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  comboId: string;
  systemPrompt: string;
  messages: ChatMessage[];
  stickyProviderId?: string;
  stickyModelId?: string;
  folder: string;
}

export interface CacheEntry {
  key: string;
  modelId: string;
  providerId: string;
  prefixHash: string;
  tokens: number;
  hits: number;
  createdAt: number;
  expiresAt: number;
  preview: string;
}

export interface LogEntry {
  id: string;
  at: number;
  conversationId?: string;
  providerId: string;
  modelId: string;
  strategy: Strategy;
  path: string[];
  tokensIn: number;
  tokensOut: number;
  cachedTokens: number;
  costUsd: number;
  savedUsd: number;
  cacheHit: boolean;
  rtk: boolean;
  status: "ok" | "fallback" | "error";
  preview: string;
}

export interface WorkflowStep {
  id: string;
  role: string;
  agent: string;
  sticky: boolean;
  comboId: string;
  handoff: "full" | "summary" | "advisor";
}

export interface Workflow {
  id: string;
  name: string;
  blurb: string;
  steps: WorkflowStep[];
}

export interface WorkflowRunEvent {
  id: string;
  at: number;
  stepId: string;
  role: string;
  providerId: string;
  modelId: string;
  prefixHash: string;
  cacheHit: boolean;
  tokensIn: number;
  cachedTokens: number;
  costUsd: number;
  naiveCostUsd: number;
  note: string;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  at: number;
  events: WorkflowRunEvent[];
  totalCost: number;
  naiveCost: number;
}

export const STRATEGY_META: Record<
  Strategy,
  { label: string; blurb: string }
> = {
  auto: {
    label: "Auto",
    blurb: "Nine-factor score: health, quota, cost, latency, cache, context, quality, RPM, last-good.",
  },
  priority: {
    label: "Priority",
    blurb: "Walk the combo in order. First healthy provider with quota wins.",
  },
  "fill-first": {
    label: "Fill first",
    blurb: "Drain the current subscription before spilling to cheaper tiers.",
  },
  "round-robin": {
    label: "Round robin",
    blurb: "Spread load evenly across healthy candidates.",
  },
  p2c: {
    label: "Power of two",
    blurb: "Sample two healthy nodes, pick the better score.",
  },
  "least-used": {
    label: "Least used",
    blurb: "Send the next request to the quietest healthy model.",
  },
  "cost-optimized": {
    label: "Cheapest",
    blurb: "Lowest effective dollar cost, including cache-read discounts.",
  },
  "cache-optimized": {
    label: "Cache sticky",
    blurb: "Prefer the model with the longest live prefix hash.",
  },
  "context-optimized": {
    label: "Context fit",
    blurb: "Keep long threads on windows that actually fit. Relay on overflow.",
  },
  headroom: {
    label: "Headroom",
    blurb: "Most remaining quota. Avoids mid-turn 429s.",
  },
  lkgp: {
    label: "Last known good",
    blurb: "Stay on the last provider that returned 200.",
  },
  "reset-aware": {
    label: "Reset window",
    blurb: "If a quota is about to refill, wait-or-spill based on remaining minutes.",
  },
  fusion: {
    label: "Fusion",
    blurb: "Fan out to a panel, then a judge. Costly, high-signal.",
  },
  pipeline: {
    label: "Pipeline",
    blurb: "Planner → executor → reviewer with advisor-style handoff.",
  },
  random: {
    label: "Random",
    blurb: "Uniform among healthy candidates. Useful as a control.",
  },
};

export const CAVEMAN_LABELS: Record<CavemanLevel, string> = {
  0: "Off",
  1: "Trim",
  2: "Lean",
  3: "Caveman",
  4: "Ultra",
  5: "Telegraph",
};
