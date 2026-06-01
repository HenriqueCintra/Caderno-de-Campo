import { getDb } from "./schema";

let openPromise: Promise<void> | null = null;

/** Garante que o IndexedDB está aberto antes de ler ou gravar. */
export async function ensureDbReady(): Promise<void> {
  if (typeof window === "undefined") return;

  const database = getDb();
  if (database.isOpen()) return;

  if (!openPromise) {
    openPromise = database
      .open()
      .then(() => undefined)
      .catch((err) => {
        openPromise = null;
        throw err;
      });
  }

  await openPromise;
}

/** Pede ao navegador para não apagar os dados automaticamente (quando suportado). */
export async function requestPersistentStorage(): Promise<void> {
  if (typeof navigator === "undefined") return;
  try {
    const storage = navigator.storage;
    if (storage?.persist) {
      await storage.persist();
    }
  } catch {
    // ignorar — alguns navegadores não suportam
  }
}
