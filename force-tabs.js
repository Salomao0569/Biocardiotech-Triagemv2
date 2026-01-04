// FORÇA A EXIBIÇÃO DAS TABS - SOLUÇÃO PARA CACHE
console.log('🔧 Force Tabs Script carregado...');

// Executar imediatamente
(function() {
    'use strict';
    
    console.log('🚀 Verificando tabs...');
    
    // Aguardar DOM carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTabs);
    } else {
        initTabs();
    }
    
    function initTabs() {
        console.log('📊 Inicializando tabs...');
        
        // Verificar se tabs já existem
        const tabsExistentes = document.querySelector('.tabs-container');
        if (tabsExistentes) {
            console.log('✅ Tabs já existem!');
            tabsExistentes.style.display = 'block';
            return;
        }
        
        console.log('⚠️ Tabs não encontradas, criando...');
        
        // Criar CSS para tabs
        const style = document.createElement('style');
        style.textContent = `
            .tabs-container {
                max-width: 1600px;
                margin: 0 auto;
                padding: 0 20px;
                background: #f8f9fa;
                border-bottom: 2px solid #dee2e6;
                display: block !important;
            }
            
            .tabs {
                display: flex !important;
                gap: 5px;
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .tab {
                padding: 18px 40px;
                font-family: 'Montserrat', sans-serif;
                font-weight: 700;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                cursor: pointer;
                background: transparent;
                color: #6c757d;
                border: none;
                border-bottom: 3px solid transparent;
                transition: all 0.3s;
            }
            
            .tab:hover {
                background: rgba(0, 61, 122, 0.05);
                color: #003d7a;
            }
            
            .tab.active {
                background: white;
                color: #003d7a;
                border-bottom-color: #c8102e;
            }
            
            .tab-icon {
                margin-right: 8px;
            }
            
            .tab-content {
                display: none;
            }
            
            .tab-content.active {
                display: block;
            }
        `;
        document.head.appendChild(style);
        
        // Criar HTML das tabs
        const header = document.querySelector('.header');
        if (!header) {
            console.error('❌ Header não encontrado');
            return;
        }
        
        const tabsHTML = `
            <div class="tabs-container" style="display: block !important;">
                <ul class="tabs" style="display: flex !important;">
                    <li class="tab active" onclick="window.switchTabForce('dashboard-executivo')">
                        <span class="tab-icon">📊</span> Dashboard Executivo
                    </li>
                    <li class="tab" onclick="window.switchTabForce('central-ia')">
                        <span class="tab-icon">🧠</span> Central de Inteligência IA
                    </li>
                </ul>
            </div>
        `;
        
        header.insertAdjacentHTML('afterend', tabsHTML);
        console.log('✅ Tabs criadas!');
        
        // Criar função global para trocar tabs
        window.switchTabForce = function(tabId) {
            console.log('🔄 Trocando para tab:', tabId);
            
            // Remover todas as classes active
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Ativar tab clicada
            event.target.closest('.tab').classList.add('active');
            
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Se for Central IA, carregar conteúdo
                if (tabId === 'central-ia' && typeof carregarCentralIA === 'function') {
                    carregarCentralIA();
                }
            }
        };
    }
})();

console.log('✅ Force Tabs Script finalizado');

