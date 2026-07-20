"use client";

import { Task } from "@/lib/types";

export function TaskRow({
  task,
  onToggleComplete,
  onOpen,
}: {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onOpen: (task: Task) => void;
}) {
  const isCompleted = task.status === "completed";

  return (
    <div className="flex items-stretch">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete(task);
        }}
        aria-pressed={isCompleted}
        aria-label={
          isCompleted
            ? `Mark "${task.title}" as not complete`
            : `Mark "${task.title}" as complete`
        }
        className="flex h-11 w-11 shrink-0 items-center justify-center"
      >
        <span
          className={`flex h-[23px] w-[23px] items-center justify-center rounded-full border-[1.75px] transition-colors duration-150 ${
            isCompleted ? "border-accent bg-accent" : "border-muted-2 bg-transparent"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`h-3.5 w-3.5 text-white transition-opacity duration-150 ${
              isCompleted ? "opacity-100" : "opacity-0"
            }`}
          >
            <path
              d="M6 12.5 10 16.5 18 8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <button
        type="button"
        onClick={() => onOpen(task)}
        className="flex min-h-[52px] min-w-0 flex-1 flex-col items-start justify-center py-2.5 pr-4 text-left transition-colors duration-100 active:bg-black/[0.025]"
      >
        <span
          className={`w-full truncate text-[16px] leading-snug transition-opacity duration-150 ${
            isCompleted ? "text-muted line-through opacity-70" : "text-foreground"
          }`}
        >
          {task.title}
        </span>
        {task.notes && (
          <span className="mt-0.5 w-full truncate text-[13px] leading-snug text-muted">
            {task.notes}
          </span>
        )}
      </button>
    </div>
  );
}
