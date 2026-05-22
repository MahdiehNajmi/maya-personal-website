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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
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

  const resetMicState = useCallback(() => {
    startingRef.current = false;
    setListening(false);
    setVoiceHint(null);
    try {
      recognitionRef.current?.abort();
    } catch {
      /* ignore */
    }
    recognitionRef.current = null;
  }, []);

  const clearAudioPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    clearAudioPlayback();
    setSpeaking(false);
  }, [clearAudioPlayback]);

  const speakWithBrowser = useCallback(
    (text: string) =>
      new Promise<void>((resolve) => {
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          resolve();
        };

        const maxMs = Math.min(120_000, text.length * 90 + 4000);
        const timeoutId = window.setTimeout(finish, maxMs);

        let pollId = 0;
        const run = () => {
          const utterance = new SpeechSynthesisUtterance(text);
          const voice = pickVoice();
          if (voice) utterance.voice = voice;
          utterance.rate = 1;
          utterance.pitch = 1.02;
          utterance.volume = 1;

          const done = () => {
            if (pollId) window.clearInterval(pollId);
            window.clearTimeout(timeoutId);
            finish();
          };

          utterance.onend = done;
          utterance.onerror = done;
          speechSynthesis.speak(utterance);

          pollId = window.setInterval(() => {
            if (!speechSynthesis.speaking && !speechSynthesis.pending) {
              done();
            }
          }, 400);
        };

        if (speechSynthesis.pending || speechSynthesis.speaking) {
          speechSynthesis.cancel();
        }
        window.setTimeout(run, synthesisUnlocked ? 0 : 50);
      }),
    [],
  );

  const speakWithGemini = useCallback(
    async (text: string) => {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error("Gemini TTS failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;

      await new Promise<void>((resolve, reject) => {
        const audio = new Audio(url);
        audioRef.current = audio;
        const maxMs = Math.min(120_000, text.length * 100 + 5000);
        const timeoutId = window.setTimeout(() => {
          clearAudioPlayback();
          resolve();
        }, maxMs);

        audio.onended = () => {
          window.clearTimeout(timeoutId);
          clearAudioPlayback();
          resolve();
        };
        audio.onerror = () => {
          window.clearTimeout(timeoutId);
          clearAudioPlayback();
          reject(new Error("Audio playback failed"));
        };
        void audio.play().catch(reject);
      });
    },
    [clearAudioPlayback],
  );

  const speak = useCallback(
    async (text: string) => {
      if (!voiceReplyOn || !text.trim() || typeof window === "undefined") {
        return;
      }

      unlockSpeechSynthesis();
      stopSpeaking();
      setSpeaking(true);

      try {
        await speakWithGemini(text);
      } catch {
        await speakWithBrowser(text);
      } finally {
        setSpeaking(false);
      }
    },
    [voiceReplyOn, stopSpeaking, speakWithGemini, speakWithBrowser],
  );

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    resetMicState();
  }, [resetMicState]);

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

      if (speaking) stopSpeaking();

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
        window.setTimeout(() => {
          if (startingRef.current && !listening) {
            resetMicState();
            setVoiceHint(
              "Could not start listening. Tap the mic again.",
            );
          }
        }, 8000);
        return true;
      } catch {
        resetMicState();
        setVoiceHint("Could not start listening. Wait a moment and tap the mic again.");
        return false;
      }
    },
    [listening, speaking, resetMicState, stopSpeaking],
  );

  const toggleListening = useCallback(
    (onTranscript: (text: string, isFinal: boolean) => void) => {
      if (speaking) {
        stopSpeaking();
        return;
      }
      if (listening || startingRef.current) {
        stopListening();
        return;
      }
      void startListening(onTranscript);
    },
    [listening, speaking, startListening, stopListening, stopSpeaking],
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
    resetMicState,
    unlock: unlockSpeechSynthesis,
  };
};
