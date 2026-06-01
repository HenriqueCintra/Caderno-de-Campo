export type SyncStatus = "pending" | "synced" | "error";

export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
  remoteId?: string;
  deletedAt?: string;
}

export type QualidadeColheita = "Boa" | "Média" | "Ruim";
