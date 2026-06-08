"use client";

import { Icons } from "@/components/icons";
import { ContactIconPanel } from "@/components/site/contact-icon-panel";
import { DATA } from "@/data/resume";
import { portfolioPath } from "@/lib/paths";
import { CalendarClock, MessageSquare } from "lucide-react";

const contactLinks = [
  {
    key: "linkedin",
    label: "LinkedIn",
    href: DATA.contact.social.LinkedIn.url,
    icon: Icons.linkedin,
    external: true,
    action: "link" as const,
  },
  {
    key: "meeting",
    label: "Book a meeting",
    href: DATA.contact.calendlyUrl,
    icon: CalendarClock,
    external: false,
    action: "schedule" as const,
  },
  {
    key: "message",
    label: "Message",
    href: portfolioPath("/lets-discuss"),
    icon: MessageSquare,
    external: false,
    action: "link" as const,
  },
] as const;

export default function ContactSection() {
  return (
    <section id="contact">
      <ContactIconPanel title="Get in Touch" links={contactLinks} />
    </section>
  );
}
