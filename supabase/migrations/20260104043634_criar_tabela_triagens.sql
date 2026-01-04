-- Criar tabela de triagens
CREATE TABLE IF NOT EXISTS triagens (
    id BIGSERIAL PRIMARY KEY,
    nome_paciente TEXT NOT NULL,
    data_nascimento DATE,
    idade TEXT,
    data_triagem DATE,
    hora_triagem TIME,
    pressao_sis_esquerdo INTEGER,
    pressao_dia_esquerdo INTEGER,
    pressao_sis_direito INTEGER,
    pressao_dia_direito INTEGER,
    frequencia_cardiaca INTEGER,
    saturacao_oxigenio INTEGER,
    altura_cm NUMERIC,
    peso_kg NUMERIC,
    imc NUMERIC,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comentários nas colunas (documentação)
COMMENT ON TABLE triagens IS 'Registros de triagem clínica dos pacientes';
COMMENT ON COLUMN triagens.nome_paciente IS 'Nome completo do paciente';
COMMENT ON COLUMN triagens.data_nascimento IS 'Data de nascimento do paciente';
COMMENT ON COLUMN triagens.idade IS 'Idade calculada automaticamente';
COMMENT ON COLUMN triagens.pressao_sis_esquerdo IS 'Pressão sistólica do braço esquerdo (mmHg)';
COMMENT ON COLUMN triagens.pressao_dia_esquerdo IS 'Pressão diastólica do braço esquerdo (mmHg)';
COMMENT ON COLUMN triagens.pressao_sis_direito IS 'Pressão sistólica do braço direito (mmHg)';
COMMENT ON COLUMN triagens.pressao_dia_direito IS 'Pressão diastólica do braço direito (mmHg)';
COMMENT ON COLUMN triagens.frequencia_cardiaca IS 'Frequência cardíaca em batimentos por minuto (bpm)';
COMMENT ON COLUMN triagens.saturacao_oxigenio IS 'Saturação de oxigênio em porcentagem (%)';
COMMENT ON COLUMN triagens.altura_cm IS 'Altura em centímetros';
COMMENT ON COLUMN triagens.peso_kg IS 'Peso em quilogramas';
COMMENT ON COLUMN triagens.imc IS 'Índice de Massa Corporal calculado';

-- Criar índices para melhor performance nas buscas
CREATE INDEX IF NOT EXISTS idx_triagens_nome ON triagens(nome_paciente);
CREATE INDEX IF NOT EXISTS idx_triagens_data ON triagens(data_triagem DESC);
CREATE INDEX IF NOT EXISTS idx_triagens_criado_em ON triagens(criado_em DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE triagens ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança (Acesso Público para desenvolvimento)
CREATE POLICY "Permitir inserção pública"
ON triagens FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Permitir leitura pública"
ON triagens FOR SELECT
TO public
USING (true);

-- Função para atualizar automaticamente o campo atualizado_em
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que executa a função antes de cada UPDATE
DROP TRIGGER IF EXISTS trigger_atualizar_timestamp ON triagens;
CREATE TRIGGER trigger_atualizar_timestamp
BEFORE UPDATE ON triagens
FOR EACH ROW
EXECUTE FUNCTION atualizar_timestamp();

-- View com triagens recentes (últimos 7 dias)
CREATE OR REPLACE VIEW triagens_recentes AS
SELECT 
    id,
    nome_paciente,
    data_triagem,
    hora_triagem,
    pressao_sis_esquerdo || '×' || pressao_dia_esquerdo AS pa_esquerdo,
    pressao_sis_direito || '×' || pressao_dia_direito AS pa_direito,
    frequencia_cardiaca,
    saturacao_oxigenio,
    imc,
    criado_em
FROM triagens
WHERE data_triagem >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY data_triagem DESC, hora_triagem DESC;

-- View com estatísticas gerais
CREATE OR REPLACE VIEW estatisticas_triagens AS
SELECT 
    COUNT(*) AS total_triagens,
    COUNT(DISTINCT nome_paciente) AS total_pacientes,
    COUNT(*) FILTER (WHERE data_triagem = CURRENT_DATE) AS triagens_hoje,
    ROUND(AVG(imc), 1) AS imc_medio,
    ROUND(AVG(frequencia_cardiaca), 0) AS fc_media,
    ROUND(AVG(saturacao_oxigenio), 1) AS spo2_medio
FROM triagens;

