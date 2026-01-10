# 📱 Guia de Teste Mobile - Dashboard Biocardio

## Como Testar no Computador

### Opção 1: Chrome DevTools (Recomendado)

1. **Abrir o dashboard no Chrome**
   ```
   Abra: dashboard.html
   ```

2. **Ativar modo mobile**
   - Pressione `F12` (ou `Ctrl+Shift+I` no Windows/Linux, `Cmd+Option+I` no Mac)
   - Clique no ícone de celular/tablet no topo (ou `Ctrl+Shift+M`)

3. **Testar diferentes dispositivos**
   - Selecione no dropdown superior:
     - **iPhone SE** (375px) - Celular pequeno
     - **iPhone 12/13/14** (390px) - Celular padrão
     - **iPhone 14 Pro Max** (430px) - Celular grande
     - **iPad Mini** (768px) - Tablet pequeno
     - **iPad Air** (820px) - Tablet médio
     - **iPad Pro** (1024px) - Tablet grande

4. **O que verificar:**
   - ✅ Todos os textos legíveis sem zoom
   - ✅ Botões grandes e fáceis de clicar
   - ✅ Tabela transformada em cards empilhados
   - ✅ Formulários empilhados verticalmente
   - ✅ Tabs com scroll horizontal suave
   - ✅ Gráficos ajustados à largura
   - ✅ Sem scroll horizontal na página

### Opção 2: Firefox Responsive Design Mode

1. **Abrir o dashboard no Firefox**
2. Pressione `Ctrl+Shift+M` (Windows/Linux) ou `Cmd+Option+M` (Mac)
3. Selecione tamanho ou dispositivo
4. Testar funcionalidades

### Opção 3: Safari Responsive Design Mode

1. **Abrir o dashboard no Safari**
2. Ativar "Show Develop menu": Preferences > Advanced > Show Develop menu
3. Menu Develop > Enter Responsive Design Mode
4. Testar diferentes tamanhos

---

## Como Testar no Celular Real

### Opção 1: Via Netlify (Se deployado)

1. Abra o navegador do celular
2. Acesse a URL do Netlify
3. Faça login
4. Navegue pelo dashboard

### Opção 2: Via Servidor Local (Desenvolvimento)

1. **No computador, inicie um servidor local:**

   **Python 3:**
   ```bash
   python -m http.server 8000
   ```

   **Node.js (se tiver npx):**
   ```bash
   npx http-server -p 8000
   ```

   **PHP:**
   ```bash
   php -S localhost:8000
   ```

2. **Descubra o IP local do seu computador:**

   **Windows:**
   ```cmd
   ipconfig
   ```
   Procure por "IPv4 Address" (ex: 192.168.1.100)

   **Mac/Linux:**
   ```bash
   ifconfig | grep inet
   ```
   Ou:
   ```bash
   ip addr show
   ```

3. **No celular:**
   - Conecte à mesma rede Wi-Fi
   - Abra navegador
   - Digite: `http://SEU_IP:8000/dashboard.html`
   - Exemplo: `http://192.168.1.100:8000/dashboard.html`

---

## ✅ Checklist de Testes Mobile

### 1. Navegação
- [ ] Logo e título visíveis no topo
- [ ] Botões do header empilhados e clicáveis
- [ ] Tabs com scroll horizontal funcionando
- [ ] Tab ativa visível e centralizada
- [ ] Feedback visual ao tocar em botões

### 2. Cards de Estatísticas
- [ ] 4 cards empilhados (1 por linha)
- [ ] Valores grandes e legíveis
- [ ] Ícones proporcionais
- [ ] Hover/touch feedback

### 3. Tabela de Produção
- [ ] Transformada em cards
- [ ] Cada especialidade em seu próprio card
- [ ] Labels "Hoje", "Esta Semana", "Este Mês" visíveis
- [ ] Valores destacados e legíveis

### 4. Mini-Sumário de Conversão
- [ ] 4 cards empilhados verticalmente
- [ ] Textos legíveis
- [ ] Cores mantidas
- [ ] Sem overflow

### 5. Formulário de Busca (Prontuário)
- [ ] Campos empilhados (1 por linha)
- [ ] Labels legíveis
- [ ] Inputs com altura confortável
- [ ] Botões largura total e clicáveis
- [ ] Não dá zoom ao focar no input (iOS)

### 6. Prontuário do Paciente
- [ ] Header empilhado
- [ ] Botões de impressão/PDF empilhados
- [ ] Detalhes do paciente em lista
- [ ] Timeline legível
- [ ] Cards de atendimento compactos
- [ ] Dados em grid 2 colunas

### 7. Gráficos
- [ ] Ajustados à largura da tela
- [ ] Altura adequada (não muito alto)
- [ ] Labels legíveis
- [ ] Responsivo ao girar celular

### 8. Performance
- [ ] Scroll suave
- [ ] Sem lag ao tocar
- [ ] Transições fluidas
- [ ] Carregamento rápido

---

## 🐛 Problemas Comuns e Soluções

### Problema: Zoom automático ao focar input (iOS)
**Solução:** O código já previne isso com `font-size: 16px` nos inputs.

### Problema: Scroll horizontal aparecendo
**Solução:** Verifique se não há elementos com `width` maior que a viewport.

### Problema: Botões pequenos demais
**Solução:** Todos os botões têm `min-height: 44px`. Verifique CSS.

### Problema: Tabela não vira cards
**Solução:** Verifique se os atributos `data-label` estão presentes nas `<td>`.

### Problema: Tabs não scrollam horizontalmente
**Solução:** Verifique se `.tabs-container` tem `overflow-x: auto`.

---

## 📊 Tamanhos de Tela para Testar

| Dispositivo | Largura | Altura | Orientação |
|-------------|---------|--------|------------|
| iPhone SE | 375px | 667px | Portrait |
| iPhone 12 | 390px | 844px | Portrait |
| iPhone 14 Pro Max | 430px | 932px | Portrait |
| Samsung Galaxy S20 | 360px | 800px | Portrait |
| iPad Mini | 768px | 1024px | Portrait |
| iPad Pro 11" | 834px | 1194px | Portrait |

**Importante:** Teste também em modo **Landscape** (horizontal)!

---

## 🎯 Teste de Usabilidade

### Cenário 1: Visualizar Estatísticas
1. Abrir dashboard
2. Verificar se consegue ler todos os números
3. Scroll suave pela página
4. Tocar nos botões de atualizar

### Cenário 2: Buscar Prontuário
1. Rolar até seção "Prontuário de Triagem"
2. Digitar nome de paciente
3. Tocar em "Pesquisar"
4. Verificar resultado
5. Tentar imprimir/exportar PDF

### Cenário 3: Filtrar por Mês
1. No topo, tocar no campo "Filtrar por Mês/Ano"
2. Selecionar mês
3. Ver dados atualizados
4. Tocar em "Ver Todos os Dados"

---

## ✨ Resultados Esperados

### Mobile Pequeno (< 375px)
- 1 coluna em tudo
- Textos menores mas legíveis
- Botões empilhados
- Scroll vertical apenas

### Mobile Padrão (375px - 768px)
- Layout otimizado
- Tabela em cards
- 2 colunas em timeline
- Touch-friendly

### Tablet (768px - 1024px)
- 2 colunas em grids
- Mais espaço para conteúdo
- Tabela ainda em formato de tabela
- Híbrido desktop/mobile

### Desktop (> 1024px)
- Layout completo
- 4 colunas em grids
- Tabela tradicional
- Todas funcionalidades

---

## 📞 Reportar Problemas

Se encontrar algum problema:

1. **Tire um screenshot**
2. **Anote:**
   - Dispositivo/navegador
   - Tamanho da tela
   - O que estava fazendo
   - O que esperava acontecer
   - O que realmente aconteceu

3. **Teste em outro navegador** para confirmar

---

**Data do documento**: 10/01/2026  
**Versão do dashboard**: 3.0 Mobile-Optimized
