"use client";

import { MAHI_AVATAR, MAYA_CHAT, MAYA_CHAT_GREETING } from "@/data/maya-ai";
import { fetchWithTimeout } from "@/lib/fetch-with-timeout";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const TEASER_KEY = "maya-chat-teaser-dismissed";

export function MayaChatWidget() {
  const [open, setOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: MAYA_CHAT_GREETING },
  ]);
  const [input, setInput] = useState("");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sendingRef = useRef(false);

  useEffect(() => {
    try {
      setShowTeaser(!localStorage.getItem(TEASER_KEY));
    } catch {
      setShowTeaser(true);
    }
  }, []);

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

  const dismissTeaser = () => {
    setShowTeaser(false);
    try {
      localStorage.setItem(TEASER_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const openChat = () => {
    dismissTeaser();
    setOpen(true);
  };

  const closeChat = () => {
    setOpen(false);
  };

  const requestReply = useCallback(
    async (history: Message[]) => {
      setError(null);
      setFetching(true);

      try {
        const res = await fetchWithTimeout(
          "/api/chat",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: history
                .filter((m) => m.id !== "welcome")
                .map((m) => ({ role: m.role, content: m.content })),
            }),
          },
          52_000,
        );

        let data: {
          message?: string;
          error?: string;
        } = {};
        try {
          data = (await res.json()) as { message?: string; error?: string };
        } catch {
          setError(MAYA_CHAT.errorMessage);
          return;
        }

        if (!res.ok) {
          setError(data.error ?? MAYA_CHAT.errorMessage);
          return;
        }

        const text = data.message?.trim();
        if (text) {
          setMessages((prev) => [
            ...prev,
            { id: newId(), role: "assistant", content: text },
          ]);
        } else {
          setError(MAYA_CHAT.errorMessage);
        }
      } catch (err) {
        const aborted =
          err instanceof Error && /abort/i.test(err.name + err.message);
        setError(
          aborted
            ? "That took too long. Please try again with a shorter question."
            : MAYA_CHAT.errorMessage,
        );
      } finally {
        setFetching(false);
        sendingRef.current = false;
      }
    },
    [],
  );

  const sendText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || fetching || sendingRef.current) return;

      sendingRef.current = true;
      const userMsg: Message = { id: newId(), role: "user", content: trimmed };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInput("");
      await requestReply(nextMessages);
    },
    [fetching, messages, requestReply],
  );

  const send = () => void sendText(input);

  const retryLast = () => {
    if (fetching) return;
    const lastUserIndex = [...messages]
      .map((m, i) => (m.role === "user" ? i : -1))
      .filter((i) => i >= 0)
      .pop();
    if (lastUserIndex === undefined) return;
    void requestReply(messages.slice(0, lastUserIndex + 1));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  const statusLabel = fetching ? MAYA_CHAT.thinkingLabel : null;

  return (
    <div
      className="maya-chat"
      data-open={open ? "true" : "false"}
    >
      {!open && showTeaser ? (
        <button
          type="button"
          className="maya-chat__teaser"
          onClick={openChat}
          aria-label={MAYA_CHAT.teaser}
        >
          <span className="maya-chat__teaser-dot" aria-hidden="true" />
          {MAYA_CHAT.teaser}
        </button>
      ) : null}

      {open ? (
        <div
          className="maya-chat__panel"
          role="dialog"
          aria-label={MAYA_CHAT.openLabel}
        >
          <div className="maya-chat__glow" aria-hidden="true" />

          <header className="maya-chat__header">
            <div className="maya-chat__avatar-wrap">
              <Image
                src={MAHI_AVATAR}
                alt=""
                width={44}
                height={44}
                className="maya-chat__avatar"
              />
              <span className="maya-chat__live" aria-hidden="true" />
            </div>
            <div className="maya-chat__header-text">
              <strong className="maya-chat__title">{MAYA_CHAT.title}</strong>
              <span className="maya-chat__subtitle">{MAYA_CHAT.subtitle}</span>
              {statusLabel ? (
                <span className="maya-chat__status">{statusLabel}</span>
              ) : null}
            </div>
            <button
              type="button"
              className="maya-chat__icon-btn"
              onClick={closeChat}
              aria-label={MAYA_CHAT.closeLabel}
            >
              <CloseIcon />
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
            {fetching ? (
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
            <div className="maya-chat__error-wrap" role="alert">
              <p className="maya-chat__error">{error}</p>
              <button
                type="button"
                className="maya-chat__retry"
                onClick={retryLast}
              >
                {MAYA_CHAT.retryLabel}
              </button>
            </div>
          ) : null}

          <footer className="maya-chat__footer">
            <div className="maya-chat__composer">
              <textarea
                ref={inputRef}
                className="maya-chat__input"
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={MAYA_CHAT.placeholder}
                disabled={fetching}
                aria-label={MAYA_CHAT.placeholder}
              />
              <button
                type="button"
                className="maya-chat__send"
                onClick={() => void send()}
                disabled={fetching || !input.trim()}
              >
                <SendIcon />
                <span>{MAYA_CHAT.sendLabel}</span>
              </button>
            </div>
          </footer>
        </div>
      ) : null}

      <div className="maya-chat__launcher-wrap">
        <span className="maya-chat__pulse" aria-hidden="true" />
        <button
          type="button"
          className="maya-chat__launcher"
          onClick={() => (open ? closeChat() : openChat())}
          aria-expanded={open}
          aria-label={open ? MAYA_CHAT.closeLabel : MAYA_CHAT.openLabel}
        >
          <Image
            src={MAHI_AVATAR}
            alt=""
            width={36}
            height={36}
            className="maya-chat__launcher-avatar"
          />
          <span className="maya-chat__launcher-text">
            {MAYA_CHAT.launcherLabel}
          </span>
          <span className="maya-chat__launcher-badge" aria-hidden="true">
            <SparklesIcon />
          </span>
        </button>
      </div>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg
      className="maya-chat__sparkles-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M12 2l1.2 4.2L17.4 7.4l-4.2 1.2L12 12.8 10.8 8.6 6.6 7.4l4.2-1.2L12 2zM5 14l.7 2.4L8.1 17l-2.4.7L5 20.1l-.7-2.4L2 17l2.4-.7L5 14zm14 0l.7 2.4 2.4.7-2.4.7-.7 2.4-.7-2.4-2.4-.7 2.4-.7.7-2.4zM12 16.5l.9 3.1 3.1.9-3.1.9-.9 3.1-.9-3.1-3.1-.9 3.1-.9.9-3.1z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
