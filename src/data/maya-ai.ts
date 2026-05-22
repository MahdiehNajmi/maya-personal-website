import { MAHI_AVATAR } from "@/data/mahi-voices";

export { MAHI_AVATAR };

/** Greeting shown in the chat widget (Mahi's voice). */
export const MAYA_CHAT_GREETING =
  "Hi, I'm Mahi. Feel free to ask me any questions about the website, or send me your feedback here.";

export const MAYA_CHAT = {
  title: "Mahi",
  subtitle: "AI clone · natural voice & text",
  teaser: "Ask me anything — tap to talk or type",
  launcherLabel: "Talk to Mahi",
  placeholder: "Type or use the mic to speak…",
  sendLabel: "Send",
  micLabel: "Speak your question",
  micStopLabel: "Stop listening",
  voiceOnLabel: "Mahi speaks replies aloud",
  voiceOffLabel: "Voice replies off",
  listeningLabel: "Listening…",
  speakingLabel: "Mahi is speaking…",
  thinkingLabel: "Thinking…",
  closeLabel: "Close chat",
  openLabel: "Talk to Mahi — AI clone",
  retryLabel: "Try again",
  speechUnsupported:
    "Voice is not supported in this browser. You can still type your message.",
  errorMessage:
    "Sorry, I could not respond right now. Please try again or email me directly.",
} as const;
