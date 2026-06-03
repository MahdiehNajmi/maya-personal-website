"use client";

import { useEffect } from "react";

const RESUME_PATH = "/resume/maya-najmi-resume.pdf";

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ResumePreviewModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="resume-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      <button
        type="button"
        className="resume-modal__backdrop"
        aria-label="Close resume preview"
        onClick={onClose}
      />
      <div className="resume-modal__panel">
        <header className="resume-modal__header">
          <div>
            <p className="resume-modal__eyebrow">Resume preview</p>
            <h2 id="resume-modal-title" className="resume-modal__title">
              Maya Najmi Resume
            </h2>
          </div>
          <button
            type="button"
            className="resume-modal__close"
            aria-label="Close resume preview"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </header>

        <div className="resume-modal__preview">
          <object
            data={RESUME_PATH}
            type="application/pdf"
            className="resume-modal__object"
          >
            <div className="resume-modal__fallback">
              <p>
                Resume preview will appear here after the PDF is added to the
                site.
              </p>
              <p className="resume-modal__fallback-path">{RESUME_PATH}</p>
            </div>
          </object>
        </div>

        <footer className="resume-modal__footer">
          <button
            type="button"
            className="resume-modal__secondary"
            onClick={onClose}
          >
            Close preview
          </button>
          <a
            className="resume-modal__download"
            href={RESUME_PATH}
            download="Maya-Najmi-Resume.pdf"
          >
            <DownloadIcon />
            Download resume
          </a>
        </footer>
      </div>
    </div>
  );
}
