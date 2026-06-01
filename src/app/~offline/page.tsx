export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-700 p-6 text-center text-white">
      <h1 className="text-2xl font-bold">Você está offline</h1>
      <p className="mt-4 max-w-sm">
        O Caderno de Campo continua funcionando. Seus dados estão salvos neste
        aparelho. Reabra a página quando tiver conexão para sincronizar.
      </p>
    </div>
  );
}
