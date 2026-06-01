"use client";

import { AppShell } from "@/components/layout/app-shell";
import { RecordList } from "@/components/entity/record-list";
import { formatDate } from "@/lib/utils";

export default function CapaListPage() {
  return (
    <AppShell title="Configuração (Capa)">
      <RecordList
        table="configuracao_area"
        basePath="/capa"
        titleField={(r) =>
          String(r.experimento || r.municipio || "Área sem nome")
        }
        subtitleField={(r) =>
          `${r.cultura} · ${formatDate(String(r.dataPlantio))}`
        }
      />
    </AppShell>
  );
}
