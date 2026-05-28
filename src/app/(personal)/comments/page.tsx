import { CommentsSection } from "@/components/personal/comments-section";
import { PERSONAL } from "@/data/personal";
import { listComments } from "@/lib/comments";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `${PERSONAL.comments.pageTitle} — ${PERSONAL.name}`,
  description: PERSONAL.comments.pageLead,
};

export const dynamic = "force-dynamic";

export default async function CommentsPage() {
  const { comments: initialComments, error: loadError } = await listComments();

  return (
    <main className="comments-main">
      <Suspense fallback={<p className="comments-page__lead">Loading…</p>}>
        <CommentsSection
          initialComments={initialComments}
          loadError={loadError}
        />
      </Suspense>
    </main>
  );
}
