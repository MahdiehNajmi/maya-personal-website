"use client";

import { BorderBeam } from "@/registry/magicui/border-beam";
import { Marquee } from "@/components/magicui/marquee";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function SkillChip({ label }: { label: string }) {
  return (
    <figure
      className={cn(
        "relative mx-auto flex w-full max-w-[12.5rem] cursor-default items-center justify-center overflow-hidden rounded-xl border px-4 py-3 text-center",
        "border-border/80 bg-card/80 shadow-sm ring-1 ring-border/20",
        "dark:bg-card/40",
      )}
    >
      <figcaption className="text-center text-sm font-semibold tracking-tight text-foreground">
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
    <div className="flex min-h-0 flex-col gap-y-4">
      <Card className="relative w-full overflow-hidden border-border/60 bg-muted/10 shadow-sm">
        <CardContent className="relative z-10 p-3 pt-4">
          <div className="relative overflow-hidden rounded-lg bg-[#1a365d] py-1">
            <div className="relative mx-auto flex h-[min(32rem,70vh)] w-fit max-w-full flex-row items-stretch justify-center gap-4 px-4">
              <Marquee
                pauseOnHover
                vertical
                className="[--duration:32s] w-[13rem] shrink-0"
              >
                {firstCol.map((label, i) => (
                  <SkillChip key={`a-${i}-${label}`} label={label} />
                ))}
              </Marquee>
              <Marquee
                reverse
                pauseOnHover
                vertical
                className="[--duration:36s] w-[13rem] shrink-0"
              >
                {secondCol.map((label, i) => (
                  <SkillChip key={`b-${i}-${label}`} label={label} />
                ))}
              </Marquee>
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/5 bg-linear-to-b from-[#1a365d] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/5 bg-linear-to-t from-[#1a365d] to-transparent" />
          </div>
        </CardContent>
        <BorderBeam
          duration={6}
          size={400}
          className="from-transparent via-red-500 to-transparent"
        />
        <BorderBeam
          duration={6}
          delay={3}
          size={400}
          borderWidth={2}
          className="from-transparent via-blue-500 to-transparent"
        />
      </Card>
    </div>
  );
}
