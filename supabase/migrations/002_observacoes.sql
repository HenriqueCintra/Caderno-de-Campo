-- Observações por área e categoria (caderno tabulado)
CREATE TABLE observacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id UUID NOT NULL REFERENCES configuracao_area(id) ON DELETE CASCADE,
  categoria TEXT NOT NULL DEFAULT 'detalhamento',
  data DATE NOT NULL,
  responsavel TEXT NOT NULL DEFAULT '',
  texto TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE observacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_observacoes" ON observacoes FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE agrotoxicos ADD COLUMN IF NOT EXISTS observacoes TEXT NOT NULL DEFAULT '';
ALTER TABLE colheita ADD COLUMN IF NOT EXISTS observacoes TEXT NOT NULL DEFAULT '';
ALTER TABLE monitoramento_pragas ADD COLUMN IF NOT EXISTS observacoes TEXT NOT NULL DEFAULT '';
ALTER TABLE monitoramento_doencas ADD COLUMN IF NOT EXISTS observacoes TEXT NOT NULL DEFAULT '';
ALTER TABLE clima ADD COLUMN IF NOT EXISTS observacoes TEXT NOT NULL DEFAULT '';
ALTER TABLE parcelas ADD COLUMN IF NOT EXISTS observacoes TEXT NOT NULL DEFAULT '';
