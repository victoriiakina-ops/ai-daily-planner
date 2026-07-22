"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import { MicIcon, StopIcon } from "@/components/icons";
import { useCaptureDraftContext } from "@/context/CaptureDraftProvider";
import { useSpeechInput } from "@/hooks/useSpeechInput";
import { ProcessingOverlay } from "@/components/capture/ProcessingOverlay";

export function CaptureScreen() {
  const router = useRouter();
  const { phase, submitCapture, confirmDrafts } = useCaptureDraftContext();
  const [text, setText] = useState("");

  const handleSpeechResult = useCallback((transcript: string) => {
    setText((prev) => (prev.trim().length > 0 ? `${prev.trim()}\n${transcript}` : transcript));
  }, []);
  const { isSupported: isVoiceSupported, isListening, start, stop } = useSpeechInput({
    onResult: handleSpeechResult,
  });

  const isProcessing = phase === "processing" || phase === "done";

  const handleConfirm = () => {
    if (text.trim().length === 0) return;
    submitCapture(text);
  };

  const handleFinished = () => {
    confirmDrafts();
    setText("");
    router.push("/today");
  };

  return (
    <div
      className="flex flex-1 flex-col px-5"
      style={{ paddingTop: "calc(var(--safe-top) + 24px)" }}
    >
      <h1 className="text-[26px] font-semibold leading-tight text-foreground">
        {t.capture.prompt}
      </h1>

      <div className="relative mt-6 flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.capture.prompt}
          autoFocus
          className="h-full w-full resize-none rounded-[20px] border border-transparent bg-black/[0.03] p-4 pb-16 text-[16px] leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-2 focus:border-accent/40 focus:bg-surface"
        />
        <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center">
          {isListening && (
            <>
              <span className="absolute inset-0 rounded-full bg-accent opacity-75 animate-ping" />
              <span className="absolute -inset-2 rounded-full bg-accent/30 animate-pulse" />
            </>
          )}
          <button
            type="button"
            aria-label={isListening ? t.a11y.stopVoiceInput : t.a11y.voiceInput}
            aria-pressed={isListening}
            disabled={!isVoiceSupported}
            onClick={isListening ? stop : start}
            className={`relative flex h-11 w-11 items-center justify-center rounded-full shadow-[0_4px_12px_rgba(244,156,152,0.4)] transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:shadow-none ${
              isListening ? "bg-dark-surface text-accent" : "bg-accent text-dark-surface"
            }`}
          >
            {isListening ? <StopIcon className="h-4 w-4" /> : <MicIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={text.trim().length === 0}
        className="my-5 flex h-12 w-full items-center justify-center rounded-full bg-accent text-[16px] font-semibold text-dark-surface transition-transform active:scale-[0.98] disabled:opacity-40"
      >
        {t.capture.confirm}
      </button>

      {isProcessing && (
        <ProcessingOverlay isComplete={phase === "done"} onFinished={handleFinished} />
      )}
    </div>
  );
}
