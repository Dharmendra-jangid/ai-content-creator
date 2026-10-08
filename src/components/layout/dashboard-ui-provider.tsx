"use client";

import { createContext, use, useMemo, useState, type ReactNode } from "react";

type DashboardUiContextValue = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
};

const DashboardUiContext = createContext<DashboardUiContextValue | null>(null);

export function DashboardUiProvider({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const value = useMemo(
    () => ({ mobileNavOpen, setMobileNavOpen }),
    [mobileNavOpen],
  );

  return (
    <DashboardUiContext.Provider value={value}>
      {children}
    </DashboardUiContext.Provider>
  );
}

export function useDashboardUi() {
  const context = use(DashboardUiContext);

  if (!context) {
    throw new Error("useDashboardUi must be used within DashboardUiProvider");
  }

  return context;
}
