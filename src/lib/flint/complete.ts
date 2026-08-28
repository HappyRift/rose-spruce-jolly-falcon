import { createServerFn } from "@tanstack/react-start";
import { cavemanSystem } from "./caveman";
import type { CavemanLevel } from "./types";

export const getAiStatus = createServerFn({ method: "GET" }).handler(async () => {
  return { available: Boolean(process.env.XAI_API_KEY) };
});

export const completeChat = createServerFn({ method: "POST" })
  .validator(
    (input: {
      messages: { role: "user" | "assistant" | "system"; content: string }[];
      cavemanLevel: CavemanLevel;
      temperature: number;
      systemPrompt: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "unavailable" };
    }

    const cave = cavemanSystem(data.cavemanLevel);
    const system = [
      data.systemPrompt ||
        "You are Flint, a local AI gateway. Answer the user. When relevant, mention routing, KV-cache prefixes, or cost briefly.",
      cave,
    ]
      .filter(Boolean)
      .join("\n\n");

    const messages = [
      { role: "system" as const, content: system },
      ...data.messages.filter((m) => m.role !== "system").slice(-12),
    ];

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        messages,
        temperature: data.temperature,
        max_tokens: 420,
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: `xAI ${res.status}` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "empty" };
    return { ok: true as const, text, live: true as const };
  });
