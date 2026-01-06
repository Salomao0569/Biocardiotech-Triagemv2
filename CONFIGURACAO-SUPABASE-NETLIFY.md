# 🔧 Configuração Supabase + Netlify

## 📋 URLs do Projeto

### Netlify (Produção)
```
https://silver-rolypoly-c0f7f2.netlify.app
```

### Supabase (Database)
```
https://tsaxwxchxhbvmotkxonq.supabase.co
```

---

## ⚙️ CONFIGURAÇÃO PASSO A PASSO

### 1. Acessar Supabase Dashboard

1. Vá para: https://supabase.com/dashboard
2. Selecione o projeto: `tsaxwxchxhbvmotkxonq`

### 2. Configurar Authentication URLs

**Caminho:** `Authentication → URL Configuration`

#### **Site URL:**
```
https://silver-rolypoly-c0f7f2.netlify.app
```

#### **Redirect URLs (adicionar):**
```
https://silver-rolypoly-c0f7f2.netlify.app
https://silver-rolypoly-c0f7f2.netlify.app/**
http://localhost:*
http://127.0.0.1:*
```

### 3. Verificar Políticas de RLS

**Caminho:** `Database → Policies`

#### **Políticas Atuais (Desenvolvimento):**

```sql
-- Política de Leitura
CREATE POLICY "Permitir leitura pública"
ON triagens FOR SELECT
TO public
USING (true);

-- Política de Inserção
CREATE POLICY "Permitir inserção pública"
ON triagens FOR INSERT
TO public
WITH CHECK (true);
```

✅ **Essas políticas estão OK para desenvolvimento/produção inicial**

⚠️ **Para produção avançada, considere implementar autenticação**

---

## 🔐 SEGURANÇA - CORS

### 4. Configurar CORS (já configurado automaticamente)

O Supabase aceita requisições de qualquer origem com a chave `anon`.

Para restringir, adicione em `Project Settings → API → CORS Allowed Origins`:

```
https://silver-rolypoly-c0f7f2.netlify.app
```

---

## 🌐 CONFIGURAÇÃO DO NETLIFY

### 5. Adicionar Variáveis de Ambiente (Opcional - Segurança Extra)

**Caminho no Netlify:** `Site Settings → Environment Variables`

```env
SUPABASE_URL=https://tsaxwxchxhbvmotkxonq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzYXh3eGNoeGhidm1vdGt4b25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NzgxMzUsImV4cCI6MjA4MzA1NDEzNX0.bIfHNQest_rYd5FUJrAdbw8ne136td9Hjh4-vpmlSKw
```

**Nota:** Como estamos usando CDN, as credenciais já estão no `supabase-config.js` (público).

---

## ✅ VERIFICAÇÃO

### 6. Testar a Conexão

1. **Acesse:** https://silver-rolypoly-c0f7f2.netlify.app/index.html
2. **Preencha** uma triagem
3. **Clique** em "Salvar no Banco"
4. **Verifique** se aparece: "✅ Triagem salva com sucesso!"

### 7. Testar o Dashboard

1. **Acesse:** https://silver-rolypoly-c0f7f2.netlify.app/dashboard.html
2. **Verifique** se as estatísticas carregam
3. **Teste** o filtro de mês
4. **Teste** a busca de prontuário

---

## 🔍 TROUBLESHOOTING

### Erro: "Failed to fetch" ou CORS

**Solução:**
1. Vá em `Project Settings → API → CORS Allowed Origins`
2. Adicione: `https://silver-rolypoly-c0f7f2.netlify.app`
3. Aguarde 1-2 minutos

### Erro: "Row Level Security"

**Solução:**
```sql
-- No SQL Editor do Supabase, execute:
ALTER TABLE triagens ENABLE ROW LEVEL SECURITY;

-- Verificar se as políticas existem:
SELECT * FROM pg_policies WHERE tablename = 'triagens';
```

### Erro: "Unauthorized"

**Solução:**
1. Verifique se a `anonKey` está correta em `supabase-config.js`
2. Regenere a key se necessário em `Project Settings → API`

---

## 📊 MONITORAMENTO

### 8. Verificar Uso

**Caminho:** `Project Settings → Usage`

Monitore:
- Database Size (max 500 MB no plano free)
- API Requests (max 50,000/dia no plano free)
- Storage (max 1 GB no plano free)

---

## 🚀 DOMÍNIO CUSTOMIZADO (OPCIONAL)

### Se quiser usar domínio próprio:

1. **No Netlify:**
   - `Domain Settings → Add custom domain`
   - Adicione: `triagem.clinicabiocardio.com` (exemplo)

2. **No Supabase:**
   - Atualize as Redirect URLs com o novo domínio

3. **Atualize `supabase-config.js`:**
   - Nenhuma mudança necessária (a URL do Supabase permanece a mesma)

---

## 📝 CHECKLIST FINAL

- [ ] Site URL configurada no Supabase
- [ ] Redirect URLs configuradas no Supabase
- [ ] CORS configurado (se necessário)
- [ ] Políticas RLS verificadas
- [ ] Teste de salvamento funcionando
- [ ] Dashboard carregando corretamente
- [ ] Filtro de mês funcionando
- [ ] Busca de prontuário funcionando

---

## 🎯 RESUMO

**Status Atual:**
- ✅ Código no GitHub atualizado
- ✅ Deploy no Netlify funcionando
- ✅ Supabase configurado
- ⏳ URLs precisam ser adicionadas no Auth (ver passo 2)

**Próxima Ação:**
1. Acesse o Supabase Dashboard
2. Vá em `Authentication → URL Configuration`
3. Adicione a URL do Netlify nas Redirect URLs
4. Salve e teste!

---

## 📞 SUPORTE

Se encontrar problemas:
1. Verifique o Console do navegador (F12)
2. Veja os logs no Supabase Dashboard
3. Verifique se as credenciais estão corretas

---

**Última atualização:** 06/01/2026  
**Projeto:** Biocardiotech Triagem V2  
**Deploy:** https://silver-rolypoly-c0f7f2.netlify.app

