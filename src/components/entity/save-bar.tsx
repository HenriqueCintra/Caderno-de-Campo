"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export function SaveBar({
  saving,
  onSave,
  label = "Salvar",
}: {
  saving?: boolean;
  onSave: () => void;
  label?: string;
}) {
  return (
    <div className="fixed bottom-20 left-0 right-0 z-30 border-t border-green-200 bg-white/95 p-4 backdrop-blur dark:border-green-900 dark:bg-zinc-950/95">
      <div className="mx-auto max-w-lg">
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={saving}
          onClick={onSave}
        >
          <Save className="h-5 w-5" />
          {saving ? "Salvando…" : label}
        </Button>
      </div>
    </div>
  );
}
