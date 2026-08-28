import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as cn } from "./router-DEGBjKzP.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/switch-Dgm_Dkrs.js
var import_jsx_runtime = require_jsx_runtime();
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-10 shrink-0 items-center rounded-full bg-raised shadow-[var(--shadow-border)] transition-colors data-[state=checked]:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-fg transition-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-accent-fg" })
	});
}
//#endregion
export { Switch as t };
