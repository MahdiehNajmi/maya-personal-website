import { CommentsSection } from "@/components/personal/comments-section";
import { PERSONAL } from "@/data/personal";
import { listComments } from "@/lib/comments";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${PERSONAL.comments.pageTitle} — ${PERSONAL.name}`,
  description: PERSONAL.comments.pageLead,
};

export const dynamic = "force-dynamic";

export default async function CommentsPage() {
  const { comments: initialComments, error: loadError } = await listComments();

  return (
    <main className="comments-main">
      <CommentsSection
        initialComments={initialComments}
        loadError={loadError}
      />
    </main>
  );
}
