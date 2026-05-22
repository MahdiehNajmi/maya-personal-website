import { PERSONAL } from "@/data/personal";
import Image from "next/image";
import Link from "next/link";

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
  const feedbackMailto = `mailto:${PERSONAL.email}?subject=${encodeURIComponent(PERSONAL.feedback.mailSubject)}`;

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
            <p className="hero-actions">
              <Link className="rb-btn rb-btn--default" href="/comments">
                {PERSONAL.comments.linkLabel}
              </Link>
            </p>
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
        className="section section-muted"
        aria-labelledby="contact-heading"
      >
        <h2 id="contact-heading">{PERSONAL.contact.heading}</h2>
        <p className="section-lead">{PERSONAL.contact.lead}</p>
        <a className="rb-btn rb-btn--default" href={`mailto:${PERSONAL.email}`}>
          {PERSONAL.contact.buttonLabel}
        </a>
      </section>

      <section id="feedback" className="section" aria-labelledby="feedback-heading">
        <h2 id="feedback-heading">{PERSONAL.feedback.heading}</h2>
        <p className="section-lead">{PERSONAL.feedback.lead}</p>
        <div className="section-actions">
          <Link className="rb-btn rb-btn--default" href="/comments">
            {PERSONAL.comments.linkLabel}
          </Link>
          <a className="rb-btn rb-btn--outline" href={feedbackMailto}>
            {PERSONAL.feedback.buttonLabel}
          </a>
        </div>
      </section>
    </main>
  );
}
