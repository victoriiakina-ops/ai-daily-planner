"use client";

import { useEffect, useRef } from "react";
import { t } from "@/lib/i18n";

export function TitleStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 220);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="px-1 text-[13px] font-medium text-muted" htmlFor="composer-title">
        {t.composer.titleLabel}
      </label>
      <input
        ref={inputRef}
        id="composer-title"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        enterKeyHint="next"
        autoComplete="off"
        className="min-h-11 rounded-[14px] border border-transparent bg-black/[0.045] px-4 py-3 text-[16px] leading-tight text-foreground outline-none transition-colors placeholder:text-muted-2 focus:border-accent/40 focus:bg-surface focus:ring-4 focus:ring-accent-soft"
      />
    </div>
  );
}
