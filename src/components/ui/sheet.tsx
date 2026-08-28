import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./button";

export function Sheet({
  open,
  onOpenChange,
  title,
  children,
  side = "left",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  children: React.ReactNode;
  side?: "left" | "right";
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed z-50 flex h-full w-[min(92vw,320px)] flex-col bg-surface shadow-[var(--shadow-pop)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            side === "left"
              ? "inset-y-0 left-0 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
              : "inset-y-0 right-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <Dialog.Title className="font-display text-lg text-fg">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="iconSm" aria-label="Close">
                <X />
              </Button>
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
