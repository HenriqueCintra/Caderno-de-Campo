"use client";

import { BackgroundSync } from "@/components/sync/background-sync";
import { DbReadyGate } from "@/components/providers/db-ready-gate";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DbReadyGate>
      <BackgroundSync />
      {children}
    </DbReadyGate>
  );
}
