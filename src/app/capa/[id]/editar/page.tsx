"use client";

import { use } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CapaForm } from "@/components/forms/capa-form";

export default function CapaEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <AppShell title="Editar Capa">
      <CapaForm id={id} />
    </AppShell>
  );
}
