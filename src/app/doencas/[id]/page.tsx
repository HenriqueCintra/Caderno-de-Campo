"use client";
import { ModuleDetail } from "@/components/modules/generic-module-pages";
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ModuleDetail type="doencas" params={params} />;
}
