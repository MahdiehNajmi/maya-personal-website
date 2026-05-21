/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Award } from "lucide-react";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.04;

export default function CertificationsSection() {
  return (
    <section id="certifications" className="flex min-h-0 flex-col gap-y-6">
      <BlurFade delay={BLUR_FADE_DELAY * 10.5}>
        <div className="relative inline-flex min-h-[2.5rem] items-center">
          <Award
            className="pointer-events-none absolute left-0 top-1/2 z-0 size-10 -translate-x-1 -translate-y-1/2 text-orange-500/22 dark:text-orange-400/28 sm:size-10"
            strokeWidth={1.5}
            aria-hidden
          />
          <h2 className="relative z-10 pl-14 text-xl font-bold tracking-tight text-orange-600 dark:text-orange-400 sm:pl-16">
            Certifications
          </h2>
        </div>
        <p className="mt-2 text-sm font-semibold tracking-wide text-muted-foreground">
          Professional Development
        </p>
      </BlurFade>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DATA.certifications.map((c, index) => (
          <BlurFade
            key={c.title}
            delay={BLUR_FADE_DELAY * 11 + index * 0.06}
          >
            <Card className="group/cert relative h-full overflow-hidden border border-zinc-800/70 bg-zinc-900 font-medium text-gray-300 shadow-md shadow-black/30 transition-shadow duration-300 hover:border-zinc-600/80 hover:shadow-lg hover:shadow-black/35">
              <div
                className="pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-0 transition-opacity duration-300 group-hover/cert:opacity-100"
                aria-hidden
              >
                <div className="absolute -left-1/2 top-0 h-full w-[55%] -translate-x-full rotate-12 bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover/cert:translate-x-[240%]" />
              </div>
              <CardHeader className="relative z-10 gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-600/70 bg-white ring-2 ring-zinc-800/50"
                    aria-hidden
                  >
                    <img
                      src={c.logoUrl}
                      alt=""
                      width={56}
                      height={56}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="text-sm font-semibold leading-snug tracking-wide text-gray-300">
                      {c.title}
                    </CardTitle>
                    <CardDescription className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      {c.issuer}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
