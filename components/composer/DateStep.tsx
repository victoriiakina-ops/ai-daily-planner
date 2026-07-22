"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";
import { toIsoDate, todayIsoDate } from "@/lib/date";

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildMonthGrid(monthDate: Date): (Date | null)[] {
  const first = startOfMonth(monthDate);
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const leadingBlanks = (first.getDay() + 6) % 7; // Monday-first grid.
  const cells: (Date | null)[] = Array(leadingBlanks).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), day));
  }
  return cells;
}

export function DateStep({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(value ? new Date(value) : new Date())
  );

  const cells = buildMonthGrid(visibleMonth);
  const todayIso = todayIsoDate();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() =>
            setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))
          }
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted active:bg-black/[0.04]"
          aria-label={t.a11y.previousMonth}
        >
          ‹
        </button>
        <span className="text-[14px] font-semibold text-foreground">
          {visibleMonth.toLocaleDateString("uk-UA", { month: "long", year: "numeric" })}
        </span>
        <button
          type="button"
          onClick={() =>
            setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))
          }
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted active:bg-black/[0.04]"
          aria-label={t.a11y.nextMonth}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) return <div key={`blank-${i}`} />;
          const iso = toIsoDate(cell);
          const isSelected = iso === value;
          const isToday = iso === todayIso;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onChange(isSelected ? null : iso)}
              className={`flex h-9 items-center justify-center rounded-full text-[13px] transition-colors ${
                isSelected
                  ? "bg-accent font-semibold text-dark-surface"
                  : isToday
                    ? "font-semibold text-accent"
                    : "text-foreground active:bg-black/[0.04]"
              }`}
            >
              {cell.getDate()}
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
          {t.composer.clearDate}
        </button>
      )}
    </div>
  );
}
