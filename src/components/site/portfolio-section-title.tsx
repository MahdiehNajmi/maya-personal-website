import { cn } from "@/lib/utils";

type PortfolioSectionTitleProps = {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
};

export function PortfolioSectionTitle({
  title,
  subtitle,
  align = "center",
  className,
}: PortfolioSectionTitleProps) {
  return (
    <div
      className={cn(
        "portfolio-section-heading",
        align === "left" && "portfolio-section-heading--left",
        className,
      )}
    >
      <h2 className="portfolio-section-title">{title}</h2>
      {subtitle ? (
        <p className="portfolio-section-subtitle">{subtitle}</p>
      ) : null}
    </div>
  );
}
