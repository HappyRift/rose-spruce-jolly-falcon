import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as cavemanSystem } from "./caveman-D2x3NcY1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/complete-CumNBhU4.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getAiStatus_createServerFn_handler = createServerRpc({
	id: "d870e16fb91cb1c9b0e020ad7ad4e18a61b98a647bd524416b43a9ffd41e2f0c",
	name: "getAiStatus",
	filename: "src/lib/flint/complete.ts"
}, (opts) => getAiStatus.__executeServer(opts));
var getAiStatus = createServerFn({ method: "GET" }).handler(getAiStatus_createServerFn_handler, async () => {
	return { available: Boolean(process.env.XAI_API_KEY) };
});
var completeChat_createServerFn_handler = createServerRpc({
	id: "44d60897f716321c594feb204f2df3c1eb78d3e1de8bee824b991da3b4607e96",
	name: "completeChat",
	filename: "src/lib/flint/complete.ts"
}, (opts) => completeChat.__executeServer(opts));
var completeChat = createServerFn({ method: "POST" }).validator((input) => input).handler(completeChat_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "unavailable"
	};
	const cave = cavemanSystem(data.cavemanLevel);
	const messages = [{
		role: "system",
		content: [data.systemPrompt || "You are Flint, a local AI gateway. Answer the user. When relevant, mention routing, KV-cache prefixes, or cost briefly.", cave].filter(Boolean).join("\n\n")
	}, ...data.messages.filter((m) => m.role !== "system").slice(-12)];
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			messages,
			temperature: data.temperature,
			max_tokens: 420
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI ${res.status}`
	};
	const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
	if (!text) return {
		ok: false,
		error: "empty"
	};
	return {
		ok: true,
		text,
		live: true
	};
});
//#endregion
export { completeChat_createServerFn_handler, getAiStatus_createServerFn_handler };
