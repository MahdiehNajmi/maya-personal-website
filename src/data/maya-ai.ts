import { MAHI_AVATAR } from "@/data/mahi-voices";

export { MAHI_AVATAR };

/** Greeting shown in the chat widget. */
export const MAYA_CHAT_GREETING =
  "Hi, I'm Mahi. Feel free to ask me any questions about the website, or send me your feedback here.";

export const MAYA_CHAT = {
  title: "Mahi",
  subtitle: "AI clone · text chat",
  teaser: "Ask me anything — tap to chat",
  launcherLabel: "Chat with Mahi",
  placeholder: "Type your message…",
  sendLabel: "Send",
  thinkingLabel: "Thinking…",
  closeLabel: "Close chat",
  openLabel: "Chat with Mahi — AI clone",
  retryLabel: "Try again",
  errorMessage:
    "Sorry, I could not respond right now. Please try again or email me directly.",
  rateLimitMessage:
    "Too many requests — please wait about a minute and try again.",
} as const;
