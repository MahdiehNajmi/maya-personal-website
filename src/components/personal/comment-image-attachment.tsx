"use client";

import { useCallback, useEffect, useId, useState } from "react";

type Props = {
  src: string;
  /** e.g. comments-list__image or comments-form__upload */
  thumbClassName?: string;
};

export function CommentImageAttachment({
  src,
  thumbClassName = "comments-list__image",
}: Props) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const downloadHref = `${src}?download=1`;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        className="comment-image-attachment__trigger"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className={thumbClassName}
          loading="lazy"
        />
        <span className="comment-image-attachment__label">View attachment</span>
      </button>

      {open ? (
        <div
          className="comment-image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={close}
        >
          <div
            className="comment-image-lightbox__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="comment-image-lightbox__header">
              <h3 id={titleId} className="comment-image-lightbox__title">
                Attachment
              </h3>
              <div className="comment-image-lightbox__actions">
                <a
                  href={downloadHref}
                  className="rb-btn rb-btn--default comment-image-lightbox__download"
                  download
                >
                  Download
                </a>
                <button
                  type="button"
                  className="rb-btn rb-btn--default comment-image-lightbox__close"
                  onClick={close}
                >
                  Close
                </button>
              </div>
            </header>
            <div className="comment-image-lightbox__body">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="Comment attachment preview"
                className="comment-image-lightbox__img"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
