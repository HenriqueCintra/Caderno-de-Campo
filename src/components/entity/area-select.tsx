"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { listRecords } from "@/lib/db/repository";
import type { ConfiguracaoArea } from "@/types/entities";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function AreaSelect({
  value,
  onChange,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const areas = useLiveQuery(
    () => listRecords<ConfiguracaoArea>("configuracao_area"),
    []
  );

  return (
    <div>
      <Label>Área / Experimento {required && "*"}</Label>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        <option value="">Selecione…</option>
        {areas?.map((a) => (
          <option key={a.id} value={a.id}>
            {a.experimento || a.municipio || a.id.slice(0, 8)}
          </option>
        ))}
      </Select>
      {areas?.length === 0 && (
        <p className="text-sm text-amber-700 mt-1">
          Cadastre o detalhamento da área primeiro.
        </p>
      )}
    </div>
  );
}
