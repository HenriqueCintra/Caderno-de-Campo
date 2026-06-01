-- Caderno de Campo — schema free tier
-- Aplicar no SQL Editor do Supabase ou via CLI

CREATE TYPE qualidade_colheita AS ENUM ('Boa', 'Média', 'Ruim');

CREATE TABLE configuracao_area (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supervisor TEXT NOT NULL DEFAULT '',
  responsavel_tecnico TEXT NOT NULL DEFAULT '',
  bolsista TEXT NOT NULL DEFAULT '',
  municipio TEXT NOT NULL DEFAULT '',
  telefones TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  data_plantio DATE,
  setor TEXT NOT NULL DEFAULT '',
  cultura TEXT NOT NULL DEFAULT '',
  variedade TEXT NOT NULL DEFAULT '',
  espacamento TEXT NOT NULL DEFAULT '',
  experimento TEXT NOT NULL DEFAULT '',
  tamanho_area NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE parcelas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id UUID NOT NULL REFERENCES configuracao_area(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  cultivar TEXT NOT NULL DEFAULT '',
  ano_plantio INTEGER,
  sistema_irrigacao TEXT NOT NULL DEFAULT '',
  area_ha NUMERIC,
  espacamento TEXT NOT NULL DEFAULT '',
  densidade NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tratos_culturais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  parcela_id UUID NOT NULL REFERENCES parcelas(id) ON DELETE RESTRICT,
  tipo_trato TEXT NOT NULL DEFAULT '',
  responsavel TEXT NOT NULL DEFAULT '',
  observacoes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE irrigacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  parcela_id UUID NOT NULL REFERENCES parcelas(id) ON DELETE RESTRICT,
  eto NUMERIC,
  kc NUMERIC,
  lamina_bruta NUMERIC,
  tempo_irrigacao TEXT NOT NULL DEFAULT '',
  responsavel TEXT NOT NULL DEFAULT '',
  observacoes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE nutricao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  parcela_id UUID NOT NULL REFERENCES parcelas(id) ON DELETE RESTRICT,
  fonte TEXT NOT NULL DEFAULT '',
  quantidade NUMERIC,
  unidade TEXT NOT NULL DEFAULT '',
  forma_aplicacao TEXT NOT NULL DEFAULT '',
  responsavel TEXT NOT NULL DEFAULT '',
  observacoes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE agrotoxicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  parcela_id UUID NOT NULL REFERENCES parcelas(id) ON DELETE RESTRICT,
  fenologia TEXT NOT NULL DEFAULT '',
  produto TEXT NOT NULL DEFAULT '',
  periodo_carencia_dias INTEGER,
  previsao_colheita DATE,
  dosagem TEXT NOT NULL DEFAULT '',
  volume_calda TEXT NOT NULL DEFAULT '',
  responsavel TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE colheita (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  parcela_id UUID NOT NULL REFERENCES parcelas(id) ON DELETE RESTRICT,
  producao_kg NUMERIC,
  qualidade qualidade_colheita NOT NULL DEFAULT 'Boa',
  plantas_colhidas INTEGER,
  destino TEXT NOT NULL DEFAULT '',
  responsavel TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE monitoramento_pragas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  parcela_id UUID NOT NULL REFERENCES parcelas(id) ON DELETE RESTRICT,
  praga TEXT NOT NULL DEFAULT '',
  fenologia TEXT NOT NULL DEFAULT '',
  intensidade_pct NUMERIC,
  sintomas TEXT NOT NULL DEFAULT '',
  responsavel TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE monitoramento_doencas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  parcela_id UUID NOT NULL REFERENCES parcelas(id) ON DELETE RESTRICT,
  fenologia TEXT NOT NULL DEFAULT '',
  doenca TEXT NOT NULL DEFAULT '',
  incidencia_brotos BOOLEAN NOT NULL DEFAULT false,
  incidencia_folhas BOOLEAN NOT NULL DEFAULT false,
  incidencia_ramos BOOLEAN NOT NULL DEFAULT false,
  sintomas TEXT NOT NULL DEFAULT '',
  imagem_url TEXT,
  responsavel TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE clima (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  area_id UUID NOT NULL REFERENCES configuracao_area(id) ON DELETE CASCADE,
  chuva_mm NUMERIC,
  tmax NUMERIC,
  tmin NUMERIC,
  eto NUMERIC,
  ocorrencias TEXT NOT NULL DEFAULT '',
  responsavel TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL,
  last_sync_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS permissivo para protótipo (anon). Restringir em produção.
ALTER TABLE configuracao_area ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tratos_culturais ENABLE ROW LEVEL SECURITY;
ALTER TABLE irrigacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutricao ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrotoxicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE colheita ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoramento_pragas ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoramento_doencas ENABLE ROW LEVEL SECURITY;
ALTER TABLE clima ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all_configuracao_area" ON configuracao_area FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_parcelas" ON parcelas FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_tratos" ON tratos_culturais FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_irrigacao" ON irrigacao FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_nutricao" ON nutricao FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_agrotoxicos" ON agrotoxicos FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_colheita" ON colheita FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_pragas" ON monitoramento_pragas FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_doencas" ON monitoramento_doencas FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_clima" ON clima FOR ALL TO anon USING (true) WITH CHECK (true);

-- Storage bucket para sintomas (criar no painel: sintomas, público ou RLS)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('sintomas', 'sintomas', false);
