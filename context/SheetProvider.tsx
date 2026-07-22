"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface SheetContextValue {
  composerTaskId: string | null;
  openComposer: (taskId: string) => void;
  closeComposer: () => void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

export function SheetProvider({ children }: { children: ReactNode }) {
  const [composerTaskId, setComposerTaskId] = useState<string | null>(null);

  const value: SheetContextValue = {
    composerTaskId,
    openComposer: (taskId: string) => setComposerTaskId(taskId),
    closeComposer: () => setComposerTaskId(null),
  };

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}

export function useSheetContext(): SheetContextValue {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("useSheetContext must be used within a SheetProvider");
  }
  return context;
}
