"use client";

import { ResumePreviewModal } from "@/components/personal/resume-preview-modal";
import { PERSONAL } from "@/data/personal";
import { PORTFOLIO_BASE } from "@/lib/paths";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ComponentType, type SVGProps } from "react";

const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg className="dock-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z" />
  </svg>
);

const PortfolioIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg className="dock-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const GitHubIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg className="dock-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
  </svg>
);

const EmailIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg className="dock-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const AboutIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg className="dock-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ContactIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg className="dock-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15a4 4 0 0 1-4 4H8l-4 4V7a4 4 0 0 1 4-4h5" />
    <line x1="16" y1="3" x2="22" y2="3" />
    <line x1="19" y1="6" x2="22" y2="6" />
    <line x1="16" y1="9" x2="22" y2="9" />
  </svg>
);

const ResumeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg className="dock-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <line x1="8" y1="9" x2="10" y2="9" />
  </svg>
);

type DockItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  external?: boolean;
  action?: "resume";
  match?: (pathname: string) => boolean;
};

const DOCK_ITEMS: DockItem[] = [
  {
    label: "Home",
    href: "/#home",
    icon: HomeIcon,
    match: (pathname) => pathname === "/",
  },
  {
    label: "Portfolio",
    href: PORTFOLIO_BASE,
    icon: PortfolioIcon,
    match: (pathname) => pathname.startsWith(PORTFOLIO_BASE),
  },
  {
    label: "GitHub",
    href: "https://github.com/MahdiehNajmi",
    icon: GitHubIcon,
    external: true,
  },
  {
    label: "Email",
    href: `mailto:${PERSONAL.email}`,
    icon: EmailIcon,
    external: true,
  },
  {
    label: "About",
    href: "/#about",
    icon: AboutIcon,
    match: (pathname) => pathname === "/",
  },
  {
    label: "Resume",
    href: "#resume",
    icon: ResumeIcon,
    action: "resume",
  },
  {
    label: "Contact",
    href: "/#contact",
    icon: ContactIcon,
    match: (pathname) => pathname === "/",
  },
];

function dockItemClassName(isCurrent: boolean) {
  return isCurrent ? "dock-item dock-item--current" : "dock-item";
}

export function DockNav() {
  const pathname = usePathname();
  const [resumeOpen, setResumeOpen] = useState(false);
  return (
    <>
      <header className="dock-header" role="banner">
        <div className="dock-header__align">
          <nav className="dock-shell" aria-label="Main navigation">
            <ul className="dock" id="site-dock">
            {DOCK_ITEMS.map((item) => {
              const Icon = item.icon;
              const isCurrent = item.match?.(pathname) ?? false;
              const className = dockItemClassName(isCurrent);
              const linkProps = {
                className,
                "aria-label": item.label,
                "aria-current": isCurrent ? ("page" as const) : undefined,
              };
              const content = (
                <>
                  <Icon />
                  <span className="dock-label">{item.label}</span>
                </>
              );

              return (
                <li className="dock-slot" key={item.label}>
                  {item.action === "resume" ? (
                    <button
                      {...linkProps}
                      type="button"
                      onClick={() => setResumeOpen(true)}
                    >
                      {content}
                    </button>
                  ) : item.external ? (
                    <a
                      {...linkProps}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {content}
                    </a>
                  ) : (
                    <Link {...linkProps} href={item.href}>
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
            </ul>
          </nav>
        </div>
      </header>
      <ResumePreviewModal
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />
    </>
  );
}
