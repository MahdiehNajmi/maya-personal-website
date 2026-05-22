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

export function useMayaVoice() {
  const [speechSupported, setSpeechSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceReplyOn, setVoiceReplyOn] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onTranscriptRef = useRef<(text: string, isFinal: boolean) => void>(
    () => {},
  );

  useEffect(() => {
    setSpeechSupported(
      typeof window !== "undefined" &&
        (!!getSpeechRecognition() || "speechSynthesis" in window),
    );
    const loadVoices = () => pickVoice();
    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      speechSynthesis.cancel();
      recognitionRef.current?.abort();
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

      stopSpeaking();

      return new Promise<void>((resolve) => {
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
      });
    },
    [voiceReplyOn, stopSpeaking],
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const startListening = useCallback(
    (onTranscript: (text: string, isFinal: boolean) => void) => {
      const Ctor = getSpeechRecognition();
      if (!Ctor) return false;

      stopSpeaking();
      onTranscriptRef.current = onTranscript;

      const recognition = new Ctor();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);

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
      recognition.start();
      return true;
    },
    [stopSpeaking],
  );

  const toggleListening = useCallback(
    (onTranscript: (text: string, isFinal: boolean) => void) => {
      if (listening) {
        stopListening();
        return;
      }
      startListening(onTranscript);
    },
    [listening, startListening, stopListening],
  );

  return {
    speechSupported,
    listening,
    speaking,
    voiceReplyOn,
    setVoiceReplyOn,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    toggleListening,
  };
}
