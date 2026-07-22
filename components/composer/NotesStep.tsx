"use client";

import { useState } from "react";
import { createId } from "@/lib/id";
import { Subtask } from "@/lib/types";
import { t } from "@/lib/i18n";

export function NotesStep({
  notes,
  subtasks,
  onNotesChange,
  onSubtasksChange,
}: {
  notes: string;
  subtasks: Subtask[];
  onNotesChange: (notes: string) => void;
  onSubtasksChange: (subtasks: Subtask[]) => void;
}) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const addSubtask = () => {
    const title = newSubtaskTitle.trim();
    if (!title) return;
    onSubtasksChange([...subtasks, { id: createId(), title, done: false }]);
    setNewSubtaskTitle("");
  };

  const toggleSubtask = (id: string) => {
    onSubtasksChange(subtasks.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
  };

  const removeSubtask = (id: string) => {
    onSubtasksChange(subtasks.filter((s) => s.id !== id));
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="px-1 text-[13px] font-medium text-muted" htmlFor="composer-notes">
          {t.composer.notesLabel}
        </label>
        <textarea
          id="composer-notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={t.composer.notesPlaceholder}
          rows={3}
          className="resize-none rounded-[14px] border border-transparent bg-black/[0.045] px-4 py-3 text-[15px] leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-2 focus:border-accent/40 focus:bg-surface focus:ring-4 focus:ring-accent-soft"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="px-1 text-[13px] font-medium text-muted">{t.composer.subtasksLabel}</span>
        <div className="flex flex-col gap-1.5">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center gap-2.5 rounded-[12px] bg-black/[0.03] px-3 py-2.5"
            >
              <button
                type="button"
                onClick={() => toggleSubtask(subtask.id)}
                aria-pressed={subtask.done}
                aria-label={
                  subtask.done
                    ? t.a11y.markIncomplete(subtask.title)
                    : t.a11y.markComplete(subtask.title)
                }
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                  subtask.done ? "border-accent bg-accent" : "border-muted-2"
                }`}
              />
              <span
                className={`flex-1 truncate text-[14px] ${
                  subtask.done ? "text-muted line-through" : "text-foreground"
                }`}
              >
                {subtask.title}
              </span>
              <button
                type="button"
                onClick={() => removeSubtask(subtask.id)}
                className="text-[14px] font-medium text-muted"
                aria-label={t.a11y.removeSubtask(subtask.title)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSubtask();
              }
            }}
            placeholder={t.composer.addSubtaskPlaceholder}
            className="min-h-10 flex-1 rounded-[12px] border border-transparent bg-black/[0.045] px-3 py-2 text-[14px] text-foreground outline-none placeholder:text-muted-2 focus:border-accent/40 focus:bg-surface"
          />
          <button
            type="button"
            onClick={addSubtask}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
            aria-label={t.a11y.addSubtask}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
