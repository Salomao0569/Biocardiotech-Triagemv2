# 🚀 Instruções para Aplicar a Migração no Supabase

## ✅ Você Já Tem o Arquivo de Migração Pronto!

O arquivo está em: `supabase/migrations/20260104043634_criar_tabela_triagens.sql`

---

## 📋 Método 1: Copiar e Colar no Dashboard (MAIS FÁCIL)

### Passo a Passo:

1. **Abra o arquivo de migração:**
   - Arquivo: `supabase/migrations/20260104043634_criar_tabela_triagens.sql`
   - Copie TODO o conteúdo (Ctrl+A, Ctrl+C)

2. **Acesse seu projeto no Supabase:**
   - [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecione seu projeto

3. **Abra o SQL Editor:**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New query**

4. **Cole o SQL:**
   - Cole todo o conteúdo copiado
   - Clique em **Run** (ou pressione Ctrl+Enter)

5. **Verifique o Sucesso:**
   - Você deve ver "Success" na parte inferior
   - Vá em **Table Editor** no menu lateral
   - Verifique se a tabela `triagens` foi criada

✅ **Pronto! Seu banco está configurado!**

---

## 📋 Método 2: Usar a CLI do Supabase

Se você quiser usar a linha de comando:

### Opção A: Com Project Reference ID

```bash
# Linkar ao projeto (você precisa do Project Reference ID)
npx supabase link --project-ref SEU_PROJECT_REF_ID

# Aplicar a migração
npx supabase db push
```

**Onde encontrar o Project Reference ID:**
1. Acesse seu projeto no Supabase
2. Vá em Settings > General
3. Copie o "Reference ID"

### Opção B: Com Access Token

```bash
# Fazer login com token
npx supabase login --token SEU_ACCESS_TOKEN

# Linkar ao projeto
npx supabase link --project-ref SEU_PROJECT_REF_ID

# Aplicar a migração
npx supabase db push
```

**Como criar um Access Token:**
1. Acesse: https://supabase.com/dashboard/account/tokens
2. Clique em "Generate new token"
3. Dê um nome e copie o token

---

## ✨ Após Aplicar a Migração

Não esqueça de configurar o arquivo `supabase-config.js`:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://SEU_PROJECT_ID.supabase.co',
    anonKey: 'SUA_CHAVE_ANON_AQUI'
};
```

**Onde encontrar essas informações:**
1. Settings > API
2. Copie "Project URL"
3. Copie "anon public key"

---

## 🎉 Testar a Aplicação

1. Abra `index.html` no navegador
2. Preencha o nome de um paciente
3. Clique em "💾 Salvar no Banco"
4. Verifique se aparece "✅ Triagem salva com sucesso!"
5. Clique em "📋 Ver Histórico" para ver o registro

---

## ❓ Problemas?

### "Tabela não criada"
- Execute o SQL novamente no SQL Editor
- Verifique se não houve erros

### "Erro 401"
- Verifique se configurou o `supabase-config.js` corretamente
- Certifique-se de usar a chave `anon` e não a `service_role`

### "RLS Policy"
- A migração já inclui as políticas de segurança
- Se ainda houver erro, execute no SQL Editor:
  ```sql
  ALTER TABLE triagens DISABLE ROW LEVEL SECURITY;
  ```

---

## 📞 Precisa de Mais Ajuda?

Consulte o **README.md** para documentação completa!

