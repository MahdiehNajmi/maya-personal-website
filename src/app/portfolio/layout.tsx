import { DockNav } from "@/components/personal/dock-nav";
import {
  PersonalClientEffects,
  ThemeToggle,
} from "@/components/personal/personal-client";
import { ThemeInitScript } from "@/components/personal/theme-init";
import { BackToTop } from "@/components/site/back-to-top";
import { SiteFooter } from "@/components/site/site-footer";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import "@/styles/site-nav.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

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
    <div
      className={cn(
        "portfolio-root min-h-screen bg-background font-sans antialiased relative",
        geist.variable,
        geistMono.variable,
      )}
    >
      <ThemeInitScript />
      <ThemeProvider attribute="class" defaultTheme="dark">
        <TooltipProvider delayDuration={0}>
          <DockNav />
          <ThemeToggle />
          <PersonalClientEffects />
          <div className="absolute inset-0 top-0 left-0 right-0 h-[100px] overflow-hidden z-0">
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
          <div
            id="page-top"
            className="site-page-shell portfolio-site-shell relative z-10 mx-auto w-full max-w-4xl px-6 pb-16 pt-28 sm:pb-20 sm:pt-32 lg:max-w-5xl"
          >
            {children}
            <SiteFooter />
          </div>
          <BackToTop />
        </TooltipProvider>
      </ThemeProvider>
    </div>
  );
}
