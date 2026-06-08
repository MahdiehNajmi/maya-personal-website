import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { PortfolioSectionTitle } from "@/components/site/portfolio-section-title";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.04;

export default function ProjectsSection() {
  return (
    <section id="projects">
      <div className="flex min-h-0 flex-col gap-y-8">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <PortfolioSectionTitle
            title="My Projects"
            subtitle="I've worked on a variety of projects, from simple websites to complex web applications. Here are a few of my favorites."
          />
        </BlurFade>
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
