"use client";

import { useEffect } from "react";
import { getDb } from "@/lib/db/schema";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    getDb().open().catch(console.error);
  }, []);

  return <>{children}</>;
}
