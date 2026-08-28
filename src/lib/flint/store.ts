import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { seedCombos, seedProviders, seedWorkflows } from "./catalog";
import { cavemanSystem } from "./caveman";
import { quoteCost } from "./cost";
import { estimateTokens, prefixHash } from "./hash";
import { uid } from "./id";
import { hashesForThread, routeRequest } from "./routing";
import { compressRtk } from "./rtk";
import type {
  CacheEntry,
  CavemanLevel,
  ChatMessage,
  Combo,
  Conversation,
  LogEntry,
  Provider,
  Strategy,
  Workflow,
  WorkflowRun,
  WorkflowRunEvent,
} from "./types";

const CACHE_TTL_MS = 5 * 60_000;

export interface FlintState {
  hydrated: boolean;
  providers: Provider[];
  combos: Combo[];
  workflows: Workflow[];
  conversations: Conversation[];
  activeConversationId: string;
  activeComboId: string;
  strategyOverride: Strategy | "combo";
  rtkEnabled: boolean;
  cavemanLevel: CavemanLevel;
  temperature: number;
  cache: CacheEntry[];
  log: LogEntry[];
  runs: WorkflowRun[];
  lastGoodProviderId?: string;
  sending: boolean;
  savedUsd: number;
  savedTokens: number;
  requests: number;
  cacheHits: number;
  setHydrated: (v: boolean) => void;
  tick: () => void;
  toggleProvider: (id: string) => void;
  setCombo: (id: string) => void;
  setStrategy: (s: Strategy | "combo") => void;
  setRtk: (v: boolean) => void;
  setCaveman: (n: CavemanLevel) => void;
  setTemperature: (n: number) => void;
  newChat: (folder?: string) => string;
  selectChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  deleteChat: (id: string) => void;
  setSystemPrompt: (id: string, prompt: string) => void;
  appendUser: (content: string) => {
    conversation: Conversation;
    user: ChatMessage;
    compressed: string;
    rtkSaved: number;
    rtkFilters: string[];
  } | null;
  commitAssistant: (input: {
    content: string;
    conversationId: string;
    userId: string;
    latencyMs: number;
    live: boolean;
  }) => void;
  setSending: (v: boolean) => void;
  runWorkflow: (workflowId: string) => WorkflowRun;
  updateComboStrategy: (comboId: string, strategy: Strategy) => void;
  toggleSticky: (comboId: string) => void;
}

function seedConversations(): Conversation[] {
  const now = Date.now();
  const sys =
    "You are the Flint gateway assistant. Be precise about routing, KV cache, and cost.";
  const c1: Conversation = {
    id: "conv_auth",
    title: "Auth middleware review",
    createdAt: now - 86_000_000,
    updatedAt: now - 3_600_000,
    comboId: "cache",
    systemPrompt: sys,
    folder: "Review",
    stickyProviderId: "claude-code",
    stickyModelId: "claude-sonnet",
    messages: [
      {
        id: "m1",
        role: "user",
        content:
          "Review src/lib/auth/middleware.ts. We cannot trust a client-sent user id. Propose the smallest patch.",
        createdAt: now - 3_700_000,
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "Read `context.userId` from the verified session only. Drop any `userId` field on the request body. Scope every query with that id. Add one test that a forged body id is ignored.",
        createdAt: now - 3_680_000,
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
          costUsd: 0.0041,
          naiveCostUsd: 0.0069,
          rtkSaved: 0,
          rtkFilters: [],
          cavemanLevel: 3,
          latencyMs: 410,
        },
      },
      {
        id: "m3",
        role: "user",
        content: "Write the test names. Keep the executor on the same model.",
        createdAt: now - 3_620_000,
      },
      {
        id: "m4",
        role: "assistant",
        content:
          "`ignores body userId`\n`scopes select by session userId`\n`expired session returns 401`",
        createdAt: now - 3_600_000,
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
          costUsd: 0.0022,
          naiveCostUsd: 0.0071,
          rtkSaved: 0,
          rtkFilters: [],
          cavemanLevel: 3,
          latencyMs: 280,
        },
      },
    ],
  };

  const c2: Conversation = {
    id: "conv_diff",
    title: "Billing router diff",
    createdAt: now - 12_000_000,
    updatedAt: now - 8_000_000,
    comboId: "coding",
    systemPrompt: sys,
    folder: "Coding",
    stickyProviderId: "glm",
    stickyModelId: "glm-4.5",
    messages: [
      {
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
        createdAt: now - 8_200_000,
      },
      {
        id: "d2",
        role: "assistant",
        content:
          "Diff is a score sort. Debug dump gone. Good. Watch stable sort when scores tie — pin provider order.",
        createdAt: now - 8_000_000,
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
          costUsd: 0.0004,
          naiveCostUsd: 0.0009,
          rtkSaved: 380,
          rtkFilters: ["git-diff"],
          cavemanLevel: 3,
          latencyMs: 300,
        },
      },
    ],
  };

  const c3: Conversation = {
    id: "conv_new",
    title: "New thread",
    createdAt: now,
    updatedAt: now,
    comboId: "auto",
    systemPrompt: sys,
    folder: "Inbox",
    messages: [],
  };

  return [c3, c1, c2];
}

function seedCache(): CacheEntry[] {
  const now = Date.now();
  return [
    {
      key: "claude-sonnet:pfx_sys",
      modelId: "claude-sonnet",
      providerId: "claude-code",
      prefixHash: "pfx_a11d00aa",
      tokens: 1792,
      hits: 11,
      createdAt: now - 120_000,
      expiresAt: now + 180_000,
      preview: "system + auth review thread",
    },
    {
      key: "glm-4.5:pfx_diff",
      modelId: "glm-4.5",
      providerId: "glm",
      prefixHash: "pfx_cc91aa12",
      tokens: 1024,
      hits: 3,
      createdAt: now - 80_000,
      expiresAt: now + 220_000,
      preview: "billing router diff",
    },
    {
      key: "grok-4.5:pfx_live",
      modelId: "grok-4.5",
      providerId: "xai",
      prefixHash: "pfx_ee77b010",
      tokens: 1280,
      hits: 2,
      createdAt: now - 40_000,
      expiresAt: now + 260_000,
      preview: "live grok prefix",
    },
  ];
}

function seedLog(): LogEntry[] {
  const now = Date.now();
  return [
    {
      id: "log1",
      at: now - 3_600_000,
      conversationId: "conv_auth",
      providerId: "claude-code",
      modelId: "claude-sonnet",
      strategy: "cache-optimized",
      path: ["sticky", "Claude Code"],
      tokensIn: 2140,
      tokensOut: 48,
      cachedTokens: 1792,
      costUsd: 0.0022,
      savedUsd: 0.0049,
      cacheHit: true,
      rtk: false,
      status: "ok",
      preview: "Write the test names…",
    },
    {
      id: "log2",
      at: now - 8_000_000,
      conversationId: "conv_diff",
      providerId: "glm",
      modelId: "glm-4.5",
      strategy: "fill-first",
      path: ["Claude Code", "GLM Coding"],
      tokensIn: 420,
      tokensOut: 64,
      cachedTokens: 0,
      costUsd: 0.0004,
      savedUsd: 0.0005,
      cacheHit: false,
      rtk: true,
      status: "fallback",
      preview: "git diff router.ts",
    },
    {
      id: "log3",
      at: now - 1_200_000,
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
      preview: "429 · circuit half-open",
    },
  ];
}

export const useFlintStore = create<FlintState>()(
  persist(
    (set, get) => ({
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
      temperature: 0.4,
      cache: seedCache(),
      log: seedLog(),
      runs: [],
      lastGoodProviderId: "claude-code",
      sending: false,
      savedUsd: 12.47,
      savedTokens: 1_842_000,
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
            } else if (circuit === "half" && p.quotaUsed < 0.9) {
              circuit = "closed";
            }
            const jitter = (Math.random() - 0.5) * 8;
            return {
              ...p,
              circuit,
              healthy,
              latencyMs: Math.max(40, Math.round(p.latencyMs + jitter)),
              rpm: Math.max(0, p.rpm + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
            };
          }),
          cache: s.cache.filter((c) => c.expiresAt > now),
        }));
      },
      toggleProvider: (id) =>
        set((s) => ({
          providers: s.providers.map((p) =>
            p.id === id ? { ...p, enabled: !p.enabled } : p,
          ),
        })),
      setCombo: (id) =>
        set((s) => {
          const combo = s.combos.find((c) => c.id === id);
          return {
            activeComboId: id,
            conversations: s.conversations.map((c) =>
              c.id === s.activeConversationId ? { ...c, comboId: id } : c,
            ),
            strategyOverride: combo ? "combo" : s.strategyOverride,
          };
        }),
      setStrategy: (strategyOverride) => set({ strategyOverride }),
      setRtk: (rtkEnabled) => set({ rtkEnabled }),
      setCaveman: (cavemanLevel) => set({ cavemanLevel }),
      setTemperature: (temperature) => set({ temperature }),
      newChat: (folder = "Inbox") => {
        const id = uid("conv");
        const comboId = get().activeComboId;
        const conv: Conversation = {
          id,
          title: "New thread",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          comboId,
          systemPrompt:
            "You are the Flint gateway assistant. Be precise about routing, KV cache, and cost.",
          folder,
          messages: [],
        };
        set((s) => ({
          conversations: [conv, ...s.conversations],
          activeConversationId: id,
        }));
        return id;
      },
      selectChat: (id) => set({ activeConversationId: id }),
      renameChat: (id, title) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, title } : c,
          ),
        })),
      deleteChat: (id) =>
        set((s) => {
          const rest = s.conversations.filter((c) => c.id !== id);
          const next = rest[0] ?? {
            id: uid("conv"),
            title: "New thread",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            comboId: s.activeComboId,
            systemPrompt: "",
            folder: "Inbox",
            messages: [],
          };
          const conversations = rest.length ? rest : [next];
          return {
            conversations,
            activeConversationId: conversations[0]!.id,
          };
        }),
      setSystemPrompt: (id, prompt) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, systemPrompt: prompt } : c,
          ),
        })),
      appendUser: (content) => {
        const s = get();
        const conv = s.conversations.find((c) => c.id === s.activeConversationId);
        if (!conv) return null;
        const rtk = compressRtk(content, s.rtkEnabled);
        const user: ChatMessage = {
          id: uid("msg"),
          role: "user",
          content: rtk.output,
          rawContent: rtk.filters.length ? content : undefined,
          createdAt: Date.now(),
        };
        const next: Conversation = {
          ...conv,
          title:
            conv.messages.length === 0
              ? content.trim().slice(0, 42) || "New thread"
              : conv.title,
          updatedAt: Date.now(),
          messages: [...conv.messages, user],
        };
        set({
          conversations: s.conversations.map((c) => (c.id === conv.id ? next : c)),
        });
        return {
          conversation: next,
          user,
          compressed: rtk.output,
          rtkSaved: rtk.originalTokens - rtk.compressedTokens,
          rtkFilters: rtk.filters,
        };
      },
      commitAssistant: ({ content, conversationId, latencyMs, live }) => {
        const s = get();
        const conv = s.conversations.find((c) => c.id === conversationId);
        if (!conv) return;
        const combo =
          s.combos.find((c) => c.id === conv.comboId) ?? s.combos[0]!;
        const strategy =
          s.strategyOverride === "combo" ? combo.strategy : s.strategyOverride;
        const tokensIn = estimateTokens(
          conv.systemPrompt + conv.messages.map((m) => m.content).join("\n"),
        );
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
          lastGoodProviderId: s.lastGoodProviderId,
        });
        const quote = quoteCost(
          decision.model,
          tokensIn,
          tokensOut,
          decision.cachedTokens,
        );
        const lastUser = [...conv.messages].reverse().find((m) => m.role === "user");
        const rtkSaved = lastUser?.rawContent
          ? estimateTokens(lastUser.rawContent) - estimateTokens(lastUser.content)
          : 0;
        const rtkFilters = lastUser?.rawContent
          ? compressRtk(lastUser.rawContent, true).filters
          : [];
        const meta = {
          providerId: live ? "xai" : decision.provider.id,
          modelId: live ? "grok-4.5" : decision.model.id,
          strategy: decision.strategy,
          path: live ? ["Flint gateway", "xAI Grok 4.5"] : decision.path,
          reason: live
            ? `${decision.reason} · live completion via Grok`
            : decision.reason,
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
          pipeline: decision.pipeline,
        };
        const assistant: ChatMessage = {
          id: uid("msg"),
          role: "assistant",
          content,
          createdAt: Date.now(),
          meta,
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
          preview: conv.title,
        });
        const log: LogEntry = {
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
          preview: (lastUser?.content ?? "").slice(0, 80),
        };
        set({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  updatedAt: now,
                  messages: [...c.messages, assistant],
                  stickyProviderId: providerId,
                  stickyModelId: modelId,
                }
              : c,
          ),
          providers: s.providers.map((p) =>
            p.id === providerId
              ? {
                  ...p,
                  usedCount: p.usedCount + 1,
                  rpm: p.rpm + 1,
                  quotaUsed: Math.min(0.99, p.quotaUsed + tokensIn / 8_000_000),
                }
              : p,
          ),
          cache: nextCache.slice(0, 80),
          log: [log, ...s.log].slice(0, 200),
          lastGoodProviderId: providerId,
          savedUsd: s.savedUsd + quote.savedUsd,
          savedTokens: s.savedTokens + decision.cachedTokens + rtkSaved,
          requests: s.requests + 1,
          cacheHits: s.cacheHits + (decision.cacheHit ? 1 : 0),
          sending: false,
        });
      },
      setSending: (sending) => set({ sending }),
      runWorkflow: (workflowId) => {
        const s = get();
        const wf = s.workflows.find((w) => w.id === workflowId);
        if (!wf) {
          return { id: "none", workflowId, at: Date.now(), events: [], totalCost: 0, naiveCost: 0 };
        }
        const sys = "workflow handoff via Flint gateway";
        const body =
          "Implement rate-limit headers on the gateway and add a regression test.";
        const events: WorkflowRunEvent[] = [];
        let total = 0;
        let naive = 0;
        let stickyHash: string | null = null;
        wf.steps.forEach((step, i) => {
          const combo = s.combos.find((c) => c.id === step.comboId) ?? s.combos[0]!;
          const messages =
            step.handoff === "full"
              ? [
                  { role: "user", content: body },
                  { role: "assistant", content: "working" },
                ]
              : step.handoff === "advisor"
                ? [{ role: "user", content: `Review summary: ${body.slice(0, 80)}` }]
                : [{ role: "user", content: `Plan: ${body.slice(0, 60)}` }];
          const tokensIn =
            step.handoff === "full" ? 4200 + i * 200 : step.handoff === "advisor" ? 640 : 900;
          const decision = routeRequest({
            combo,
            strategy: combo.strategy,
            providers: s.providers,
            cache: s.cache,
            systemPrompt: sys,
            messages,
            tokensIn,
            tokensOutHint: 180,
            stickyProviderId: step.sticky ? events[0]?.providerId : undefined,
            stickyModelId: step.sticky ? events[0]?.modelId : undefined,
          });
          const cached =
            step.sticky && stickyHash && decision.model.id === events[0]?.modelId
              ? Math.min(tokensIn - 200, 3072)
              : decision.cachedTokens;
          const quote = quoteCost(decision.model, tokensIn, 180, cached);
          if (step.sticky) stickyHash = decision.prefixHash;
          const ev: WorkflowRunEvent = {
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
            note:
              step.handoff === "advisor"
                ? "Summary only. Executor prefix untouched."
                : step.handoff === "summary"
                  ? "Compressed handoff. New prefix."
                  : step.sticky
                    ? "Full prefix. Sticky for KV reuse."
                    : "Full prefix on this agent.",
          };
          events.push(ev);
          total += quote.usd;
          naive += quote.naiveUsd;
        });
        const run: WorkflowRun = {
          id: uid("run"),
          workflowId,
          at: Date.now(),
          events,
          totalCost: total,
          naiveCost: naive,
        };
        set({
          runs: [run, ...s.runs].slice(0, 20),
          savedUsd: s.savedUsd + Math.max(0, naive - total),
          requests: s.requests + events.length,
        });
        return run;
      },
      updateComboStrategy: (comboId, strategy) =>
        set((s) => ({
          combos: s.combos.map((c) => (c.id === comboId ? { ...c, strategy } : c)),
        })),
      toggleSticky: (comboId) =>
        set((s) => ({
          combos: s.combos.map((c) =>
            c.id === comboId ? { ...c, sticky: !c.sticky } : c,
          ),
        })),
    }),
    {
      name: "flint-gateway",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
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
        runs: s.runs,
      }),
    },
  ),
);

export function activeConversation(s: FlintState): Conversation | undefined {
  return s.conversations.find((c) => c.id === s.activeConversationId);
}

export function activeCombo(s: FlintState): Combo | undefined {
  return s.combos.find((c) => c.id === s.activeComboId);
}

export function resolvedStrategy(s: FlintState): Strategy {
  if (s.strategyOverride !== "combo") return s.strategyOverride;
  return activeCombo(s)?.strategy ?? "auto";
}

export function providerById(s: FlintState, id: string): Provider | undefined {
  return s.providers.find((p) => p.id === id);
}

export function cavemanPrompt(level: CavemanLevel): string | null {
  return cavemanSystem(level);
}

export function threadHashes(conv: Conversation) {
  return hashesForThread(conv.systemPrompt, conv.messages);
}
