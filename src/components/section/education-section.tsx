"use client";

/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { DATA } from "@/data/resume";
import { ChevronDown } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

function EducationLogo({ logoUrl }: { logoUrl?: string }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt=""
        className="size-8 shrink-0 overflow-hidden rounded-full border border-border bg-secondary object-contain p-0.5 shadow-sm ring-2 ring-border/80"
      />
    );
  }
  return (
    <div className="size-8 shrink-0 rounded-full border border-border bg-secondary shadow-sm ring-2 ring-border/80" />
  );
}

export default function EducationSection() {
  return (
    <section id="education">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={BLUR_FADE_DELAY * 7}>
          <h2 className="text-xl font-bold">Education</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 8}>
          <Card className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
            <Accordion
              type="single"
              collapsible
              className="w-full"
            >
              {DATA.education.map((education, index) => (
                <AccordionItem
                  key={education.school}
                  value={`education-${index}`}
                  className="border-border px-0 last:border-b-0"
                >
                  <AccordionTrigger className="min-h-0 gap-2.5 px-3 py-2.5 hover:bg-muted/35 hover:no-underline sm:px-4">
                    <EducationLogo logoUrl={education.logoUrl} />
                    <span className="min-w-0 flex-1 text-left text-sm font-semibold leading-tight">
                      {education.degree}
                    </span>
                    <ChevronDown
                      className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-200"
                      aria-hidden
                    />
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-2.5 pt-0 sm:px-4 sm:pb-3">
                    <div className="flex items-center justify-between gap-3 pl-10 sm:pl-10">
                      <span className="min-w-0 truncate text-sm font-medium text-muted-foreground">
                        {education.school}
                      </span>
                      {(education.start || education.end) && (
                        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                          {education.start}
                          {education.start && education.end ? " - " : ""}
                          {education.end}
                        </span>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </BlurFade>
      </div>
    </section>
  );
}
