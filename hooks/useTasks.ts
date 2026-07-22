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

  /**
   * Applies a mutation and persists the result in the same synchronous pass, rather
   * than via a separate effect reacting to `tasks` afterward. A deferred effect
   * leaves a real window between "React commits the new state" and "the effect
   * actually writes to LocalStorage" — on mobile Safari, which can reclaim a
   * foreground tab's JS context under memory pressure without the user ever
   * backgrounding it, anything landing in that window is silently lost, and the
   * next load reads the stale pre-mutation snapshot. Persisting inside the updater
   * itself (which React invokes synchronously while processing the state update)
   * closes that window entirely.
   */
  const mutate = useCallback((updater: (prev: Task[]) => Task[]) => {
    setTasks((prev) => {
      const next = updater(prev);
      saveTasks(next);
      return next;
    });
  }, []);

  const createTask = useCallback(
    (input: CreateTaskInput) => {
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
      mutate((prev) => [newTask, ...prev]);
      return newTask;
    },
    [mutate]
  );

  /** Batches drafts extracted from a capture session into real tasks in a single update. */
  const createTasksFromDrafts = useCallback(
    (drafts: ExtractedTaskDraft[]) => {
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
      mutate((prev) => [...newTasks, ...prev]);
      return newTasks;
    },
    [mutate]
  );

  const updateTask = useCallback(
    (id: string, input: UpdateTaskInput) => {
      mutate((prev) =>
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
    },
    [mutate]
  );

  const deleteTask = useCallback(
    (id: string) => {
      mutate((prev) => prev.filter((task) => task.id !== id));
    },
    [mutate]
  );

  const moveTask = useCallback(
    (id: string, destination: "inbox" | "today") => {
      mutate((prev) =>
        prev.map((task) => (task.id === id ? { ...task, status: destination } : task))
      );
    },
    [mutate]
  );

  const completeTask = useCallback(
    (id: string) => {
      mutate((prev) =>
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
    },
    [mutate]
  );

  const uncompleteTask = useCallback(
    (id: string) => {
      mutate((prev) =>
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
    },
    [mutate]
  );

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
