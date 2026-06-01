"use client";

import { useCallback, useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { getDb } from "@/lib/db/schema";
import {
  processSyncQueue,
  pullRemoteUpdates,
  scheduleSyncDebounced,
} from "@/lib/sync/engine";
import { useOfflineStatus } from "./useOfflineStatus";

export function useSync() {
  const { online } = useOfflineStatus();
  const [syncing, setSyncing] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const pendingCount = useLiveQuery(
    () => getDb().sync_queue.count(),
    []
  );

  const runSync = useCallback(async () => {
    setSyncing(true);
    setLastResult(null);
    try {
      const pulled = await pullRemoteUpdates();
      const result = await processSyncQueue();
      setLastResult(
        `Sincronizado: ${result.processed} enviados, ${result.failed} erros, ${pulled} baixados`
      );
    } catch (e) {
      setLastResult(e instanceof Error ? e.message : "Erro na sincronização");
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (online) scheduleSyncDebounced(3000);
  }, [online]);

  return {
    online,
    syncing,
    pendingCount: pendingCount ?? 0,
    lastResult,
    runSync,
  };
}
