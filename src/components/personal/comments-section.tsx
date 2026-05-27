"use client";

import { CommentEmojiPicker } from "@/components/personal/comment-emoji-picker";
import { formatCommentDate } from "@/lib/comments";
import { PERSONAL } from "@/data/personal";
import { authClient } from "@/lib/auth/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export type CommentItem = {
  id: number;
  authorName: string;
  authorImageUrl?: string | null;
  body: string;
  createdAt: string;
  images?: { id: number; url: string }[];
};

type Props = {
  initialComments: CommentItem[];
  loadError?: string | null;
};

export function CommentsSection({ initialComments, loadError }: Props) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [sessionUserName, setSessionUserName] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<
    { id: number; url: string }[]
  >([]);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    authClient
      .getSession()
      .then((res) => {
        if (cancelled) return;
        const user = res?.data?.user;
        setSessionUserId(user?.id ?? null);
        setSessionUserName(user?.name ?? user?.email ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setSessionUserId(null);
        setSessionUserName(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

    if (!sessionUserId) {
      setError("Please log in first to leave a comment.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body,
          imageIds: uploadedImages.map((img) => img.id),
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
      setBody("");
      setWebsite("");
      setUploadedImages([]);
      if (fileRef.current) fileRef.current.value = "";
      setSuccess(true);
      router.refresh();
    } catch {
      setError(PERSONAL.comments.submitError);
    } finally {
      setSubmitting(false);
    }
  };

  const onLogin = async (provider: "google" | "github") => {
    setError(null);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/comments`,
      });
    } catch {
      setError("Could not start login. Please try again.");
    }
  };

  const onLogout = async () => {
    setError(null);
    try {
      await authClient.signOut();
      setSessionUserId(null);
      setSessionUserName(null);
      setUploadedImages([]);
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch {
      setError("Could not log out. Please try again.");
    }
  };

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!sessionUserId) {
      setError("Please log in first to upload images.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const next: { id: number; url: string }[] = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.set("file", file);
        const res = await fetch("/api/comment-images/upload", {
          method: "POST",
          body: form,
        });
        const data = (await res.json()) as {
          image?: { id: number; url: string };
          error?: string;
        };
        if (!res.ok || !data.image) {
          throw new Error(data.error ?? "Upload failed.");
        }
        next.push(data.image);
      }
      setUploadedImages((prev) => [...prev, ...next]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
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
        {loadError ? (
          <p className="comments-form__error" role="alert">
            {loadError}
          </p>
        ) : null}
      </header>

      <div className="comments-auth">
        {sessionUserId ? (
          <div className="comments-auth__row">
            <span className="comments-auth__status">
              Logged in as <strong>{sessionUserName ?? "Visitor"}</strong>
            </span>
            <button
              type="button"
              className="rb-btn rb-btn--default"
              onClick={onLogout}
              disabled={submitting || uploading}
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="comments-auth__row">
            <span className="comments-auth__status">
              Please log in to leave a comment.
            </span>
            <div className="comments-auth__actions">
              <button
                type="button"
                className="rb-btn rb-btn--default"
                onClick={() => onLogin("google")}
                disabled={submitting || uploading}
              >
                Log in with Google
              </button>
              <button
                type="button"
                className="rb-btn rb-btn--default"
                onClick={() => onLogin("github")}
                disabled={submitting || uploading}
              >
                Log in with GitHub
              </button>
            </div>
          </div>
        )}
      </div>

      <form className="comments-form" onSubmit={onSubmit} noValidate>
        <h2 className="comments-form__heading">{PERSONAL.comments.formHeading}</h2>

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

        <label className="comments-form__field">
          <span>Images (optional)</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            disabled={!sessionUserId || submitting || uploading}
            onChange={(e) => onUpload(e.target.files)}
          />
          {uploadedImages.length ? (
            <div className="comments-form__uploads">
              {uploadedImages.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={img.url}
                  alt=""
                  className="comments-form__upload"
                />
              ))}
            </div>
          ) : null}
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
          disabled={!sessionUserId || submitting || uploading}
        >
          {submitting
            ? PERSONAL.comments.submittingLabel
            : !sessionUserId
              ? "Log in to comment"
              : PERSONAL.comments.submitLabel}
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
                {c.images?.length ? (
                  <div className="comments-list__images">
                    {c.images.map((img) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={img.id}
                        src={img.url}
                        alt=""
                        className="comments-list__image"
                        loading="lazy"
                      />
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
