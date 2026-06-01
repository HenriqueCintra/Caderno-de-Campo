"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createRecord,
  getRecord,
  updateRecord,
} from "@/lib/db/repository";
import type { Parcela } from "@/types/entities";
import { SISTEMAS_IRRIGACAO } from "@/lib/constants/dropdowns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ComboSelect } from "@/components/ui/combo-select";
import { Textarea } from "@/components/ui/textarea";
import { SaveBar } from "@/components/entity/save-bar";
import { AreaSelect } from "@/components/entity/area-select";
import { areaDisplayLabel, ensureAreaId } from "@/lib/entity/resolve-links";
import type { ConfiguracaoArea } from "@/types/entities";
import { CaptureGps } from "@/components/gps/capture-gps";
import { scheduleSyncDebounced } from "@/lib/sync/engine";

type ParcelaFormState = {
  areaId: string;
  latitude: number | null;
  longitude: number | null;
  cultivar: string;
  anoPlantio: number | null;
  sistemaIrrigacao: string;
  areaHa: number | null;
  espacamento: string;
  densidade: number | null;
  observacoes: string;
};

const emptyParcela = (): ParcelaFormState => ({
  areaId: "",
  latitude: null,
  longitude: null,
  cultivar: "",
  anoPlantio: new Date().getFullYear(),
  sistemaIrrigacao: SISTEMAS_IRRIGACAO[0],
  areaHa: null,
  espacamento: "",
  densidade: null,
  observacoes: "",
});

export function ParcelaForm({
  id,
  initialAreaId,
}: {
  id?: string;
  initialAreaId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ParcelaFormState>(() => ({
    ...emptyParcela(),
    areaId: initialAreaId ?? "",
  }));
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!id);

  useEffect(() => {
    if (!id) return;
    getRecord<Parcela>("parcelas", id).then(async (r) => {
      if (r) {
        const { id: _i, createdAt, updatedAt, syncStatus, remoteId, deletedAt, ...rest } = r;
        const area = await getRecord<ConfiguracaoArea>(
          "configuracao_area",
          rest.areaId
        );
        setForm({
          ...rest,
          areaId: areaDisplayLabel(area, rest.areaId),
        });
      }
      setLoaded(true);
    });
  }, [id]);

  if (id && !loaded) return <p>Carregando…</p>;

  const save = async () => {
    setSaving(true);
    try {
      const areaId = await ensureAreaId(form.areaId);
      const payload = { ...form, areaId };
      if (id) {
        await updateRecord("parcelas", id, payload);
        scheduleSyncDebounced();
        router.push(`/parcelas/${id}`);
      } else {
        const created = await createRecord("parcelas", payload);
        scheduleSyncDebounced();
        router.push(`/parcelas/${created.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-4 pb-32">
        <AreaSelect value={form.areaId} onChange={(v) => setForm((f) => ({ ...f, areaId: v }))} />
        <CaptureGps
          onCapture={(lat, lng) =>
            setForm((f) => ({ ...f, latitude: lat, longitude: lng }))
          }
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Latitude</Label>
            <Input
              type="number"
              inputMode="decimal"
              value={form.latitude ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  latitude: e.target.value ? Number(e.target.value) : null,
                }))
              }
            />
          </div>
          <div>
            <Label>Longitude</Label>
            <Input
              type="number"
              inputMode="decimal"
              value={form.longitude ?? ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  longitude: e.target.value ? Number(e.target.value) : null,
                }))
              }
            />
          </div>
        </div>
        <div><Label>Cultivar</Label><Input value={form.cultivar} onChange={(e) => setForm((f) => ({ ...f, cultivar: e.target.value }))} /></div>
        <div><Label>Ano Plantio</Label><Input type="number" value={form.anoPlantio ?? ""} onChange={(e) => setForm((f) => ({ ...f, anoPlantio: Number(e.target.value) }))} /></div>
        <div><Label>Sistema Irrigação</Label><ComboSelect id="sistema-irrigacao" value={form.sistemaIrrigacao} onChange={(v) => setForm((f) => ({ ...f, sistemaIrrigacao: v }))} options={SISTEMAS_IRRIGACAO} /></div>
        <div><Label>Área (ha)</Label><Input type="number" inputMode="decimal" value={form.areaHa ?? ""} onChange={(e) => setForm((f) => ({ ...f, areaHa: e.target.value ? Number(e.target.value) : null }))} /></div>
        <div><Label>Espaçamento</Label><Input value={form.espacamento} onChange={(e) => setForm((f) => ({ ...f, espacamento: e.target.value }))} /></div>
        <div><Label>Densidade</Label><Input type="number" inputMode="decimal" value={form.densidade ?? ""} onChange={(e) => setForm((f) => ({ ...f, densidade: e.target.value ? Number(e.target.value) : null }))} /></div>
        <div><Label>Observações</Label><Textarea value={form.observacoes} onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))} /></div>
      </div>
      <SaveBar saving={saving} onSave={save} />
    </>
  );
}
