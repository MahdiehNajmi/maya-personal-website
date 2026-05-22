"use client";

import {
  COMMENT_EMOJI_CATEGORIES,
  COMMENT_EMOJI_QUICK,
} from "@/data/comment-emojis";
import { PERSONAL } from "@/data/personal";
import { useCallback, useRef, useState } from "react";

type Props = {
  disabled?: boolean;
  onInsert: (emoji: string) => void;
};

export function CommentEmojiPicker({ disabled, onInsert }: Props) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    COMMENT_EMOJI_CATEGORIES[0].id,
  );
  const panelRef = useRef<HTMLDivElement>(null);

  const pick = useCallback(
    (emoji: string) => {
      onInsert(emoji);
    },
    [onInsert],
  );

  const activeEmojis =
    COMMENT_EMOJI_CATEGORIES.find((c) => c.id === activeCategory)?.emojis ??
    COMMENT_EMOJI_CATEGORIES[0].emojis;

  return (
    <div className="comments-emoji" ref={panelRef}>
      <div className="comments-emoji__toolbar">
        <button
          type="button"
          className={`comments-emoji__toggle ${open ? "is-open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          disabled={disabled}
          aria-expanded={open}
          aria-controls="comments-emoji-panel"
          title={PERSONAL.comments.emojiToggleLabel}
        >
          <span aria-hidden="true">😊</span>
        </button>

        <div
          className="comments-emoji__quick"
          role="group"
          aria-label={PERSONAL.comments.emojiQuickLabel}
        >
          {COMMENT_EMOJI_QUICK.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="comments-emoji__btn"
              disabled={disabled}
              onClick={() => pick(emoji)}
              aria-label={`Insert ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {open ? (
        <div
          id="comments-emoji-panel"
          className="comments-emoji__panel"
          role="region"
          aria-label={PERSONAL.comments.emojiPanelLabel}
        >
          <div className="comments-emoji__tabs" role="tablist">
            {COMMENT_EMOJI_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`comments-emoji__tab ${activeCategory === cat.id ? "is-active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
                disabled={disabled}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="comments-emoji__grid" role="tabpanel">
            {activeEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="comments-emoji__btn comments-emoji__btn--grid"
                disabled={disabled}
                onClick={() => pick(emoji)}
                aria-label={`Insert ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
