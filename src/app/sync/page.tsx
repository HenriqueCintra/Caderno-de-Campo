"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSync } from "@/hooks/useSync";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { RefreshCw } from "lucide-react";

export default function SyncPage() {
  const { online, syncing, pendingCount, lastResult, runSync } = useSync();
  const configured = isSupabaseConfigured();

  return (
    <AppShell title="Sincronização">
      <div className="space-y-4">
        <Card>
          <p className="text-sm">
            <strong>Status:</strong> {online ? "Online" : "Offline"}
          </p>
          <p className="text-sm mt-2">
            <strong>Supabase:</strong>{" "}
            {configured ? "Configurado" : "Não configurado (somente local)"}
          </p>
          <p className="text-sm mt-2">
            <strong>Fila pendente:</strong> {pendingCount} item(ns)
          </p>
        </Card>

        <Button
          size="lg"
          className="w-full"
          disabled={syncing || !online || !configured}
          onClick={() => runSync()}
        >
          <RefreshCw className={`h-5 w-5 ${syncing ? "animate-spin" : ""}`} />
          Sincronizar agora
        </Button>

        {!configured && (
          <p className="text-sm text-amber-800 bg-amber-50 p-3 rounded-xl">
            Copie <code>.env.local.example</code> para <code>.env.local</code> e
            preencha as chaves do Supabase Free para habilitar sync na nuvem.
          </p>
        )}

        {lastResult && (
          <p className="text-sm text-zinc-600">{lastResult}</p>
        )}

        <Card>
          <h3 className="font-semibold mb-2">Como funciona</h3>
          <ul className="text-sm space-y-2 text-zinc-600 list-disc pl-4">
            <li>Todo &quot;Salvar&quot; grava primeiro no IndexedDB deste aparelho.</li>
            <li>Com internet, os dados sobem para o Supabase em background.</li>
            <li>Fotos de doenças são comprimidas antes do upload (economia de Storage).</li>
            <li>Sem custo: Vercel Hobby + Supabase Free + APIs do navegador.</li>
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
