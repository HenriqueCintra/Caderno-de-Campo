"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { listRecords } from "@/lib/db/repository";
import type { Parcela } from "@/types/entities";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ParcelasAreaTable({ areaId }: { areaId: string }) {
  const parcelas = useLiveQuery(
    () => listRecords<Parcela>("parcelas", { areaId }),
    [areaId]
  );

  return (
    <section className="space-y-3">
      <div className="rounded-t-lg bg-sky-200 px-3 py-2 text-center text-sm font-bold uppercase tracking-wide text-zinc-900">
        Parcelas da área
      </div>
      <div className="overflow-hidden rounded-b-lg border border-sky-200 border-t-0">
        <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 border-b bg-zinc-100 px-2 py-2 text-xs font-semibold uppercase text-zinc-700">
          <span>Cultivar</span>
          <span>Área (ha)</span>
          <span>Irrigação</span>
        </div>
        {(parcelas ?? []).length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-zinc-500">
            Nenhuma parcela cadastrada nesta área.
          </p>
        )}
        {(parcelas ?? []).map((p) => (
          <Link
            key={p.id}
            href={`/parcelas/${p.id}`}
            className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 border-b px-2 py-3 text-sm last:border-b-0 active:bg-zinc-50"
          >
            <span className="font-medium">{p.cultivar || "Sem nome"}</span>
            <span>{p.areaHa ?? "—"}</span>
            <span className="truncate">{p.sistemaIrrigacao || "—"}</span>
          </Link>
        ))}
      </div>
      <Button asChild className="w-full" variant="outline">
        <Link href={`/parcelas/novo?areaId=${areaId}`}>
          <Plus className="mr-2 h-4 w-4" />
          Nova parcela
        </Link>
      </Button>
    </section>
  );
}
