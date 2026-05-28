"use client";

import {
  ShimmerAnchor,
  ShimmerLink,
} from "@/components/ui/shimmer-button";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const PERSONAL_SHIMMER = {
  background: "rgba(15, 23, 42, 0.92)",
  shimmerColor: "#7dd3fc",
  borderRadius: "10px",
} as const;

type PersonalShimmerLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
} & Pick<
  ComponentPropsWithoutRef<typeof ShimmerLink>,
  "shimmerColor" | "shimmerSize" | "borderRadius" | "shimmerDuration" | "background"
>;

function ShimmerLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative z-10 text-sm font-semibold tracking-tight text-slate-100">
      {children}
    </span>
  );
}

export function PersonalShimmerLink({
  href,
  children,
  className = "shadow-lg",
  external = false,
  ...shimmerProps
}: PersonalShimmerLinkProps) {
  const props = { ...PERSONAL_SHIMMER, ...shimmerProps, className };

  if (external || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <ShimmerAnchor href={href} {...props}>
        <ShimmerLabel>{children}</ShimmerLabel>
      </ShimmerAnchor>
    );
  }

  return (
    <ShimmerLink href={href} {...props}>
      <ShimmerLabel>{children}</ShimmerLabel>
    </ShimmerLink>
  );
}
