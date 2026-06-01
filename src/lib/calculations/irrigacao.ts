export function calcularLaminaBruta(
  eto: number | null | undefined,
  kc: number | null | undefined
): number | null {
  if (eto == null || kc == null || Number.isNaN(eto) || Number.isNaN(kc)) {
    return null;
  }
  return Math.round(eto * kc * 100) / 100;
}
