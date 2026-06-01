"use client";

import { useEffect } from "react";
import { getDb } from "@/lib/db/schema";
import { BackgroundSync } from "@/components/sync/background-sync";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    getDb()
      .open()
      .catch((err) => console.error("[db] falha ao abrir IndexedDB:", err));
  }, []);

  return (
    <>
      <BackgroundSync />
      {children}
    </>
  );
}
