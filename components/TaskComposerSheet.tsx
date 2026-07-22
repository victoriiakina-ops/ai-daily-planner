"use client";

import { useEffect, useState } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { SheetHeaderButton } from "@/components/SheetHeaderButton";
import { useSheetContext } from "@/context/SheetProvider";
import { useTasksContext } from "@/context/TasksProvider";
import { Priority, Subtask } from "@/lib/types";
import { t } from "@/lib/i18n";
import { TitleStep } from "@/components/composer/TitleStep";
import { PriorityStep } from "@/components/composer/PriorityStep";
import { DateStep } from "@/components/composer/DateStep";
import { TimeStep } from "@/components/composer/TimeStep";
import { NotesStep } from "@/components/composer/NotesStep";

const STEPS = ["title", "priority", "date", "time", "notes"] as const;
type Step = (typeof STEPS)[number];

const STEP_TITLES: Record<Step, string> = {
  title: t.composer.titleStep,
  priority: t.composer.priorityStep,
  date: t.composer.dateStep,
  time: t.composer.timeStep,
  notes: t.composer.notesStep,
};

interface Draft {
  title: string;
  priority: Priority;
  date: string | null;
  time: string | null;
  notes: string;
  subtasks: Subtask[];
}

/**
 * Edit-only, multi-step task sheet (Title -> Priority -> Date -> Time -> Notes/Subtasks).
 * There is no create mode — every task originates from the Capture -> AI flow.
 */
export function TaskComposerSheet() {
  const { composerTaskId, closeComposer } = useSheetContext();
  const { getTask, updateTask } = useTasksContext();
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<Draft | null>(null);

  const task = composerTaskId ? getTask(composerTaskId) : undefined;
  const isOpen = Boolean(task);

  // Re-seed the draft whenever a (different) task is opened, and start from step 1.
  useEffect(() => {
    if (!task) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating local edit state from the newly-selected task, same pattern as useTasks' LocalStorage hydration
    setDraft({
      title: task.title,
      priority: task.priority,
      date: task.date ?? null,
      time: task.time ?? null,
      notes: task.notes ?? "",
      subtasks: task.subtasks,
    });
    setStepIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id]);

  const handleClose = () => {
    closeComposer();
  };

  const handleSave = () => {
    if (!task || !draft) return;
    updateTask(task.id, {
      title: draft.title,
      notes: draft.notes,
      priority: draft.priority,
      date: draft.date,
      time: draft.time,
      subtasks: draft.subtasks,
    });
    handleClose();
  };

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const step = STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEPS.length - 1;
  const canContinue = draft !== null && (step !== "title" || draft.title.trim().length > 0);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={STEP_TITLES[step]}
      headerLeft={
        <SheetHeaderButton
          label={isFirstStep ? t.common.cancel : t.common.back}
          onClick={isFirstStep ? handleClose : goBack}
        />
      }
      headerRight={
        <SheetHeaderButton
          label={isLastStep ? t.common.save : t.common.continue}
          variant="prominent"
          disabled={!canContinue}
          onClick={isLastStep ? handleSave : goNext}
        />
      }
    >
      {draft && (
        <div key={step} className="animate-step-in">
          {step === "title" && (
            <TitleStep value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
          )}
          {step === "priority" && (
            <PriorityStep
              value={draft.priority}
              onChange={(priority) => setDraft({ ...draft, priority })}
            />
          )}
          {step === "date" && (
            <DateStep value={draft.date} onChange={(date) => setDraft({ ...draft, date })} />
          )}
          {step === "time" && (
            <TimeStep value={draft.time} onChange={(time) => setDraft({ ...draft, time })} />
          )}
          {step === "notes" && (
            <NotesStep
              notes={draft.notes}
              subtasks={draft.subtasks}
              onNotesChange={(notes) => setDraft({ ...draft, notes })}
              onSubtasksChange={(subtasks) => setDraft({ ...draft, subtasks })}
            />
          )}
        </div>
      )}
    </BottomSheet>
  );
}
