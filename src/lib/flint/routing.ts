import { quoteCost } from "./cost";
import { cacheableTokens, estimateTokens, prefixHash } from "./hash";
import type {
  CacheEntry,
  Combo,
  ComboSlot,
  Model,
  Provider,
  Strategy,
} from "./types";

export interface Candidate {
  provider: Provider;
  model: Model;
  slot: ComboSlot;
  tierIndex: number;
}

export interface RouteRequest {
  combo: Combo;
  strategy: Strategy;
  providers: Provider[];
  cache: CacheEntry[];
  systemPrompt: string;
  messages: { role: string; content: string }[];
  tokensIn: number;
  tokensOutHint: number;
  stickyProviderId?: string;
  stickyModelId?: string;
  lastGoodProviderId?: string;
}

export interface RouteDecision {
  provider: Provider;
  model: Model;
  path: string[];
  strategy: Strategy;
  cacheHit: boolean;
  cachedTokens: number;
  prefixHash: string;
  parentHash: string | null;
  reason: string;
  fusion?: { providerId: string; modelId: string }[];
  pipeline?: { role: string; providerId: string; modelId: string }[];
}

function findModel(p: Provider, modelId: string): Model | undefined {
  return p.models.find((m) => m.id === modelId) ?? p.models[0];
}

export function candidatesOf(combo: Combo, providers: Provider[]): Candidate[] {
  const byId = new Map(providers.map((p) => [p.id, p]));
  const out: Candidate[] = [];
  combo.tiers.forEach((tier, tierIndex) => {
    for (const slot of tier) {
      const provider = byId.get(slot.providerId);
      if (!provider) continue;
      const model = findModel(provider, slot.modelId);
      if (!model) continue;
      out.push({ provider, model, slot, tierIndex });
    }
  });
  return out;
}

function isUsable(c: Candidate, now: number): boolean {
  if (!c.provider.enabled) return false;
  if (c.provider.circuit === "open" && c.provider.cooldownUntil > now) return false;
  if (!c.provider.healthy && c.provider.circuit === "open") return false;
  if (c.provider.quotaUsed >= 0.98) return false;
  return true;
}

function cacheLookup(
  cache: CacheEntry[],
  modelId: string,
  hash: string,
  now: number,
): CacheEntry | undefined {
  return cache.find(
    (e) => e.modelId === modelId && e.prefixHash === hash && e.expiresAt > now,
  );
}

function longestCache(
  cache: CacheEntry[],
  modelId: string,
  hashes: string[],
  now: number,
): CacheEntry | undefined {
  for (let i = hashes.length - 1; i >= 0; i--) {
    const h = hashes[i];
    if (!h) continue;
    const hit = cacheLookup(cache, modelId, h, now);
    if (hit) return hit;
  }
  return undefined;
}

function scoreCandidate(
  c: Candidate,
  req: RouteRequest,
  hashes: string[],
  now: number,
): number {
  const p = c.provider;
  const health = p.circuit === "closed" ? 1 : p.circuit === "half" ? 0.45 : 0.05;
  const quota = 1 - p.quotaUsed;
  const cost = 1 / (0.05 + c.model.inputPerM + c.model.outputPerM * 0.25);
  const latency = 1 / (50 + p.latencyMs);
  const hit = longestCache(req.cache, c.model.id, hashes, now);
  const cacheScore = hit ? 0.6 + Math.min(0.4, hit.tokens / 20_000) : 0;
  const ctx = req.tokensIn < c.model.context * 0.85 ? 1 : 0.1;
  const quality = c.model.quality / 10;
  const rpm = 1 - p.rpm / Math.max(1, p.rpmCap);
  const lkg = req.lastGoodProviderId === p.id ? 0.25 : 0;
  const sticky =
    req.stickyModelId === c.model.id && req.stickyProviderId === p.id ? 0.35 : 0;
  return (
    health * 1.4 +
    quota * 1.1 +
    cost * 0.9 +
    latency * 0.7 +
    cacheScore * 1.6 +
    ctx * 1.2 +
    quality * 0.8 +
    rpm * 0.6 +
    lkg +
    sticky
  );
}

function pickUsable(list: Candidate[], now: number, path: string[]): Candidate | null {
  for (const c of list) {
    path.push(c.provider.name);
    if (isUsable(c, now)) return c;
  }
  return null;
}

export function routeRequest(req: RouteRequest): RouteDecision {
  const now = Date.now();
  const all = candidatesOf(req.combo, req.providers);
  const hashes: string[] = [];
  for (let i = 0; i <= req.messages.length; i++) {
    hashes.push(prefixHash(req.systemPrompt, req.messages, i));
  }
  const currentHash = hashes[hashes.length - 1] ?? prefixHash(req.systemPrompt, [], 0);
  const parentHash = hashes.length > 1 ? (hashes[hashes.length - 2] ?? null) : null;
  const path: string[] = [];
  const strategy = req.strategy;

  const usable = all.filter((c) => isUsable(c, now));
  const fallback = () => pickUsable(all, now, path) ?? all[0];

  let chosen: Candidate | undefined;

  if (strategy === "priority" || strategy === "fill-first") {
    chosen = pickUsable(all, now, path) ?? undefined;
  } else if (strategy === "round-robin") {
    const idx =
      usable.reduce((s, c) => s + c.provider.usedCount, 0) % Math.max(1, usable.length);
    chosen = usable[idx];
    path.push(...usable.map((c) => c.provider.name));
  } else if (strategy === "least-used") {
    chosen = [...usable].sort((a, b) => a.provider.usedCount - b.provider.usedCount)[0];
    path.push(...usable.map((c) => c.provider.name));
  } else if (strategy === "p2c") {
    const shuffled = [...usable].sort(() => Math.random() - 0.5).slice(0, 2);
    path.push(...shuffled.map((c) => c.provider.name));
    chosen = [...shuffled].sort(
      (a, b) => scoreCandidate(b, req, hashes, now) - scoreCandidate(a, req, hashes, now),
    )[0];
  } else if (strategy === "cost-optimized") {
    chosen = [...usable].sort((a, b) => {
      const ha = longestCache(req.cache, a.model.id, hashes, now);
      const hb = longestCache(req.cache, b.model.id, hashes, now);
      const ca = quoteCost(a.model, req.tokensIn, req.tokensOutHint, ha?.tokens ?? 0).usd;
      const cb = quoteCost(b.model, req.tokensIn, req.tokensOutHint, hb?.tokens ?? 0).usd;
      return ca - cb;
    })[0];
    path.push(...usable.map((c) => c.provider.name));
  } else if (strategy === "cache-optimized") {
    if (req.stickyModelId && req.stickyProviderId) {
      const sticky = usable.find(
        (c) => c.model.id === req.stickyModelId && c.provider.id === req.stickyProviderId,
      );
      if (sticky) chosen = sticky;
    }
    if (!chosen) {
      chosen = [...usable].sort((a, b) => {
        const ha = longestCache(req.cache, a.model.id, hashes, now);
        const hb = longestCache(req.cache, b.model.id, hashes, now);
        return (hb?.tokens ?? 0) - (ha?.tokens ?? 0);
      })[0];
    }
    path.push(...usable.map((c) => c.provider.name));
  } else if (strategy === "context-optimized") {
    chosen = [...usable]
      .filter((c) => c.model.context > req.tokensIn + 2048)
      .sort((a, b) => a.model.inputPerM - b.model.inputPerM)[0];
    path.push("window-check");
  } else if (strategy === "headroom") {
    chosen = [...usable].sort((a, b) => a.provider.quotaUsed - b.provider.quotaUsed)[0];
    path.push(...usable.map((c) => c.provider.name));
  } else if (strategy === "lkgp") {
    chosen =
      usable.find((c) => c.provider.id === req.lastGoodProviderId) ??
      pickUsable(all, now, path) ??
      undefined;
    if (req.lastGoodProviderId) path.unshift("lkgp");
  } else if (strategy === "reset-aware") {
    chosen = [...usable].sort((a, b) => {
      const aFull = a.provider.quotaUsed > 0.85 ? a.provider.quotaResetAt : 0;
      const bFull = b.provider.quotaUsed > 0.85 ? b.provider.quotaResetAt : 0;
      if (aFull && !bFull) return 1;
      if (bFull && !aFull) return -1;
      return a.provider.quotaUsed - b.provider.quotaUsed;
    })[0];
    path.push("reset-window");
  } else if (strategy === "random") {
    chosen = usable[Math.floor(Math.random() * Math.max(1, usable.length))];
    path.push("rand");
  } else if (strategy === "fusion") {
    const panel = [...usable]
      .sort((a, b) => scoreCandidate(b, req, hashes, now) - scoreCandidate(a, req, hashes, now))
      .slice(0, 2);
    chosen = panel[0];
    path.push("fusion", ...panel.map((c) => c.provider.name));
    const hit = chosen
      ? longestCache(req.cache, chosen.model.id, hashes, now)
      : undefined;
    const cachedTokens = hit
      ? Math.min(hit.tokens, cacheableTokens(req.tokensIn, chosen.model.cacheMinTokens))
      : 0;
    return {
      provider: (chosen ?? fallback())!.provider,
      model: (chosen ?? fallback())!.model,
      path,
      strategy,
      cacheHit: Boolean(hit),
      cachedTokens,
      prefixHash: currentHash,
      parentHash,
      reason: "Fan-out to a two-model panel, then judge.",
      fusion: panel.map((c) => ({ providerId: c.provider.id, modelId: c.model.id })),
    };
  } else if (strategy === "pipeline") {
    const planner = usable.find((c) => c.tierIndex === 0) ?? usable[0];
    const exec = usable.find((c) => c.tierIndex === 1) ?? usable[1] ?? planner;
    const review = usable.find((c) => c.tierIndex === 2) ?? usable[2] ?? exec;
    chosen = exec ?? planner;
    path.push("pipeline");
    const hit = chosen
      ? longestCache(req.cache, chosen.model.id, hashes, now)
      : undefined;
    const cachedTokens = hit
      ? Math.min(hit.tokens, cacheableTokens(req.tokensIn, chosen.model.cacheMinTokens))
      : 0;
    return {
      provider: (chosen ?? fallback())!.provider,
      model: (chosen ?? fallback())!.model,
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
          modelId: planner.model.id,
        },
        exec && {
          role: "Executor",
          providerId: exec.provider.id,
          modelId: exec.model.id,
        },
        review && {
          role: "Reviewer",
          providerId: review.provider.id,
          modelId: review.model.id,
        },
      ].filter(Boolean) as RouteDecision["pipeline"],
    };
  } else {
    chosen = [...usable].sort(
      (a, b) => scoreCandidate(b, req, hashes, now) - scoreCandidate(a, req, hashes, now),
    )[0];
    path.push("auto-score");
  }

  if (!chosen) chosen = fallback();
  if (!chosen) {
    const p = req.providers[0]!;
    const m = p.models[0]!;
    return {
      provider: p,
      model: m,
      path: ["empty"],
      strategy,
      cacheHit: false,
      cachedTokens: 0,
      prefixHash: currentHash,
      parentHash,
      reason: "No healthy candidates. Using first catalog model.",
    };
  }

  if (req.combo.sticky && req.stickyModelId && req.stickyProviderId) {
    const sticky = usable.find(
      (c) => c.model.id === req.stickyModelId && c.provider.id === req.stickyProviderId,
    );
    if (sticky && (strategy === "auto" || strategy === "cache-optimized" || strategy === "lkgp")) {
      chosen = sticky;
      path.push("sticky");
    }
  }

  const hit = longestCache(req.cache, chosen.model.id, hashes, now);
  const cachedTokens = hit
    ? Math.min(hit.tokens, cacheableTokens(req.tokensIn, chosen.model.cacheMinTokens))
    : 0;

  const reasons: string[] = [];
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
    reason: reasons.join(" · "),
  };
}

export function hashesForThread(
  systemPrompt: string,
  messages: { role: string; content: string }[],
): { index: number; hash: string; tokens: number; role: string }[] {
  const out: { index: number; hash: string; tokens: number; role: string }[] = [];
  let acc = estimateTokens(systemPrompt);
  out.push({
    index: -1,
    hash: prefixHash(systemPrompt, messages, 0),
    tokens: acc,
    role: "system",
  });
  messages.forEach((m, i) => {
    acc += estimateTokens(m.content);
    out.push({
      index: i,
      hash: prefixHash(systemPrompt, messages, i + 1),
      tokens: acc,
      role: m.role,
    });
  });
  return out;
}
