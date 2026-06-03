"use client";

import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const BOTTOM_THRESHOLD_PX = 320;

function isNearPageBottom() {
  const { scrollY, innerHeight } = window;
  const { scrollHeight } = document.documentElement;
  return scrollY + innerHeight >= scrollHeight - BOTTOM_THRESHOLD_PX;
}

export function BackToTop() {
  const pathname = usePathname();
  const href = pathname === "/" ? "#home" : "#page-top";
  const aboveChat =
    pathname === "/" ||
    pathname === "/comments" ||
    pathname.startsWith("/sign-up");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let ticking = false;

    const update = () => {
      setVisible(isNearPageBottom());
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      if (reducedMotion) {
        update();
      } else {
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [pathname]);

  return (
    <a
      className={cn(
        "back-to-top-fab",
        aboveChat && "back-to-top-fab--above-chat",
        visible && "is-visible",
      )}
      href={href}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <ChevronUp className="back-to-top-fab__icon" aria-hidden strokeWidth={2.5} />
      <span className="back-to-top-fab__label">Back to top</span>
    </a>
  );
}
