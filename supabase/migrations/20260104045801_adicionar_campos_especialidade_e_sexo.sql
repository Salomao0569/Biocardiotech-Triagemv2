-- Adicionar novos campos à tabela triagens
ALTER TABLE triagens
ADD COLUMN IF NOT EXISTS especialidade TEXT,
ADD COLUMN IF NOT EXISTS tipo_atendimento TEXT,
ADD COLUMN IF NOT EXISTS sexo TEXT;

-- Comentários nas novas colunas
COMMENT ON COLUMN triagens.especialidade IS 'Especialidade médica: Cardiologia ou Endocrinologia';
COMMENT ON COLUMN triagens.tipo_atendimento IS 'Tipo de atendimento: Consulta ou Exame';
COMMENT ON COLUMN triagens.sexo IS 'Sexo do paciente: Masculino ou Feminino';

-- Criar índice para busca por especialidade
CREATE INDEX IF NOT EXISTS idx_triagens_especialidade ON triagens(especialidade);

-- Criar índice para busca por tipo de atendimento
CREATE INDEX IF NOT EXISTS idx_triagens_tipo_atendimento ON triagens(tipo_atendimento);

-- Atualizar view de triagens recentes para incluir novos campos
DROP VIEW IF EXISTS triagens_recentes;
CREATE VIEW triagens_recentes AS
SELECT 
    id,
    nome_paciente,
    idade,
    sexo,
    especialidade,
    tipo_atendimento,
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

-- Atualizar view de estatísticas para incluir novos dados
DROP VIEW IF EXISTS estatisticas_triagens;
CREATE VIEW estatisticas_triagens AS
SELECT 
    COUNT(*) AS total_triagens,
    COUNT(DISTINCT nome_paciente) AS total_pacientes,
    COUNT(*) FILTER (WHERE data_triagem = CURRENT_DATE) AS triagens_hoje,
    COUNT(*) FILTER (WHERE EXTRACT(MONTH FROM data_triagem) = EXTRACT(MONTH FROM CURRENT_DATE)) AS triagens_mes,
    COUNT(*) FILTER (WHERE EXTRACT(YEAR FROM data_triagem) = EXTRACT(YEAR FROM CURRENT_DATE)) AS triagens_ano,
    COUNT(*) FILTER (WHERE especialidade = 'Cardiologia') AS total_cardiologia,
    COUNT(*) FILTER (WHERE especialidade = 'Endocrinologia') AS total_endocrinologia,
    COUNT(*) FILTER (WHERE sexo = 'Masculino') AS total_masculino,
    COUNT(*) FILTER (WHERE sexo = 'Feminino') AS total_feminino,
    ROUND(AVG(imc), 1) AS imc_medio,
    ROUND(AVG(frequencia_cardiaca), 0) AS fc_media,
    ROUND(AVG(saturacao_oxigenio), 1) AS spo2_medio,
    ROUND(AVG(pressao_sis_esquerdo), 0) AS pa_sistolica_media,
    ROUND(AVG(pressao_dia_esquerdo), 0) AS pa_diastolica_media
FROM triagens;

-- Criar view para distribuição por faixa etária
CREATE OR REPLACE VIEW distribuicao_faixa_etaria AS
SELECT 
    CASE
        WHEN CAST(SPLIT_PART(idade, ' ', 1) AS INTEGER) < 18 THEN '0-17 anos'
        WHEN CAST(SPLIT_PART(idade, ' ', 1) AS INTEGER) BETWEEN 18 AND 29 THEN '18-29 anos'
        WHEN CAST(SPLIT_PART(idade, ' ', 1) AS INTEGER) BETWEEN 30 AND 39 THEN '30-39 anos'
        WHEN CAST(SPLIT_PART(idade, ' ', 1) AS INTEGER) BETWEEN 40 AND 49 THEN '40-49 anos'
        WHEN CAST(SPLIT_PART(idade, ' ', 1) AS INTEGER) BETWEEN 50 AND 59 THEN '50-59 anos'
        WHEN CAST(SPLIT_PART(idade, ' ', 1) AS INTEGER) >= 60 THEN '60+ anos'
        ELSE 'Não informado'
    END AS faixa_etaria,
    sexo,
    COUNT(*) AS total
FROM triagens
WHERE idade IS NOT NULL AND idade != ''
GROUP BY faixa_etaria, sexo
ORDER BY faixa_etaria, sexo;

