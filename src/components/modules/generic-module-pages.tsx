"use client";

import { use } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { RecordList } from "@/components/entity/record-list";
import { RecordDetail } from "@/components/entity/record-detail";
import { GenericRecordForm } from "@/components/forms/generic-record-form";
import { formatDate } from "@/lib/utils";
import type { EntityTableName } from "@/types/entities";

type FormType =
  | "tratos"
  | "irrigacao"
  | "nutricao"
  | "agrotoxicos"
  | "colheita"
  | "pragas"
  | "doencas"
  | "clima";

const CONFIG: Record<
  FormType,
  {
    table: EntityTableName;
    path: string;
    title: string;
    titleField: (r: Record<string, unknown>) => string;
    subtitleField: (r: Record<string, unknown>) => string;
    detailFields: { label: string; key: string }[];
  }
> = {
  tratos: {
    table: "tratos_culturais",
    path: "/tratos",
    title: "Tratos Culturais",
    titleField: (r) => formatDate(String(r.data)),
    subtitleField: (r) => String(r.tipoTrato),
    detailFields: [
      { label: "Data", key: "data" },
      { label: "Tipo", key: "tipoTrato" },
      { label: "Responsável", key: "responsavel" },
      { label: "Observações", key: "observacoes" },
    ],
  },
  irrigacao: {
    table: "irrigacao",
    path: "/irrigacao",
    title: "Irrigação",
    titleField: (r) => formatDate(String(r.data)),
    subtitleField: (r) => `Lâmina ${r.laminaBruta ?? "—"} mm`,
    detailFields: [
      { label: "Data", key: "data" },
      { label: "ETo", key: "eto" },
      { label: "Kc", key: "kc" },
      { label: "Lâmina bruta", key: "laminaBruta" },
      { label: "Tempo", key: "tempoIrrigacao" },
      { label: "Responsável", key: "responsavel" },
      { label: "Observações", key: "observacoes" },
    ],
  },
  nutricao: {
    table: "nutricao",
    path: "/nutricao",
    title: "Nutrição",
    titleField: (r) => formatDate(String(r.data)),
    subtitleField: (r) => String(r.fonte),
    detailFields: [
      { label: "Data", key: "data" },
      { label: "Fonte", key: "fonte" },
      { label: "Quantidade", key: "quantidade" },
      { label: "Unidade", key: "unidade" },
      { label: "Forma", key: "formaAplicacao" },
      { label: "Responsável", key: "responsavel" },
    ],
  },
  agrotoxicos: {
    table: "agrotoxicos",
    path: "/agrotoxicos",
    title: "Agrotóxicos",
    titleField: (r) => formatDate(String(r.data)),
    subtitleField: (r) => String(r.produto),
    detailFields: [
      { label: "Data", key: "data" },
      { label: "Produto", key: "produto" },
      { label: "Fenologia", key: "fenologia" },
      { label: "Carência (dias)", key: "periodoCarenciaDias" },
      { label: "Previsão colheita", key: "previsaoColheita" },
      { label: "Dosagem", key: "dosagem" },
      { label: "Responsável", key: "responsavel" },
    ],
  },
  colheita: {
    table: "colheita",
    path: "/colheita",
    title: "Colheita",
    titleField: (r) => formatDate(String(r.data)),
    subtitleField: (r) => `${r.producaoKg ?? "—"} kg · ${r.qualidade}`,
    detailFields: [
      { label: "Data", key: "data" },
      { label: "Produção (kg)", key: "producaoKg" },
      { label: "Qualidade", key: "qualidade" },
      { label: "Plantas", key: "plantasColhidas" },
      { label: "Destino", key: "destino" },
      { label: "Responsável", key: "responsavel" },
    ],
  },
  pragas: {
    table: "monitoramento_pragas",
    path: "/pragas",
    title: "Pragas",
    titleField: (r) => formatDate(String(r.data)),
    subtitleField: (r) => String(r.praga),
    detailFields: [
      { label: "Data", key: "data" },
      { label: "Praga", key: "praga" },
      { label: "Fenologia", key: "fenologia" },
      { label: "Intensidade %", key: "intensidadePct" },
      { label: "Sintomas", key: "sintomas" },
      { label: "Responsável", key: "responsavel" },
    ],
  },
  doencas: {
    table: "monitoramento_doencas",
    path: "/doencas",
    title: "Doenças",
    titleField: (r) => formatDate(String(r.data)),
    subtitleField: (r) => String(r.doenca),
    detailFields: [
      { label: "Data", key: "data" },
      { label: "Doença", key: "doenca" },
      { label: "Fenologia", key: "fenologia" },
      { label: "Brotos", key: "incidenciaBrotos" },
      { label: "Folhas", key: "incidenciaFolhas" },
      { label: "Ramos", key: "incidenciaRamos" },
      { label: "Sintomas", key: "sintomas" },
      { label: "Responsável", key: "responsavel" },
    ],
  },
  clima: {
    table: "clima",
    path: "/clima",
    title: "Clima",
    titleField: (r) => formatDate(String(r.data)),
    subtitleField: (r) => `Chuva ${r.chuvaMm ?? "—"} mm`,
    detailFields: [
      { label: "Data", key: "data" },
      { label: "Chuva (mm)", key: "chuvaMm" },
      { label: "Tmax", key: "tmax" },
      { label: "Tmin", key: "tmin" },
      { label: "ETo", key: "eto" },
      { label: "Ocorrências", key: "ocorrencias" },
      { label: "Responsável", key: "responsavel" },
    ],
  },
};

export function ModuleList({ type }: { type: FormType }) {
  const c = CONFIG[type];
  return (
    <AppShell title={c.title}>
      <RecordList
        table={c.table}
        basePath={c.path}
        titleField={c.titleField}
        subtitleField={c.subtitleField}
      />
    </AppShell>
  );
}

export function ModuleNovo({ type }: { type: FormType }) {
  const c = CONFIG[type];
  return (
    <AppShell title={`Novo — ${c.title}`}>
      <GenericRecordForm type={type} />
    </AppShell>
  );
}

export function ModuleDetail({
  type,
  params,
}: {
  type: FormType;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const c = CONFIG[type];
  return (
    <AppShell title={c.title}>
      <RecordDetail
        table={c.table}
        id={id}
        basePath={c.path}
        title={c.title}
        fields={c.detailFields}
      />
    </AppShell>
  );
}

export function ModuleEditar({
  type,
  params,
}: {
  type: FormType;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const c = CONFIG[type];
  return (
    <AppShell title={`Editar — ${c.title}`}>
      <GenericRecordForm type={type} id={id} />
    </AppShell>
  );
}
