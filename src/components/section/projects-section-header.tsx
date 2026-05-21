"use client";

import { Confetti } from "@/components/magicui/confetti";

export function ProjectsSectionHeader() {
  return (
    <div className="relative flex min-h-[160px] w-full flex-col items-center justify-center gap-y-3 py-6">
      <Confetti
        className="pointer-events-none absolute inset-0 z-0 h-full w-full max-w-3xl"
        manualstart={false}
      />
      <div className="relative z-10 flex flex-col items-center gap-y-3 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Check out my latest work
        </h2>
        <p className="max-w-xl text-balance text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
          I&apos;ve worked on a variety of projects, from simple websites to
          complex web applications. Here are a few of my favorites.
        </p>
      </div>
    </div>
  );
}
