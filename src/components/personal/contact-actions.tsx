"use client";

import { PersonalShimmerLink } from "@/components/personal/personal-shimmer-link";
import { PERSONAL } from "@/data/personal";

export function ContactActions() {
  return (
    <div className="contact-actions">
      <PersonalShimmerLink href={`mailto:${PERSONAL.email}`} external>
        {PERSONAL.contact.buttonLabel}
      </PersonalShimmerLink>
      <PersonalShimmerLink href="/comments">
        {PERSONAL.comments.linkLabel}
      </PersonalShimmerLink>
    </div>
  );
}
