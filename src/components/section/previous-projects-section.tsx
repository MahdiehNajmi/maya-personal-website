import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import { History } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

type PreviousProjectItem = {
  title: string;
  description?: string;
  technologies: readonly string[];
};

function PreviousProjectCard({ project }: { project: PreviousProjectItem }) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-xl border border-border bg-card p-4">
      <h4 className="text-sm font-semibold leading-snug">{project.title}</h4>
      {project.description ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {project.description}
        </p>
      ) : null}
      <div className="mt-auto flex flex-wrap gap-1 pt-1">
        {project.technologies.map((tech) => (
          <Badge
            key={tech}
            className="h-6 w-fit border border-border px-2 text-[11px] font-medium"
            variant="outline"
          >
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default function PreviousProjectsSection() {
  return (
    <section id="previous-projects">
      <BlurFade delay={BLUR_FADE_DELAY * 13}>
        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-y-6">
          <div className="flex w-full items-center">
            <div className="h-px flex-1 bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="z-10 inline-flex animate-gradient items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-[length:200%_auto] px-4 py-1.5 shadow-lg shadow-purple-500/30 ring-1 ring-white/20">
              <History className="size-3.5 text-white" aria-hidden />
              <span className="text-sm font-semibold tracking-wide text-white">
                {DATA.previousProjects.heading}
              </span>
            </div>
            <div className="h-px flex-1 bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>

          <p className="text-center text-sm text-muted-foreground md:text-base">
            {DATA.previousProjects.intro}
          </p>

          <div className="flex flex-col gap-3">
            <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-3 sm:grid-cols-2">
              {DATA.previousProjects.erp.map((project) => (
                <PreviousProjectCard key={project.title} project={project} />
              ))}
            </div>
            <p className="text-xs italic leading-relaxed text-muted-foreground">
              {DATA.previousProjects.erpNote}
            </p>
          </div>

          <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-3">
            {DATA.previousProjects.standalone.map((project) => (
              <PreviousProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      </BlurFade>
    </section>
  );
}
