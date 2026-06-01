import { ensureDbReady } from "@/lib/db/ready";
import { getDb } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";
import type { EntityTableName } from "@/types/entities";

export type RegistroItem = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  href: string;
  sortKey: string;
};

type RecordRow = Record<string, unknown> & { id: string; updatedAt?: string };

type Source = {
  table: EntityTableName;
  category: string;
  title: (r: RecordRow) => string;
  subtitle: (r: RecordRow) => string;
  href: (r: RecordRow) => string;
  sortKey: (r: RecordRow) => string;
};

const SOURCES: Source[] = [
  {
    table: "configuracao_area",
    category: "Detalhamento da área",
    title: (r) => String(r.experimento || r.municipio || "Área sem nome"),
    subtitle: (r) => `${r.cultura || "—"} · ${formatDate(String(r.dataPlantio ?? ""))}`,
    href: (r) => `/capa/${r.id}`,
    sortKey: (r) => String(r.dataPlantio || r.updatedAt || ""),
  },
  {
    table: "parcelas",
    category: "Parcela",
    title: (r) => String(r.cultivar || "Parcela"),
    subtitle: (r) => `${r.areaHa ?? "—"} ha · ${r.sistemaIrrigacao || "—"}`,
    href: (r) => `/parcelas/${r.id}`,
    sortKey: (r) => String(r.updatedAt || ""),
  },
  {
    table: "observacoes",
    category: "Observação",
    title: (r) => formatDate(String(r.data ?? "")),
    subtitle: (r) => {
      const txt = String(r.texto || "");
      return txt.length > 72 ? `${txt.slice(0, 72)}…` : txt || "—";
    },
    href: (r) => `/capa/${String(r.areaId || r.id)}`,
    sortKey: (r) => String(r.data || r.updatedAt || ""),
  },
  {
    table: "tratos_culturais",
    category: "Tratos culturais",
    title: (r) => formatDate(String(r.data ?? "")),
    subtitle: (r) => String(r.tipoTrato || "—"),
    href: (r) => `/tratos/${r.id}`,
    sortKey: (r) => String(r.data || r.updatedAt || ""),
  },
  {
    table: "irrigacao",
    category: "Irrigação",
    title: (r) => formatDate(String(r.data ?? "")),
    subtitle: (r) => `Lâmina ${r.laminaBruta ?? "—"} mm`,
    href: (r) => `/irrigacao/${r.id}`,
    sortKey: (r) => String(r.data || r.updatedAt || ""),
  },
  {
    table: "nutricao",
    category: "Nutrição",
    title: (r) => formatDate(String(r.data ?? "")),
    subtitle: (r) => String(r.fonte || "—"),
    href: (r) => `/nutricao/${r.id}`,
    sortKey: (r) => String(r.data || r.updatedAt || ""),
  },
  {
    table: "agrotoxicos",
    category: "Agrotóxicos",
    title: (r) => formatDate(String(r.data ?? "")),
    subtitle: (r) => String(r.produto || "—"),
    href: (r) => `/agrotoxicos/${r.id}`,
    sortKey: (r) => String(r.data || r.updatedAt || ""),
  },
  {
    table: "colheita",
    category: "Colheita",
    title: (r) => formatDate(String(r.data ?? "")),
    subtitle: (r) => `${r.producaoKg ?? "—"} kg · ${r.qualidade || "—"}`,
    href: (r) => `/colheita/${r.id}`,
    sortKey: (r) => String(r.data || r.updatedAt || ""),
  },
  {
    table: "monitoramento_pragas",
    category: "Pragas",
    title: (r) => formatDate(String(r.data ?? "")),
    subtitle: (r) => String(r.praga || "—"),
    href: (r) => `/pragas/${r.id}`,
    sortKey: (r) => String(r.data || r.updatedAt || ""),
  },
  {
    table: "monitoramento_doencas",
    category: "Doenças",
    title: (r) => formatDate(String(r.data ?? "")),
    subtitle: (r) => String(r.doenca || "—"),
    href: (r) => `/doencas/${r.id}`,
    sortKey: (r) => String(r.data || r.updatedAt || ""),
  },
  {
    table: "clima",
    category: "Clima",
    title: (r) => formatDate(String(r.data ?? "")),
    subtitle: (r) => `Chuva ${r.chuvaMm ?? "—"} mm`,
    href: (r) => `/clima/${r.id}`,
    sortKey: (r) => String(r.data || r.updatedAt || ""),
  },
];

async function listTableRows(tableName: EntityTableName): Promise<RecordRow[]> {
  const database = getDb();
  const table = database.tables.find((t) => t.name === tableName);
  if (!table) return [];

  const rows = await table.toArray();
  return rows.filter((r) => !(r as RecordRow).deletedAt) as RecordRow[];
}

export async function listAllRegistros(): Promise<RegistroItem[]> {
  if (typeof window === "undefined") return [];

  await ensureDbReady();
  const database = getDb();

  const items: RegistroItem[] = [];

  for (const src of SOURCES) {
    try {
      const rows = await listTableRows(src.table);
      for (const row of rows) {
        items.push({
          id: `${src.table}-${row.id}`,
          category: src.category,
          title: src.title(row),
          subtitle: src.subtitle(row),
          href: src.href(row),
          sortKey: src.sortKey(row),
        });
      }
    } catch (err) {
      console.warn(`[registros] falha ao ler ${src.table}:`, err);
    }
  }

  return items.sort((a, b) => b.sortKey.localeCompare(a.sortKey));
}
