import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as cn } from "./router-DEGBjKzP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-CgaOjFSa.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "muted", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide", tone === "muted" && "bg-raised text-muted", tone === "ok" && "bg-ok/15 text-ok", tone === "warn" && "bg-warn/15 text-warn", tone === "bad" && "bg-bad/15 text-bad", tone === "cache" && "bg-cache/15 text-cache", tone === "accent" && "bg-accent/15 text-fg", className),
		...props
	});
}
//#endregion
export { Badge as t };
