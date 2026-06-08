import { DockNav } from "@/components/personal/dock-nav";
import {
  PersonalClientEffects,
  ThemeToggle,
} from "@/components/personal/personal-client";
import { ThemeInitScript } from "@/components/personal/theme-init";
import { BackToTop } from "@/components/site/back-to-top";
import { SiteFooter } from "@/components/site/site-footer";
import { DATA } from "@/data/resume";
import type { Metadata } from "next";
import "@/styles/site-tokens.css";
import "./globals.css";
import "@/styles/site-nav.css";
import "@/styles/contact-panel.css";

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: `${DATA.name} — Portfolio`,
    template: `%s | ${DATA.name}`,
  },
  description: DATA.description,
  openGraph: {
    title: `${DATA.name} — Portfolio`,
    description: DATA.description,
    url: `${DATA.url}/portfolio`,
    siteName: DATA.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: `${DATA.name} — Portfolio`,
    card: "summary_large_image",
  },
};

export default function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ThemeInitScript />
      <a className="skip-link" href="#page-top">
        Skip to content
      </a>
      <DockNav />
      <ThemeToggle />
      <PersonalClientEffects />
      <div
        id="page-top"
        className="site-page-shell portfolio-site-shell relative z-10 w-full"
      >
        {children}
        <SiteFooter />
      </div>
      <BackToTop />
    </>
  );
}
