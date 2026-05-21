"use client";

import {
  MAYA_CHAT,
  MAYA_CHAT_GREETING,
} from "@/data/maya-ai";
import { useCallback, useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function MayaChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: MAYA_CHAT_GREETING,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, messages, scrollToBottom]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: newId(), role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = (await res.json()) as {
        message?: string;
        error?: string;
      };

      if (!res.ok) {
        setError(data.error ?? MAYA_CHAT.errorMessage);
        return;
      }

      if (data.message) {
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: "assistant", content: data.message! },
        ]);
      }
    } catch {
      setError(MAYA_CHAT.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div className="maya-chat" data-open={open ? "true" : "false"}>
      {open ? (
        <div
          className="maya-chat__panel"
          role="dialog"
          aria-label={MAYA_CHAT.title}
        >
          <header className="maya-chat__header">
            <div className="maya-chat__header-text">
              <strong className="maya-chat__title">{MAYA_CHAT.title}</strong>
              <span className="maya-chat__subtitle">{MAYA_CHAT.subtitle}</span>
            </div>
            <button
              type="button"
              className="maya-chat__close"
              onClick={() => setOpen(false)}
              aria-label={MAYA_CHAT.closeLabel}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div className="maya-chat__messages" ref={listRef}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`maya-chat__bubble maya-chat__bubble--${m.role}`}
              >
                {m.content}
              </div>
            ))}
            {loading ? (
              <div
                className="maya-chat__bubble maya-chat__bubble--assistant maya-chat__typing"
                aria-live="polite"
              >
                <span />
                <span />
                <span />
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="maya-chat__error" role="alert">
              {error}
            </p>
          ) : null}

          <footer className="maya-chat__footer">
            <textarea
              ref={inputRef}
              className="maya-chat__input"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={MAYA_CHAT.placeholder}
              disabled={loading}
              aria-label={MAYA_CHAT.placeholder}
            />
            <button
              type="button"
              className="maya-chat__send"
              onClick={() => void send()}
              disabled={loading || !input.trim()}
            >
              {MAYA_CHAT.sendLabel}
            </button>
          </footer>
        </div>
      ) : null}

      <button
        type="button"
        className="maya-chat__launcher"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? MAYA_CHAT.closeLabel : MAYA_CHAT.openLabel}
        title={MAYA_CHAT.openLabel}
      >
        {open ? (
          <svg
            viewBox="0 0 24 24"
            width="26"
            height="26"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="26"
            height="26"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a4 4 0 0 1-4 4H8l-4 4V7a4 4 0 0 1 4-4h5" />
            <line x1="16" y1="3" x2="22" y2="3" />
            <line x1="19" y1="6" x2="22" y2="6" />
            <line x1="16" y1="9" x2="22" y2="9" />
          </svg>
        )}
      </button>
    </div>
  );
}
