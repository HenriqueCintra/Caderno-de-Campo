"use client";

import { use } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { RecordDetail } from "@/components/entity/record-detail";

export default function ParcelaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <AppShell title="Parcela">
      <RecordDetail
        table="parcelas"
        id={id}
        basePath="/parcelas"
        title="Parcela"
        fields={[
          { label: "Cultivar", key: "cultivar" },
          { label: "Latitude", key: "latitude" },
          { label: "Longitude", key: "longitude" },
          { label: "Ano plantio", key: "anoPlantio" },
          { label: "Sistema irrigação", key: "sistemaIrrigacao" },
          { label: "Área (ha)", key: "areaHa" },
          { label: "Espaçamento", key: "espacamento" },
          { label: "Densidade", key: "densidade" },
        ]}
      />
    </AppShell>
  );
}
