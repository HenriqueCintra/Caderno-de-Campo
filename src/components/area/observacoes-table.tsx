"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  createRecord,
  listRecords,
  softDeleteRecord,
} from "@/lib/db/repository";
import type { Observacao, ObservacaoCategoria } from "@/types/entities";
import { formatDate, todayIsoDate } from "@/lib/utils";
import { scheduleSyncDebounced } from "@/lib/sync/engine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

export function ObservacoesTable({
  areaId,
  categoria,
}: {
  areaId: string;
  categoria: ObservacaoCategoria;
}) {
  const rows = useLiveQuery(
    () =>
      listRecords<Observacao>("observacoes", { areaId, categoria }),
    [areaId, categoria]
  );
  const [adding, setAdding] = useState(false);
  const [data, setData] = useState(todayIsoDate());
  const [responsavel, setResponsavel] = useState("");
  const [texto, setTexto] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!texto.trim()) {
      alert("Informe a observação.");
      return;
    }
    setSaving(true);
    try {
      await createRecord("observacoes", {
        areaId,
        categoria,
        data,
        responsavel,
        texto: texto.trim(),
      });
      scheduleSyncDebounced();
      setTexto("");
      setResponsavel("");
      setAdding(false);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir esta observação?")) return;
    await softDeleteRecord("observacoes", id);
    scheduleSyncDebounced();
  };

  return (
    <section className="space-y-3">
      <div className="rounded-t-lg bg-amber-200 px-3 py-2 text-center text-sm font-bold uppercase tracking-wide text-zinc-900">
        Observações
      </div>
      <div className="overflow-hidden rounded-b-lg border border-amber-200 border-t-0">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,2fr)_auto] gap-2 border-b bg-zinc-100 px-2 py-2 text-xs font-semibold uppercase text-zinc-700">
          <span>Data</span>
          <span>Responsável</span>
          <span className="col-span-1">Observação</span>
          <span className="w-8" />
        </div>
        {(rows ?? []).length === 0 && !adding && (
          <p className="px-3 py-6 text-center text-sm text-zinc-500">
            Nenhuma observação registrada.
          </p>
        )}
        {(rows ?? []).map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,2fr)_auto] gap-2 border-b px-2 py-2 text-sm last:border-b-0"
          >
            <span>{formatDate(row.data)}</span>
            <span className="truncate">{row.responsavel || "—"}</span>
            <span className="break-words">{row.texto}</span>
            <button
              type="button"
              onClick={() => remove(row.id)}
              className="flex h-8 w-8 items-center justify-center text-red-600"
              aria-label="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {adding && (
          <div className="space-y-3 border-t bg-zinc-50 p-3">
            <div>
              <Label>Data</Label>
              <Input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
            <div>
              <Label>Responsável</Label>
              <Input
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
              />
            </div>
            <div>
              <Label>Observação</Label>
              <Textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={save} disabled={saving}>
                {saving ? "Salvando…" : "Salvar"}
              </Button>
              <Button variant="outline" onClick={() => setAdding(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
      {!adding && (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setAdding(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova observação
        </Button>
      )}
    </section>
  );
}
