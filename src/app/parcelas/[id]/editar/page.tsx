"use client";

import { use } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ParcelaForm } from "@/components/forms/parcela-form";

export default function ParcelaEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <AppShell title="Editar Parcela">
      <ParcelaForm id={id} />
    </AppShell>
  );
}
