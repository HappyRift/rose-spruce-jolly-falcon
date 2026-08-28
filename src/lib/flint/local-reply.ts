import type { RouteDecision } from "./routing";
import type { CavemanLevel } from "./types";
import { compressProse } from "./caveman";
import { formatTokens, formatUsd } from "./cost";

export function localReply(
  userText: string,
  decision: RouteDecision,
  opts: { cavemanLevel: CavemanLevel; rtkSaved: number; costUsd: number; naiveUsd: number },
): string {
  const q = userText.toLowerCase();
  let body: string;
  if (q.includes("cache") || q.includes("prefix") || q.includes("kv")) {
    body = `Prefix ${decision.prefixHash} ${decision.cacheHit ? "hits" : "misses"} on ${decision.model.name}. Cached ${formatTokens(decision.cachedTokens)}. Switching models mid-thread writes a new hash and pays full input. Sticky executor keeps the KV hot; advisor sees a summary.`;
  } else if (q.includes("cost") || q.includes("cheap") || q.includes("price")) {
    body = `Routed ${decision.provider.name} / ${decision.model.name}. Effective ${formatUsd(opts.costUsd)} vs naive ${formatUsd(opts.naiveUsd)}. Cache-aware quote uses read multiplier ${decision.model.cacheReadMult} after ${decision.model.cacheMinTokens} tokens.`;
  } else if (q.includes("diff") || q.includes("rtk") || q.includes("compress")) {
    body = `RTK ${opts.rtkSaved > 0 ? `dropped ${formatTokens(opts.rtkSaved)} tool tokens` : "found nothing to crush"}. Filters run before the router. Same answer, smaller prefix, better cache alignment.`;
  } else if (q.includes("handoff") || q.includes("advisor") || q.includes("workflow")) {
    body = `Advisor pattern: cheap sticky builder holds the long prefix. Reviewer gets a short brief so the builder cache does not break. Fusion fans out; pipeline sequences plan → build → check.`;
  } else {
    body = `Gateway picked ${decision.provider.name} (${decision.model.name}) via ${decision.strategy}. ${decision.reason}. Path: ${decision.path.join(" → ")}.`;
  }
  return compressProse(body, opts.cavemanLevel);
}
