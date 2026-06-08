"use client";

import { Icons } from "@/components/icons";
import { ContactIconPanel } from "@/components/site/contact-icon-panel";
import { PERSONAL } from "@/data/personal";
import { DATA } from "@/data/resume";
import { Mail, MessageSquare } from "lucide-react";

const HOME_CONTACT_LINKS = [
  {
    key: "email",
    label: PERSONAL.contact.buttonLabel,
    href: `mailto:${PERSONAL.email}`,
    icon: Mail,
    external: true,
    action: "link" as const,
  },
  {
    key: "comments",
    label: PERSONAL.comments.linkLabel,
    href: "/comments",
    icon: MessageSquare,
    action: "link" as const,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: DATA.contact.social.LinkedIn.url,
    icon: Icons.linkedin,
    external: true,
    action: "link" as const,
  },
];

export function HomeContactSection() {
  return (
    <ContactIconPanel
      title={PERSONAL.contact.heading}
      lead={PERSONAL.contact.lead}
      links={HOME_CONTACT_LINKS}
    />
  );
}
