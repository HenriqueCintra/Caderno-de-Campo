"use client";

import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { listRecords } from "@/lib/db/repository";
import type { Clima } from "@/types/entities";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ClimaAreaTable({ areaId }: { areaId: string }) {
  const registros = useLiveQuery(
    () => listRecords<Clima>("clima", { areaId }),
    [areaId]
  );

  return (
    <section className="space-y-3">
      <div className="rounded-t-lg bg-sky-200 px-3 py-2 text-center text-sm font-bold uppercase tracking-wide text-zinc-900">
        Condições meteorológicas
      </div>
      <div className="overflow-hidden rounded-b-lg border border-sky-200 border-t-0">
        <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,0.8fr))] gap-2 border-b bg-zinc-100 px-2 py-2 text-xs font-semibold uppercase text-zinc-700">
          <span>Data</span>
          <span>Chuva</span>
          <span>Tmax</span>
          <span>Tmin</span>
        </div>
        {(registros ?? []).length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-zinc-500">
            Nenhum registro climático para esta área.
          </p>
        )}
        {(registros ?? []).map((r) => (
          <Link
            key={r.id}
            href={`/clima/${r.id}`}
            className="grid grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,0.8fr))] gap-2 border-b px-2 py-3 text-sm last:border-b-0 active:bg-zinc-50"
          >
            <span>{formatDate(r.data)}</span>
            <span>{r.chuvaMm ?? "—"} mm</span>
            <span>{r.tmax ?? "—"}°</span>
            <span>{r.tmin ?? "—"}°</span>
          </Link>
        ))}
      </div>
      <Button asChild className="w-full" variant="outline">
        <Link href={`/clima/novo?areaId=${areaId}`}>
          <Plus className="mr-2 h-4 w-4" />
          Novo registro
        </Link>
      </Button>
    </section>
  );
}
