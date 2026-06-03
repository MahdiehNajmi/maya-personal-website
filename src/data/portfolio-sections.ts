export type PortfolioSection = {
  id: string;
  label: string;
};

export const PORTFOLIO_SECTIONS: PortfolioSection[] = [
  { id: "projects", label: "Projects" },
  { id: "hackathons", label: "Hackathons" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certificates" },
  { id: "education", label: "Education" },
  { id: "volunteer", label: "Volunteer" },
  { id: "contact", label: "Contact" },
];
