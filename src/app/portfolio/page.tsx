import BlurFade from "@/components/magicui/blur-fade";
import { PortfolioSectionNav } from "@/components/portfolio/portfolio-section-nav";
import ContactSection from "@/components/section/contact-section";
import HackathonsSection from "@/components/section/hackathons-section";
import ProjectsSection from "@/components/section/projects-section";
import PreviousProjectsSection from "@/components/section/previous-projects-section";
import CertificationsSection from "@/components/section/certifications-section";
import EducationSection from "@/components/section/education-section";
import VolunteerSection from "@/components/section/volunteer-section";
import { SkillsTableSection } from "@/components/section/skills-table-section";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  return (
    <div className="portfolio-page-grid">
      <PortfolioSectionNav />
      <main className="portfolio-page-main relative flex min-h-dvh min-w-0 flex-col gap-14">
        <BlurFade delay={BLUR_FADE_DELAY * 11}>
          <ProjectsSection />
        </BlurFade>
        <PreviousProjectsSection />
        <BlurFade delay={BLUR_FADE_DELAY * 13}>
          <HackathonsSection />
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 9}>
          <SkillsTableSection />
        </BlurFade>
        <CertificationsSection />
        <EducationSection />
        <BlurFade delay={BLUR_FADE_DELAY * 14}>
          <VolunteerSection />
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 16}>
          <ContactSection />
        </BlurFade>
      </main>
    </div>
  );
}
