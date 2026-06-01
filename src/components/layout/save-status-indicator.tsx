"use client";

import { useSyncExternalStore } from "react";
import { Check, Loader2 } from "lucide-react";
import {
  getSaveStatus,
  subscribeSaveStatus,
} from "@/lib/save-status-store";
import { cn } from "@/lib/utils";

export function SaveStatusIndicator() {
  const status = useSyncExternalStore(
    subscribeSaveStatus,
    getSaveStatus,
    () => "idle" as const
  );

  if (status === "idle") return null;

  const saving = status === "saving";

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        saving ? "bg-white/20" : "bg-white/25"
      )}
      role="status"
      aria-live="polite"
      aria-label={saving ? "Salvando dados" : "Dados salvos"}
    >
      {saving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          <span>Salvando…</span>
        </>
      ) : (
        <>
          <Check className="h-4 w-4" aria-hidden />
          <span>Salvo</span>
        </>
      )}
    </div>
  );
}
