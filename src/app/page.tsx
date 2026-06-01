"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { MODULES } from "@/lib/modules/registry";
import { countRecords, getLatestDate } from "@/lib/db/repository";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";

function ModuleCard({
  path,
  title,
  description,
  table,
}: {
  path: string;
  title: string;
  description: string;
  table: (typeof MODULES)[0]["table"];
}) {
  const count = useLiveQuery(() => countRecords(table), [table]);
  const [latest, setLatest] = useState<string | null>(null);

  useEffect(() => {
    getLatestDate(table).then(setLatest);
  }, [table, count]);

  return (
    <Link href={path}>
      <Card className="active:scale-[0.99] transition-transform">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <p className="mt-3 text-sm text-green-800 dark:text-green-300">
          {count ?? 0} registro(s)
          {latest && ` · último ${formatDate(latest)}`}
        </p>
      </Card>
    </Link>
  );
}

export default function HomePage() {
  return (
    <AppShell title="Caderno de Campo">
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        Salve e consulte no campo, mesmo sem internet. Seus dados ficam
        guardados neste aparelho.
      </p>
      <div className="grid gap-3">
        {MODULES.map((m) => (
          <ModuleCard
            key={m.id}
            path={m.path}
            title={m.shortTitle}
            description={m.description}
            table={m.table}
          />
        ))}
      </div>
    </AppShell>
  );
}
