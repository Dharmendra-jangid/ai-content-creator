"use client";

import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CreditSnapshot, UserProfile } from "@/types";

type DashboardUserContextValue = {
  user: UserProfile;
  applyCreditSnapshot: (snapshot: CreditSnapshot) => void;
};

const DashboardUserContext = createContext<DashboardUserContextValue | null>(null);

function profileStamp(user: UserProfile) {
  return [
    user.id,
    user.plan,
    user.creditsRemaining,
    user.creditsLimit,
    user.creditsUsed,
    user.creditsResetAt,
    user.creditsTracked,
    user.subscription.status,
    user.subscription.periodEnd,
  ].join(":");
}

export function DashboardUserProvider({
  user,
  children,
}: {
  user: UserProfile;
  children: ReactNode;
}) {
  const [current, setCurrent] = useState(user);
  const [stamp, setStamp] = useState(() => profileStamp(user));
  const nextStamp = profileStamp(user);

  if (stamp !== nextStamp) {
    setStamp(nextStamp);
    setCurrent(user);
  }

  const applyCreditSnapshot = useCallback((snapshot: CreditSnapshot) => {
    setCurrent((existing) => ({ ...existing, ...snapshot, creditsTracked: true }));
  }, []);

  const value = useMemo(
    () => ({ user: current, applyCreditSnapshot }),
    [applyCreditSnapshot, current],
  );

  return (
    <DashboardUserContext.Provider value={value}>
      {children}
    </DashboardUserContext.Provider>
  );
}

export function useDashboardUser() {
  const context = use(DashboardUserContext);

  if (!context) {
    throw new Error("useDashboardUser must be used within DashboardUserProvider");
  }

  return context.user;
}

export function useApplyCreditSnapshot() {
  const context = use(DashboardUserContext);

  if (!context) {
    throw new Error("useApplyCreditSnapshot must be used within DashboardUserProvider");
  }

  return context.applyCreditSnapshot;
}
