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
        <h2 id="about-heading" className="journey-title journey-title--shimmer">
          {PERSONAL.about.heading}
        </h2>
        <div className="journey-copy">
          {PERSONAL.about.paragraphs.map((para, i) => (
            <JourneyParagraph
              key={i}
              text={para.text}
              keywords={para.keywords}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
