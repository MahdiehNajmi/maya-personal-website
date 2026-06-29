import { AboutSection } from "@/components/personal/about-section";
import { HomeContactSection } from "@/components/personal/home-contact-section";
import { CommentsSection } from "@/components/personal/comments-section";
import { PERSONAL } from "@/data/personal";
import { listComments } from "@/lib/comments";
import Image from "next/image";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function PersonalHomePage() {
  const { comments: initialComments, error: loadError } = await listComments();

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
            <p className="hero-role">
              {PERSONAL.roleLines.map((line) => (
                <span key={line} className="hero-role__line">
                  {line}
                </span>
              ))}
            </p>
            <p className="intro">{PERSONAL.intro}</p>
          </div>
        </div>
      </section>

      <AboutSection />

      <section
        id="comments"
        className="home-comments"
        aria-labelledby="home-comments-heading"
      >
        <div className="home-comments-wrap">
          <Suspense fallback={<p className="comments-page__lead">Loading…</p>}>
            <CommentsSection
              initialComments={initialComments}
              loadError={loadError}
              variant="home"
              showBackLink={false}
            />
          </Suspense>
        </div>
      </section>

      <section id="contact" className="contact" aria-label="Contact">
        <div className="contact-wrap">
          <HomeContactSection />
        </div>
      </section>
    </main>
  );
}
