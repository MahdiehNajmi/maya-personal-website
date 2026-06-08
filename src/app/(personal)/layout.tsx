import { MayaChatWidget } from "@/components/personal/maya-chat-widget";
import { DockNav } from "@/components/personal/dock-nav";
import {
  PersonalClientEffects,
  ThemeToggle,
  TypingHero,
} from "@/components/personal/personal-client";
import { ThemeInitScript } from "@/components/personal/theme-init";
import { BackToTop } from "@/components/site/back-to-top";
import { SiteFooter } from "@/components/site/site-footer";
import { PERSONAL } from "@/data/personal";
import type { Metadata } from "next";
import "@/styles/site-tokens.css";
import "@/styles/site-nav.css";
import "@/styles/personal.css";
import "@/styles/hero-shimmer.css";
import "@/styles/contact-panel.css";

export const metadata: Metadata = {
  title: PERSONAL.title,
  description: PERSONAL.metaDescription,
};

export default function PersonalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ThemeInitScript />
      <a className="skip-link" href="#home">
        Skip to content
      </a>
      <DockNav />
      <ThemeToggle />
      <PersonalClientEffects />
      <TypingHero />
      <div
        id="page-top"
        className="site-page-shell site-page-shell--personal w-full pb-16"
      >
        {children}
        <SiteFooter />
      </div>
      <BackToTop />
      {PERSONAL.chatWidgetEnabled ? <MayaChatWidget /> : null}
    </>
  );
}
