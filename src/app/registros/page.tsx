"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AllRecordsList } from "@/components/registros/all-records-list";

export default function RegistrosPage() {
  return (
    <AppShell title="Registros">
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        Todos os cadastros feitos no caderno, do mais recente ao mais antigo.
      </p>
      <AllRecordsList />
    </AppShell>
  );
}
