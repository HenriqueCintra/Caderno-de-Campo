"use client";

import { useState } from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { getRecord } from "@/lib/db/repository";
import type { ConfiguracaoArea, ObservacaoCategoria } from "@/types/entities";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ObservacoesTable } from "@/components/area/observacoes-table";
import { ParcelasAreaTable } from "@/components/area/parcelas-area-table";
import { TratosAreaTable } from "@/components/area/tratos-area-table";
import { ClimaAreaTable } from "@/components/area/clima-area-table";
import { Pencil } from "lucide-react";

const TABS: { id: ObservacaoCategoria; label: string }[] = [
  { id: "detalhamento", label: "Detalhamento da área" },
  { id: "parcelas", label: "Parcelas" },
  { id: "tratos", label: "Tratos culturais" },
  { id: "clima", label: "Condições meteorológicas" },
];

export function AreaWorkbook({ areaId }: { areaId: string }) {
  const [tab, setTab] = useState<ObservacaoCategoria>("detalhamento");
  const area = useLiveQuery(
    () => getRecord<ConfiguracaoArea>("configuracao_area", areaId),
    [areaId]
  );

  if (!area) {
    return <p className="text-sm text-zinc-500">Carregando área…</p>;
  }

  const titulo =
    area.experimento || area.municipio || "Área sem nome";

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {titulo}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {area.cultura} · {area.variedade} · plantio{" "}
            {formatDate(area.dataPlantio)}
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href={`/capa/${areaId}/editar`}>
            <Pencil className="mr-1 h-4 w-4" />
            Editar
          </Link>
        </Button>
      </div>

      <nav
        className="flex gap-1 overflow-x-auto border-b border-zinc-200 pb-px dark:border-zinc-700"
        aria-label="Seções do caderno"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 rounded-t-lg px-3 py-2 text-xs font-semibold uppercase tracking-tight",
              tab === t.id
                ? "bg-slate-600 text-white"
                : "bg-slate-300 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "detalhamento" && (
        <div className="space-y-4">
          <dl className="grid gap-2 rounded-xl border border-zinc-200 p-3 text-sm dark:border-zinc-700">
            <div className="flex justify-between gap-2">
              <dt className="text-zinc-500">Supervisor</dt>
              <dd>{area.supervisor || "—"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-zinc-500">Resp. técnico</dt>
              <dd>{area.responsavelTecnico || "—"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-zinc-500">Município</dt>
              <dd>{area.municipio || "—"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-zinc-500">Setor</dt>
              <dd>{area.setor || "—"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-zinc-500">Área (ha)</dt>
              <dd>{area.tamanhoArea ?? "—"}</dd>
            </div>
          </dl>
          <ObservacoesTable areaId={areaId} categoria="detalhamento" />
        </div>
      )}

      {tab === "parcelas" && (
        <div className="space-y-4">
          <ParcelasAreaTable areaId={areaId} />
          <ObservacoesTable areaId={areaId} categoria="parcelas" />
        </div>
      )}

      {tab === "tratos" && (
        <div className="space-y-4">
          <TratosAreaTable areaId={areaId} />
          <ObservacoesTable areaId={areaId} categoria="tratos" />
        </div>
      )}

      {tab === "clima" && (
        <div className="space-y-4">
          <ClimaAreaTable areaId={areaId} />
          <ObservacoesTable areaId={areaId} categoria="clima" />
        </div>
      )}
    </div>
  );
}
