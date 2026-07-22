"use client";

import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { useTasksContext } from "@/context/TasksProvider";
import { getAiPlannerService } from "@/lib/ai";
import { ExtractedTaskDraft } from "@/lib/ai/types";

type CapturePhase = "idle" | "processing" | "done" | "error";

interface CaptureDraftContextValue {
  phase: CapturePhase;
  drafts: ExtractedTaskDraft[];
  submitCapture: (rawText: string) => void;
  /** Persists the current drafts as real tasks and resets back to idle. */
  confirmDrafts: () => void;
  reset: () => void;
}

const CaptureDraftContext = createContext<CaptureDraftContextValue | null>(null);

export function CaptureDraftProvider({ children }: { children: ReactNode }) {
  const { createTasksFromDrafts } = useTasksContext();
  const [phase, setPhase] = useState<CapturePhase>("idle");
  const [drafts, setDrafts] = useState<ExtractedTaskDraft[]>([]);

  const submitCapture = useCallback((rawText: string) => {
    setPhase("processing");
    getAiPlannerService()
      .extractTasks(rawText)
      .then((result) => {
        setDrafts(result);
        setPhase("done");
      })
      .catch(() => {
        setPhase("error");
      });
  }, []);

  const confirmDrafts = useCallback(() => {
    createTasksFromDrafts(drafts);
    setDrafts([]);
    setPhase("idle");
  }, [createTasksFromDrafts, drafts]);

  const reset = useCallback(() => {
    setDrafts([]);
    setPhase("idle");
  }, []);

  return (
    <CaptureDraftContext.Provider
      value={{ phase, drafts, submitCapture, confirmDrafts, reset }}
    >
      {children}
    </CaptureDraftContext.Provider>
  );
}

export function useCaptureDraftContext(): CaptureDraftContextValue {
  const context = useContext(CaptureDraftContext);
  if (!context) {
    throw new Error("useCaptureDraftContext must be used within a CaptureDraftProvider");
  }
  return context;
}
