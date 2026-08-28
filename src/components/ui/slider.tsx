import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/cn";

export function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn("relative flex h-6 w-full touch-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow rounded-full bg-raised">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-accent" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-4 rounded-full bg-fg shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" />
    </SliderPrimitive.Root>
  );
}
