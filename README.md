# Maya — personal website + portfolio (single app)

## Links (use these)

| | URL |
|---|-----|
| **Production site** | **https://maya-personal-website.vercel.app** |
| Portfolio | https://maya-personal-website.vercel.app/portfolio |
| GitHub | https://github.com/MahdiehNajmi/maya-personal-website |
| Vercel project | https://vercel.com/mahdiehnajmis-projects/maya-personal-website |

> Vercel also shows URLs like `maya-personal-website-p0q2ztmns-….vercel.app` in the dashboard. Those are **per-deployment preview IDs** and cannot be renamed. Your public site is always **maya-personal-website.vercel.app** (assigned to production).

One [Next.js](https://nextjs.org) deployment with:

| Route | Content |
|-------|---------|
| `/` | Personal landing (hero, about, contact, feedback, dock nav) |
| `/portfolio` | Interactive portfolio (projects, skills, certifications, hackathons) |
| `/portfolio/blog` | Project case studies (MDX) |
| `/portfolio/lets-discuss` | Contact form |
| `/api/contact` | Contact API (Resend or mailto fallback) |

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the personal site and [http://localhost:3000/portfolio](http://localhost:3000/portfolio) for the portfolio.

## Content

- **Personal site copy:** [`src/data/personal.ts`](src/data/personal.ts)
- **Portfolio copy & projects:** [`src/data/resume.tsx`](src/data/resume.tsx) and [`content/*.mdx`](content/)

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local` and set values as needed.

## Deploy to Vercel (one project)

1. Push this repo to GitHub and import it in [Vercel](https://vercel.com).
2. Framework preset: **Next.js**; root directory: `.`
3. Optional env vars: `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL`
4. Point your custom domain (e.g. `maya-personal-website.vercel.app`) to this project.
5. After cutover, you can retire separate `maya-portfolio-template` deployments.

## Project structure

```text
src/app/(personal)/     # Personal landing at /
src/app/portfolio/      # Portfolio UI at /portfolio
src/data/personal.ts    # Personal-site content
src/data/resume.tsx     # Portfolio content
src/styles/personal.css # Personal-site styles (from static template)
```

Built from the live [maya-personal-website](https://maya-personal-website.vercel.app) template and the [dillionverma/portfolio](https://github.com/dillionverma/portfolio) Next.js portfolio template.
