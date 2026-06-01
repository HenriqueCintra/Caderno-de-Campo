"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getRecord, softDeleteRecord } from "@/lib/db/repository";
import type { EntityTableName } from "@/types/entities";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

export function RecordDetail({
  table,
  id,
  basePath,
  title,
  fields,
}: {
  table: EntityTableName;
  id: string;
  basePath: string;
  title: string;
  fields: { label: string; key: string; format?: (v: unknown) => string }[];
}) {
  const router = useRouter();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    getRecord(table, id).then((r) => setRecord(r ?? null));
  }, [table, id]);

  if (!record) return <p>Carregando…</p>;

  const remove = async () => {
    if (!confirm("Excluir este registro?")) return;
    await softDeleteRecord(table, id);
    router.push(basePath);
  };

  return (
    <div className="space-y-4 pb-8">
      <Card>
        <h2 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4">
          {title}
        </h2>
        <dl className="space-y-3">
          {fields.map(({ label, key, format }) => (
            <div key={key}>
              <dt className="text-xs text-zinc-500 uppercase">{label}</dt>
              <dd className="text-base">
                {format
                  ? format(record[key])
                  : String(record[key] ?? "—")}
              </dd>
            </div>
          ))}
          <div>
            <dt className="text-xs text-zinc-500 uppercase">Atualizado</dt>
            <dd>{formatDate(String(record.updatedAt).slice(0, 10))}</dd>
          </div>
        </dl>
      </Card>
      <div className="flex gap-3">
        <Link href={`${basePath}/${id}/editar`} className="flex-1">
          <Button variant="outline" size="lg" className="w-full">
            <Pencil className="h-5 w-5" />
            Editar
          </Button>
        </Link>
        <Button variant="destructive" size="lg" onClick={remove}>
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
