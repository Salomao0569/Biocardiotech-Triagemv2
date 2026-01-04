# 🧪 TESTE DA APLICAÇÃO - Passo a Passo

## ✅ Setup Completo!

Tudo está configurado e pronto para uso:
- ✅ Database criado via Supabase CLI
- ✅ Tabela `triagens` criada
- ✅ Credenciais configuradas
- ✅ Aplicação pronta para testar

---

## 🚀 Como Testar Agora

### 1️⃣ Abrir a Aplicação

**Opção A: Clique duplo**
- Navegue até a pasta do projeto
- Clique duas vezes em `index.html`

**Opção B: Servidor Local (Recomendado)**
```bash
# Se tiver Python instalado:
python -m http.server 8000

# Se tiver Node.js instalado:
npx http-server

# Depois acesse: http://localhost:8000
```

### 2️⃣ Preencher um Paciente de Teste

Preencha os seguintes dados de exemplo:

**👤 Dados do Paciente:**
- **Nome:** João da Silva
- **Data de Nascimento:** 01/01/1980
- **Data Triagem:** (preenchido automaticamente)
- **Hora:** (preenchido automaticamente)

**🩺 Sinais Vitais:**
- **PA Braço Esquerdo:** 120 / 80
- **PA Braço Direito:** 122 / 82
- **Frequência Cardíaca:** 75
- **Saturação O₂:** 98

**📏 Medidas:**
- **Altura:** 175 cm
- **Peso:** 70 kg
- (IMC será calculado automaticamente: 22.9)

### 3️⃣ Salvar no Banco

1. Clique no botão **"💾 Salvar no Banco"**
2. Aguarde alguns segundos
3. Deve aparecer a mensagem: **"✅ Triagem salva com sucesso!"**

### 4️⃣ Ver o Histórico

1. Clique no botão **"📋 Ver Histórico"**
2. Uma janela modal deve abrir
3. Você verá a tabela com o registro que acabou de criar
4. Verifique se todos os dados estão corretos

### 5️⃣ Imprimir/Gerar PDF

1. Clique no botão **"🖨️ Salvar PDF / Imprimir"**
2. Selecione "Salvar como PDF" ou "Microsoft Print to PDF"
3. O documento será formatado para papel A4
4. Salve o PDF para conferir o layout

### 6️⃣ Limpar e Testar Novamente

1. Clique em **"🗑️ Limpar Dados"**
2. Confirme a ação
3. Todos os campos serão limpos
4. Data e hora serão restauradas automaticamente
5. Preencha outro paciente para testar novamente

---

## ✅ O que Esperar em Cada Etapa

### ✨ Ao Abrir a Aplicação:
- ✅ QR Code deve aparecer
- ✅ Data e hora atuais preenchidas
- ✅ Design bonito e profissional
- ✅ Cores da Clínica Biocardio (azul e vermelho)

### ✨ Ao Preencher os Campos:
- ✅ Idade calculada automaticamente ao inserir data de nascimento
- ✅ IMC calculado automaticamente ao inserir altura e peso
- ✅ Campos numéricos só aceitam números
- ✅ Layout responsivo (funciona no celular)

### ✨ Ao Salvar:
- ✅ Mensagem "💾 Salvando..." aparece
- ✅ Depois: "✅ Triagem salva com sucesso!" (verde)
- ❌ Se erro: "❌ Erro ao salvar..." (vermelho)

### ✨ No Histórico:
- ✅ Tabela formatada com todas as colunas
- ✅ Dados ordenados por data (mais recente primeiro)
- ✅ Até 50 registros mostrados
- ✅ Rolagem se tiver muitos registros

---

## 🐛 Troubleshooting

### ❌ "Configure o Supabase primeiro!"
**Causa:** Arquivo `supabase-config.js` não configurado
**Solução:** Isso NÃO deve acontecer mais! As credenciais já foram configuradas.

### ❌ "Tabela não criada!"
**Causa:** Migração não foi aplicada
**Solução:** Isso também NÃO deve acontecer! A tabela já foi criada via CLI.

### ❌ "Erro ao salvar: [alguma mensagem]"
**Possíveis causas:**
1. **Sem internet** - Verifique sua conexão
2. **Nome vazio** - Nome do paciente é obrigatório
3. **Erro de rede** - Tente novamente

**Verificar no Console:**
- Pressione F12 no navegador
- Vá na aba "Console"
- Veja se há erros em vermelho
- Me envie a mensagem se precisar de ajuda

### ❌ Histórico não abre
**Solução:**
- Abra o Console (F12)
- Veja se há erros de JavaScript
- Verifique se o Supabase SDK carregou corretamente

### ❌ QR Code não aparece
**Solução:**
- Verifique sua conexão com internet
- O QR Code usa uma biblioteca CDN externa
- Se não carregar, a aplicação funciona normalmente mesmo assim

---

## 📊 Verificar no Supabase Dashboard

### Ver os Dados Salvos:

1. **Acesse:** https://supabase.com/dashboard/project/tsaxwxchxhbvmotkxonq/editor
2. Clique na tabela **`triagens`**
3. Você verá todos os registros salvos
4. Pode editar, deletar ou adicionar diretamente aqui

### Ver Estatísticas:

1. **Acesse:** https://supabase.com/dashboard/project/tsaxwxchxhbvmotkxonq/sql
2. Execute a query:
   ```sql
   SELECT * FROM estatisticas_triagens;
   ```
3. Verá: total de triagens, pacientes únicos, IMC médio, etc.

### Ver Triagens Recentes:

Execute no SQL Editor:
```sql
SELECT * FROM triagens_recentes;
```

---

## 🎯 Teste de Stress (Opcional)

Para testar a robustez:

1. Salve 10 pacientes diferentes
2. Verifique se todos aparecem no histórico
3. Verifique se as estatísticas estão corretas
4. Teste no celular (layout responsivo)
5. Teste em diferentes navegadores (Chrome, Firefox, Edge)

---

## 📱 Teste no Celular

1. Coloque a aplicação em um servidor web
2. OU use seu IP local (ex: http://192.168.0.10:8000)
3. Abra no navegador do celular
4. Teste todos os botões
5. Verifique se o layout está bonito
6. Teste a rolagem e zoom

---

## ✅ Checklist de Teste

- [ ] Aplicação abre sem erros
- [ ] QR Code aparece
- [ ] Data e hora preenchidas automaticamente
- [ ] Idade calcula ao inserir data de nascimento
- [ ] IMC calcula ao inserir altura e peso
- [ ] Botão "Salvar" funciona
- [ ] Mensagem de sucesso aparece
- [ ] Histórico abre
- [ ] Registro aparece no histórico
- [ ] Dados estão corretos na tabela
- [ ] PDF/Impressão funciona
- [ ] Layout está bonito no PDF
- [ ] Botão "Limpar" funciona
- [ ] Campos são limpos corretamente
- [ ] Funciona no celular
- [ ] Funciona em diferentes navegadores

---

## 🎉 Se Tudo Funcionou

**PARABÉNS!** 🎊 

Sua aplicação está 100% funcional e pronta para uso!

### Próximos Passos (Opcional):

1. **Personalizar:** Altere cores, logos, textos
2. **Expandir:** Adicione novos campos se necessário
3. **Segurança:** Implemente autenticação para produção
4. **Deploy:** Coloque online (Netlify, Vercel, GitHub Pages)
5. **Backup:** Configure backups automáticos no Supabase

---

## 📞 Precisa de Ajuda?

Se algo não funcionar como esperado:
1. Abra o Console do navegador (F12)
2. Anote a mensagem de erro
3. Verifique a conexão com internet
4. Me envie os detalhes do problema

---

**Aplicação desenvolvida e testada para Clínica Biocardio** ✅

