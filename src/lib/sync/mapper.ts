import type { EntityTableName } from "@/types/entities";

/** Converte camelCase (local) para snake_case (Supabase) */
export function toSnakeCase(
  obj: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (
      key === "syncStatus" ||
      key === "imagemBlobId" ||
      key === "deletedAt"
    ) {
      continue;
    }
    const snake = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    out[snake] = value;
  }
  if (obj.remoteId) out.id = obj.remoteId;
  else if (obj.id && typeof obj.id === "string") out.id = obj.id;
  return out;
}

export const SYNC_ORDER: EntityTableName[] = [
  "configuracao_area",
  "parcelas",
  "tratos_culturais",
  "irrigacao",
  "nutricao",
  "agrotoxicos",
  "colheita",
  "monitoramento_pragas",
  "monitoramento_doencas",
  "clima",
  "observacoes",
];
