/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { Card, CardContent } from "@/components/ui/card";
import { PortfolioSectionTitle } from "@/components/site/portfolio-section-title";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";

const BLUR_FADE_DELAY = 0.04;

function CertificationTile({
  title,
  issuer,
  logoUrl,
}: {
  title: string;
  issuer: string;
  logoUrl: string;
}) {
  return (
    <article
      className={cn(
        "group/cert flex h-full items-center gap-3 rounded-lg border border-border/60",
        "bg-background/50 p-3 sm:p-3.5",
        "transition-colors duration-200 hover:border-primary/25 hover:bg-muted/30",
      )}
    >
      <div
        className="relative size-14 shrink-0 overflow-hidden rounded-full border border-border bg-white shadow-sm ring-2 ring-border/80 sm:size-16"
        aria-hidden
      >
        <img
          src={logoUrl}
          alt=""
          className="size-full scale-[1.28] object-contain object-center"
        />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="text-sm font-semibold leading-snug text-foreground">
          {title}
        </h3>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {issuer}
        </p>
      </div>
    </article>
  );
}

export default function CertificationsSection() {
  return (
    <section id="certifications" className="flex min-h-0 flex-col gap-y-4">
      <BlurFade delay={BLUR_FADE_DELAY * 10.5}>
        <PortfolioSectionTitle
          title="Certifications"
          subtitle="Professional Development"
          align="left"
        />
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY * 11}>
        <Card className="portfolio-surface-card relative w-full overflow-hidden text-card-foreground">
          <CardContent className="relative z-10 p-3 sm:p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {DATA.certifications.map((c) => (
                <CertificationTile
                  key={c.title}
                  title={c.title}
                  issuer={c.issuer}
                  logoUrl={c.logoUrl}
                />
              ))}
            </div>
          </CardContent>
          <BorderBeam
            duration={8}
            size={400}
            className="from-transparent via-primary to-transparent"
          />
          <BorderBeam
            duration={8}
            delay={4}
            size={400}
            borderWidth={2}
            className="from-transparent via-sky-400/80 to-transparent"
          />
        </Card>
      </BlurFade>
    </section>
  );
}
