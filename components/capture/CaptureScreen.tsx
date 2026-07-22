"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";
import { MicIcon } from "@/components/icons";
import { useCaptureDraftContext } from "@/context/CaptureDraftProvider";
import { ProcessingOverlay } from "@/components/capture/ProcessingOverlay";

export function CaptureScreen() {
  const router = useRouter();
  const { phase, submitCapture, confirmDrafts } = useCaptureDraftContext();
  const [text, setText] = useState("");

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
        <button
          type="button"
          aria-label={t.a11y.voiceInput}
          className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-dark-surface shadow-[0_4px_12px_rgba(244,156,152,0.4)] transition-transform active:scale-95"
        >
          <MicIcon className="h-5 w-5" />
        </button>
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
