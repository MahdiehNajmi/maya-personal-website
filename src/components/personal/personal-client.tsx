"use client";

import { PERSONAL } from "@/data/personal";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function initDockMagnification() {
  const dock = document.getElementById("site-dock");
  if (!dock) return;
  const items = Array.from(
    dock.querySelectorAll<HTMLAnchorElement>(".dock-item"),
  );
  if (!items.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let frame: number | null = null;
  let lastX: number | null = null;

  const apply = () => {
    frame = null;
    if (lastX === null) return;
    const x = lastX;
    const influence = 140;
    const maxExtra = 0.58;
    for (const el of items) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const d = Math.abs(x - cx);
      const t = Math.max(0, 1 - d / influence);
      const scale = 1 + maxExtra * t * t;
      el.style.setProperty("--dock-scale", scale.toFixed(3));
    }
  };

  const queue = (clientX: number) => {
    lastX = clientX;
    if (frame !== null) return;
    frame = window.requestAnimationFrame(apply);
  };

  dock.addEventListener("mousemove", (e) => queue(e.clientX));
  dock.addEventListener("mouseleave", () => {
    lastX = null;
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = null;
    for (const el of items) el.style.removeProperty("--dock-scale");
  });
}

function initRevealOnScroll() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
  );
  els.forEach((el) => io.observe(el));
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", id);
      }
    });
  });
}

export function PersonalClientEffects() {
  useEffect(() => {
    initDockMagnification();
    initRevealOnScroll();
    initSmoothAnchors();
  }, []);

  return null;
}

export function ThemeToggle() {
  useEffect(() => {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const applyTheme = (theme: "light" | "dark") => {
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    };
    const sync = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      btn.setAttribute("aria-pressed", isDark ? "true" : "false");
    };
    sync();
    const onClick = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch {
        /* ignore */
      }
      sync();
    };
    btn.addEventListener("click", onClick);
    return () => btn.removeEventListener("click", onClick);
  }, []);

  return (
    <button
      type="button"
      className="theme-toggle"
      id="theme-toggle"
      aria-label="Switch color theme"
      aria-pressed="true"
      title="Light / dark theme"
    >
      <span className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      </span>
      <span className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  );
}

export function TypingHero() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const TYPING_TEXT = PERSONAL.typingText;
    const TYPE_MS = 100;
    const DELETE_MS = Math.max(35, Math.floor(TYPE_MS / 2));
    const PAUSE_MS = 1200;
    const IO_THRESHOLD = 0.3;

    const root = document.getElementById("typing-root");
    const output = document.getElementById("typing-output");
    const hiIcon = document.getElementById("typing-hi-icon");
    const cursor = document.getElementById("typing-cursor");
    if (!root || !output || !hiIcon || !cursor) return;

    const graphemes = Array.from(TYPING_TEXT);
    let started = false;
    let charIndex = 0;
    let phase: "typing" | "pause" | "deleting" = "typing";
    let timerId: number | null = null;

    const clearTimer = () => {
      if (timerId !== null) {
        window.clearTimeout(timerId);
        timerId = null;
      }
    };

    const schedule = (fn: () => void, delay: number) => {
      clearTimer();
      timerId = window.setTimeout(fn, delay) as unknown as number;
    };

    const tick = () => {
      if (document.hidden) return;
      if (phase === "typing") {
        if (charIndex < graphemes.length) {
          output.textContent = graphemes.slice(0, charIndex + 1).join("");
          charIndex += 1;
          schedule(tick, TYPE_MS);
        } else {
          hiIcon.classList.add("is-visible");
          hiIcon.setAttribute("aria-hidden", "false");
          phase = "pause";
          schedule(tick, PAUSE_MS);
        }
      } else if (phase === "pause") {
        hiIcon.classList.remove("is-visible");
        hiIcon.setAttribute("aria-hidden", "true");
        phase = "deleting";
        schedule(tick, DELETE_MS);
      } else if (phase === "deleting") {
        if (charIndex > 0) {
          charIndex -= 1;
          output.textContent = graphemes.slice(0, charIndex).join("");
          schedule(tick, DELETE_MS);
        } else {
          phase = "typing";
          output.textContent = "";
          schedule(tick, TYPE_MS);
        }
      }
    };

    const beginLoop = () => {
      cursor.classList.remove("is-done");
      hiIcon.classList.remove("is-visible");
      hiIcon.setAttribute("aria-hidden", "true");
      phase = "typing";
      charIndex = 0;
      output.textContent = "";
      tick();
    };

    const start = () => {
      if (started) return;
      started = true;
      beginLoop();
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      output.textContent = TYPING_TEXT;
      hiIcon.classList.add("is-visible");
      hiIcon.setAttribute("aria-hidden", "false");
      cursor.classList.add("is-done");
      return;
    }

    const onVisibility = () => {
      if (!started) return;
      if (document.hidden) clearTimer();
      else beginLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= IO_THRESHOLD) {
            observer.disconnect();
            start();
            break;
          }
        }
      },
      { threshold: IO_THRESHOLD },
    );
    observer.observe(root);

    return () => {
      clearTimer();
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
      output.textContent = "";
      hiIcon.classList.remove("is-visible");
      hiIcon.setAttribute("aria-hidden", "true");
      cursor.classList.remove("is-done");
    };
  }, [pathname]);

  return null;
}
