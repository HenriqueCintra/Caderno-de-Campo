"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { listRecords } from "@/lib/db/repository";
import type { Parcela, TratoCultural } from "@/types/entities";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function TratosAreaTable({ areaId }: { areaId: string }) {
  const parcelaIds = useLiveQuery(async () => {
    const parcelas = await listRecords<Parcela>("parcelas", { areaId });
    return new Set(parcelas.map((p) => p.id));
  }, [areaId]);

  const tratos = useLiveQuery(async () => {
    const all = await listRecords<TratoCultural>("tratos_culturais");
    if (!parcelaIds) return [];
    return all
      .filter((t) => parcelaIds.has(t.parcelaId))
      .sort((a, b) => b.data.localeCompare(a.data));
  }, [areaId, parcelaIds]);

  return (
    <section className="space-y-3">
      <div className="rounded-t-lg bg-sky-200 px-3 py-2 text-center text-sm font-bold uppercase tracking-wide text-zinc-900">
        Tratos culturais
      </div>
      <div className="overflow-hidden rounded-b-lg border border-sky-200 border-t-0">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,2fr)] gap-2 border-b bg-zinc-100 px-2 py-2 text-xs font-semibold uppercase text-zinc-700">
          <span>Data</span>
          <span>Tipo</span>
          <span>Responsável</span>
        </div>
        {(tratos ?? []).length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-zinc-500">
            Nenhum trato registrado nas parcelas desta área.
          </p>
        )}
        {(tratos ?? []).map((t) => (
          <Link
            key={t.id}
            href={`/tratos/${t.id}`}
            className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,2fr)] gap-2 border-b px-2 py-3 text-sm last:border-b-0 active:bg-zinc-50"
          >
            <span>{formatDate(t.data)}</span>
            <span>{t.tipoTrato || "—"}</span>
            <span className="truncate">{t.responsavel || "—"}</span>
          </Link>
        ))}
      </div>
      <Button asChild className="w-full" variant="outline">
        <Link href="/tratos/novo">
          <Plus className="mr-2 h-4 w-4" />
          Novo trato
        </Link>
      </Button>
    </section>
  );
}
