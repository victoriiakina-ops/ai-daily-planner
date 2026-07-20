"use client";

import { useCallback, useEffect, useState } from "react";
import { createId } from "@/lib/id";
import { getTasks, saveTasks } from "@/lib/storage";
import { CreateTaskInput, Task, UpdateTaskInput } from "@/lib/types";

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
      status: "inbox",
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, input: UpdateTaskInput) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              title: input.title !== undefined ? input.title.trim() : task.title,
              notes:
                input.notes !== undefined ? input.notes.trim() || undefined : task.notes,
            }
          : task
      )
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
    updateTask,
    deleteTask,
    moveTask,
    completeTask,
    uncompleteTask,
    getTask,
  };
}
