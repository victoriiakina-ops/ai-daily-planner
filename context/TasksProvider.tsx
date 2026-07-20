"use client";

import { createContext, ReactNode, useContext } from "react";
import { useTasks } from "@/hooks/useTasks";

type TasksContextValue = ReturnType<typeof useTasks>;

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const value = useTasks();
  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasksContext(): TasksContextValue {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasksContext must be used within a TasksProvider");
  }
  return context;
}
