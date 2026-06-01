"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { listRecords } from "@/lib/db/repository";
import { areaDisplayLabel } from "@/lib/entity/resolve-links";
import type { ConfiguracaoArea } from "@/types/entities";
import { Label } from "@/components/ui/label";
import { ComboSelect } from "@/components/ui/combo-select";

export function AreaSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const areas = useLiveQuery(
    () => listRecords<ConfiguracaoArea>("configuracao_area"),
    []
  );
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!areas) return;
    const byId = areas.find((a) => a.id === value);
    setDisplay(areaDisplayLabel(byId, value));
  }, [value, areas]);

  const options = (areas ?? [])
    .map((a) => areaDisplayLabel(a, a.id))
    .filter((name) => name.length > 0);

  return (
    <div>
      <Label>Área / Experimento</Label>
      <ComboSelect
        id="area"
        listId="area-options"
        value={display}
        onChange={(v) => {
          setDisplay(v);
          onChange(v);
        }}
        options={options}
        placeholder="Digite ou escolha a área"
      />
      <p className="mt-1 text-xs text-zinc-500">
        Pode digitar um nome novo; não é preciso cadastrar a área antes.
      </p>
    </div>
  );
}
