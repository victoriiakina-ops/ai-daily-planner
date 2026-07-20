"use client";

import { useEffect, useRef, useState } from "react";

export function TaskForm({
  formId,
  initialTitle = "",
  initialNotes = "",
  autoFocus = false,
  onSubmit,
  onCanSubmitChange,
}: {
  formId: string;
  initialTitle?: string;
  initialNotes?: string;
  autoFocus?: boolean;
  onSubmit: (title: string, notes: string) => void;
  onCanSubmitChange?: (canSubmit: boolean) => void;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [notes, setNotes] = useState(initialNotes);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      // Slight delay lets the sheet's enter transition finish first.
      const t = setTimeout(() => titleRef.current?.focus(), 220);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  useEffect(() => {
    onCanSubmitChange?.(title.trim().length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length === 0) return;
    onSubmit(title, notes);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          className="px-1 text-[13px] font-medium text-muted"
          htmlFor={`${formId}-title`}
        >
          Title
        </label>
        <input
          ref={titleRef}
          id={`${formId}-title`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          enterKeyHint="done"
          autoComplete="off"
          className="min-h-11 rounded-[14px] border border-transparent bg-black/[0.045] px-4 py-3 text-[16px] leading-tight text-foreground outline-none transition-colors placeholder:text-muted-2 focus:border-accent/40 focus:bg-surface focus:ring-4 focus:ring-accent-soft"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          className="px-1 text-[13px] font-medium text-muted"
          htmlFor={`${formId}-notes`}
        >
          Notes
        </label>
        <textarea
          id={`${formId}-notes`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes (optional)"
          rows={3}
          className="resize-none rounded-[14px] border border-transparent bg-black/[0.045] px-4 py-3 text-[15px] leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-2 focus:border-accent/40 focus:bg-surface focus:ring-4 focus:ring-accent-soft"
        />
      </div>
    </form>
  );
}
