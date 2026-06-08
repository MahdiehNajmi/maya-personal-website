/* eslint-disable @next/next/no-img-element */
import { PortfolioSectionTitle } from "@/components/site/portfolio-section-title";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DATA } from "@/data/resume";
import { Timeline, TimelineItem, TimelineConnectItem } from "@/components/timeline";

function hackathonsSubtitle() {
  if (DATA.hackathons.length === 0) {
    return "Add your hackathon highlights in src/data/resume.tsx to populate this timeline.";
  }
  if (DATA.hackathons.length === 1) {
    return "Below is a hardware build from a local hackathon—quick prototypes, real constraints, and a lot of learning in a short window.";
  }
  return `During my time in university, I attended ${DATA.hackathons.length}+ hackathons. People from around the country would come together and build incredible things in 2-3 days.`;
}

export default function HackathonsSection() {
  return (
    <section id="hackathons" className="overflow-hidden">
      <div className="flex min-h-0 flex-col gap-y-8 w-full">
        <PortfolioSectionTitle
          title="Hackathons"
          subtitle={hackathonsSubtitle()}
        />
        <Timeline>
          {DATA.hackathons.map((hackathon) => (
            <TimelineItem key={hackathon.title + hackathon.dates} className="w-full flex items-start justify-between gap-10">
              <TimelineConnectItem className="flex items-start justify-center">
                {hackathon.image ? (
                  <img
                    src={hackathon.image}
                    alt={hackathon.title}
                    className="size-10 bg-card z-10 shrink-0 overflow-hidden p-1 border rounded-full shadow ring-2 ring-border object-contain flex-none"
                  />
                ) : (
                  <div className="size-10 bg-card z-10 shrink-0 overflow-hidden p-1 border rounded-full shadow ring-2 ring-border flex-none" />
                )}
              </TimelineConnectItem>
              <div className="flex flex-1 flex-col justify-start gap-2 min-w-0">
                {hackathon.dates && (
                  <time className="text-xs text-muted-foreground">{hackathon.dates}</time>
                )}
                {hackathon.title && (
                  <h3 className="font-semibold leading-none">{hackathon.title}</h3>
                )}
                {hackathon.location && (
                  <p className="text-sm text-muted-foreground">{hackathon.location}</p>
                )}
                {hackathon.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed wrap-break-word">
                    {hackathon.description}
                  </p>
                )}
                {hackathon.screenshots && hackathon.screenshots.length > 0 && (
                  <div className="mt-2 grid w-full max-w-lg grid-cols-1 items-stretch gap-3 sm:grid-cols-2">
                    {hackathon.screenshots.map((src, idx) => (
                      <div
                        key={src}
                        className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted/20"
                      >
                        <img
                          src={src}
                          alt={`${hackathon.title} — image ${idx + 1}`}
                          className="size-full object-cover object-center"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {hackathon.links && hackathon.links.length > 0 && (
                  <div className="mt-1 flex flex-row flex-wrap items-start gap-2">
                    {hackathon.links.map((link, idx) => (
                      <Link
                        href={link.href}
                        key={idx}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Badge className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground">
                          {link.icon}
                          {link.title}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </section>
  );
}
