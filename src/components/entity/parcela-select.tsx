"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { listRecords } from "@/lib/db/repository";
import { parcelaDisplayLabel } from "@/lib/entity/resolve-links";
import type { Parcela } from "@/types/entities";
import { Label } from "@/components/ui/label";
import { ComboSelect } from "@/components/ui/combo-select";

export function ParcelaSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const parcelas = useLiveQuery(() => listRecords<Parcela>("parcelas"), []);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!parcelas) return;
    const byId = parcelas.find((p) => p.id === value);
    setDisplay(parcelaDisplayLabel(byId, value));
  }, [value, parcelas]);

  const options = (parcelas ?? [])
    .map((p) => (p.cultivar || "").trim())
    .filter((name) => name.length > 0);

  return (
    <div>
      <Label>Parcela</Label>
      <ComboSelect
        id="parcela"
        listId="parcela-options"
        value={display}
        onChange={(v) => {
          setDisplay(v);
          onChange(v);
        }}
        options={options}
        placeholder="Digite ou escolha a parcela"
      />
      <p className="mt-1 text-xs text-zinc-500">
        Pode digitar um nome novo; não é preciso cadastrar a parcela antes.
      </p>
    </div>
  );
}
