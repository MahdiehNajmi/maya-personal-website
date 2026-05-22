"use client";

import { CommentEmojiPicker } from "@/components/personal/comment-emoji-picker";
import { formatCommentDate } from "@/lib/comments";
import { PERSONAL } from "@/data/personal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

export type CommentItem = {
  id: number;
  authorName: string;
  body: string;
  createdAt: string;
};

type Props = {
  initialComments: CommentItem[];
};

export function CommentsSection({ initialComments }: Props) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const insertEmoji = useCallback((emoji: string) => {
    const el = bodyRef.current;
    setBody((prev) => {
      const start = el?.selectionStart ?? prev.length;
      const end = el?.selectionEnd ?? prev.length;
      const next = prev.slice(0, start) + emoji + prev.slice(end);
      requestAnimationFrame(() => {
        if (!el) return;
        el.focus();
        const pos = start + emoji.length;
        el.setSelectionRange(pos, pos);
      });
      return next;
    });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName,
          body,
          website,
        }),
      });

      const data = (await res.json()) as {
        comment?: CommentItem;
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? PERSONAL.comments.submitError);
        return;
      }

      if (data.comment) {
        setComments((prev) => [data.comment!, ...prev]);
      }
      setAuthorName("");
      setBody("");
      setWebsite("");
      setSuccess(true);
      router.refresh();
    } catch {
      setError(PERSONAL.comments.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comments-page">
      <header className="comments-page__header">
        <Link href="/" className="comments-page__back">
          ← {PERSONAL.comments.backLabel}
        </Link>
        <h1 className="comments-page__title">{PERSONAL.comments.pageTitle}</h1>
        <p className="comments-page__lead">{PERSONAL.comments.pageLead}</p>
      </header>

      <form className="comments-form" onSubmit={onSubmit} noValidate>
        <h2 className="comments-form__heading">{PERSONAL.comments.formHeading}</h2>

        <label className="comments-form__field">
          <span>{PERSONAL.comments.nameLabel}</span>
          <input
            type="text"
            name="authorName"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder={PERSONAL.comments.namePlaceholder}
            required
            maxLength={120}
            autoComplete="name"
            disabled={submitting}
          />
        </label>

        <label className="comments-form__field comments-form__field--message">
          <span>{PERSONAL.comments.messageLabel}</span>
          <textarea
            ref={bodyRef}
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={PERSONAL.comments.messagePlaceholder}
            required
            minLength={3}
            maxLength={2000}
            rows={5}
            disabled={submitting}
          />
          <CommentEmojiPicker
            disabled={submitting}
            onInsert={insertEmoji}
          />
        </label>

        <label className="comments-form__hp" aria-hidden="true">
          <span>Website</span>
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>

        {error ? (
          <p className="comments-form__error" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="comments-form__success" role="status">
            {PERSONAL.comments.successMessage}
          </p>
        ) : null}

        <button
          type="submit"
          className="rb-btn rb-btn--default"
          disabled={submitting}
        >
          {submitting ? PERSONAL.comments.submittingLabel : PERSONAL.comments.submitLabel}
        </button>
      </form>

      <section className="comments-list" aria-labelledby="comments-list-heading">
        <h2 id="comments-list-heading" className="comments-list__heading">
          {PERSONAL.comments.listHeading} ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <p className="comments-list__empty">{PERSONAL.comments.emptyMessage}</p>
        ) : (
          <ul className="comments-list__items">
            {comments.map((c) => (
              <li key={c.id} className="comments-list__item">
                <div className="comments-list__meta">
                  <strong className="comments-list__author">{c.authorName}</strong>
                  <time
                    className="comments-list__time"
                    dateTime={c.createdAt}
                  >
                    {formatCommentDate(new Date(c.createdAt))}
                  </time>
                </div>
                <p className="comments-list__body">{c.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
