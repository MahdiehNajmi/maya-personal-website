import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import { ProjectsSectionHeader } from "@/components/section/projects-section-header";
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

export default function ProjectsSection() {
  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-8">
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              <span className="text-background text-sm font-medium">
                My Projects
              </span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <ProjectsSectionHeader />
        </div>
        <div className="mx-auto grid max-w-[800px] auto-rows-auto grid-cols-1 items-start gap-3 sm:grid-cols-2">
          {DATA.projects.map((project, id) => (
            <BlurFade
              key={project.title}
              delay={BLUR_FADE_DELAY * 12 + id * 0.05}
            >
              <ProjectCard
                href={project.href}
                key={project.title}
                title={project.title}
                description={project.description}
                dates={project.dates}
                tags={project.technologies}
                image={project.image}
                video={
                  "video" in project &&
                  typeof (project as { video?: string }).video === "string"
                    ? (project as { video: string }).video
                    : undefined
                }
                links={project.links}
                demo={"demo" in project ? project.demo : undefined}
              />
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={BLUR_FADE_DELAY * 14}>
          <div className="mx-auto flex w-full max-w-[800px] flex-col gap-y-6">
            <div className="flex items-center w-full">
              <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
              <div className="z-10 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-[length:200%_auto] px-4 py-1.5 shadow-lg shadow-purple-500/30 ring-1 ring-white/20 animate-gradient">
                <History className="size-3.5 text-white" aria-hidden />
                <span className="text-sm font-semibold tracking-wide text-white">
                  {DATA.previousProjects.heading}
                </span>
              </div>
              <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
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
      </div>
    </section>
  );
}
