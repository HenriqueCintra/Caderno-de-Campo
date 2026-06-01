"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { listRecords } from "@/lib/db/repository";
import type { EntityTableName } from "@/types/entities";
import type { BaseRecord } from "@/types/base";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RecordListProps {
  table: EntityTableName;
  basePath: string;
  titleField: (r: BaseRecord & Record<string, unknown>) => string;
  subtitleField?: (r: BaseRecord & Record<string, unknown>) => string;
}

export function RecordList({
  table,
  basePath,
  titleField,
  subtitleField,
}: RecordListProps) {
  const records = useLiveQuery(
    () => listRecords(table),
    [table]
  );

  return (
    <div className="space-y-4">
      <Link href={`${basePath}/novo`}>
        <Button size="lg" className="w-full">
          <Plus className="h-5 w-5" />
          Novo registro
        </Button>
      </Link>

      {!records?.length && (
        <p className="text-center text-zinc-500 py-8">
          Nenhum registro salvo. Os dados ficam no aparelho (offline).
        </p>
      )}

      <ul className="space-y-3">
        {records?.map((r) => (
          <li key={r.id}>
            <Link href={`${basePath}/${r.id}`}>
              <Card className="active:scale-[0.99] transition-transform">
                <p className="font-medium text-green-900 dark:text-green-100">
                  {titleField(r as BaseRecord & Record<string, unknown>)}
                </p>
                {subtitleField && (
                  <p className="text-sm text-zinc-600 mt-1">
                    {subtitleField(r as BaseRecord & Record<string, unknown>)}
                  </p>
                )}
                <p className="text-xs text-zinc-400 mt-2">
                  Atualizado {formatDate(r.updatedAt.slice(0, 10))}
                </p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
