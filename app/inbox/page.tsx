"use client";

import { ViewHeader } from "@/components/ViewHeader";
import { TaskList } from "@/components/TaskList";
import { EmptyState } from "@/components/EmptyState";
import { InboxIcon } from "@/components/icons";
import { useTasksContext } from "@/context/TasksProvider";
import { useSheetContext } from "@/context/SheetProvider";
import { Task } from "@/lib/types";

export default function InboxPage() {
  const { tasks, completeTask, uncompleteTask } = useTasksContext();
  const { openDetailSheet } = useSheetContext();

  const inboxTasks = tasks.filter((t) => t.status === "inbox");

  const handleToggle = (task: Task) => {
    if (task.status === "completed") uncompleteTask(task.id);
    else completeTask(task.id);
  };

  return (
    <>
      <ViewHeader title="Inbox" count={inboxTasks.length} />
      <TaskList
        tasks={inboxTasks}
        onToggleComplete={handleToggle}
        onOpen={(task) => openDetailSheet(task.id)}
        emptyState={
          <EmptyState
            icon={<InboxIcon className="h-6 w-6" />}
            title="Inbox zero"
            message="Nice. Tap the + button to capture something new."
          />
        }
      />
    </>
  );
}
