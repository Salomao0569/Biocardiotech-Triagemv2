# 🏥 Sistema de Triagem - Clínica Biocardio

Sistema web para registro de triagens clínicas com integração ao banco de dados Supabase.

## 📋 Funcionalidades

✅ **Coleta de Dados do Paciente:**
- Nome completo
- Data de nascimento (com cálculo automático de idade)
- Data e hora da triagem

✅ **Sinais Vitais:**
- Pressão arterial (braços esquerdo e direito)
- Frequência cardíaca (FC)
- Saturação de oxigênio (SpO₂)
- Altura e peso (com cálculo automático de IMC)

✅ **Recursos:**
- 💾 Salvamento automático no banco de dados Supabase
- 📋 Visualização de histórico de triagens
- 🖨️ Geração de PDF para impressão
- 📱 Layout responsivo (mobile-friendly)
- 🔒 QR Code informativo

## 🚀 Configuração do Supabase

### Passo 1: Criar Conta e Projeto

1. Acesse [https://supabase.com/](https://supabase.com/)
2. Crie uma conta gratuita (se ainda não tiver)
3. Clique em "New Project"
4. Preencha:
   - **Name:** Biocardio Triagens (ou nome de sua preferência)
   - **Database Password:** Escolha uma senha forte
   - **Region:** Escolha a região mais próxima (ex: South America)
5. Clique em "Create new project" e aguarde alguns minutos

### Passo 2: Criar a Tabela no Banco de Dados

1. No painel do seu projeto, clique em **"SQL Editor"** no menu lateral
2. Clique em **"New query"**
3. Cole o seguinte código SQL:

```sql
-- Criar tabela de triagens
CREATE TABLE triagens (
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

-- Criar índices para melhor performance
CREATE INDEX idx_triagens_nome ON triagens(nome_paciente);
CREATE INDEX idx_triagens_data ON triagens(data_triagem DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE triagens ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir inserção pública (para teste)
-- ATENÇÃO: Para produção, configure políticas mais restritivas!
CREATE POLICY "Permitir inserção pública"
ON triagens FOR INSERT
TO public
WITH CHECK (true);

-- Criar política para permitir leitura pública (para teste)
CREATE POLICY "Permitir leitura pública"
ON triagens FOR SELECT
TO public
USING (true);
```

4. Clique em **"Run"** ou pressione `Ctrl+Enter`
5. Verifique se apareceu "Success. No rows returned" (ou similar)

### Passo 3: Obter as Credenciais

1. No menu lateral, clique em **"Settings"** (ícone de engrenagem)
2. Clique em **"API"**
3. Você verá duas informações importantes:

   - **Project URL:** Algo como `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key:** Uma chave longa começando com `eyJ...`

4. Copie essas informações

### Passo 4: Configurar o Projeto

1. Abra o arquivo **`supabase-config.js`** no seu editor
2. Substitua os valores:

```javascript
const SUPABASE_CONFIG = {
    // Cole sua URL aqui
    url: 'https://xxxxxxxxxxxxx.supabase.co',
    
    // Cole sua chave anon aqui
    anonKey: 'eyJhbGc...(sua chave completa)...'
};
```

3. Salve o arquivo

## 🎯 Como Usar

### Registrar uma Triagem

1. Abra o arquivo `index.html` no navegador
2. Preencha os dados do paciente:
   - Nome (obrigatório)
   - Data de nascimento (a idade será calculada automaticamente)
   - Data e hora da triagem (preenchidos automaticamente)
3. Registre os sinais vitais:
   - Pressão arterial em ambos os braços
   - Frequência cardíaca
   - Saturação de oxigênio
4. Informe altura e peso (o IMC será calculado automaticamente)
5. Clique em **"💾 Salvar no Banco"**
6. Aguarde a confirmação "✅ Triagem salva com sucesso!"

### Visualizar Histórico

1. Clique no botão **"📋 Ver Histórico"**
2. Uma janela modal será aberta com as últimas 50 triagens
3. As triagens são exibidas em ordem decrescente (mais recentes primeiro)
4. Para fechar, clique no **"×"** ou fora da janela

### Imprimir/Gerar PDF

1. Clique no botão **"🖨️ Salvar PDF / Imprimir"**
2. Selecione "Salvar como PDF" no diálogo de impressão
3. O documento será formatado automaticamente para papel A4

### Limpar Formulário

1. Clique no botão **"🗑️ Limpar Dados"**
2. Confirme a ação
3. Todos os campos serão limpos e a data/hora serão restauradas

## 🔧 Estrutura de Arquivos

```
📁 Projeto
├── 📄 index.html           # Aplicação principal
├── 📄 supabase-config.js   # Configurações do Supabase
├── 📄 README.md            # Esta documentação
└── 📄 .gitignore           # Arquivos ignorados pelo Git
```

## 🔒 Segurança

### ⚠️ IMPORTANTE - Configurações de Produção

As políticas de segurança configuradas no passo 2 permitem acesso público para facilitar o desenvolvimento. **Para uso em produção:**

1. Configure autenticação de usuários
2. Implemente políticas RLS mais restritivas
3. Crie diferentes níveis de acesso (admin, médico, enfermeiro)
4. Adicione validação de dados no backend

Exemplo de política mais segura (requer autenticação):

```sql
-- Remover políticas públicas
DROP POLICY "Permitir inserção pública" ON triagens;
DROP POLICY "Permitir leitura pública" ON triagens;

-- Criar políticas para usuários autenticados
CREATE POLICY "Usuários autenticados podem inserir"
ON triagens FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem ler"
ON triagens FOR SELECT
TO authenticated
USING (true);
```

## 🌐 Deploy

### GitHub Pages (Somente Frontend)

1. Faça commit de todos os arquivos
2. Push para o GitHub
3. Vá em Settings > Pages
4. Selecione a branch `main` e clique em Save

**Nota:** Lembre-se de configurar o `supabase-config.js` com suas credenciais antes do deploy!

### Netlify

1. Conecte seu repositório GitHub ao Netlify
2. Configure as variáveis de ambiente (opcional)
3. Deploy automático a cada commit

## 📊 Estrutura da Tabela

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | ID único (auto-incremento) |
| nome_paciente | TEXT | Nome completo do paciente |
| data_nascimento | DATE | Data de nascimento |
| idade | TEXT | Idade calculada |
| data_triagem | DATE | Data da triagem |
| hora_triagem | TIME | Hora da triagem |
| pressao_sis_esquerdo | INTEGER | Pressão sistólica (braço esquerdo) |
| pressao_dia_esquerdo | INTEGER | Pressão diastólica (braço esquerdo) |
| pressao_sis_direito | INTEGER | Pressão sistólica (braço direito) |
| pressao_dia_direito | INTEGER | Pressão diastólica (braço direito) |
| frequencia_cardiaca | INTEGER | Frequência cardíaca (bpm) |
| saturacao_oxigenio | INTEGER | Saturação de O₂ (%) |
| altura_cm | NUMERIC | Altura em centímetros |
| peso_kg | NUMERIC | Peso em quilogramas |
| imc | NUMERIC | Índice de Massa Corporal |
| criado_em | TIMESTAMP | Data/hora de criação do registro |
| atualizado_em | TIMESTAMP | Data/hora da última atualização |

## 🐛 Solução de Problemas

### Erro: "Configure o Supabase primeiro!"
- Verifique se você editou o arquivo `supabase-config.js`
- Certifique-se de substituir `SUA_URL_DO_SUPABASE_AQUI` e `SUA_CHAVE_ANON_AQUI`

### Erro: "Tabela não criada!"
- Execute o SQL fornecido no Passo 2 no SQL Editor do Supabase
- Verifique se a tabela `triagens` aparece em "Table Editor"

### Erro: "Row Level Security"
- Verifique se você executou as políticas de RLS no SQL
- Teste temporariamente desabilitando o RLS: `ALTER TABLE triagens DISABLE ROW LEVEL SECURITY;`

### Modal de histórico não abre
- Abra o Console do navegador (F12) e verifique erros
- Verifique se o Supabase SDK foi carregado corretamente

## 💡 Melhorias Futuras

- [ ] Sistema de login e autenticação
- [ ] Busca e filtros no histórico
- [ ] Edição de triagens existentes
- [ ] Exportação de relatórios em Excel
- [ ] Gráficos e estatísticas
- [ ] Notificações para valores críticos
- [ ] Backup automático dos dados
- [ ] Integração com prontuário eletrônico

## 📝 Licença

Este projeto é de uso interno da Clínica Biocardio.

## 👨‍💻 Suporte

Para dúvidas ou problemas:
- Verifique a documentação do [Supabase](https://supabase.com/docs)
- Consulte o desenvolvedor responsável

---

**Desenvolvido para Clínica Biocardio** ❤️
*Cardiologia e Medicina Diagnóstica*

