import * as React from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md bg-inset px-3 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-20 w-full rounded-md bg-inset px-3 py-2 text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}
