"use client";

import { openCalendlyPopup } from "@/components/contact/calendly-popup";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import Link from "next/link";
import type { ComponentType } from "react";

export type ContactIconLink = {
  key: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  external?: boolean;
  action?: "link" | "schedule";
};

type ContactIconPanelProps = {
  title: string;
  lead?: string;
  links: readonly ContactIconLink[];
  showGrid?: boolean;
  className?: string;
};

export function ContactIconPanel({
  title,
  lead,
  links,
  showGrid = true,
  className,
}: ContactIconPanelProps) {
  return (
    <div className={["contact-icon-panel", className].filter(Boolean).join(" ")}>
      {showGrid ? (
        <div className="contact-icon-panel__grid" aria-hidden>
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
      ) : null}
      <div className="contact-icon-panel__body">
        <h2 className="contact-icon-panel__title">{title}</h2>
        {lead ? <p className="contact-icon-panel__lead">{lead}</p> : null}
        <nav aria-label="Contact options" className="contact-icon-panel__nav">
          {links.map((item) => {
            const Icon = item.icon;
            const icon = (
              <Icon className="contact-icon-panel__icon" aria-hidden />
            );

            if (item.action === "schedule") {
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => openCalendlyPopup(item.href)}
                  className="contact-icon-panel__btn"
                >
                  {icon}
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
                className="contact-icon-panel__btn"
              >
                {icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
