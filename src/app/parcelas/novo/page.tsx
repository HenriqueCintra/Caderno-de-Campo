"use client";

import { AppShell } from "@/components/layout/app-shell";
import { ParcelaForm } from "@/components/forms/parcela-form";

export default function ParcelaNovoPage() {
  return (
    <AppShell title="Nova Parcela">
      <ParcelaForm />
    </AppShell>
  );
}
