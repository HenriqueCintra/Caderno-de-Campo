"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createRecord,
  getRecord,
  updateRecord,
} from "@/lib/db/repository";
import type { ConfiguracaoArea } from "@/types/entities";
import { CULTURAS, SETORES, VARIEDADES } from "@/lib/constants/dropdowns";
import { todayIsoDate } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SaveBar } from "@/components/entity/save-bar";
import { scheduleSyncDebounced } from "@/lib/sync/engine";

const empty = (): Omit<ConfiguracaoArea, "id" | "createdAt" | "updatedAt" | "syncStatus"> => ({
  supervisor: "",
  responsavelTecnico: "",
  bolsista: "",
  municipio: "",
  telefones: "",
  email: "",
  dataPlantio: todayIsoDate(),
  setor: "A",
  cultura: CULTURAS[0],
  variedade: VARIEDADES[0],
  espacamento: "",
  experimento: "",
  tamanhoArea: null,
});

export function CapaForm({ id }: { id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!id);

  useEffect(() => {
    if (!id) return;
    getRecord<ConfiguracaoArea>("configuracao_area", id).then((r) => {
      if (r) {
        const { id: _i, createdAt, updatedAt, syncStatus, remoteId, deletedAt, ...rest } = r;
        setForm(rest);
      }
      setLoaded(true);
    });
  }, [id]);

  if (id && !loaded) return <p>Carregando…</p>;

  const set = (k: keyof typeof form, v: string | number | null) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      if (id) {
        await updateRecord("configuracao_area", id, form);
        scheduleSyncDebounced();
        router.push(`/capa/${id}`);
      } else {
        const created = await createRecord("configuracao_area", form);
        scheduleSyncDebounced();
        router.push(`/capa/${created.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-4 pb-32">
        <div><Label>Supervisor</Label><Input value={form.supervisor} onChange={(e) => set("supervisor", e.target.value)} /></div>
        <div><Label>Responsável Técnico</Label><Input value={form.responsavelTecnico} onChange={(e) => set("responsavelTecnico", e.target.value)} /></div>
        <div><Label>Bolsista</Label><Input value={form.bolsista} onChange={(e) => set("bolsista", e.target.value)} /></div>
        <div><Label>Município</Label><Input value={form.municipio} onChange={(e) => set("municipio", e.target.value)} /></div>
        <div><Label>Telefones</Label><Input inputMode="tel" value={form.telefones} onChange={(e) => set("telefones", e.target.value)} /></div>
        <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
        <div><Label>Data Plantio</Label><Input type="date" value={form.dataPlantio} onChange={(e) => set("dataPlantio", e.target.value)} /></div>
        <div><Label>Setor</Label><Select value={form.setor} onChange={(e) => set("setor", e.target.value)}>{SETORES.map((s) => <option key={s} value={s}>{s}</option>)}</Select></div>
        <div><Label>Cultura</Label><Select value={form.cultura} onChange={(e) => set("cultura", e.target.value)}>{CULTURAS.map((c) => <option key={c} value={c}>{c}</option>)}</Select></div>
        <div><Label>Variedade</Label><Select value={form.variedade} onChange={(e) => set("variedade", e.target.value)}>{VARIEDADES.map((v) => <option key={v} value={v}>{v}</option>)}</Select></div>
        <div><Label>Espaçamento</Label><Input value={form.espacamento} onChange={(e) => set("espacamento", e.target.value)} /></div>
        <div><Label>Experimento</Label><Input value={form.experimento} onChange={(e) => set("experimento", e.target.value)} /></div>
        <div><Label>Tamanho Área (ha)</Label><Input type="number" inputMode="decimal" value={form.tamanhoArea ?? ""} onChange={(e) => set("tamanhoArea", e.target.value ? Number(e.target.value) : null)} /></div>
      </div>
      <SaveBar saving={saving} onSave={save} />
    </>
  );
}
