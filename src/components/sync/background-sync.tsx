"use client";

import { useEffect } from "react";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import { runFullSync, scheduleSyncDebounced } from "@/lib/sync/engine";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/** Sincronização automática em segundo plano (nuvem), sem UI. */
export function BackgroundSync() {
  const { online } = useOfflineStatus();

  useEffect(() => {
    if (!online || !isSupabaseConfigured()) return;
    void runFullSync();
  }, []);

  useEffect(() => {
    if (!online || !isSupabaseConfigured()) return;
    scheduleSyncDebounced(500);
  }, [online]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const onVisible = () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        void runFullSync();
      }
    };

    const onOnline = () => {
      void runFullSync();
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("online", onOnline);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  return null;
}
