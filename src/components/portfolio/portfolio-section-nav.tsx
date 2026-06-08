"use client";

import { PORTFOLIO_SECTIONS } from "@/data/portfolio-sections";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_SPY_OFFSET_PX = 112;

function resolveActiveSection(): string {
  let active = PORTFOLIO_SECTIONS[0].id;

  for (const section of PORTFOLIO_SECTIONS) {
    const el = document.getElementById(section.id);
    if (!el) continue;

    if (el.getBoundingClientRect().top <= SCROLL_SPY_OFFSET_PX) {
      active = section.id;
    }
  }

  return active;
}

export function PortfolioSectionNav() {
  const [activeId, setActiveId] = useState(PORTFOLIO_SECTIONS[0].id);
  const clickScrollingRef = useRef(false);

  const releaseClickScrollLock = useCallback(() => {
    if (!clickScrollingRef.current) return;
    clickScrollingRef.current = false;
    setActiveId(resolveActiveSection());
  }, []);

  const scrollToSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;

      clickScrollingRef.current = true;
      setActiveId(id);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);

      const timeoutId = window.setTimeout(releaseClickScrollLock, 1200);
      const onScrollEnd = () => {
        window.clearTimeout(timeoutId);
        releaseClickScrollLock();
      };
      window.addEventListener("scrollend", onScrollEnd, { once: true });
    },
    [releaseClickScrollLock],
  );

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && PORTFOLIO_SECTIONS.some((s) => s.id === hash)) {
      setActiveId(hash);
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      });
      return;
    }

    setActiveId(resolveActiveSection());
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (clickScrollingRef.current) return;
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        setActiveId(resolveActiveSection());
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="portfolio-section-nav" aria-label="Portfolio sections">
      <div className="portfolio-section-nav__panel">
        <ul className="portfolio-section-nav__list">
          {PORTFOLIO_SECTIONS.map((section) => {
            const isActive = activeId === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={cn(
                    "portfolio-section-nav__link",
                    isActive && "is-active",
                  )}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(section.id);
                  }}
                >
                  <span
                    className="portfolio-section-nav__indicator"
                    aria-hidden
                  />
                  <span className="portfolio-section-nav__label">
                    {section.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
