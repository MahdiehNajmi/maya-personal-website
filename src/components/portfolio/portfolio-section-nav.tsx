"use client";

import { PORTFOLIO_SECTIONS } from "@/data/portfolio-sections";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

export function PortfolioSectionNav() {
  const [activeId, setActiveId] = useState(PORTFOLIO_SECTIONS[0].id);
  const clickScrollingRef = useRef(false);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    clickScrollingRef.current = true;
    setActiveId(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);

    window.setTimeout(() => {
      clickScrollingRef.current = false;
    }, 700);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && PORTFOLIO_SECTIONS.some((s) => s.id === hash)) {
      setActiveId(hash);
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      });
    }
  }, []);

  useEffect(() => {
    const sectionEls = PORTFOLIO_SECTIONS.map((s) =>
      document.getElementById(s.id),
    ).filter((el): el is HTMLElement => Boolean(el));

    if (!sectionEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (clickScrollingRef.current) return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-12% 0px -55% 0px", threshold: [0, 0.15, 0.5] },
    );

    for (const el of sectionEls) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="portfolio-section-nav" aria-label="Portfolio sections">
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
    </nav>
  );
}
