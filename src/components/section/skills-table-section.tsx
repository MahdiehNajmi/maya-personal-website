import BlurFade from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import {
  Cloud,
  Database,
  Layers2,
  Monitor,
  Server,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

const CATEGORY_ICONS: Record<
  (typeof DATA.skillCategories)[number]["icon"],
  LucideIcon
> = {
  monitor: Monitor,
  server: Server,
  database: Database,
  cloud: Cloud,
  wrench: Wrench,
};

function SkillCategoryTile({
  name,
  icon,
  skills,
}: {
  name: string;
  icon: (typeof DATA.skillCategories)[number]["icon"];
  skills: readonly string[];
}) {
  const Icon = CATEGORY_ICONS[icon];

  return (
    <article
      className={cn(
        "flex h-full flex-col gap-3 rounded-lg border border-border/60",
        "bg-background/50 p-4 transition-colors duration-200",
        "hover:border-primary/25 hover:bg-muted/30",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary/10 shadow-sm ring-2 ring-border/80"
          aria-hidden
        >
          <Icon className="size-5 text-primary" strokeWidth={2} />
        </div>
        <h3 className="text-sm font-semibold leading-snug text-foreground">
          {name}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge
            key={skill}
            variant="outline"
            className="rounded-md border-border/70 bg-background/80 px-2.5 py-1 text-xs font-bold text-foreground transition-colors hover:border-primary/30 hover:bg-muted/40"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </article>
  );
}

export function SkillsTableSection() {
  return (
    <section id="skills" className="flex min-h-0 flex-col gap-y-4 scroll-mt-28">
      <BlurFade delay={BLUR_FADE_DELAY * 9}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Layers2
              className="size-5 shrink-0 text-primary"
              strokeWidth={2}
              aria-hidden
            />
            <h2 className="text-xl font-bold">Skills</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Technologies and tools I work with
          </p>
        </div>
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY * 9.5}>
        <Card className="relative w-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
          <CardContent className="relative z-10 p-3 sm:p-4">
            <div className="grid gap-3 md:grid-cols-2">
              {DATA.skillCategories.map((category) => (
                <SkillCategoryTile
                  key={category.name}
                  name={category.name}
                  icon={category.icon}
                  skills={category.skills}
                />
              ))}
            </div>
          </CardContent>
          <BorderBeam
            size={120}
            duration={10}
            delay={2}
            colorFrom="var(--primary)"
            colorTo="var(--chart-2)"
          />
        </Card>
      </BlurFade>
    </section>
  );
}
