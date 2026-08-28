import { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Hash,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Markdown } from "@/components/chat/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";
import { completeChat, getAiStatus } from "@/lib/flint/complete";
import { formatPct, formatTokens, formatUsd } from "@/lib/flint/cost";
import { estimateTokens } from "@/lib/flint/hash";
import { localReply } from "@/lib/flint/local-reply";
import { quoteCost } from "@/lib/flint/cost";
import { routeRequest } from "@/lib/flint/routing";
import {
  activeCombo,
  activeConversation,
  resolvedStrategy,
  useFlintStore,
} from "@/lib/flint/store";
import { CAVEMAN_LABELS, STRATEGY_META, type CavemanLevel } from "@/lib/flint/types";

const PROMPTS = [
  {
    title: "Keep the KV hot",
    body: "If I switch from Sonnet to Opus mid-thread, what happens to the prefix hash and the bill?",
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
`,
  },
  {
    title: "Advisor handoff",
    body: "Hand this review to a stronger model without breaking the executor cache.",
  },
  {
    title: "Cheapest path",
    body: "Route this 8k-token coding turn as cheap as possible but keep a cache-capable model if the prefix is already warm.",
  },
];

export function ChatView() {
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
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [aiOn, setAiOn] = useState<boolean | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void getAiStatus().then((s) => setAiOn(s.available));
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [conv?.messages.length, sending]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => c.title.toLowerCase().includes(q));
  }, [conversations, query]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setDraft("");
    const appended = useFlintStore.getState().appendUser(trimmed);
    if (!appended) return;
    useFlintStore.getState().setSending(true);
    const state = useFlintStore.getState();
    const liveConv = state.conversations.find((c) => c.id === appended.conversation.id)!;
    const comboNow = state.combos.find((c) => c.id === liveConv.comboId) ?? state.combos[0]!;
    const strat =
      state.strategyOverride === "combo" ? comboNow.strategy : state.strategyOverride;
    const tokensIn = estimateTokens(
      liveConv.systemPrompt + liveConv.messages.map((m) => m.content).join("\n"),
    );
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
      lastGoodProviderId: state.lastGoodProviderId,
    });
    const started = Date.now();
    let textOut = "";
    let live = false;
    try {
      const res = await completeChat({
        data: {
          messages: liveConv.messages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
          cavemanLevel: state.cavemanLevel,
          temperature: state.temperature,
          systemPrompt: liveConv.systemPrompt,
        },
      });
      if (res.ok) {
        textOut = res.text;
        live = true;
      }
    } catch {
      /* fall through to local */
    }
    if (!textOut) {
      const quote = quoteCost(decision.model, tokensIn, 160, decision.cachedTokens);
      textOut = localReply(trimmed, decision, {
        cavemanLevel: state.cavemanLevel,
        rtkSaved: appended.rtkSaved,
        costUsd: quote.usd,
        naiveUsd: quote.naiveUsd,
      });
    }
    useFlintStore.getState().commitAssistant({
      content: textOut,
      conversationId: liveConv.id,
      userId: appended.user.id,
      latencyMs: Date.now() - started,
      live,
    });
  }

  return (
    <div className="flex h-[calc(100dvh-3rem)] md:h-dvh">
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex items-center gap-2 p-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-faint" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search threads"
              className="h-9 pl-8"
            />
          </div>
          <Button
            size="iconSm"
            variant="secondary"
            aria-label="New thread"
            onClick={() => useFlintStore.getState().newChat()}
          >
            <Plus />
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => useFlintStore.getState().selectChat(c.id)}
              className={cn(
                "mb-1 flex w-full flex-col rounded-md px-2.5 py-2 text-left transition-colors duration-[var(--motion-quick)]",
                c.id === activeId ? "bg-raised text-fg" : "text-muted hover:bg-raised/60 hover:text-fg",
              )}
            >
              <span className="truncate text-sm">{c.title}</span>
              <span className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-faint">
                {c.folder} · {c.messages.length} turns
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
          <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
            {combos.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => useFlintStore.getState().setCombo(c.id)}
                className={cn(
                  "h-8 shrink-0 rounded-md px-2.5 font-mono text-xs transition-colors duration-[var(--motion-quick)]",
                  combo?.id === c.id
                    ? "bg-accent text-accent-fg"
                    : "bg-raised text-muted hover:text-fg",
                )}
              >
                /{c.slug}
              </button>
            ))}
          </div>
          <Badge tone="muted">{STRATEGY_META[strategy].label}</Badge>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="font-mono text-[10px] uppercase text-muted">RTK</span>
            <Switch
              checked={rtkEnabled}
              onCheckedChange={(v) => useFlintStore.getState().setRtk(v)}
              aria-label="RTK token saver"
            />
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="font-mono text-[10px] uppercase text-muted">
              {CAVEMAN_LABELS[cavemanLevel]}
            </span>
            <Slider
              min={0}
              max={5}
              step={1}
              value={[cavemanLevel]}
              onValueChange={(v) =>
                useFlintStore.getState().setCaveman((v[0] ?? 0) as CavemanLevel)
              }
              className="w-24"
              aria-label="Caveman level"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {aiOn === true && <Badge tone="ok">Live Grok</Badge>}
            {aiOn === false && <Badge tone="warn">Local router</Badge>}
            {conv && conv.messages.length > 0 && (
              <Button
                variant="ghost"
                size="iconSm"
                aria-label="Delete thread"
                onClick={() => useFlintStore.getState().deleteChat(conv.id)}
              >
                <Trash2 />
              </Button>
            )}
          </div>
        </header>

        <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-3 py-6 sm:px-8">
          {!conv || conv.messages.length === 0 ? (
            <EmptyState onPick={(t) => void send(t)} />
          ) : (
            <div className="mx-auto flex max-w-2xl flex-col gap-6">
              {conv.messages.map((m) => (
                <article key={m.id} className="min-w-0">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wide text-muted">
                      {m.role}
                    </span>
                    {m.rawContent && <Badge tone="ok">RTK</Badge>}
                    {m.meta?.cacheHit && (
                      <Badge tone="cache">
                        cache {formatPct(m.meta.cachedTokens / Math.max(1, m.meta.tokensIn))}
                      </Badge>
                    )}
                    {m.meta && (
                      <span className="truncate font-mono text-[10px] text-faint">
                        {m.meta.path.join(" → ")}
                      </span>
                    )}
                  </div>
                  {m.role === "assistant" ? (
                    <Markdown text={m.content} />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg/90">
                      {m.content}
                    </p>
                  )}
                  {m.meta && (
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-muted">
                      <span className="tabular-nums">{formatUsd(m.meta.costUsd)}</span>
                      <span className="tabular-nums">
                        {formatTokens(m.meta.tokensIn)} in
                      </span>
                      {m.meta.rtkSaved > 0 && (
                        <span className="text-ok">−{formatTokens(m.meta.rtkSaved)} rtk</span>
                      )}
                      <span className="inline-flex items-center gap-1 text-cache">
                        <Hash className="size-3" />
                        {m.meta.prefixHash}
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-faint hover:text-fg"
                        onClick={() => void navigator.clipboard.writeText(m.content)}
                      >
                        <Copy className="size-3" />
                        Copy
                      </button>
                    </div>
                  )}
                </article>
              ))}
              {sending && (
                <p className="font-mono text-xs text-muted">
                  Routing {combo?.slug ?? "auto"} · compressing · hashing prefix
                </p>
              )}
            </div>
          )}
        </div>

        <form
          className="border-t border-border p-3 sm:px-8 sm:pb-5"
          onSubmit={(e) => {
            e.preventDefault();
            void send(draft);
          }}
        >
          <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-xl bg-surface p-2 shadow-[var(--shadow-border)]">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(draft);
                }
              }}
              rows={2}
              placeholder="Message Flint. Tool dumps get RTK. Prefix stays sticky."
              className="min-h-12 max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-fg placeholder:text-faint focus:outline-none"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!draft.trim() || sending}
              aria-label="Send"
            >
              <Send />
            </Button>
          </div>
          <div className="mx-auto mt-2 flex max-w-2xl items-center justify-between font-mono text-[10px] text-faint">
            <span>
              {STRATEGY_META[strategy].label} · caveman {CAVEMAN_LABELS[cavemanLevel]} · temp{" "}
              {temperature.toFixed(1)}
            </span>
            <span>{providers.filter((p) => p.healthy && p.enabled).length} healthy</span>
          </div>
        </form>
      </section>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (t: string) => void }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start px-2 pt-10 sm:pt-20">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        Central gateway
      </p>
      <h1 className="mt-3 font-display text-4xl leading-none tracking-tight sm:text-5xl">
        Where to.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        One endpoint. Cross-provider routing, RTK + Caveman, prefix-hash KV math, and
        advisor-style handoff. Threads stay sticky so cache hits survive the session.
      </p>
      <div className="mt-8 grid w-full gap-2 sm:grid-cols-2">
        {PROMPTS.map((p) => (
          <button
            key={p.title}
            type="button"
            onClick={() => onPick(p.body)}
            className="rounded-lg bg-surface p-3 text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-[var(--motion-quick)] hover:shadow-[var(--shadow-border-hover)]"
          >
            <div className="flex items-center gap-2 text-sm text-fg">
              <Sparkles className="size-3.5 text-muted" />
              {p.title}
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-muted">{p.body}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
