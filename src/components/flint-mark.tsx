import { cn } from "@/lib/cn";

export function FlintMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-fg", className)}
      aria-hidden="true"
    >
      <path
        d="M16 3 L27 18 L16 29 L5 18 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M16 8 L22 18 L16 24 L10 18 Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}
