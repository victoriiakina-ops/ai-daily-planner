"use client";

import { ViewHeader } from "@/components/ViewHeader";
import { TaskList } from "@/components/TaskList";
import { EmptyState } from "@/components/EmptyState";
import { CompletedIcon } from "@/components/icons";
import { useTasksContext } from "@/context/TasksProvider";
import { useSheetContext } from "@/context/SheetProvider";
import { Task } from "@/lib/types";

export default function CompletedPage() {
  const { tasks, completeTask, uncompleteTask } = useTasksContext();
  const { openDetailSheet } = useSheetContext();

  const completedTasks = tasks
    .filter((t) => t.status === "completed")
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));

  const handleToggle = (task: Task) => {
    if (task.status === "completed") uncompleteTask(task.id);
    else completeTask(task.id);
  };

  return (
    <>
      <ViewHeader title="Completed" count={completedTasks.length} />
      <TaskList
        tasks={completedTasks}
        onToggleComplete={handleToggle}
        onOpen={(task) => openDetailSheet(task.id)}
        emptyState={
          <EmptyState
            icon={<CompletedIcon className="h-6 w-6" />}
            title="Nothing completed yet"
            message="Tasks you finish will show up here."
          />
        }
      />
    </>
  );
}
