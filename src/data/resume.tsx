import { Icons } from "@/components/icons";
import { PORTFOLIO_BASE, portfolioPath } from "@/lib/paths";
import { BookOpen, HomeIcon, LayoutGrid, NotebookIcon } from "lucide-react";
import type { ReactNode } from "react";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://maya-personal-website.vercel.app");

const LIVE_SITE = "https://maya-personal-website.vercel.app";

type HackathonItem = {
  title: string;
  dates: string;
  location: string;
  description: string;
  image: string;
  /** Optional gallery below the description (e.g. build photos). */
  screenshots?: readonly string[];
  mlh?: string;
  win?: string;
  icon?: string;
  links: Array<{ title: string; icon: ReactNode; href: string }>;
};

export const DATA = {
  name: "Maya",
  initials: "M",
  url: siteUrl,
  location: "",
  locationLink: "https://www.google.com/maps",
  description:
    "DATA ANALYST | AI DATA ENGINEER | FULL-STACK DEVELOPER",
  summary:
    "I'm passionate about cleaning massive, messy data and building visualized dashboards for better decision-making. I'm also a full-stack developer with a strong interest in AI-driven applications.",
  avatarUrl: "/me.png",
  skillLabels: [
    "React",
    "JavaScript",
    "Material UI",
    "HTML/CSS",
    "Node.js",
    "Express.js",
    "FastAPI",
    "Python",
    "Oracle",
    "SQL Server",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "IAM",
    "SageMaker AI",
    "Lambda",
    "Step Functions",
    "EventBridge",
    "AWS Glue",
    "Athena",
    "Power BI",
    "Postman",
    "Git / GitHub",
    "Docker",
    "Jupyter Notebook",
  ] as const,
  navbar: [
    { href: "/", icon: HomeIcon, label: "Personal site" },
    { href: PORTFOLIO_BASE, icon: LayoutGrid, label: "Portfolio" },
    { href: portfolioPath("/blog"), icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "mnajmi@mun.ca",
    tel: "",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/MahdiehNajmi/maya-personal-website",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/mahdiehnajmi",
        icon: Icons.linkedin,
        navbar: false,
      },
      X: {
        name: "X",
        url: "https://github.com/MahdiehNajmi",
        icon: Icons.x,
        navbar: false,
      },
      Youtube: {
        name: "Youtube",
        url: "https://www.youtube.com/",
        icon: Icons.youtube,
        navbar: false,
      },
      email: {
        name: "Send Email",
        url: "mailto:mnajmi@mun.ca",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  education: [
    {
      school: "Memorial University",
      href: "https://www.mun.ca/",
      degree: "Master's Degree in Computer Engineering",
      logoUrl: "/logos/memorial.png",
      start: "",
      end: "",
    },
    {
      school: "Qazvin Azad University",
      href: "https://en.wikipedia.org/wiki/Islamic_Azad_University,_Qazvin_Branch",
      degree: "Master's Degree in EMBA",
      logoUrl: "/logos/islamic-azad-university.png",
      start: "",
      end: "",
    },
    {
      school: "Arak Azad University",
      href: "https://en.wikipedia.org/wiki/Islamic_Azad_University,_Arak_Branch",
      degree: "Bachelor's Degree in Software Engineering",
      logoUrl: "/logos/islamic-azad-university.png",
      start: "",
      end: "",
    },
  ],

  certifications: [
    {
      title: "Professional Skill Development Program",
      issuer: "Memorial University",
      logoUrl: "/logos/memorial.png",
    },
    {
      title: "AI for Data Engineering",
      issuer: "techNL",
      logoUrl: "/logos/technl.png",
    },
    {
      title: "Artificial Intelligence Fundamentals",
      issuer: "IBM",
      logoUrl: "/logos/ibm.png",
    },
  ],

  projects: [
    {
      title: "Personal Website & Portfolio",
      href: portfolioPath("/blog/personal-website-portfolio"),
      dates: "2025 – Present",
      active: true,
      description:
        "**Problem:** I did not have a dedicated platform to showcase my work, skills, and experience in one place.\n\n**Approach:** I built a personal site with portfolio case studies, contact flow, Neon Auth comments (Google/GitHub) with private image uploads, and a Gemini-powered AI assistant.\n\n**Results:** Production site on Vercel with social login, visitor feedback, and MDX project write-ups.\n\n[Case study with screenshots →](/portfolio/blog/personal-website-portfolio)",
      technologies: [
        "Next.js",
        "TypeScript",
        "React",
        "Vercel",
        "Neon Postgres",
        "Neon Auth",
        "Vercel Blob",
        "Google Gemini",
        "Drizzle ORM",
        "Cursor",
      ],
      links: [
        {
          type: "Case study",
          href: portfolioPath("/blog/personal-website-portfolio"),
          icon: <BookOpen className="size-3" />,
        },
        {
          type: "Live site",
          href: LIVE_SITE,
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "GitHub",
          href: "https://github.com/MahdiehNajmi/maya-personal-website",
          icon: <Icons.github className="size-3" />,
        },
        {
          type: "Comments",
          href: `${LIVE_SITE}/comments`,
          icon: <NotebookIcon className="size-3" />,
        },
      ],
      image: "/projects/personal-website/homepage.png",
      demo: {
        label: "View Live Site",
        href: LIVE_SITE,
      },
    },
    {
      title: "ER Room — Hospital Wait-Time Tracker",
      href: portfolioPath("/blog/er-room-hospital-wait-time-tracker"),
      dates: "2026",
      active: true,
      description:
        "**Problem:** Patients visit ERs blind to live wait times; capacity is opaque, so crowding and underuse happen side by side.\n\n**Approach:** Full-stack app where facilities own their data; patients get a ranked, location-aware list sorted by average wait, with waitlists that update as they choose a site, plus history dashboards.\n\n**Results:** Working prototype with dynamic re-ranking, real-time patient decisions, and admin visibility into visits.\n\n[Case study with screenshots →](/portfolio/blog/er-room-hospital-wait-time-tracker)",
      technologies: [
        "React",
        "Material UI",
        "Node.js",
        "Express.js",
        "JavaScript",
        "PostgreSQL",
      ],
      links: [
        {
          type: "Case study",
          href: portfolioPath("/blog/er-room-hospital-wait-time-tracker"),
          icon: <BookOpen className="size-3" />,
        },
      ],
      image: "/projects/er-room/patient-dashboard.png",
    },
    {
      title: "AWS AI for Data Engineering — House Price Prediction",
      href: portfolioPath("/blog/aws-house-price-prediction"),
      dates: "2026",
      active: true,
      description:
        "**Problem:** Accurate house-price models need large datasets moved through reproducible ML pipelines—manual notebooks alone do not scale.\n\n**Approach:** Kaggle-based end-to-end pipeline on AWS: SageMaker notebooks, Lambda and Step Functions orchestration, EventBridge triggers, IAM-scoped access, S3 medallion layers, CloudWatch and RDS where needed, with Power BI for predictions, feature importance, and trends.\n\n**Results:** Automated cloud-native pipeline from ingest through training and governed access, with stakeholder dashboards in Power BI.\n\n[Case study with diagrams →](/portfolio/blog/aws-house-price-prediction)",
      technologies: [
        "Power BI",
        "Amazon SageMaker",
        "AWS Lambda",
        "AWS Step Functions",
        "Amazon EventBridge",
        "AWS IAM",
        "Amazon S3",
        "Amazon CloudWatch",
        "Amazon RDS",
        "Python",
      ],
      links: [
        {
          type: "Case study",
          href: portfolioPath("/blog/aws-house-price-prediction"),
          icon: <BookOpen className="size-3" />,
        },
      ],
      image: "/projects/house-price-aws/architecture-medallion.png",
    },
    {
      title: "Anti-Spoof Face Detection",
      href: portfolioPath("/blog/anti-spoof-face-detection"),
      dates: "2026",
      active: true,
      description:
        "**Problem:** Face recognition is exposed to spoofing via prints, replays, and masks, weakening secure auth and monitoring.\n\n**Approach:** Trained on 65,000+ images (~9 GB) of real vs. fake faces. Two-phase pipeline: YOLOv11 for live face localization, then a hybrid VGG16 + ResNet50 classifier for spoof detection—trained on Google Colab GPUs.\n\n**Results:** 99.8% spoof-classification accuracy across diverse attack types.\n\n[Case study →](/portfolio/blog/anti-spoof-face-detection)",
      technologies: [
        "TensorFlow",
        "YOLOv11",
        "VGG16",
        "ResNet50",
        "Pandas",
        "NumPy",
        "scikit-learn",
        "Google Colab",
        "Jupyter Notebook",
        "JavaScript",
        "GitHub",
      ],
      links: [
        {
          type: "Case study",
          href: portfolioPath("/blog/anti-spoof-face-detection"),
          icon: <BookOpen className="size-3" />,
        },
      ],
      image: "/projects/anti-spoof/antispoof-vision-demo.png",
      demo: {
        label: "Try The Live Demo",
        href: "https://eian-irca.github.io/web-app-v5_CelebA_Spoof/",
      },
    },
    {
      title: "NewcomerNavigatorNL — Settlement Support Platform",
      href: portfolioPath("/blog/newcomer-navigator-nl"),
      dates: "2025 – Present",
      active: true,
      description:
        "**Problem:** Newcomers to NL struggle to find reliable, centralized information on settlement, housing, health care, and community resources.\n\n**Approach:** Backend API with **FastAPI** and **MongoDB**, **Pydantic** + **Beanie** for validation and ODM, **Postman** for API testing—structured to support a future newcomer-facing frontend.\n\n**Results:** Actively developed API with validated settlement-resource endpoints and a scalable layout for the live product experience.\n\n[Case study →](/portfolio/blog/newcomer-navigator-nl)",
      technologies: [
        "FastAPI",
        "Python",
        "MongoDB",
        "Pydantic",
        "Beanie",
        "Postman",
      ],
      links: [
        {
          type: "Website",
          href: "https://newcomernavigatornl.ca/en",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Case study",
          href: portfolioPath("/blog/newcomer-navigator-nl"),
          icon: <BookOpen className="size-3" />,
        },
      ],
      image: "/projects/newcomer-navigator/homepage.png",
    },
  ],
  hackathons: [
    {
      title: "Hardware Hackathon — Just Do It!",
      dates: "2025",
      location: "Project: TennisBall Collector",
      description:
        "Small-scale mobile robot built around a Raspberry Pi with motor control, power management, and sensing—prototype hardware to detect and drive toward a tennis ball, with demo branding for NL community tech events.",
      image: "/projects/hackathons/tennis-ball/robot-prototype.png",
      screenshots: [
        "/projects/hackathons/tennis-ball/robot-prototype.png",
        "/projects/hackathons/tennis-ball/poster-screen.png",
      ],
      links: [],
    },
  ] as HackathonItem[],
};
