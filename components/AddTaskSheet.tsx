"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/BottomSheet";
import { TaskForm } from "@/components/TaskForm";
import { SheetHeaderButton } from "@/components/SheetHeaderButton";
import { useSheetContext } from "@/context/SheetProvider";
import { useTasksContext } from "@/context/TasksProvider";

const FORM_ID = "add-task-form";

export function AddTaskSheet() {
  const { isAddOpen, closeAddSheet } = useSheetContext();
  const { createTask } = useTasksContext();
  const [canSubmit, setCanSubmit] = useState(false);

  return (
    <BottomSheet
      isOpen={isAddOpen}
      onClose={closeAddSheet}
      title="New Task"
      headerLeft={<SheetHeaderButton label="Cancel" onClick={closeAddSheet} />}
      headerRight={
        <SheetHeaderButton
          label="Add"
          type="submit"
          form={FORM_ID}
          variant="prominent"
          disabled={!canSubmit}
        />
      }
    >
      {/* Remount the form each time the sheet opens so fields reset. */}
      {isAddOpen && (
        <TaskForm
          formId={FORM_ID}
          autoFocus
          onCanSubmitChange={setCanSubmit}
          onSubmit={(title, notes) => {
            createTask({ title, notes });
            closeAddSheet();
          }}
        />
      )}
    </BottomSheet>
  );
}
