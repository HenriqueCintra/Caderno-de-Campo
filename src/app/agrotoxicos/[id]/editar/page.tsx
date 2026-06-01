"use client";
import { ModuleEditar } from "@/components/modules/generic-module-pages";
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ModuleEditar type="agrotoxicos" params={params} />;
}
