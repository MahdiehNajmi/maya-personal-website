"use client";

import { openCalendlyPopup } from "@/components/contact/calendly-popup";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Icons } from "@/components/icons";
import { DATA } from "@/data/resume";
import { portfolioPath } from "@/lib/paths";
import { CalendarClock, MessageSquare } from "lucide-react";
import Link from "next/link";

const contactLinks = [
  {
    key: "linkedin",
    label: "LinkedIn",
    href: DATA.contact.social.LinkedIn.url,
    icon: Icons.linkedin,
    external: true,
    action: "link" as const,
  },
  {
    key: "meeting",
    label: "Book a meeting",
    href: DATA.contact.calendlyUrl,
    icon: CalendarClock,
    external: false,
    action: "schedule" as const,
  },
  {
    key: "message",
    label: "Message",
    href: portfolioPath("/lets-discuss"),
    icon: MessageSquare,
    external: false,
    action: "link" as const,
  },
] as const;

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden rounded-xl border border-border p-8 sm:p-10"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-xl">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={2}
          gridGap={2}
          style={{
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>
      <div className="relative flex flex-col items-center gap-5 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Get in Touch
        </h2>
        <nav
          aria-label="Contact options"
          className="flex w-full max-w-lg flex-wrap items-center justify-center gap-3"
        >
          {contactLinks.map((item) => {
            const Icon = item.icon;
            const isSchedule = item.action === "schedule";

            if (isSchedule) {
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => openCalendlyPopup(item.href)}
                  className="inline-flex min-w-[6.5rem] flex-col items-center gap-1.5 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Icon className="size-5 shrink-0 text-primary" aria-hidden />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="inline-flex min-w-[6.5rem] flex-col items-center gap-1.5 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Icon className="size-5 shrink-0 text-primary" aria-hidden />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
