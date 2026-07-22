"use client";

import { Priority } from "@/lib/types";
import { t } from "@/lib/i18n";

const OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: "low", label: t.composer.priorityLow, color: "var(--priority-low)" },
  { value: "medium", label: t.composer.priorityMedium, color: "var(--priority-medium)" },
  { value: "high", label: t.composer.priorityHigh, color: "var(--priority-high)" },
];

export function PriorityStep({
  value,
  onChange,
}: {
  value: Priority;
  onChange: (value: Priority) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-3 rounded-[14px] border px-4 py-3.5 text-left text-[15px] font-medium transition-colors ${
              active ? "border-accent/40 bg-accent-soft" : "border-transparent bg-black/[0.03]"
            }`}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: option.color }}
            />
            <span className="text-foreground">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
