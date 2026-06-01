"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { listAllRegistros } from "@/lib/registros/all-records";
import { Card } from "@/components/ui/card";

export function AllRecordsList() {
  const registros = useLiveQuery(async () => {
    try {
      return await listAllRegistros();
    } catch (err) {
      console.error("[registros]", err);
      return [];
    }
  });

  if (registros === undefined) {
    return <p className="py-8 text-center text-sm text-zinc-500">Carregando…</p>;
  }

  if (registros.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-zinc-500">
        Nenhum registro cadastrado ainda.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {registros.map((r) => (
        <li key={r.id}>
          <Link href={r.href}>
            <Card className="active:scale-[0.99] transition-transform">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">
                {r.category}
              </p>
              <p className="mt-1 font-medium text-green-900 dark:text-green-100">
                {r.title}
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {r.subtitle}
              </p>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
