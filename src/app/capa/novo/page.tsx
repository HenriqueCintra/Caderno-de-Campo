"use client";

import { AppShell } from "@/components/layout/app-shell";
import { CapaForm } from "@/components/forms/capa-form";

export default function CapaNovoPage() {
  return (
    <AppShell title="Nova Capa">
      <CapaForm />
    </AppShell>
  );
}
