"use client";

import { useEffect, useState } from "react";
import { ensureDbReady, requestPersistentStorage } from "@/lib/db/ready";

export function DbReadyGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await ensureDbReady();
        await requestPersistentStorage();
        if (!cancelled) setReady(true);
      } catch (err) {
        console.error("[db]", err);
        if (!cancelled) {
          setError(
            "Não foi possível abrir o armazenamento local. Verifique se o navegador permite salvar dados neste site."
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <p className="max-w-sm text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-zinc-500">Preparando armazenamento…</p>
      </div>
    );
  }

  return <>{children}</>;
}
