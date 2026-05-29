"use client";

import { CommentImageAttachment } from "@/components/personal/comment-image-attachment";
import { CommentEmojiPicker } from "@/components/personal/comment-emoji-picker";
import { formatCommentDate } from "@/lib/comments";
import { PERSONAL } from "@/data/personal";
import { authClient } from "@/lib/auth/client";
import {
  fetchWithTimeout,
  readJsonResponse,
} from "@/lib/read-json-response";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

function GoogleIcon(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="18"
      height="18"
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.656 32.657 29.17 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.958 3.042l5.657-5.657C34.965 6.053 29.711 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691 12.88 19.51C14.657 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.958 3.042l5.657-5.657C34.965 6.053 29.711 4 24 4c-7.682 0-14.35 4.332-17.694 10.691Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.602 0 10.746-2.053 14.646-5.402l-6.761-5.727C29.83 34.169 27.057 35 24 35c-5.149 0-9.621-3.321-11.283-7.946l-6.52 5.025C9.505 39.556 16.227 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a11.96 11.96 0 0 1-4.127 5.871l.003-.002 6.761 5.727C36.25 41.131 44 36 44 24c0-1.341-.138-2.65-.389-3.917Z"
      />
    </svg>
  );
}

function UserIcon(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SessionAvatar({
  imageUrl,
  name,
}: {
  imageUrl: string | null;
  name: string;
}) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className="comments-user-bar__avatar-media"
        width={40}
        height={40}
        decoding="async"
      />
    );
  }

  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <span className="comments-user-bar__avatar-fallback" aria-hidden="true">
      {initial}
    </span>
  );
}

function GitHubIcon(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 .5C5.73.5.75 5.6.75 12c0 5.13 3.15 9.48 7.52 11.02.55.1.75-.24.75-.53v-1.9c-3.06.69-3.7-1.5-3.7-1.5-.5-1.3-1.22-1.65-1.22-1.65-1-.7.08-.69.08-.69 1.1.08 1.68 1.16 1.68 1.16.98 1.72 2.57 1.22 3.2.93.1-.73.38-1.22.69-1.5-2.44-.29-5.01-1.25-5.01-5.56 0-1.23.42-2.24 1.11-3.02-.11-.29-.48-1.46.11-3.04 0 0 .91-.3 2.98 1.15.86-.25 1.78-.37 2.7-.38.92.01 1.85.13 2.72.38 2.06-1.45 2.97-1.15 2.97-1.15.6 1.58.23 2.75.12 3.04.69.78 1.11 1.79 1.11 3.02 0 4.32-2.58 5.26-5.03 5.55.39.35.74 1.04.74 2.1v3.1c0 .29.2.64.76.53A11.27 11.27 0 0 0 23.25 12C23.25 5.6 18.27.5 12 .5Z"
      />
    </svg>
  );
}

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
  const searchParams = useSearchParams();
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [sessionUserName, setSessionUserName] = useState<string | null>(null);
  const [sessionUserImage, setSessionUserImage] = useState<string | null>(null);
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
  const uploadInFlightRef = useRef(false);

  useEffect(() => {
    const authError = searchParams.get("auth_error");
    if (authError) {
      setError(decodeURIComponent(authError));
      const url = new URL(window.location.href);
      url.searchParams.delete("auth_error");
      window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    }
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    authClient
      .getSession()
      .then((res) => {
        if (cancelled) return;
        const user = res?.data?.user;
        setSessionUserId(user?.id ?? null);
        setSessionUserName(user?.name ?? user?.email ?? null);
        setSessionUserImage(user?.image ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setSessionUserId(null);
        setSessionUserName(null);
        setSessionUserImage(null);
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

    const trimmedBody = body.trim();
    if (trimmedBody.length < 3 && uploadedImages.length === 0) {
      setError(
        "Add a message (at least 3 characters) or attach at least one image.",
      );
      return;
    }

    if (uploading) {
      setError("Please wait for the image upload to finish.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: trimmedBody,
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

  const startLogin = (provider: "google" | "github") => {
    setError(null);
    window.location.assign(`/api/auth/login/${provider}`);
  };

  const onLogout = async () => {
    setError(null);
    try {
      const res = await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Logout failed (${res.status}).`);
      }
      setSessionUserId(null);
      setSessionUserName(null);
      setSessionUserImage(null);
      setUploadedImages([]);
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not log out. Please try again.");
    }
  };

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!sessionUserId) {
      setError("Please log in first to upload images.");
      return;
    }
    if (uploadInFlightRef.current) return;

    const MAX_BYTES = 4 * 1024 * 1024;
    for (const file of Array.from(files)) {
      if (file.size > MAX_BYTES) {
        setError("Image is too large (max 4MB). Try resizing or exporting as JPEG.");
        if (fileRef.current) fileRef.current.value = "";
        return;
      }
    }

    setError(null);
    setUploading(true);
    uploadInFlightRef.current = true;
    try {
      const next: { id: number; url: string }[] = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.set("file", file);

        const res = await fetchWithTimeout(
          "/api/comment-images/upload",
          {
            method: "POST",
            body: form,
            credentials: "include",
          },
          90_000,
        );

        const data = await readJsonResponse<{
          image?: { id: number; url: string };
          error?: string;
        }>(res);

        if (!res.ok || !data.image) {
          throw new Error(data.error ?? "Upload failed.");
        }
        next.push(data.image);
      }
      setUploadedImages((prev) => [...prev, ...next]);
    } catch (e) {
      const raw = e instanceof Error ? e.message : "Upload failed.";
      const message = /aborted/i.test(raw)
        ? "Image upload was interrupted. Please try again."
        : raw;
      setError(message);
      if (fileRef.current) fileRef.current.value = "";
    } finally {
      uploadInFlightRef.current = false;
      setUploading(false);
    }
  };

  const trimmedBody = body.trim();
  const hasCommentContent =
    trimmedBody.length >= 3 || uploadedImages.length > 0;
  const canSubmit =
    Boolean(sessionUserId) &&
    !submitting &&
    !uploading &&
    hasCommentContent;

  const displayName = sessionUserName ?? "Visitor";

  return (
    <div className="comments-page">
      {sessionUserId ? (
        <div className="comments-user-bar">
          <div className="comments-user-bar__welcome">
            <div className="comments-user-bar__avatar-bg" aria-hidden="true">
              {sessionUserImage ? (
                <SessionAvatar imageUrl={sessionUserImage} name={displayName} />
              ) : (
                <UserIcon className="comments-user-bar__avatar-icon" />
              )}
            </div>
            <p className="comments-user-bar__greeting">
              Welcome, <strong>{displayName}</strong>!
            </p>
          </div>
          <button
            type="button"
            className="comments-user-bar__logout"
            onClick={onLogout}
            disabled={submitting || uploading}
          >
            Log out
          </button>
        </div>
      ) : null}

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

      {!sessionUserId ? (
        <div className="comments-auth">
          <div className="comments-auth__row">
            <span className="comments-auth__status">
              Please log in to leave a comment.
            </span>
            <div className="comments-auth__actions">
              <button
                type="button"
                className="auth-btn auth-btn--google"
                onClick={() => startLogin("google")}
                disabled={submitting || uploading}
              >
                <span className="auth-btn__icon">
                  <GoogleIcon />
                </span>
                <span className="auth-btn__label">Continue with Google</span>
              </button>
              <button
                type="button"
                className="auth-btn auth-btn--github"
                onClick={() => startLogin("github")}
                disabled={submitting || uploading}
              >
                <span className="auth-btn__icon">
                  <GitHubIcon />
                </span>
                <span className="auth-btn__label">Continue with GitHub</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
            maxLength={2000}
            rows={5}
            disabled={submitting || uploading}
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
                <CommentImageAttachment
                  key={img.id}
                  src={img.url}
                  thumbClassName="comments-form__upload"
                />
              ))}
            </div>
          ) : null}
          {uploading ? (
            <p className="comments-form__upload-status" role="status">
              Uploading image…
            </p>
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
          disabled={!canSubmit}
        >
          {submitting
            ? PERSONAL.comments.submittingLabel
            : uploading
              ? "Uploading image…"
              : !sessionUserId
                ? "Log in to comment"
                : !hasCommentContent
                  ? "Add a message or image"
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
                      <CommentImageAttachment
                        key={img.id}
                        src={img.url}
                        thumbClassName="comments-list__image"
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
