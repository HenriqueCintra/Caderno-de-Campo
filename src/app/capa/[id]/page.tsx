"use client";

import { use } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AreaWorkbook } from "@/components/area/area-workbook";

export default function CapaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <AppShell title="Detalhamento da área">
      <AreaWorkbook areaId={id} />
    </AppShell>
  );
}
