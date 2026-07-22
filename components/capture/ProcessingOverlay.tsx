"use client";

import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import { CaptureIcon } from "@/components/icons";

const STEP_LABELS = [
  t.processing.step1,
  t.processing.step2,
  t.processing.step3,
  t.processing.step4,
  t.processing.step5,
] as const;

const STEP_DWELL_MS = 550;

/**
 * Runs its own fixed-schedule step animation, independent of how long the real
 * extraction call takes — so a slower/real AI backend can replace the simulated
 * one later with no changes here. Only finishes once the animation has reached
 * its last step AND the real work (isComplete) has actually resolved.
 */
export function ProcessingOverlay({
  isComplete,
  onFinished,
}: {
  isComplete: boolean;
  onFinished: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const reachedLastStep = stepIndex === STEP_LABELS.length - 1;

  useEffect(() => {
    if (stepIndex >= STEP_LABELS.length - 1) return;
    const timer = setTimeout(() => setStepIndex((i) => i + 1), STEP_DWELL_MS);
    return () => clearTimeout(timer);
  }, [stepIndex]);

  useEffect(() => {
    if (!reachedLastStep || !isComplete) return;
    const timer = setTimeout(onFinished, STEP_DWELL_MS);
    return () => clearTimeout(timer);
  }, [reachedLastStep, isComplete, onFinished]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-surface">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
        <CaptureIcon className={`h-7 w-7 ${reachedLastStep ? "" : "animate-pulse"}`} filled />
      </div>
      <p className="text-[16px] font-medium text-foreground">{STEP_LABELS[stepIndex]}</p>
      <div className="flex items-center gap-1.5">
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
              i <= stepIndex ? "bg-accent" : "bg-muted-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
