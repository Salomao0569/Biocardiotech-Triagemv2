// ============================================
// CONFIGURAÇÃO DO SUPABASE
// ============================================
// 
// INSTRUÇÕES PARA CONFIGURAR:
// 
// 1. Acesse: https://supabase.com/
// 2. Crie uma conta gratuita
// 3. Crie um novo projeto
// 4. Vá em Settings > API
// 5. Copie:
//    - Project URL (SUPABASE_URL)
//    - anon/public key (SUPABASE_ANON_KEY)
// 6. Substitua os valores abaixo
//
// ============================================

const SUPABASE_CONFIG = {
    // URL do projeto Supabase
    url: 'https://tsaxwxchxhbvmotkxonq.supabase.co',
    
    // Chave anon/public para acesso ao banco (Publishable Key)
    anonKey: 'sb_publishable_5Mau2TiE8Ywey61MZCSkfA_-JkcHuVv'
};

// ============================================
// ESTRUTURA DA TABELA NO SUPABASE
// ============================================
//
// Nome da tabela: triagens
//
// Execute este SQL no SQL Editor do Supabase:
//
// CREATE TABLE triagens (
//     id BIGSERIAL PRIMARY KEY,
//     nome_paciente TEXT NOT NULL,
//     data_nascimento DATE,
//     idade TEXT,
//     data_triagem DATE,
//     hora_triagem TIME,
//     pressao_sis_esquerdo INTEGER,
//     pressao_dia_esquerdo INTEGER,
//     pressao_sis_direito INTEGER,
//     pressao_dia_direito INTEGER,
//     frequencia_cardiaca INTEGER,
//     saturacao_oxigenio INTEGER,
//     altura_cm NUMERIC,
//     peso_kg NUMERIC,
//     imc NUMERIC,
//     criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//     atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );
//
// -- Índice para buscar por nome
// CREATE INDEX idx_triagens_nome ON triagens(nome_paciente);
//
// -- Índice para buscar por data
// CREATE INDEX idx_triagens_data ON triagens(data_triagem DESC);
//
// ============================================

// Exportar configuração
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
}

