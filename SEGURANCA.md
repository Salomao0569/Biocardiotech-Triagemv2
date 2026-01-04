# ⚠️ AVISO IMPORTANTE DE SEGURANÇA

## 🔒 Credenciais do Supabase Commitadas

O arquivo `supabase-config.js` contém suas credenciais do Supabase:
- URL do projeto
- Chave `anon` pública

### ✅ A Chave `anon` É Segura?

**SIM**, a chave `anon` é projetada para ser usada no frontend (código público).

**MAS** você deve tomar precauções:

---

## 🛡️ Segurança Configurada

### ✅ O que está protegido:

1. **Row Level Security (RLS) ativado**
   - Somente operações permitidas pelas políticas funcionam
   
2. **Políticas configuradas:**
   - Inserção pública (apenas dados válidos)
   - Leitura pública (apenas tabela triagens)
   - Nenhuma deleção permitida por padrão

3. **Chave anon tem permissões limitadas:**
   - Não pode alterar estrutura do banco
   - Não pode acessar dados de sistema
   - Não pode modificar configurações

### ⚠️ Riscos Atuais (Desenvolvimento):

1. **Acesso público à tabela triagens**
   - Qualquer pessoa com a URL pode inserir dados
   - Qualquer pessoa pode ler os dados da tabela
   
2. **Sem autenticação**
   - Não há login de usuários
   - Todos têm o mesmo nível de acesso

---

## 🚀 Recomendações por Ambiente

### 📘 Para Desenvolvimento (ATUAL)

✅ **Pode commitar** a chave `anon` (você já fez isso)
✅ **Pode usar RLS com políticas públicas**
⚠️ **Não coloque dados sensíveis reais no banco**

### 🟡 Para Teste/Homologação

✅ Use as mesmas credenciais
⚠️ Crie um projeto separado se possível
⚠️ Altere as políticas RLS para restringir acesso

### 🔴 Para Produção

❌ **NÃO use acesso público!**
✅ **Implemente autenticação** (Supabase Auth)
✅ **Altere as políticas RLS:**

```sql
-- Remover políticas públicas
DROP POLICY "Permitir inserção pública" ON triagens;
DROP POLICY "Permitir leitura pública" ON triagens;

-- Criar políticas autenticadas
CREATE POLICY "Usuários autenticados podem inserir"
ON triagens FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem ler"
ON triagens FOR SELECT
TO authenticated
USING (true);
```

✅ **Use variáveis de ambiente** em vez de commitar credenciais
✅ **Adicione rate limiting** no Supabase
✅ **Monitore o uso** no dashboard

---

## 🔐 Como Proteger Credenciais (Opcional)

### Opção 1: Usar .gitignore (Recomendado para produção)

1. Adicione ao `.gitignore`:
   ```
   supabase-config.js
   ```

2. Crie um arquivo exemplo:
   ```javascript
   // supabase-config.example.js
   const SUPABASE_CONFIG = {
       url: 'SUA_URL_AQUI',
       anonKey: 'SUA_CHAVE_AQUI'
   };
   ```

3. Remova credenciais do Git:
   ```bash
   git rm --cached supabase-config.js
   git commit -m "Remove credenciais do Git"
   ```

### Opção 2: Usar Variáveis de Ambiente

1. Crie arquivo `.env`:
   ```
   SUPABASE_URL=https://tsaxwxchxhbvmotkxonq.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   ```

2. Adicione `.env` ao `.gitignore`

3. Use no código (requer bundler como Vite/Webpack)

---

## 📊 Status Atual de Segurança

| Item | Status | Nível |
|------|--------|-------|
| RLS Ativado | ✅ | Bom |
| Políticas Configuradas | ✅ | Bom |
| Chave anon pública | ⚠️ | Aceitável para dev |
| Autenticação | ❌ | Não implementada |
| Rate Limiting | ⚠️ | Padrão do Supabase |
| Dados Sensíveis | ⚠️ | Evitar em dev |

**Nível de Segurança Atual: Adequado para Desenvolvimento** ✅

---

## 🎯 Checklist de Segurança para Produção

Quando estiver pronto para produção, faça:

- [ ] Implementar Supabase Auth (login de usuários)
- [ ] Remover políticas públicas
- [ ] Criar políticas baseadas em usuários autenticados
- [ ] Adicionar roles (admin, enfermeiro, recepcionista)
- [ ] Usar variáveis de ambiente
- [ ] Configurar rate limiting personalizado
- [ ] Adicionar logs de auditoria
- [ ] Testar todas as políticas de segurança
- [ ] Configurar backup automático
- [ ] Monitorar uso e acessos suspeitos

---

## 📞 Em Caso de Vazamento de Credenciais

Se as credenciais forem expostas publicamente:

1. **Acesse:** https://supabase.com/dashboard/project/tsaxwxchxhbvmotkxonq/settings/api
2. **Clique em:** "Reset" na chave anon (se disponível)
3. **OU crie um novo projeto** e migre os dados
4. **Revogue o Personal Access Token:** https://supabase.com/dashboard/account/tokens

---

## ✅ Conclusão

**Para o seu caso de uso atual (desenvolvimento interno):**
- ✅ A configuração está segura o suficiente
- ✅ O RLS protege contra operações não autorizadas
- ✅ Você pode continuar desenvolvendo tranquilamente

**Lembre-se:** Antes de colocar em produção com dados reais de pacientes, implemente autenticação e restrinja o acesso!

---

**Desenvolvido com segurança para Clínica Biocardio** 🔒

