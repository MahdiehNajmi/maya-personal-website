import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { DATA } from "@/data/resume";
import { ProjectsSectionHeader } from "@/components/section/projects-section-header";

const BLUR_FADE_DELAY = 0.04;

export default function ProjectsSection() {
  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-8">
        <div className="flex flex-col items-center justify-center gap-y-4">
          <div className="flex w-full items-center">
            <div className="h-px flex-1 bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="z-10 rounded-xl border bg-primary px-4 py-1">
              <span className="text-sm font-medium text-background">
                My Projects
              </span>
            </div>
            <div className="h-px flex-1 bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <ProjectsSectionHeader />
        </div>
        <div className="grid w-full grid-cols-1 items-start gap-5">
          {DATA.projects.map((project, id) => (
            <BlurFade
              key={project.title}
              delay={BLUR_FADE_DELAY * 12 + id * 0.05}
            >
              <ProjectCard
                href={project.href}
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
                layout="row"
                compact={false}
              />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
