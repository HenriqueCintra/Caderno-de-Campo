# Caderno de Campo (PWA)

Aplicação **mobile-first** e **offline-first** para digitalizar o caderno de campo agrícola, com **custo de infraestrutura zero**.

## Stack (free tier)

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 16, React, TypeScript, Tailwind CSS |
| UI | Componentes estilo shadcn, Lucide |
| Local | IndexedDB via Dexie.js |
| Nuvem (opcional) | Supabase Free (Postgres + Storage) |
| Hospedagem | Vercel Hobby |
| PWA | Serwist (Service Worker) |

## Princípio

O **aparelho é a fonte da verdade**. Todo formulário grava no IndexedDB imediatamente. A sincronização com o Supabase ocorre em background quando há rede.

## Desenvolvimento

```bash
npm install
cp .env.local.example .env.local
# Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY (opcional)
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). No celular: “Adicionar à tela inicial” para instalar o PWA.

## Supabase

1. Crie um projeto no [plano gratuito](https://supabase.com).
2. Execute o SQL em [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql).
3. (Opcional) Crie o bucket Storage `sintomas` para fotos comprimidas.
4. Copie URL e `anon key` para `.env.local`.

Sem Supabase o app funciona **100% offline** no navegador.

## Deploy (Vercel)

1. Importe o repositório na Vercel (plano Hobby).
2. Adicione as variáveis de ambiente do Supabase.
3. Deploy automático a cada push.

## Módulos

- Configuração (Capa), Parcelas (GPS), Tratos, Irrigação (ETo×Kc), Nutrição, Agrotóxicos (carência), Colheita, Pragas, Doenças (foto comprimida), Clima.

## Limites gratuitos

- Evite uploads grandes; imagens são comprimidas no cliente (~400 KB).
- Sync com debounce — não há polling contínuo.
- Se o Storage encher, as fotos permanecem só no dispositivo.
