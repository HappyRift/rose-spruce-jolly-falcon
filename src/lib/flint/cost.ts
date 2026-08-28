import type { Model } from "./types";
import { cacheableTokens } from "./hash";

export interface CostQuote {
  usd: number;
  naiveUsd: number;
  savedUsd: number;
  freshTokens: number;
  cachedTokens: number;
  wroteCache: boolean;
}

export function quoteCost(
  model: Model,
  tokensIn: number,
  tokensOut: number,
  cachedTokens: number,
): CostQuote {
  const hittable = cacheableTokens(tokensIn, model.cacheMinTokens);
  const cached = Math.min(cachedTokens, hittable);
  const fresh = Math.max(0, tokensIn - cached);
  const inputUsd = (fresh / 1e6) * model.inputPerM;
  const cachedUsd = (cached / 1e6) * model.inputPerM * model.cacheReadMult;
  const wroteCache = cached === 0 && tokensIn >= model.cacheMinTokens;
  const writePremium = wroteCache
    ? (tokensIn / 1e6) * model.inputPerM * Math.max(0, model.cacheWriteMult - 1)
    : 0;
  const outputUsd = (tokensOut / 1e6) * model.outputPerM;
  const usd = inputUsd + cachedUsd + writePremium + outputUsd;
  const naiveUsd = (tokensIn / 1e6) * model.inputPerM + outputUsd;
  return {
    usd,
    naiveUsd,
    savedUsd: Math.max(0, naiveUsd - usd),
    freshTokens: fresh,
    cachedTokens: cached,
    wroteCache,
  };
}

export function formatUsd(n: number): string {
  if (n < 0.0001) return "$0.0000";
  if (n < 0.01) return `$${n.toFixed(4)}`;
  if (n < 1) return `$${n.toFixed(3)}`;
  return `$${n.toFixed(2)}`;
}

export function formatTokens(n: number): string {
  if (n < 1000) return `${Math.round(n)}`;
  if (n < 10_000) return `${(n / 1000).toFixed(1)}k`;
  if (n < 1_000_000) return `${Math.round(n / 1000)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

export function formatPct(n: number): string {
  if (!Number.isFinite(n)) return "0%";
  return `${Math.round(n * 100)}%`;
}
