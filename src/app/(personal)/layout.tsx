import { MayaChatWidget } from "@/components/personal/maya-chat-widget";
import { DockNav } from "@/components/personal/dock-nav";
import {
  PersonalClientEffects,
  ThemeToggle,
  TypingHero,
} from "@/components/personal/personal-client";
import { ThemeInitScript } from "@/components/personal/theme-init";
import { PERSONAL } from "@/data/personal";
import type { Metadata } from "next";
import "@/styles/personal.css";
import "@/styles/hero-shimmer.css";

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
      {children}
      <MayaChatWidget />
    </>
  );
}
