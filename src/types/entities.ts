import type { BaseRecord, QualidadeColheita } from "./base";

export type ObservacaoCategoria =
  | "detalhamento"
  | "parcelas"
  | "tratos"
  | "clima";

export interface Observacao extends BaseRecord {
  areaId: string;
  categoria: ObservacaoCategoria;
  data: string;
  responsavel: string;
  texto: string;
}

export interface ConfiguracaoArea extends BaseRecord {
  supervisor: string;
  responsavelTecnico: string;
  bolsista: string;
  municipio: string;
  telefones: string;
  email: string;
  dataPlantio: string;
  setor: string;
  cultura: string;
  variedade: string;
  espacamento: string;
  experimento: string;
  tamanhoArea: number | null;
}

export interface Parcela extends BaseRecord {
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
}

export interface TratoCultural extends BaseRecord {
  data: string;
  parcelaId: string;
  tipoTrato: string;
  responsavel: string;
  observacoes: string;
}

export interface Irrigacao extends BaseRecord {
  data: string;
  parcelaId: string;
  eto: number | null;
  kc: number | null;
  laminaBruta: number | null;
  tempoIrrigacao: string;
  responsavel: string;
  observacoes: string;
}

export interface Nutricao extends BaseRecord {
  data: string;
  parcelaId: string;
  fonte: string;
  quantidade: number | null;
  unidade: string;
  formaAplicacao: string;
  responsavel: string;
  observacoes: string;
}

export interface Agrotoxico extends BaseRecord {
  data: string;
  parcelaId: string;
  fenologia: string;
  produto: string;
  periodoCarenciaDias: number | null;
  previsaoColheita: string;
  dosagem: string;
  volumeCalda: string;
  responsavel: string;
  observacoes: string;
}

export interface Colheita extends BaseRecord {
  data: string;
  parcelaId: string;
  producaoKg: number | null;
  qualidade: QualidadeColheita;
  plantasColhidas: number | null;
  destino: string;
  responsavel: string;
  observacoes: string;
}

export interface MonitoramentoPraga extends BaseRecord {
  data: string;
  parcelaId: string;
  praga: string;
  fenologia: string;
  intensidadePct: number | null;
  sintomas: string;
  responsavel: string;
  observacoes: string;
}

export interface MonitoramentoDoenca extends BaseRecord {
  data: string;
  parcelaId: string;
  fenologia: string;
  doenca: string;
  incidenciaBrotos: boolean;
  incidenciaFolhas: boolean;
  incidenciaRamos: boolean;
  sintomas: string;
  imagemBlobId?: string;
  imagemUrl?: string;
  responsavel: string;
  observacoes: string;
}

export interface Clima extends BaseRecord {
  data: string;
  areaId: string;
  chuvaMm: number | null;
  tmax: number | null;
  tmin: number | null;
  eto: number | null;
  ocorrencias: string;
  responsavel: string;
  observacoes: string;
}

export interface ImagemBlob extends BaseRecord {
  entityId: string;
  entityType: "monitoramento_doencas";
  blob: Blob;
  mimeType: string;
}

export interface SyncQueueItem {
  id?: number;
  tableName: string;
  recordId: string;
  operation: "upsert" | "delete";
  payload: Record<string, unknown>;
  createdAt: string;
  attempts: number;
  lastError?: string;
}

export type EntityTableName =
  | "configuracao_area"
  | "parcelas"
  | "tratos_culturais"
  | "irrigacao"
  | "nutricao"
  | "agrotoxicos"
  | "colheita"
  | "monitoramento_pragas"
  | "monitoramento_doencas"
  | "clima"
  | "observacoes";
