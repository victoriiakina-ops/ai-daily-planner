"use client";

import { useMemo } from "react";
import { t } from "@/lib/i18n";

function buildTimeOptions(): string[] {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      options.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    }
  }
  return options;
}

export function TimeStep({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const options = useMemo(() => buildTimeOptions(), []);

  return (
    <div className="flex flex-col gap-3">
      <div className="max-h-64 snap-y snap-mandatory overflow-y-auto rounded-[14px] bg-black/[0.03]">
        {options.map((time) => {
          const isSelected = time === value;
          return (
            <button
              key={time}
              type="button"
              onClick={() => onChange(time)}
              className={`block w-full snap-center px-4 py-2.5 text-center text-[15px] transition-colors ${
                isSelected ? "font-semibold text-accent" : "text-foreground"
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>
      {value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="self-start px-1 text-[13px] font-medium text-muted underline underline-offset-2"
        >
          {t.composer.clearTime}
        </button>
      )}
    </div>
  );
}
