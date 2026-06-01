"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ParcelaForm } from "@/components/forms/parcela-form";

function ParcelaNovoInner() {
  const searchParams = useSearchParams();
  const areaId = searchParams.get("areaId") ?? undefined;

  return (
    <AppShell title="Nova Parcela">
      <ParcelaForm initialAreaId={areaId} />
    </AppShell>
  );
}

export default function ParcelaNovoPage() {
  return (
    <Suspense fallback={<p>Carregando…</p>}>
      <ParcelaNovoInner />
    </Suspense>
  );
}
