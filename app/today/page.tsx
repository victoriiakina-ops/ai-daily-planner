"use client";

import { ViewHeader } from "@/components/ViewHeader";
import { TaskList } from "@/components/TaskList";
import { EmptyState } from "@/components/EmptyState";
import { TodayIcon } from "@/components/icons";
import { useTasksContext } from "@/context/TasksProvider";
import { useSheetContext } from "@/context/SheetProvider";
import { Task } from "@/lib/types";

export default function TodayPage() {
  const { tasks, completeTask, uncompleteTask } = useTasksContext();
  const { openDetailSheet } = useSheetContext();

  const todayTasks = tasks.filter((t) => t.status === "today");

  const handleToggle = (task: Task) => {
    if (task.status === "completed") uncompleteTask(task.id);
    else completeTask(task.id);
  };

  return (
    <>
      <ViewHeader title="Today" count={todayTasks.length} />
      <TaskList
        tasks={todayTasks}
        onToggleComplete={handleToggle}
        onOpen={(task) => openDetailSheet(task.id)}
        emptyState={
          <EmptyState
            icon={<TodayIcon className="h-6 w-6" />}
            title="Nothing planned for today"
            message="Pull something in from your Inbox to get started."
          />
        }
      />
    </>
  );
}
