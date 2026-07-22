"use client";

import { useCallback, useEffect, useState } from "react";
import { createId } from "@/lib/id";
import { getTasks, saveTasks } from "@/lib/storage";
import { CreateTaskInput, Task, UpdateTaskInput } from "@/lib/types";
import { ExtractedTaskDraft } from "@/lib/ai/types";
import { todayIsoDate } from "@/lib/date";

function isToday(date?: string): boolean {
  return date !== undefined && date === todayIsoDate();
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage once, on mount. This must run in an effect (not a lazy
  // initializer) because LocalStorage is unavailable during server-side rendering.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- required for SSR-safe hydration from LocalStorage
    setTasks(getTasks());
    setIsLoaded(true);
  }, []);

  // Persist to LocalStorage whenever tasks change, after the initial load.
  useEffect(() => {
    if (!isLoaded) return;
    saveTasks(tasks);
  }, [tasks, isLoaded]);

  const createTask = useCallback((input: CreateTaskInput) => {
    const newTask: Task = {
      id: createId(),
      title: input.title.trim(),
      notes: input.notes?.trim() || undefined,
      status: isToday(input.date) ? "today" : "inbox",
      priority: input.priority ?? "medium",
      date: input.date,
      time: input.time,
      durationMinutes: input.durationMinutes,
      subtasks: [],
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  /** Batches drafts extracted from a capture session into real tasks in a single update. */
  const createTasksFromDrafts = useCallback((drafts: ExtractedTaskDraft[]) => {
    const now = new Date().toISOString();
    const newTasks: Task[] = drafts.map((draft) => ({
      id: createId(),
      title: draft.title.trim(),
      notes: draft.notes?.trim() || undefined,
      status: isToday(draft.date) ? "today" : "inbox",
      priority: draft.priority,
      date: draft.date,
      durationMinutes: draft.durationMinutes,
      subtasks: [],
      createdAt: now,
    }));
    setTasks((prev) => [...newTasks, ...prev]);
    return newTasks;
  }, []);

  const updateTask = useCallback((id: string, input: UpdateTaskInput) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const dateChanged = input.date !== undefined;
        const nextDate = dateChanged ? input.date ?? undefined : task.date;
        // Changing the date implicitly re-buckets the task, unless it's already completed.
        const nextStatus =
          dateChanged && task.status !== "completed"
            ? isToday(nextDate)
              ? "today"
              : "inbox"
            : task.status;

        return {
          ...task,
          title: input.title !== undefined ? input.title.trim() : task.title,
          notes:
            input.notes !== undefined ? input.notes.trim() || undefined : task.notes,
          priority: input.priority ?? task.priority,
          date: nextDate,
          time: input.time !== undefined ? input.time ?? undefined : task.time,
          durationMinutes:
            input.durationMinutes !== undefined
              ? input.durationMinutes ?? undefined
              : task.durationMinutes,
          subtasks: input.subtasks ?? task.subtasks,
          status: nextStatus,
        };
      })
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const moveTask = useCallback((id: string, destination: "inbox" | "today") => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: destination } : task
      )
    );
  }, []);

  const completeTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id && task.status !== "completed"
          ? {
              ...task,
              previousStatus: task.status,
              status: "completed",
              completedAt: new Date().toISOString(),
            }
          : task
      )
    );
  }, []);

  const uncompleteTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id && task.status === "completed"
          ? {
              ...task,
              status: task.previousStatus ?? "inbox",
              previousStatus: undefined,
              completedAt: undefined,
            }
          : task
      )
    );
  }, []);

  const getTask = useCallback(
    (id: string) => tasks.find((task) => task.id === id),
    [tasks]
  );

  return {
    tasks,
    isLoaded,
    createTask,
    createTasksFromDrafts,
    updateTask,
    deleteTask,
    moveTask,
    completeTask,
    uncompleteTask,
    getTask,
  };
}
