"use client";

import { ReactNode } from "react";
import { Task } from "@/lib/types";
import { TaskRow } from "@/components/TaskRow";

export function TaskList({
  tasks,
  onToggleComplete,
  onOpen,
  onDelete,
  emptyState,
}: {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onOpen: (task: Task) => void;
  onDelete: (task: Task) => void;
  emptyState: ReactNode;
}) {
  if (tasks.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className="mx-5 overflow-hidden rounded-[18px] bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {tasks.map((task, index) => (
        <div key={task.id} className="relative">
          <TaskRow task={task} onToggleComplete={onToggleComplete} onOpen={onOpen} onDelete={onDelete} />
          {index < tasks.length - 1 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-divider" style={{ left: 44 }} />
          )}
        </div>
      ))}
    </div>
  );
}
