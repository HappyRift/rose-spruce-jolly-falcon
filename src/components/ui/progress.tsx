import { cn } from "@/lib/cn";

export function Progress({
  value,
  className,
  tone = "accent",
}: {
  value: number;
  className?: string;
  tone?: "accent" | "ok" | "warn" | "bad" | "cache";
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-raised", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
          tone === "accent" && "bg-accent",
          tone === "ok" && "bg-ok",
          tone === "warn" && "bg-warn",
          tone === "bad" && "bg-bad",
          tone === "cache" && "bg-cache",
        )}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
