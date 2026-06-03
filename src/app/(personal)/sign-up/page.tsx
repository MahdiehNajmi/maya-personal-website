import { EmailAuthCard } from "@/components/personal/email-auth-card";
import { PERSONAL } from "@/data/personal";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Sign up — ${PERSONAL.name}`,
  description: "Create a visitor account to leave a comment on Maya's site.",
};

export default function SignUpPage() {
  return (
    <main className="signup-main">
      <Suspense fallback={<p className="comments-page__lead">Loading...</p>}>
        <EmailAuthCard />
      </Suspense>
    </main>
  );
}
