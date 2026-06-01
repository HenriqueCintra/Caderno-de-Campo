"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type ComboSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  className?: string;
  id?: string;
  listId?: string;
};

export function ComboSelect({
  value,
  onChange,
  options,
  placeholder,
  className,
  id,
  listId,
}: ComboSelectProps) {
  const datalistId = listId ?? id ?? "combo-options";

  return (
    <>
      <Input
        id={id}
        list={datalistId}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(className)}
      />
      <datalist id={datalistId}>
        {options.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </>
  );
}
