"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { PERSONAL } from "@/data/personal";

function JourneyParagraph({
  text,
  keywords,
}: {
  text: string;
  keywords: readonly string[];
}) {
  if (!keywords.length) {
    return <p className="journey-para">{text}</p>;
  }

  let content: React.ReactNode = text;
  for (const kw of keywords) {
    const idx = text.indexOf(kw);
    if (idx === -1) continue;
    content = (
      <>
        {text.slice(0, idx)}
        <span className="journey-kw">{kw}</span>
        {text.slice(idx + kw.length)}
      </>
    );
    break;
  }

  return <p className="journey-para">{content}</p>;
}

export function AboutSection() {
  return (
    <section id="about" className="journey" aria-labelledby="about-heading">
      <div className="journey-wrap">
        <div className="journey-card">
          <BlurFade delay={0} inView>
            <h2 id="about-heading" className="journey-title">
              {PERSONAL.about.heading}
            </h2>
          </BlurFade>
          <div className="journey-copy">
            {PERSONAL.about.paragraphs.map((para, i) => (
              <BlurFade key={i} delay={0.06 * (i + 1)} inView>
                <JourneyParagraph text={para.text} keywords={para.keywords} />
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
