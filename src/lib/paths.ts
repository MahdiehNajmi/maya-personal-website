/** Base path for the portfolio section (single-app deploy). */
export const PORTFOLIO_BASE = "/portfolio";

export function portfolioPath(path = ""): string {
  if (!path || path === "/") return PORTFOLIO_BASE;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${PORTFOLIO_BASE}${normalized}`;
}
