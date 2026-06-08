import BlurFade from "@/components/magicui/blur-fade";
import { PortfolioSectionTitle } from "@/components/site/portfolio-section-title";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.04;

type PreviousProjectItem = {
  title: string;
  description?: string;
  technologies: readonly string[];
};

function PreviousProjectCard({ project }: { project: PreviousProjectItem }) {
  return (
    <div className="portfolio-surface-card flex h-full flex-col gap-2 p-4">
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
          <PortfolioSectionTitle
            title={DATA.previousProjects.heading}
            subtitle={DATA.previousProjects.intro}
          />

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
