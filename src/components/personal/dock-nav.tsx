import { PERSONAL } from "@/data/personal";
import { PORTFOLIO_BASE } from "@/lib/paths";
import Link from "next/link";

const HomeIcon = () => (
  <svg className="dock-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z" />
  </svg>
);

const PortfolioIcon = () => (
  <svg className="dock-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="dock-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="dock-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const AboutIcon = () => (
  <svg className="dock-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ContactIcon = () => (
  <svg className="dock-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a4 4 0 0 1-4 4H8l-4 4V7a4 4 0 0 1 4-4h5" />
    <line x1="16" y1="3" x2="22" y2="3" />
    <line x1="19" y1="6" x2="22" y2="6" />
    <line x1="16" y1="9" x2="22" y2="9" />
  </svg>
);

export function DockNav() {
  return (
    <header className="dock-header" role="presentation">
      <nav className="dock-shell" aria-label="Main">
        <ul className="dock" id="site-dock">
          <li className="dock-slot">
            <Link
              className="dock-item"
              href="/#home"
              data-tooltip="Home — back to the top of the page"
              aria-label="Home — back to the top of the page"
            >
              <HomeIcon />
            </Link>
          </li>
          <li className="dock-slot">
            <Link
              className="dock-item"
              href={PORTFOLIO_BASE}
              data-tooltip="Portfolio — projects, demos, and work samples"
              aria-label="Portfolio — projects, demos, and work samples"
            >
              <PortfolioIcon />
            </Link>
          </li>
          <li className="dock-slot">
            <a
              className="dock-item"
              href={PERSONAL.github}
              target="_blank"
              rel="noopener noreferrer"
              data-tooltip="GitHub — code, repositories, and open source"
              aria-label="GitHub — code and repositories (opens in new tab)"
            >
              <GitHubIcon />
            </a>
          </li>
          <li className="dock-slot">
            <a
              className="dock-item"
              href={`mailto:${PERSONAL.email}`}
              data-tooltip={`Email — send a message to ${PERSONAL.email}`}
              aria-label={`Email — send a message to ${PERSONAL.email}`}
            >
              <EmailIcon />
            </a>
          </li>
          <li className="dock-slot">
            <Link
              className="dock-item"
              href="/#about"
              data-tooltip="About Me — my story and background"
              aria-label="About Me — my story and background"
            >
              <AboutIcon />
            </Link>
          </li>
          <li className="dock-slot">
            <Link
              className="dock-item"
              href="/#contact"
              data-tooltip="Contact Me — email and reach out"
              aria-label="Contact Me — email and reach out"
            >
              <ContactIcon />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
