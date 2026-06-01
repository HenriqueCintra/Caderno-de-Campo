import type { Table } from "dexie";
import { markSaved, markSaving } from "@/lib/save-status-store";
import { scheduleSyncDebounced } from "@/lib/sync/engine";
import { getDb } from "./schema";
import { newId, nowIso } from "@/lib/utils";
import type { BaseRecord, SyncStatus } from "@/types/base";
import type { EntityTableName, SyncQueueItem } from "@/types/entities";

type AnyRecord = BaseRecord & Record<string, unknown>;

function asAnyTable<T>(table: Table<T, string>): Table<AnyRecord, string> {
  return table as unknown as Table<AnyRecord, string>;
}

const TABLE_MAP: Record<EntityTableName, () => Table<AnyRecord, string>> = {
  configuracao_area: () => asAnyTable(getDb().configuracao_area),
  parcelas: () => asAnyTable(getDb().parcelas),
  tratos_culturais: () => asAnyTable(getDb().tratos_culturais),
  irrigacao: () => asAnyTable(getDb().irrigacao),
  nutricao: () => asAnyTable(getDb().nutricao),
  agrotoxicos: () => asAnyTable(getDb().agrotoxicos),
  colheita: () => asAnyTable(getDb().colheita),
  monitoramento_pragas: () => asAnyTable(getDb().monitoramento_pragas),
  monitoramento_doencas: () => asAnyTable(getDb().monitoramento_doencas),
  clima: () => asAnyTable(getDb().clima),
  observacoes: () => asAnyTable(getDb().observacoes),
};

export function getTable(tableName: EntityTableName): Table<AnyRecord, string> {
  return TABLE_MAP[tableName]();
}

async function enqueueSync(
  tableName: EntityTableName,
  record: AnyRecord,
  operation: "upsert" | "delete"
) {
  const item: SyncQueueItem = {
    tableName,
    recordId: record.id,
    operation,
    payload: record,
    createdAt: nowIso(),
    attempts: 0,
  };
  await getDb().sync_queue.add(item);
}

export async function createRecord<T = AnyRecord>(
  tableName: EntityTableName,
  data: Omit<T, keyof BaseRecord>
): Promise<T> {
  markSaving();
  const ts = nowIso();
  const record = {
    ...data,
    id: newId(),
    createdAt: ts,
    updatedAt: ts,
    syncStatus: "pending" as SyncStatus,
  } as AnyRecord;
  await getTable(tableName).add(record);
  await enqueueSync(tableName, record, "upsert");
  markSaved();
  scheduleSyncDebounced();
  return record as T;
}

export async function updateRecord<T = AnyRecord>(
  tableName: EntityTableName,
  id: string,
  data: Partial<T>
): Promise<T | undefined> {
  markSaving();
  const existing = await getTable(tableName).get(id);
  if (!existing || existing.deletedAt) {
    markSaved();
    return undefined;
  }
  const updated = {
    ...existing,
    ...data,
    id,
    updatedAt: nowIso(),
    syncStatus: "pending" as SyncStatus,
  } as AnyRecord;
  await getTable(tableName).put(updated);
  await enqueueSync(tableName, updated, "upsert");
  markSaved();
  scheduleSyncDebounced();
  return updated as T;
}

export async function getRecord<T = AnyRecord>(
  tableName: EntityTableName,
  id: string
): Promise<T | undefined> {
  const r = await getTable(tableName).get(id);
  if (!r || r.deletedAt) return undefined;
  return r as T;
}

export async function listRecords<T = AnyRecord>(
  tableName: EntityTableName,
  options?: { parcelaId?: string; areaId?: string; categoria?: string }
): Promise<T[]> {
  let collection = getTable(tableName).filter((r) => !r.deletedAt);
  if (options?.parcelaId) {
    const pid = options.parcelaId;
    collection = collection.filter((r) => r.parcelaId === pid);
  }
  if (options?.areaId) {
    const aid = options.areaId;
    collection = collection.filter((r) => r.areaId === aid);
  }
  if (options?.categoria) {
    const cat = options.categoria;
    collection = collection.filter((r) => r.categoria === cat);
  }
  const items = await collection.toArray();
  return items.sort((a, b) => {
    const da = (a.data as string) || a.updatedAt;
    const db = (b.data as string) || b.updatedAt;
    return db.localeCompare(da);
  }) as T[];
}

export async function softDeleteRecord(
  tableName: EntityTableName,
  id: string
): Promise<boolean> {
  markSaving();
  const existing = await getTable(tableName).get(id);
  if (!existing) {
    markSaved();
    return false;
  }
  const updated = {
    ...existing,
    deletedAt: nowIso(),
    updatedAt: nowIso(),
    syncStatus: "pending" as SyncStatus,
  };
  await getTable(tableName).put(updated);
  await enqueueSync(tableName, updated, "delete");
  markSaved();
  scheduleSyncDebounced();
  return true;
}

export async function countRecords(
  tableName: EntityTableName
): Promise<number> {
  return getTable(tableName).filter((r) => !r.deletedAt).count();
}

export async function getLatestDate(
  tableName: EntityTableName
): Promise<string | null> {
  const items = await listRecords(tableName);
  if (items.length === 0) return null;
  const first = items[0] as { data?: string; updatedAt: string };
  return first.data || first.updatedAt.slice(0, 10);
}
