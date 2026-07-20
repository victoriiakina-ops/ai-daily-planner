"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { TaskForm } from "@/components/TaskForm";
import { SheetHeaderButton } from "@/components/SheetHeaderButton";
import { ArrowMoveIcon, CompletedIcon, TrashIcon } from "@/components/icons";
import { useSheetContext } from "@/context/SheetProvider";
import { useTasksContext } from "@/context/TasksProvider";

const FORM_ID = "edit-task-form";

export function TaskDetailSheet() {
  const { detailTaskId, closeDetailSheet } = useSheetContext();
  const { getTask, updateTask, deleteTask, moveTask, completeTask, uncompleteTask } =
    useTasksContext();
  const [canSubmit, setCanSubmit] = useState(true);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const task = detailTaskId ? getTask(detailTaskId) : undefined;
  const isOpen = Boolean(task);

  const handleClose = () => {
    setConfirmingDelete(false);
    closeDetailSheet();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="Task"
      headerLeft={<SheetHeaderButton label="Cancel" onClick={handleClose} />}
      headerRight={
        <SheetHeaderButton
          label="Save"
          type="submit"
          form={FORM_ID}
          variant="prominent"
          disabled={!canSubmit}
        />
      }
    >
      {task && (
        <div className="flex flex-col gap-6">
          <TaskForm
            formId={FORM_ID}
            initialTitle={task.title}
            initialNotes={task.notes ?? ""}
            onCanSubmitChange={setCanSubmit}
            onSubmit={(title, notes) => {
              updateTask(task.id, { title, notes });
              handleClose();
            }}
          />

          <div className="overflow-hidden rounded-[16px] bg-black/[0.03]">
            <ActionRow
              icon={<CompletedIcon className="h-[19px] w-[19px]" filled />}
              label={
                task.status === "completed" ? "Mark as Not Complete" : "Mark as Complete"
              }
              onClick={() => {
                if (task.status === "completed") uncompleteTask(task.id);
                else completeTask(task.id);
                handleClose();
              }}
            />

            {task.status !== "completed" && (
              <ActionRow
                icon={<ArrowMoveIcon className="h-[19px] w-[19px]" />}
                label={task.status === "inbox" ? "Move to Today" : "Move to Inbox"}
                onClick={() => {
                  moveTask(task.id, task.status === "inbox" ? "today" : "inbox");
                  handleClose();
                }}
              />
            )}

            <ActionRow
              icon={<TrashIcon className="h-[19px] w-[19px]" />}
              label={confirmingDelete ? "Tap again to confirm" : "Delete Task"}
              destructive
              highlighted={confirmingDelete}
              onClick={() => {
                if (confirmingDelete) {
                  deleteTask(task.id);
                  handleClose();
                } else {
                  setConfirmingDelete(true);
                }
              }}
            />
          </div>
        </div>
      )}
    </BottomSheet>
  );
}

function ActionRow({
  icon,
  label,
  onClick,
  destructive = false,
  highlighted = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
  highlighted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 border-b border-divider px-4 py-3.5 text-left text-[15px] font-medium transition-colors duration-150 last:border-b-0 active:bg-black/[0.04] ${
        destructive ? "text-destructive" : "text-foreground"
      } ${highlighted ? "bg-destructive-soft" : ""}`}
    >
      <span className={destructive ? "text-destructive" : "text-muted"}>{icon}</span>
      {label}
    </button>
  );
}
