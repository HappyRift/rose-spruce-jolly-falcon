import { cn } from "@/lib/cn";

export function Badge({
  className,
  tone = "muted",
  ...props
}: React.ComponentProps<"span"> & {
  tone?: "muted" | "ok" | "warn" | "bad" | "cache" | "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide",
        tone === "muted" && "bg-raised text-muted",
        tone === "ok" && "bg-ok/15 text-ok",
        tone === "warn" && "bg-warn/15 text-warn",
        tone === "bad" && "bg-bad/15 text-bad",
        tone === "cache" && "bg-cache/15 text-cache",
        tone === "accent" && "bg-accent/15 text-fg",
        className,
      )}
      {...props}
    />
  );
}
