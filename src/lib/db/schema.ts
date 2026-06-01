import Dexie, { type Table } from "dexie";
import type {
  Agrotoxico,
  Clima,
  Colheita,
  ConfiguracaoArea,
  ImagemBlob,
  Irrigacao,
  MonitoramentoDoenca,
  MonitoramentoPraga,
  Nutricao,
  Parcela,
  SyncQueueItem,
  TratoCultural,
} from "@/types/entities";

export class CadernoDatabase extends Dexie {
  configuracao_area!: Table<ConfiguracaoArea, string>;
  parcelas!: Table<Parcela, string>;
  tratos_culturais!: Table<TratoCultural, string>;
  irrigacao!: Table<Irrigacao, string>;
  nutricao!: Table<Nutricao, string>;
  agrotoxicos!: Table<Agrotoxico, string>;
  colheita!: Table<Colheita, string>;
  monitoramento_pragas!: Table<MonitoramentoPraga, string>;
  monitoramento_doencas!: Table<MonitoramentoDoenca, string>;
  clima!: Table<Clima, string>;
  imagens_blob!: Table<ImagemBlob, string>;
  sync_queue!: Table<SyncQueueItem, number>;

  constructor() {
    super("CadernoCampoDB");
    this.version(1).stores({
      configuracao_area:
        "id, syncStatus, updatedAt, experimento, municipio",
      parcelas: "id, areaId, syncStatus, updatedAt, cultivar",
      tratos_culturais:
        "id, parcelaId, data, syncStatus, updatedAt",
      irrigacao: "id, parcelaId, data, syncStatus, updatedAt",
      nutricao: "id, parcelaId, data, syncStatus, updatedAt",
      agrotoxicos: "id, parcelaId, data, syncStatus, updatedAt",
      colheita: "id, parcelaId, data, syncStatus, updatedAt",
      monitoramento_pragas:
        "id, parcelaId, data, syncStatus, updatedAt",
      monitoramento_doencas:
        "id, parcelaId, data, syncStatus, updatedAt",
      clima: "id, areaId, data, syncStatus, updatedAt",
      imagens_blob: "id, entityId, syncStatus, updatedAt",
      sync_queue: "++id, tableName, recordId, createdAt",
    });
  }
}

export const db =
  typeof window !== "undefined"
    ? new CadernoDatabase()
    : (null as unknown as CadernoDatabase);

export function getDb(): CadernoDatabase {
  if (!db) {
    throw new Error("IndexedDB só está disponível no navegador");
  }
  return db;
}
