import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as cn } from "./router-DEGBjKzP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-i9MBh0tk.js
var import_jsx_runtime = require_jsx_runtime();
function Progress({ value, className, tone = "accent" }) {
	const v = Math.max(0, Math.min(100, value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-1.5 w-full overflow-hidden rounded-full bg-raised", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full transition-[width] duration-[var(--motion-fast)] ease-[var(--ease-out)]", tone === "accent" && "bg-accent", tone === "ok" && "bg-ok", tone === "warn" && "bg-warn", tone === "bad" && "bg-bad", tone === "cache" && "bg-cache"),
			style: { width: `${v}%` }
		})
	});
}
//#endregion
export { Progress as t };
