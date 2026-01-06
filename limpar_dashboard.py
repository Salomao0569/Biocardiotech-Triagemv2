#!/usr/bin/env python3
"""
Script para remover todas as referências de IA do dashboard.html
"""

import re

# Ler o arquivo original
with open('dashboard.html.backup', 'r', encoding='utf-8') as f:
    content = f.read()

# Remover comentário de IA no head
content = re.sub(r'<!-- Central IA Integrada.*?-->', '', content, flags=re.DOTALL)

# Remover botão "Central IA" do header
content = re.sub(r'<button[^>]*onclick="irParaCentralIA\(\)"[^>]*>.*?</button>', '', content, flags=re.DOTALL)

# Remover tab "Central de Inteligência IA"
content = re.sub(r'<li class="tab"[^>]*onclick="switchTab\(\'central-ia\'\)"[^>]*>.*?</li>', '', content, flags=re.DOTALL)

# Remover seção de destaque da Central IA
content = re.sub(r'<!-- BOTÃO DE ACESSO À CENTRAL IA -->.*?</div>\s*</div>', '', content, flags=re.DOTALL)

# Remover todo o conteúdo da tab central-ia
content = re.sub(r'<!-- CONTEÚDO TAB 2: CENTRAL DE INTELIGÊNCIA IA -->.*?</div>\s*</div>\s*</div>', '', content, flags=re.DOTALL)

# Remover seção de insight IA do prontuário
content = re.sub(r'<!-- INSIGHT DA INTELIGÊNCIA BIOCARDIO -->.*?</div>\s*</div>', '', content, flags=re.DOTALL)

# Remover funções JavaScript de IA
patterns_to_remove = [
    r'function irParaCentralIA\(\).*?\}',
    r'function abrirCentralIA\(\).*?\}',
    r'function carregarCentralIA\(\).*?\}',
    r'async function analisarComIA\(.*?\n\s*\}',
    r'async function enviarPerguntaIA\(\).*?\n\s*\}',
]

for pattern in patterns_to_remove:
    content = re.sub(pattern, '', content, flags=re.DOTALL)

# Remover estilos CSS da Central IA
content = re.sub(r'/\* CENTRAL DE INTELIGÊNCIA IA.*?\*/', '', content, flags=re.DOTALL)
content = re.sub(r'\.central-ia-container\s*\{[^}]*\}', '', content)
content = re.sub(r'\.oracle-[a-z-]*\s*\{[^}]*\}', '', content)
content = re.sub(r'\.chat-[a-z-]*\s*\{[^}]*\}', '', content)
content = re.sub(r'\.diamond-[a-z-]*\s*\{[^}]*\}', '', content)
content = re.sub(r'\.delta-[a-z-]*\s*\{[^}]*\}', '', content)
content = re.sub(r'\.insight-ia-card.*?\}', '', content, flags=re.DOTALL)

# Salvar o arquivo limpo
with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Dashboard limpo com sucesso!")
print("📊 Arquivo salvo: dashboard.html")
print("💾 Backup mantido: dashboard.html.backup")

