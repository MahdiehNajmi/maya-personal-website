import { ContactForm } from "@/app/portfolio/lets-discuss/contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Let's discuss",
  description: "Send a message to get in touch.",
  robots: { index: false, follow: true },
};

export default function LetsDiscussPage() {
  return (
    <section className="flex min-h-[60vh] flex-col">
      <ContactForm />
    </section>
  );
}
