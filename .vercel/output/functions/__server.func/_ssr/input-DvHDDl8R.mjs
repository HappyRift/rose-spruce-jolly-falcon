import "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as cn } from "./router-DEGBjKzP.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-10 w-full rounded-md bg-inset px-3 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40", className),
		...props
	});
}
//#endregion
export { Input as t };
