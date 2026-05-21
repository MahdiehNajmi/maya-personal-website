import { type ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  children: React.ReactNode;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden",
        vertical ? "h-full min-h-0 max-h-[min(32rem,70vh)] w-full" : "w-full",
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 gap-3 [--gap:0.75rem] [gap:var(--gap)]",
          vertical
            ? "min-h-max flex-col items-center animate-marquee-y"
            : "min-w-max flex-row animate-marquee-x",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
