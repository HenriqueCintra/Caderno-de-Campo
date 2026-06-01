"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createRecord,
  getRecord,
  updateRecord,
} from "@/lib/db/repository";
import type { EntityTableName } from "@/types/entities";
import { todayIsoDate } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ComboSelect } from "@/components/ui/combo-select";
import { Textarea } from "@/components/ui/textarea";
import { SaveBar } from "@/components/entity/save-bar";
import { ParcelaSelect } from "@/components/entity/parcela-select";
import { AreaSelect } from "@/components/entity/area-select";
import {
  areaDisplayLabel,
  ensureAreaId,
  ensureParcelaId,
  parcelaDisplayLabel,
} from "@/lib/entity/resolve-links";
import type { ConfiguracaoArea, Parcela } from "@/types/entities";
import { scheduleSyncDebounced } from "@/lib/sync/engine";
import { calcularLaminaBruta } from "@/lib/calculations/irrigacao";
import { calcularPrevisaoColheita } from "@/lib/calculations/agrotoxicos";
import {
  DOENCAS,
  DESTINOS_COLHEITA,
  FENOLOGIAS,
  FORMAS_APLICACAO,
  PRAGAS,
  QUALIDADES,
  TIPOS_TRATO,
  UNIDADES,
} from "@/lib/constants/dropdowns";
import { getDb } from "@/lib/db/schema";
import { newId, nowIso } from "@/lib/utils";
import { compressImage, blobToObjectUrl } from "@/lib/images/compress";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

type FormType =
  | "tratos"
  | "irrigacao"
  | "nutricao"
  | "agrotoxicos"
  | "colheita"
  | "pragas"
  | "doencas"
  | "clima";

const TABLE_MAP: Record<FormType, EntityTableName> = {
  tratos: "tratos_culturais",
  irrigacao: "irrigacao",
  nutricao: "nutricao",
  agrotoxicos: "agrotoxicos",
  colheita: "colheita",
  pragas: "monitoramento_pragas",
  doencas: "monitoramento_doencas",
  clima: "clima",
};

const PATH_MAP: Record<FormType, string> = {
  tratos: "/tratos",
  irrigacao: "/irrigacao",
  nutricao: "/nutricao",
  agrotoxicos: "/agrotoxicos",
  colheita: "/colheita",
  pragas: "/pragas",
  doencas: "/doencas",
  clima: "/clima",
};

export function GenericRecordForm({
  type,
  id,
  initialAreaId,
}: {
  type: FormType;
  id?: string;
  initialAreaId?: string;
}) {
  const router = useRouter();
  const table = TABLE_MAP[type];
  const basePath = PATH_MAP[type];
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!id);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({
    data: todayIsoDate(),
    parcelaId: "",
    areaId: initialAreaId ?? "",
    responsavel: "",
    observacoes: "",
  });

  useEffect(() => {
    if (!id) return;
    getRecord(table, id).then(async (r) => {
      if (r) {
        const {
          id: _i,
          createdAt,
          updatedAt,
          syncStatus,
          remoteId,
          deletedAt,
          imagemBlobId,
          ...rest
        } = r as Record<string, unknown>;

        if (rest.parcelaId && typeof rest.parcelaId === "string") {
          const parcela = await getRecord<Parcela>(
            "parcelas",
            rest.parcelaId
          );
          rest.parcelaId = parcelaDisplayLabel(parcela, rest.parcelaId);
        }
        if (rest.areaId && typeof rest.areaId === "string") {
          const area = await getRecord<ConfiguracaoArea>(
            "configuracao_area",
            rest.areaId
          );
          rest.areaId = areaDisplayLabel(area, rest.areaId);
        }

        setForm(rest);
        if (imagemBlobId && typeof imagemBlobId === "string") {
          getDb()
            .imagens_blob.get(imagemBlobId)
            .then((img) => {
              if (img?.blob) setImagePreview(blobToObjectUrl(img.blob));
            });
        }
      }
      setLoaded(true);
    });
  }, [id, table]);

  if (id && !loaded) return <p>Carregando…</p>;

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const eto = form.eto as number | null;
  const kc = form.kc as number | null;
  const laminaAuto =
    type === "irrigacao" ? calcularLaminaBruta(eto, kc) : null;

  const previsaoAuto =
    type === "agrotoxicos"
      ? calcularPrevisaoColheita(
          form.data as string,
          form.periodoCarenciaDias as number | null
        )
      : "";

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      if (type !== "clima") {
        payload.parcelaId = await ensureParcelaId(
          String(form.parcelaId ?? "")
        );
      }
      if (type === "clima") {
        payload.areaId = await ensureAreaId(String(form.areaId ?? ""));
      }
      if (type === "irrigacao" && laminaAuto != null) {
        payload.laminaBruta = laminaAuto;
      }
      if (type === "agrotoxicos" && previsaoAuto) {
        payload.previsaoColheita = previsaoAuto;
      }

      if (id) {
        await updateRecord(table, id, payload);
        router.push(`${basePath}/${id}`);
      } else {
        const created = await createRecord(table, payload as never);
        scheduleSyncDebounced();
        router.push(`${basePath}/${created.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const onImage = async (file: File | null) => {
    if (!file) return;
    const blob = await compressImage(file);
    const blobId = newId();
    await getDb().imagens_blob.put({
      id: blobId,
      entityId: id || "pending",
      entityType: "monitoramento_doencas",
      blob,
      mimeType: "image/jpeg",
      createdAt: nowIso(),
      updatedAt: nowIso(),
      syncStatus: "pending",
    });
    set("imagemBlobId", blobId);
    setImagePreview(blobToObjectUrl(blob));

    if (isSupabaseConfigured() && navigator.onLine && id) {
      const supabase = getSupabase();
      if (supabase) {
        const path = `${id}/${blobId}.jpg`;
        const { error } = await supabase.storage
          .from("sintomas")
          .upload(path, blob, { upsert: true });
        if (!error) {
          const { data } = supabase.storage.from("sintomas").getPublicUrl(path);
          set("imagemUrl", data.publicUrl);
        }
      }
    }
  };

  return (
    <>
      <div className="space-y-4 pb-32">
        <div>
          <Label>Data</Label>
          <Input
            type="date"
            value={(form.data as string) || ""}
            onChange={(e) => set("data", e.target.value)}
          />
        </div>

        {type !== "clima" && (
          <ParcelaSelect
            value={(form.parcelaId as string) || ""}
            onChange={(v) => set("parcelaId", v)}
          />
        )}

        {type === "clima" && (
          <AreaSelect
            value={(form.areaId as string) || ""}
            onChange={(v) => set("areaId", v)}
          />
        )}

        {type === "tratos" && (
          <>
            <div>
              <Label>Tipo de Trato</Label>
              <ComboSelect
                id="tipo-trato"
                value={(form.tipoTrato as string) || ""}
                onChange={(v) => set("tipoTrato", v)}
                options={TIPOS_TRATO}
              />
            </div>
            <div>
              <Label>Observações</Label>
              <Textarea
                value={(form.observacoes as string) || ""}
                onChange={(e) => set("observacoes", e.target.value)}
              />
            </div>
          </>
        )}

        {type === "irrigacao" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>ETo</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={eto ?? ""}
                  onChange={(e) =>
                    set("eto", e.target.value ? Number(e.target.value) : null)
                  }
                />
              </div>
              <div>
                <Label>Kc</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={kc ?? ""}
                  onChange={(e) =>
                    set("kc", e.target.value ? Number(e.target.value) : null)
                  }
                />
              </div>
            </div>
            <div>
              <Label>Lâmina bruta (mm)</Label>
              <Input
                type="number"
                readOnly={laminaAuto != null}
                value={
                  laminaAuto != null
                    ? laminaAuto
                    : (form.laminaBruta as number) ?? ""
                }
                onChange={(e) =>
                  set(
                    "laminaBruta",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              />
              {laminaAuto != null && (
                <p className="text-xs text-green-700 mt-1">
                  Calculado: ETo × Kc
                </p>
              )}
            </div>
            <div>
              <Label>Tempo irrigação</Label>
              <Input
                value={(form.tempoIrrigacao as string) || ""}
                onChange={(e) => set("tempoIrrigacao", e.target.value)}
              />
            </div>
            <div>
              <Label>Observações</Label>
              <Textarea
                value={(form.observacoes as string) || ""}
                onChange={(e) => set("observacoes", e.target.value)}
              />
            </div>
          </>
        )}

        {type === "nutricao" && (
          <>
            <div>
              <Label>Fonte (adubo)</Label>
              <Input
                value={(form.fonte as string) || ""}
                onChange={(e) => set("fonte", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  value={(form.quantidade as number) ?? ""}
                  onChange={(e) =>
                    set(
                      "quantidade",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                />
              </div>
              <div>
                <Label>Unidade</Label>
                <ComboSelect
                  id="unidade"
                  value={(form.unidade as string) || UNIDADES[0]}
                  onChange={(v) => set("unidade", v)}
                  options={UNIDADES}
                />
              </div>
            </div>
            <div>
              <Label>Forma aplicação</Label>
              <ComboSelect
                id="forma-aplicacao"
                value={(form.formaAplicacao as string) || ""}
                onChange={(v) => set("formaAplicacao", v)}
                options={FORMAS_APLICACAO}
              />
            </div>
            <div>
              <Label>Observações</Label>
              <Textarea
                value={(form.observacoes as string) || ""}
                onChange={(e) => set("observacoes", e.target.value)}
              />
            </div>
          </>
        )}

        {type === "agrotoxicos" && (
          <>
            <div>
              <Label>Fenologia</Label>
              <ComboSelect
                id="fenologia-agro"
                value={(form.fenologia as string) || ""}
                onChange={(v) => set("fenologia", v)}
                options={FENOLOGIAS}
              />
            </div>
            <div>
              <Label>Produto</Label>
              <Input
                value={(form.produto as string) || ""}
                onChange={(e) => set("produto", e.target.value)}
              />
            </div>
            <div>
              <Label>Período carência (dias)</Label>
              <Input
                type="number"
                value={(form.periodoCarenciaDias as number) ?? ""}
                onChange={(e) =>
                  set(
                    "periodoCarenciaDias",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              />
            </div>
            <div>
              <Label>Previsão colheita</Label>
              <Input
                type="date"
                value={
                  previsaoAuto ||
                  (form.previsaoColheita as string) ||
                  ""
                }
                readOnly={Boolean(previsaoAuto)}
                onChange={(e) => set("previsaoColheita", e.target.value)}
              />
            </div>
            <div>
              <Label>Dosagem</Label>
              <Input
                value={(form.dosagem as string) || ""}
                onChange={(e) => set("dosagem", e.target.value)}
              />
            </div>
            <div>
              <Label>Volume calda</Label>
              <Input
                value={(form.volumeCalda as string) || ""}
                onChange={(e) => set("volumeCalda", e.target.value)}
              />
            </div>
            <div>
              <Label>Observações</Label>
              <Textarea
                value={(form.observacoes as string) || ""}
                onChange={(e) => set("observacoes", e.target.value)}
              />
            </div>
          </>
        )}

        {type === "colheita" && (
          <>
            <div>
              <Label>Produção (kg)</Label>
              <Input
                type="number"
                value={(form.producaoKg as number) ?? ""}
                onChange={(e) =>
                  set(
                    "producaoKg",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              />
            </div>
            <div>
              <Label>Qualidade</Label>
              <ComboSelect
                id="qualidade"
                value={(form.qualidade as string) || QUALIDADES[0]}
                onChange={(v) => set("qualidade", v)}
                options={QUALIDADES}
              />
            </div>
            <div>
              <Label>Plantas colhidas</Label>
              <Input
                type="number"
                value={(form.plantasColhidas as number) ?? ""}
                onChange={(e) =>
                  set(
                    "plantasColhidas",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              />
            </div>
            <div>
              <Label>Destino</Label>
              <ComboSelect
                id="destino"
                value={(form.destino as string) || ""}
                onChange={(v) => set("destino", v)}
                options={DESTINOS_COLHEITA}
              />
            </div>
            <div>
              <Label>Observações</Label>
              <Textarea
                value={(form.observacoes as string) || ""}
                onChange={(e) => set("observacoes", e.target.value)}
              />
            </div>
          </>
        )}

        {type === "pragas" && (
          <>
            <div>
              <Label>Praga</Label>
              <ComboSelect
                id="praga"
                value={(form.praga as string) || ""}
                onChange={(v) => set("praga", v)}
                options={PRAGAS}
              />
            </div>
            <div>
              <Label>Fenologia</Label>
              <ComboSelect
                id="fenologia-praga"
                value={(form.fenologia as string) || ""}
                onChange={(v) => set("fenologia", v)}
                options={FENOLOGIAS}
              />
            </div>
            <div>
              <Label>Intensidade (%)</Label>
              <Input
                type="number"
                value={(form.intensidadePct as number) ?? ""}
                onChange={(e) =>
                  set(
                    "intensidadePct",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              />
            </div>
            <div>
              <Label>Sintomas</Label>
              <Textarea
                value={(form.sintomas as string) || ""}
                onChange={(e) => set("sintomas", e.target.value)}
              />
            </div>
            <div>
              <Label>Observações</Label>
              <Textarea
                value={(form.observacoes as string) || ""}
                onChange={(e) => set("observacoes", e.target.value)}
              />
            </div>
          </>
        )}

        {type === "doencas" && (
          <>
            <div>
              <Label>Doença</Label>
              <ComboSelect
                id="doenca"
                value={(form.doenca as string) || ""}
                onChange={(v) => set("doenca", v)}
                options={DOENCAS}
              />
            </div>
            <div>
              <Label>Fenologia</Label>
              <ComboSelect
                id="fenologia-doenca"
                value={(form.fenologia as string) || ""}
                onChange={(v) => set("fenologia", v)}
                options={FENOLOGIAS}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(form.incidenciaBrotos)}
                  onChange={(e) => set("incidenciaBrotos", e.target.checked)}
                />
                Brotos
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(form.incidenciaFolhas)}
                  onChange={(e) => set("incidenciaFolhas", e.target.checked)}
                />
                Folhas
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(form.incidenciaRamos)}
                  onChange={(e) => set("incidenciaRamos", e.target.checked)}
                />
                Ramos
              </label>
            </div>
            <div>
              <Label>Sintomas</Label>
              <Textarea
                value={(form.sintomas as string) || ""}
                onChange={(e) => set("sintomas", e.target.value)}
              />
            </div>
            <div>
              <Label>Imagem do sintoma</Label>
              <Input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => onImage(e.target.files?.[0] ?? null)}
              />
              {imagePreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Sintoma"
                  className="mt-2 max-h-48 rounded-xl object-cover"
                />
              )}
            </div>
            <div>
              <Label>Observações</Label>
              <Textarea
                value={(form.observacoes as string) || ""}
                onChange={(e) => set("observacoes", e.target.value)}
              />
            </div>
          </>
        )}

        {type === "clima" && (
          <>
            <div>
              <Label>Chuva (mm)</Label>
              <Input
                type="number"
                value={(form.chuvaMm as number) ?? ""}
                onChange={(e) =>
                  set("chuvaMm", e.target.value ? Number(e.target.value) : null)
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Tmax</Label>
                <Input
                  type="number"
                  value={(form.tmax as number) ?? ""}
                  onChange={(e) =>
                    set("tmax", e.target.value ? Number(e.target.value) : null)
                  }
                />
              </div>
              <div>
                <Label>Tmin</Label>
                <Input
                  type="number"
                  value={(form.tmin as number) ?? ""}
                  onChange={(e) =>
                    set("tmin", e.target.value ? Number(e.target.value) : null)
                  }
                />
              </div>
            </div>
            <div>
              <Label>ETo</Label>
              <Input
                type="number"
                value={(form.eto as number) ?? ""}
                onChange={(e) =>
                  set("eto", e.target.value ? Number(e.target.value) : null)
                }
              />
            </div>
            <div>
              <Label>Ocorrências</Label>
              <Textarea
                value={(form.ocorrencias as string) || ""}
                onChange={(e) => set("ocorrencias", e.target.value)}
              />
            </div>
            <div>
              <Label>Observações</Label>
              <Textarea
                value={(form.observacoes as string) || ""}
                onChange={(e) => set("observacoes", e.target.value)}
              />
            </div>
          </>
        )}

        <div>
          <Label>Responsável</Label>
          <Input
            value={(form.responsavel as string) || ""}
            onChange={(e) => set("responsavel", e.target.value)}
          />
        </div>
      </div>
      <SaveBar saving={saving} onSave={save} />
    </>
  );
}
