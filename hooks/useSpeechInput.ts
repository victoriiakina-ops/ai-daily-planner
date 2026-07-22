"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// The Web Speech API's SpeechRecognition interface isn't in TypeScript's DOM
// lib (spec is still non-standard) and isn't implemented by Safari/iOS at all.
// Minimal local typing for the parts we use, on whichever prefixed global exists.
interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
}
interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}
interface SpeechRecognitionEventLike {
  results: SpeechRecognitionResultListLike;
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/**
 * Thin wrapper around the (non-standard, Safari-unsupported) Web Speech API.
 * `isSupported` lets callers render the mic affordance as inert wherever the
 * browser can't actually do speech-to-text, instead of a button that silently
 * does nothing.
 */
export function useSpeechInput({
  lang = "uk-UA",
  onResult,
}: {
  lang?: string;
  onResult: (transcript: string) => void;
}) {
  // Starts false on both server and client's first render (SSR has no `window`),
  // then flips after mount once the real client-side check can run. Computing
  // this synchronously during render would make the server-rendered `disabled`
  // attribute mismatch the client's — React doesn't patch that up after hydration.
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- required for SSR-safe browser-capability detection, same pattern as useTasks' LocalStorage hydration
    setIsSupported(getSpeechRecognitionConstructor() !== null);
  }, []);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionConstructor();
    if (!Ctor || isListening) return;

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const alternatives: string[] = [];
      for (let i = 0; i < event.results.length; i++) {
        alternatives.push(event.results[i][0].transcript);
      }
      onResultRef.current(alternatives.join(" "));
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }, [isListening, lang]);

  // Stop any in-flight recognition if the component unmounts mid-listen.
  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  return { isSupported, isListening, start, stop };
}
