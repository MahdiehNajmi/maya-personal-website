"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionCtor = new () => SpeechRecognition;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

let synthesisUnlocked = false;

/** iOS/Safari require speech synthesis within a user gesture; call on open/mic tap. */
export function unlockSpeechSynthesis(): void {
  if (typeof window === "undefined" || synthesisUnlocked) return;
  try {
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    u.rate = 10;
    speechSynthesis.speak(u);
    speechSynthesis.cancel();
    synthesisUnlocked = true;
  } catch {
    /* ignore */
  }
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      /female|samantha|victoria|karen|moira|google us english/i.test(
        `${v.name} ${v.voiceURI}`,
      ),
  );
  return preferred ?? voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
}

function micErrorMessage(code: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access was blocked. Allow the mic in your browser settings and reload.";
    case "no-speech":
      return "No speech detected. Try again and speak clearly.";
    case "audio-capture":
      return "No microphone found. Check your device or input settings.";
    case "network":
      return "Speech recognition needs a network connection. Check your connection and try again.";
    case "aborted":
      return "";
    default:
      return "Could not use the microphone. Try again or type your message.";
  }
}

async function ensureMicrophoneAccess(): Promise<boolean> {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    return true;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

export function useMayaVoice() {
  const [micSupported, setMicSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceReplyOn, setVoiceReplyOn] = useState(true);
  const [voiceHint, setVoiceHint] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const startingRef = useRef(false);
  const onTranscriptRef = useRef<(text: string, isFinal: boolean) => void>(
    () => {},
  );

  useEffect(() => {
    setMicSupported(!!getSpeechRecognition());
    setTtsSupported(
      typeof window !== "undefined" && "speechSynthesis" in window,
    );
    const loadVoices = () => pickVoice();
    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      speechSynthesis.cancel();
      try {
        recognitionRef.current?.abort();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!voiceReplyOn || !text.trim() || typeof window === "undefined") {
        return Promise.resolve();
      }

      unlockSpeechSynthesis();
      stopSpeaking();

      return new Promise<void>((resolve) => {
        const run = () => {
          const utterance = new SpeechSynthesisUtterance(text);
          const voice = pickVoice();
          if (voice) utterance.voice = voice;
          utterance.rate = 1;
          utterance.pitch = 1.02;
          utterance.volume = 1;

          utterance.onstart = () => setSpeaking(true);
          utterance.onend = () => {
            setSpeaking(false);
            resolve();
          };
          utterance.onerror = () => {
            setSpeaking(false);
            resolve();
          };

          speechSynthesis.speak(utterance);
        };

        // After async API replies, Safari may need a short delay post-unlock.
        if (speechSynthesis.pending || speechSynthesis.speaking) {
          speechSynthesis.cancel();
        }
        window.setTimeout(run, synthesisUnlocked ? 0 : 50);
      });
    },
    [voiceReplyOn, stopSpeaking],
  );

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    startingRef.current = false;
    setListening(false);
  }, []);

  const startListening = useCallback(
    async (onTranscript: (text: string, isFinal: boolean) => void) => {
      const Ctor = getSpeechRecognition();
      if (!Ctor) {
        setVoiceHint(
          "Voice input is not supported in this browser. Use Chrome, Edge, or Safari.",
        );
        return false;
      }

      if (startingRef.current || listening) return false;

      unlockSpeechSynthesis();
      setVoiceHint(null);
      stopSpeaking();
      onTranscriptRef.current = onTranscript;

      const micOk = await ensureMicrophoneAccess();
      if (!micOk) {
        setVoiceHint(micErrorMessage("not-allowed"));
        return false;
      }

      try {
        recognitionRef.current?.abort();
      } catch {
        /* ignore */
      }

      const recognition = new Ctor();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        startingRef.current = false;
        setListening(true);
        setVoiceHint(null);
      };

      recognition.onend = () => {
        startingRef.current = false;
        setListening(false);
      };

      recognition.onerror = (ev: Event) => {
        startingRef.current = false;
        setListening(false);
        const code =
          (ev as SpeechRecognitionErrorEvent).error ?? "unknown";
        const msg = micErrorMessage(code);
        if (msg) setVoiceHint(msg);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let finalText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const chunk = result[0]?.transcript ?? "";
          if (result.isFinal) finalText += chunk;
          else interim += chunk;
        }
        if (finalText.trim()) {
          onTranscriptRef.current(finalText.trim(), true);
        } else if (interim.trim()) {
          onTranscriptRef.current(interim.trim(), false);
        }
      };

      recognitionRef.current = recognition;
      startingRef.current = true;

      try {
        recognition.start();
        return true;
      } catch {
        startingRef.current = false;
        setVoiceHint("Could not start listening. Wait a moment and tap the mic again.");
        return false;
      }
    },
    [listening, stopSpeaking],
  );

  const toggleListening = useCallback(
    (onTranscript: (text: string, isFinal: boolean) => void) => {
      if (listening || startingRef.current) {
        stopListening();
        return;
      }
      void startListening(onTranscript);
    },
    [listening, startListening, stopListening],
  );

  return {
    micSupported,
    ttsSupported,
    speechSupported: micSupported || ttsSupported,
    listening,
    speaking,
    voiceReplyOn,
    setVoiceReplyOn,
    voiceHint,
    setVoiceHint,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    toggleListening,
    unlock: unlockSpeechSynthesis,
  };
};
