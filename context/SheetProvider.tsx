"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface SheetContextValue {
  isAddOpen: boolean;
  openAddSheet: () => void;
  closeAddSheet: () => void;

  detailTaskId: string | null;
  openDetailSheet: (taskId: string) => void;
  closeDetailSheet: () => void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

export function SheetProvider({ children }: { children: ReactNode }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);

  const value: SheetContextValue = {
    isAddOpen,
    openAddSheet: () => setIsAddOpen(true),
    closeAddSheet: () => setIsAddOpen(false),
    detailTaskId,
    openDetailSheet: (taskId: string) => setDetailTaskId(taskId),
    closeDetailSheet: () => setDetailTaskId(null),
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
