import { addDaysToDate } from "@/lib/utils";

export function calcularPrevisaoColheita(
  data: string,
  periodoCarenciaDias: number | null | undefined
): string {
  if (!data || periodoCarenciaDias == null || periodoCarenciaDias < 0) {
    return "";
  }
  return addDaysToDate(data, periodoCarenciaDias);
}
