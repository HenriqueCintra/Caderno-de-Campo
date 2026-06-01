"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { listRecords } from "@/lib/db/repository";
import type { Parcela } from "@/types/entities";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function ParcelaSelect({
  value,
  onChange,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const parcelas = useLiveQuery(() => listRecords<Parcela>("parcelas"), []);

  return (
    <div>
      <Label>Parcela {required && "*"}</Label>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        <option value="">Selecione…</option>
        {parcelas?.map((p) => (
          <option key={p.id} value={p.id}>
            {p.cultivar || p.id.slice(0, 8)} — {p.areaHa ?? "?"} ha
          </option>
        ))}
      </Select>
      {parcelas?.length === 0 && (
        <p className="text-sm text-amber-700 mt-1">
          Cadastre parcelas antes deste registro.
        </p>
      )}
    </div>
  );
}
