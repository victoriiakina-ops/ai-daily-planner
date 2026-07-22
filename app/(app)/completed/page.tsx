"use client";

import { ViewHeader } from "@/components/ViewHeader";
import { TaskList } from "@/components/TaskList";
import { EmptyState } from "@/components/EmptyState";
import { CompletedIcon } from "@/components/icons";
import { useTasksContext } from "@/context/TasksProvider";
import { useSheetContext } from "@/context/SheetProvider";
import { Task } from "@/lib/types";
import { t, pluralizeUk } from "@/lib/i18n";

export default function CompletedPage() {
  const { tasks, completeTask, uncompleteTask, deleteTask } = useTasksContext();
  const { openComposer } = useSheetContext();

  const completedTasks = tasks
    .filter((task) => task.status === "completed")
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));

  const handleToggle = (task: Task) => {
    if (task.status === "completed") uncompleteTask(task.id);
    else completeTask(task.id);
  };

  const countLabel = pluralizeUk(
    completedTasks.length,
    t.common.taskOne,
    t.common.taskFew,
    t.common.taskMany
  );

  return (
    <>
      <ViewHeader
        title={t.nav.completed}
        subtitle={completedTasks.length > 0 ? `${completedTasks.length} ${countLabel}` : undefined}
      />
      <TaskList
        tasks={completedTasks}
        onToggleComplete={handleToggle}
        onOpen={(task) => openComposer(task.id)}
        onDelete={(task) => deleteTask(task.id)}
        emptyState={
          <EmptyState
            icon={<CompletedIcon className="h-6 w-6" />}
            title={t.completed.emptyTitle}
            message={t.completed.emptyMessage}
          />
        }
      />
    </>
  );
}
