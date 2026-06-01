import {
  createRecord,
  getRecord,
  listRecords,
} from "@/lib/db/repository";
import { SISTEMAS_IRRIGACAO, CULTURAS, VARIEDADES } from "@/lib/constants/dropdowns";
import type { ConfiguracaoArea, Parcela } from "@/types/entities";
import { todayIsoDate } from "@/lib/utils";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

function norm(value: string): string {
  return value.trim().toLowerCase();
}

function areaLabel(area: ConfiguracaoArea): string {
  return (area.experimento || area.municipio || "").trim();
}

export function areaDisplayLabel(
  area: ConfiguracaoArea | undefined,
  ref: string
): string {
  if (!area) return ref;
  return areaLabel(area) || ref;
}

export function parcelaDisplayLabel(
  parcela: Parcela | undefined,
  ref: string
): string {
  if (!parcela) return ref;
  return (parcela.cultivar || "").trim() || ref;
}

/** Garante um id de área: aceita id existente ou nome digitado (cria se precisar). */
export async function ensureAreaId(ref: string): Promise<string> {
  const text = ref.trim();
  if (!text) {
    const areas = await listRecords<ConfiguracaoArea>("configuracao_area");
    if (areas.length > 0) return areas[0].id;
    return createDefaultArea("Área geral");
  }

  if (isUuid(text)) {
    const byId = await getRecord<ConfiguracaoArea>("configuracao_area", text);
    if (byId) return byId.id;
  }

  const areas = await listRecords<ConfiguracaoArea>("configuracao_area");
  const match = areas.find((a) => norm(areaLabel(a)) === norm(text));
  if (match) return match.id;

  return createDefaultArea(text);
}

async function createDefaultArea(nome: string): Promise<string> {
  const created = await createRecord("configuracao_area", {
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
    experimento: nome,
    tamanhoArea: null,
  });
  return created.id;
}

/** Garante um id de parcela: aceita id existente ou nome digitado (cria se precisar). */
export async function ensureParcelaId(
  ref: string,
  areaRef?: string
): Promise<string> {
  const text = ref.trim();
  if (!text) {
    const parcelas = await listRecords<Parcela>("parcelas");
    if (parcelas.length > 0) return parcelas[0].id;
    const areaId = await ensureAreaId(areaRef ?? "");
    return createDefaultParcela("Parcela geral", areaId);
  }

  if (isUuid(text)) {
    const byId = await getRecord<Parcela>("parcelas", text);
    if (byId) return byId.id;
  }

  const parcelas = await listRecords<Parcela>("parcelas");
  const match = parcelas.find((p) => norm(p.cultivar || "") === norm(text));
  if (match) return match.id;

  const areaId = await ensureAreaId(areaRef ?? "");
  return createDefaultParcela(text, areaId);
}

async function createDefaultParcela(
  cultivar: string,
  areaId: string
): Promise<string> {
  const created = await createRecord("parcelas", {
    areaId,
    latitude: null,
    longitude: null,
    cultivar,
    anoPlantio: new Date().getFullYear(),
    sistemaIrrigacao: SISTEMAS_IRRIGACAO[0],
    areaHa: null,
    espacamento: "",
    densidade: null,
    observacoes: "",
  });
  return created.id;
}
