"use client";

import { ReactNode, useEffect } from "react";

export function BottomSheet({
  isOpen,
  onClose,
  title,
  headerLeft,
  headerRight,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  children: ReactNode;
}) {
  // Prevent background scroll while a sheet is open.
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-40 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[28px] bg-surface shadow-[0_-8px_30px_rgba(0,0,0,0.12)] transition-all duration-200 ease-out ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
        style={{ paddingBottom: "var(--safe-bottom)" }}
      >
        <div className="mx-auto mt-2.5 h-1.25 w-9 shrink-0 rounded-full bg-muted-2/70" />

        <div className="flex shrink-0 items-center justify-between px-2 pb-1 pt-2">
          <div className="flex min-w-[64px] items-center">{headerLeft}</div>
          <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <div className="flex min-w-[64px] items-center justify-end">
            {headerRight}
          </div>
        </div>

        <div className="overflow-y-auto px-5 pb-6 pt-3">{children}</div>
      </div>
    </div>
  );
}
