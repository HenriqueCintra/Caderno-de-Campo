"use client";

import { AppShell } from "@/components/layout/app-shell";
import { RecordList } from "@/components/entity/record-list";
import { formatDate } from "@/lib/utils";

export default function ParcelasListPage() {
  return (
    <AppShell title="Parcelas">
      <RecordList
        table="parcelas"
        basePath="/parcelas"
        titleField={(r) => String(r.cultivar || "Parcela")}
        subtitleField={(r) =>
          `GPS: ${r.latitude ?? "—"}, ${r.longitude ?? "—"} · ${r.areaHa ?? "?"} ha`
        }
      />
    </AppShell>
  );
}
