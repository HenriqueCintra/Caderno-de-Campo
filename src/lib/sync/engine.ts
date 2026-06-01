import { getDb } from "@/lib/db/schema";
import { getTable } from "@/lib/db/repository";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { EntityTableName, SyncQueueItem } from "@/types/entities";
import { SYNC_ORDER, toSnakeCase } from "./mapper";
import { nowIso } from "@/lib/utils";

type LooseRecord = {
  id: string;
  updatedAt: string;
  createdAt: string;
  syncStatus: string;
  [key: string]: unknown;
};

const THROTTLE_MS = 300;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export type SyncResult = {
  processed: number;
  failed: number;
  skipped: boolean;
};

export async function processSyncQueue(): Promise<SyncResult> {
  if (!isSupabaseConfigured() || !navigator.onLine) {
    return { processed: 0, failed: 0, skipped: true };
  }

  const supabase = getSupabase();
  if (!supabase) return { processed: 0, failed: 0, skipped: true };

  const queue = await getDb().sync_queue.orderBy("createdAt").toArray();
  let processed = 0;
  let failed = 0;

  const sorted = [...queue].sort((a, b) => {
    const ia = SYNC_ORDER.indexOf(a.tableName as EntityTableName);
    const ib = SYNC_ORDER.indexOf(b.tableName as EntityTableName);
    return ia - ib;
  });

  for (const item of sorted) {
    try {
      await syncItem(supabase, item);
      if (item.id != null) await getDb().sync_queue.delete(item.id);
      processed++;
      await sleep(THROTTLE_MS);
    } catch (err) {
      failed++;
      const message = err instanceof Error ? err.message : String(err);
      if (item.id != null) {
        await getDb().sync_queue.update(item.id, {
          attempts: (item.attempts || 0) + 1,
          lastError: message,
        });
      }
      const table = getTable(item.tableName as EntityTableName);
      const rec = await table.get(item.recordId);
      if (rec) {
        await table.update(item.recordId, {
          syncStatus: "error",
        });
      }
    }
  }

  return { processed, failed, skipped: false };
}

async function syncItem(
  supabase: ReturnType<typeof getSupabase>,
  item: SyncQueueItem
) {
  if (!supabase) return;
  const tableName = item.tableName as EntityTableName;
  const payload = toSnakeCase(item.payload);

  if (item.operation === "delete") {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", payload.id as string);
    if (error) throw error;
    return;
  }

  const { data, error } = await supabase
    .from(tableName)
    .upsert(payload, { onConflict: "id" })
    .select("id")
    .single();

  if (error) throw error;

  const localTable = getTable(tableName);
  const local = await localTable.get(item.recordId);
  if (local) {
    await localTable.update(item.recordId, {
      syncStatus: "synced",
      remoteId: data?.id as string,
      updatedAt: nowIso(),
    });
  }
}

export async function pullRemoteUpdates(): Promise<number> {
  if (!isSupabaseConfigured() || !navigator.onLine) return 0;
  const supabase = getSupabase();
  if (!supabase) return 0;

  let pulled = 0;
  for (const tableName of SYNC_ORDER) {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error || !data) continue;

    const localTable = getTable(tableName);
    for (const row of data) {
      const localId = row.id as string;
      const existing = await localTable.get(localId);
      const mapped = fromSnakeCase(row) as LooseRecord;
      const mappedUpdated = String(mapped.updatedAt || row.updated_at || "");
      if (
        !existing ||
        new Date(mappedUpdated) > new Date(existing.updatedAt)
      ) {
        await localTable.put({
          ...mapped,
          id: localId,
          remoteId: localId,
          syncStatus: "synced",
          updatedAt: mappedUpdated || existing?.updatedAt || nowIso(),
          createdAt: String(mapped.createdAt || row.created_at || nowIso()),
        });
        pulled++;
      }
    }
    await sleep(THROTTLE_MS);
  }
  return pulled;
}

function fromSnakeCase(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    out[camel] = value;
  }
  if (row.updated_at) out.updatedAt = row.updated_at;
  if (row.created_at) out.createdAt = row.created_at;
  return out;
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleSyncDebounced(delayMs = 8000) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    void processSyncQueue();
  }, delayMs);
}
