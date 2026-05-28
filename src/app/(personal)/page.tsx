import { ContactActions } from "@/components/personal/contact-actions";
import { PERSONAL } from "@/data/personal";
import Image from "next/image";

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

export default function PersonalHomePage() {
  return (
    <main>
      <section id="home" className="hero" aria-label="Introduction">
        <div className="hero-card">
          <Image
            className="profile-photo"
            src={PERSONAL.profileImage}
            width={200}
            height={200}
            alt="Portrait of Maya"
            priority
          />
          <div className="hero-copy">
            <h1 className="typing-line" id="typing-root">
              <span id="typing-output" />
              <span
                id="typing-hi-icon"
                className="typing-hi-icon"
                role="img"
                aria-hidden="true"
                aria-label="Waving hello"
              >
                👋
              </span>
              <span className="typing-cursor" id="typing-cursor">
                |
              </span>
            </h1>
            <p className="intro">{PERSONAL.intro}</p>
          </div>
        </div>
      </section>

      <section id="about" className="journey" aria-labelledby="about-heading">
        <div className="journey-wrap">
          <h2 id="about-heading" className="journey-title">
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

      <section
        id="contact"
        className="contact"
        aria-labelledby="contact-heading"
      >
        <div className="contact-wrap">
          <h2 id="contact-heading" className="journey-title">
            {PERSONAL.contact.heading}
          </h2>
          <div className="contact-card">
            <p className="contact-lead">{PERSONAL.contact.lead}</p>
            <ContactActions />
          </div>
        </div>
      </section>
    </main>
  );
}
