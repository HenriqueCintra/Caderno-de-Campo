import type { EntityTableName } from "@/types/entities";

export interface ModuleConfig {
  id: string;
  table: EntityTableName;
  path: string;
  title: string;
  shortTitle: string;
  description: string;
  requiresParcela: boolean;
  requiresArea: boolean;
}

export const MODULES: ModuleConfig[] = [
  {
    id: "capa",
    table: "configuracao_area",
    path: "/capa",
    title: "Detalhamento da área",
    shortTitle: "Detalhamento da área",
    description: "Dados gerais da área, parcelas e observações",
    requiresParcela: false,
    requiresArea: false,
  },
  {
    id: "parcelas",
    table: "parcelas",
    path: "/parcelas",
    title: "Parcelas",
    shortTitle: "Parcelas",
    description: "Coordenadas e características das parcelas",
    requiresParcela: false,
    requiresArea: true,
  },
  {
    id: "tratos",
    table: "tratos_culturais",
    path: "/tratos",
    title: "Tratos Culturais",
    shortTitle: "Tratos",
    description: "Operações de manejo",
    requiresParcela: true,
    requiresArea: false,
  },
  {
    id: "irrigacao",
    table: "irrigacao",
    path: "/irrigacao",
    title: "Irrigação",
    shortTitle: "Irrigação",
    description: "ETo, Kc e lâmina aplicada",
    requiresParcela: true,
    requiresArea: false,
  },
  {
    id: "nutricao",
    table: "nutricao",
    path: "/nutricao",
    title: "Nutrição",
    shortTitle: "Nutrição",
    description: "Adubação e fertilização",
    requiresParcela: true,
    requiresArea: false,
  },
  {
    id: "agrotoxicos",
    table: "agrotoxicos",
    path: "/agrotoxicos",
    title: "Agrotóxicos",
    shortTitle: "Agrotóxicos",
    description: "Aplicações e carência",
    requiresParcela: true,
    requiresArea: false,
  },
  {
    id: "colheita",
    table: "colheita",
    path: "/colheita",
    title: "Colheita",
    shortTitle: "Colheita",
    description: "Produção e qualidade",
    requiresParcela: true,
    requiresArea: false,
  },
  {
    id: "pragas",
    table: "monitoramento_pragas",
    path: "/pragas",
    title: "Monitoramento de Pragas",
    shortTitle: "Pragas",
    description: "Incidência e sintomas",
    requiresParcela: true,
    requiresArea: false,
  },
  {
    id: "doencas",
    table: "monitoramento_doencas",
    path: "/doencas",
    title: "Monitoramento de Doenças",
    shortTitle: "Doenças",
    description: "Sintomas e imagens",
    requiresParcela: true,
    requiresArea: false,
  },
  {
    id: "clima",
    table: "clima",
    path: "/clima",
    title: "Clima",
    shortTitle: "Clima",
    description: "Chuva, temperatura e ETo",
    requiresParcela: false,
    requiresArea: true,
  },
];

export function getModuleByPath(path: string): ModuleConfig | undefined {
  return MODULES.find((m) => m.path === path);
}
