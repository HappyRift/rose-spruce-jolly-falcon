import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  GitBranch,
  Hash,
  Layers,
  Menu,
  MessageSquare,
  Radio,
  Scissors,
  Waypoints,
} from "lucide-react";
import { FlintMark } from "@/components/flint-mark";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { cn } from "@/lib/cn";
import { formatUsd } from "@/lib/flint/cost";
import { useFlintStore } from "@/lib/flint/store";

const NAV = [
  { to: "/", label: "Chat", icon: MessageSquare },
  { to: "/gateway", label: "Gateway", icon: Radio },
  { to: "/providers", label: "Providers", icon: Layers },
  { to: "/combos", label: "Combos", icon: GitBranch },
  { to: "/compress", label: "Compress", icon: Scissors },
  { to: "/cache", label: "Cache", icon: Hash },
  { to: "/workflows", label: "Handoff", icon: Waypoints },
  { to: "/log", label: "Log", icon: Activity },
] as const;

function NavLinks({
  pathname,
  onNavigate,
  compact,
}: {
  pathname: string;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active =
          item.to === "/"
            ? pathname === "/"
            : pathname === item.to || pathname.startsWith(`${item.to}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-2.5 text-sm transition-colors duration-[var(--motion-quick)]",
              compact ? "h-10 justify-center px-0" : "h-10",
              active
                ? "bg-raised text-fg shadow-[var(--shadow-border)]"
                : "text-muted hover:bg-raised/70 hover:text-fg",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-4 shrink-0" />
            {!compact && <span>{item.label}</span>}
            {compact && <span className="sr-only">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const savedUsd = useFlintStore((s) => s.savedUsd);
  const setHydrated = useFlintStore((s) => s.setHydrated);
  const tick = useFlintStore((s) => s.tick);

  useEffect(() => {
    void Promise.resolve(useFlintStore.persist.rehydrate()).then(() =>
      setHydrated(true),
    );
  }, [setHydrated]);

  useEffect(() => {
    const id = window.setInterval(tick, 2500);
    return () => window.clearInterval(id);
  }, [tick]);

  return (
    <div className="flex min-h-dvh bg-bg text-fg">
      <aside className="sticky top-0 hidden h-dvh w-[220px] shrink-0 flex-col border-r border-border bg-surface p-3 md:flex">
        <Link to="/" className="mb-6 flex items-center gap-2.5 px-1 pt-1">
          <FlintMark className="size-7" />
          <div className="min-w-0">
            <div className="font-display text-xl leading-none tracking-tight">Flint</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Gateway
            </div>
          </div>
        </Link>
        <NavLinks pathname={pathname} />
        <div className="mt-auto rounded-lg bg-inset p-3 shadow-[var(--shadow-border)]">
          <div className="font-mono text-[10px] uppercase tracking-wide text-muted">
            Saved vs naive
          </div>
          <div className="mt-1 font-mono text-lg tabular-nums text-ok">
            {formatUsd(savedUsd)}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 items-center gap-2 border-b border-border px-3 md:hidden">
          <Button
            variant="ghost"
            size="iconSm"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </Button>
          <FlintMark className="size-5" />
          <span className="font-display text-lg">Flint</span>
          <span className="ml-auto font-mono text-xs tabular-nums text-ok">
            {formatUsd(savedUsd)}
          </span>
        </header>
        <Sheet open={open} onOpenChange={setOpen} title="Flint">
          <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
        </Sheet>
        <div className="min-h-0 min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
