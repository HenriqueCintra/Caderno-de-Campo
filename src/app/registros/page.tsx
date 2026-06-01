"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { MODULES } from "@/lib/modules/registry";

const REGISTRO_MODULES = MODULES.filter(
  (m) => !["capa", "parcelas", "clima"].includes(m.id)
);

export default function RegistrosPage() {
  return (
    <AppShell title="Registros">
      <p className="mb-4 text-sm text-zinc-600">
        Tratos, irrigação, nutrição, defensivos, colheita e monitoramento.
      </p>
      <div className="grid gap-3">
        {REGISTRO_MODULES.map((m) => (
          <Link key={m.id} href={m.path}>
            <Card>
              <CardTitle>{m.title}</CardTitle>
              <CardDescription>{m.description}</CardDescription>
            </Card>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
