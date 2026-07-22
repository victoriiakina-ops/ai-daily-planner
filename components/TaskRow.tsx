"use client";

import { useRef, useState } from "react";
import { Priority, Task } from "@/lib/types";
import { TrashIcon } from "@/components/icons";
import { t } from "@/lib/i18n";

const NEW_TASK_WINDOW_MS = 4000;
const DELETE_REVEAL_PX = 76;
const AUTO_DELETE_THRESHOLD_PX = 160;

const PRIORITY_COLORS: Record<Priority, string> = {
  high: "var(--priority-high)",
  medium: "var(--priority-medium)",
  low: "var(--priority-low)",
};

const PRIORITY_LABELS: Record<Priority, string> = {
  high: t.composer.priorityHigh,
  medium: t.composer.priorityMedium,
  low: t.composer.priorityLow,
};

function isRecentlyCreated(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < NEW_TASK_WINDOW_MS;
}

export function TaskRow({
  task,
  onToggleComplete,
  onOpen,
  onDelete,
}: {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onOpen: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const isCompleted = task.status === "completed";
  // Evaluated once at mount so the entrance animation only plays for genuinely
  // fresh rows (e.g. just landed here from Capture), never on a normal reload.
  const [isNew] = useState(() => isRecentlyCreated(task.createdAt));
  const [justToggled, setJustToggled] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(task);
    setJustToggled(true);
    setTimeout(() => setJustToggled(false), 280);
  };

  const dragStartRef = useRef<{ x: number; y: number; baseX: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY, baseX: isRevealed ? -DELETE_REVEAL_PX : 0 };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const dragStart = dragStartRef.current;
    if (!dragStart) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    if (!isDragging) {
      if (Math.abs(deltaX) < 8 || Math.abs(deltaY) > Math.abs(deltaX)) return;
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const nextX = Math.min(0, Math.max(-AUTO_DELETE_THRESHOLD_PX - 40, dragStart.baseX + deltaX));
    setDragX(nextX);
  };

  const handlePointerUp = () => {
    if (!isDragging) {
      dragStartRef.current = null;
      return;
    }
    setIsDragging(false);
    dragStartRef.current = null;

    if (dragX <= -AUTO_DELETE_THRESHOLD_PX) {
      onDelete(task);
      return;
    }
    if (dragX <= -DELETE_REVEAL_PX / 2) {
      setDragX(-DELETE_REVEAL_PX);
      setIsRevealed(true);
    } else {
      setDragX(0);
      setIsRevealed(false);
    }
  };

  const handleRowClick = () => {
    if (isRevealed) {
      setDragX(0);
      setIsRevealed(false);
      return;
    }
    onOpen(task);
  };

  return (
    <div className={`relative overflow-hidden ${isNew ? "animate-card-in" : ""}`}>
      <div className="absolute inset-y-0 right-0 flex w-[76px] items-stretch justify-center bg-destructive">
        <button
          type="button"
          onClick={() => onDelete(task)}
          aria-label={t.a11y.deleteTask(task.title)}
          className="flex w-full items-center justify-center text-white"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div
        className="relative flex items-stretch bg-surface"
        style={{
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? "none" : "transform 180ms ease-out",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <button
          type="button"
          onClick={handleToggle}
          aria-pressed={isCompleted}
          aria-label={
            isCompleted ? t.a11y.markIncomplete(task.title) : t.a11y.markComplete(task.title)
          }
          className="flex h-11 w-11 shrink-0 items-center justify-center"
        >
          <span
            className={`flex h-[23px] w-[23px] items-center justify-center rounded-full border-[1.75px] transition-colors duration-150 ${
              isCompleted ? "border-accent bg-accent" : "border-muted-2 bg-transparent"
            } ${justToggled ? "animate-check-pop" : ""}`}
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
          onClick={handleRowClick}
          className="flex min-h-[52px] min-w-0 flex-1 items-center justify-between gap-2 py-2.5 pr-4 text-left transition-colors duration-100 active:bg-black/[0.025]"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
            />
            <div className="flex min-w-0 flex-col items-start">
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
            </div>
          </div>

          {task.time ? (
            <span className="shrink-0 text-[12px] font-medium text-muted">{task.time}</span>
          ) : (
            task.priority !== "medium" && (
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: `color-mix(in srgb, ${PRIORITY_COLORS[task.priority]} 16%, transparent)`,
                  color: PRIORITY_COLORS[task.priority],
                }}
              >
                {PRIORITY_LABELS[task.priority]}
              </span>
            )
          )}
        </button>
      </div>
    </div>
  );
}
