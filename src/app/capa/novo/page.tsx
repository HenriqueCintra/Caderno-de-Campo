"use client";

import { AppShell } from "@/components/layout/app-shell";
import { CapaForm } from "@/components/forms/capa-form";

export default function CapaNovoPage() {
  return (
    <AppShell title="Novo detalhamento da área">
      <CapaForm />
    </AppShell>
  );
}
