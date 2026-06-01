"use client";

import { use } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { RecordDetail } from "@/components/entity/record-detail";
import { formatDate } from "@/lib/utils";

export default function CapaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <AppShell title="Capa">
      <RecordDetail
        table="configuracao_area"
        id={id}
        basePath="/capa"
        title="Configuração da área"
        fields={[
          { label: "Supervisor", key: "supervisor" },
          { label: "Responsável Técnico", key: "responsavelTecnico" },
          { label: "Bolsista", key: "bolsista" },
          { label: "Município", key: "municipio" },
          { label: "Telefones", key: "telefones" },
          { label: "Email", key: "email" },
          {
            label: "Data plantio",
            key: "dataPlantio",
            format: (v) => formatDate(String(v)),
          },
          { label: "Setor", key: "setor" },
          { label: "Cultura", key: "cultura" },
          { label: "Variedade", key: "variedade" },
          { label: "Espaçamento", key: "espacamento" },
          { label: "Experimento", key: "experimento" },
          { label: "Tamanho área (ha)", key: "tamanhoArea" },
        ]}
      />
    </AppShell>
  );
}
