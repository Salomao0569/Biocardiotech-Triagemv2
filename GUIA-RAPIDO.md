# 🚀 Guia Rápido - Configuração em 5 Minutos

## ✅ Checklist de Configuração

### 1️⃣ Criar Conta no Supabase (2 minutos)

- [ ] Acessar [https://supabase.com/](https://supabase.com/)
- [ ] Criar conta gratuita
- [ ] Criar novo projeto
- [ ] Escolher nome: **Biocardio Triagens**
- [ ] Escolher região: **South America**
- [ ] Definir senha do banco
- [ ] Aguardar criação (2-3 minutos)

### 2️⃣ Configurar Banco de Dados (1 minuto)

- [ ] Clicar em **SQL Editor** (menu lateral)
- [ ] Clicar em **New query**
- [ ] Copiar todo o conteúdo do arquivo `setup-supabase.sql`
- [ ] Colar no editor
- [ ] Clicar em **Run** (ou `Ctrl+Enter`)
- [ ] Verificar mensagem de sucesso

### 3️⃣ Obter Credenciais (1 minuto)

- [ ] Clicar em **Settings** (ícone engrenagem)
- [ ] Clicar em **API**
- [ ] Copiar **Project URL**
- [ ] Copiar **anon public key**

### 4️⃣ Configurar Aplicação (1 minuto)

- [ ] Abrir arquivo `supabase-config.js`
- [ ] Substituir `SUA_URL_DO_SUPABASE_AQUI` pela URL copiada
- [ ] Substituir `SUA_CHAVE_ANON_AQUI` pela chave copiada
- [ ] Salvar arquivo

### 5️⃣ Testar! 🎉

- [ ] Abrir `index.html` no navegador
- [ ] Preencher nome de um paciente
- [ ] Clicar em **💾 Salvar no Banco**
- [ ] Verificar mensagem "✅ Triagem salva com sucesso!"
- [ ] Clicar em **📋 Ver Histórico**
- [ ] Verificar se o registro aparece

---

## 🎯 Exemplo de Configuração

### Antes:
```javascript
const SUPABASE_CONFIG = {
    url: 'SUA_URL_DO_SUPABASE_AQUI',
    anonKey: 'SUA_CHAVE_ANON_AQUI'
};
```

### Depois:
```javascript
const SUPABASE_CONFIG = {
    url: 'https://xyzabc123.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

---

## ⚠️ Problemas Comuns

### ❌ "Configure o Supabase primeiro!"
**Solução:** Você não editou o arquivo `supabase-config.js` corretamente.

### ❌ "Tabela não criada!"
**Solução:** Execute o SQL do arquivo `setup-supabase.sql` no SQL Editor.

### ❌ "Erro 401 ou 403"
**Solução:** Verifique se copiou a chave `anon` correta (não use a chave `service_role`).

---

## 📱 Testando no Celular

1. Coloque os arquivos em um servidor web (GitHub Pages, Netlify, etc.)
2. OU use um servidor local:
   - Instale: `npm install -g http-server`
   - Execute: `http-server`
   - Acesse pelo IP local no celular

---

## 🔐 Segurança para Produção

Quando estiver pronto para uso real:

1. Edite o arquivo `setup-supabase.sql`
2. Comente as políticas públicas
3. Descomente as políticas autenticadas
4. Execute novamente no SQL Editor
5. Implemente sistema de login

---

## 📞 Precisa de Ajuda?

Consulte o arquivo **README.md** para documentação completa!

