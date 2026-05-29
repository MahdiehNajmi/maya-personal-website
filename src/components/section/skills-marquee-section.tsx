"use client";

import { Marquee } from "@/components/magicui/marquee";
import { BorderBeam } from "@/components/ui/border-beam";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function SkillChip({ label }: { label: string }) {
  return (
    <figure
      className={cn(
        "relative mx-auto flex w-full max-w-[11.5rem] cursor-default items-center justify-center",
        "rounded-lg border border-border/60 bg-secondary/60 px-3 py-2 text-center",
        "shadow-sm ring-1 ring-primary/10 backdrop-blur-sm",
        "transition-colors duration-200 hover:border-primary/30 hover:bg-secondary hover:ring-primary/20",
      )}
    >
      <figcaption className="text-center text-sm font-medium tracking-tight text-foreground/90">
        {label}
      </figcaption>
    </figure>
  );
}

type SkillsMarqueeSectionProps = {
  skills: readonly string[];
};

export function SkillsMarqueeSection({ skills }: SkillsMarqueeSectionProps) {
  const list = [...skills];
  const mid = Math.ceil(list.length / 2);
  const firstCol = list.slice(0, mid);
  const secondCol = list.slice(mid);

  return (
    <Card className="relative w-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      <CardContent className="relative z-10 p-3 sm:p-4">
        <div
          className={cn(
            "relative overflow-hidden rounded-lg",
            "border border-border/50 bg-background",
            "ring-1 ring-inset ring-primary/5",
          )}
        >
          <div className="relative mx-auto flex h-[min(28rem,62vh)] w-fit max-w-full flex-row items-stretch justify-center gap-3 px-3 sm:gap-4 sm:px-4">
            <Marquee
              pauseOnHover
              vertical
              className="w-[11.5rem] shrink-0 [--duration:32s]"
            >
              {firstCol.map((label, i) => (
                <SkillChip key={`a-${i}-${label}`} label={label} />
              ))}
            </Marquee>
            <Marquee
              reverse
              pauseOnHover
              vertical
              className="w-[11.5rem] shrink-0 [--duration:36s]"
            >
              {secondCol.map((label, i) => (
                <SkillChip key={`b-${i}-${label}`} label={label} />
              ))}
            </Marquee>
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/4 bg-linear-to-b from-background to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/4 bg-linear-to-t from-background to-transparent"
            aria-hidden
          />
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
  );
}
