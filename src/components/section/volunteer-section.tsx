/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { Card, CardContent } from "@/components/ui/card";
import { HeartHandshake } from "lucide-react";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";

const BLUR_FADE_DELAY = 0.04;

function VolunteerTile({
  organization,
  role,
  badge,
  logoUrl,
}: {
  organization: string;
  role?: string;
  badge: string;
  logoUrl?: string;
}) {
  return (
    <article
      className={cn(
        "group/vol flex h-full items-center gap-3 rounded-lg border border-border/60",
        "bg-background/50 p-3 sm:p-3.5",
        "transition-colors duration-200 hover:border-rose-400/30 hover:bg-muted/30",
      )}
    >
      <div
        className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-white shadow-sm ring-2 ring-border/80 sm:size-16"
        aria-hidden
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt=""
            className="size-full object-cover object-center"
          />
        ) : (
          <span className="bg-gradient-to-br from-rose-500 to-purple-500 bg-clip-text text-sm font-bold tracking-tight text-transparent">
            {badge}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="text-sm font-semibold leading-snug text-foreground">
          {organization}
        </h3>
        {role ? (
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {role}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default function VolunteerSection() {
  return (
    <section id="volunteer" className="flex min-h-0 flex-col gap-y-4">
      <BlurFade delay={BLUR_FADE_DELAY * 14.5}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <HeartHandshake
              className="size-5 shrink-0 text-rose-500"
              strokeWidth={2}
              aria-hidden
            />
            <h2 className="text-xl font-bold">Volunteering</h2>
          </div>
          <p className="text-sm text-muted-foreground">Community involvement</p>
        </div>
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY * 15}>
        <Card className="relative w-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
          <CardContent className="relative z-10 p-3 sm:p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {DATA.volunteer.map((v) => (
                <VolunteerTile
                  key={v.organization}
                  organization={v.organization}
                  role={v.role}
                  badge={v.badge}
                  logoUrl={"logoUrl" in v ? v.logoUrl : undefined}
                />
              ))}
            </div>
          </CardContent>
          <BorderBeam
            duration={8}
            size={400}
            className="from-transparent via-rose-400 to-transparent"
          />
          <BorderBeam
            duration={8}
            delay={4}
            size={400}
            borderWidth={2}
            className="from-transparent via-purple-400/80 to-transparent"
          />
        </Card>
      </BlurFade>
    </section>
  );
}
