"use client";

import { Cloud, CloudOff, Loader2 } from "lucide-react";
import { useSync } from "@/hooks/useSync";
import { cn } from "@/lib/utils";

export function SyncBadge() {
  const { online, syncing, pendingCount } = useSync();

  if (syncing) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
        <Loader2 className="h-3 w-3 animate-spin" />
        Sincronizando
      </span>
    );
  }

  if (!online) {
    return (
      <span className="flex items-center gap-1 rounded-full bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
        <CloudOff className="h-3 w-3" />
        Offline
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
        pendingCount > 0
          ? "bg-amber-100 text-amber-800"
          : "bg-green-100 text-green-800"
      )}
    >
      <Cloud className="h-3 w-3" />
      {pendingCount > 0 ? `${pendingCount} pendente(s)` : "Online"}
    </span>
  );
}
