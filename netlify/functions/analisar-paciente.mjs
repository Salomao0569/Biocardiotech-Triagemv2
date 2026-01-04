/**
 * ============================================
 * NETLIFY FUNCTION: ANALISAR PACIENTE
 * Motor de Inteligência Biocardio com OpenAI
 * ============================================
 */

export default async (req, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    // Validar método
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ error: 'Método não permitido. Use POST.' }),
            { status: 405, headers }
        );
    }

    try {
        // Ler dados do request
        const body = await req.json();
        const { paciente, atendimentoAtual, historicoCompleto } = body;

        // Validação
        if (!paciente || !atendimentoAtual) {
            return new Response(
                JSON.stringify({ error: 'Dados do paciente ou atendimento ausentes.' }),
                { status: 400, headers }
            );
        }
        
        // Validar histórico
        if (!historicoCompleto || !Array.isArray(historicoCompleto) || historicoCompleto.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Histórico do paciente ausente ou inválido.' }),
                { status: 400, headers }
            );
        }

        // Verificar API Key
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error('OPENAI_API_KEY não configurada');
            return new Response(
                JSON.stringify({ error: 'Configuração da IA ausente.' }),
                { status: 500, headers }
            );
        }

        // PROCESSAR HISTÓRICO COMPLETO
        const totalVisitas = historicoCompleto.length;
        
        // Extrair especialidades únicas visitadas
        const especialidadesSet = new Set();
        historicoCompleto.forEach(atend => {
            if (atend.especialidade) {
                especialidadesSet.add(atend.especialidade);
            }
        });
        const especialidadesVisitadas = Array.from(especialidadesSet);
        
        // Verificar se é paciente recorrente
        const isPrimeiraVisita = totalVisitas === 1;
        const isRecorrente = totalVisitas > 1;
        
        // Calcular tempo desde última visita (se houver mais de uma)
        let diasDesdeUltimaVisita = null;
        if (totalVisitas > 1) {
            const ordenado = [...historicoCompleto].sort((a, b) => 
                new Date(b.data_triagem) - new Date(a.data_triagem)
            );
            const maisRecente = new Date(ordenado[0].data_triagem);
            const segundaMaisRecente = new Date(ordenado[1].data_triagem);
            diasDesdeUltimaVisita = Math.floor((maisRecente - segundaMaisRecente) / (1000 * 60 * 60 * 24));
        }
        
        // Preparar dados atuais (atendimento de hoje)
        const dadosAtuais = {
            tipoAtendimento: atendimentoAtual.tipo_atendimento,
            especialidade: atendimentoAtual.especialidade,
            peso: atendimentoAtual.peso_kg,
            altura: atendimentoAtual.altura_cm,
            imc: atendimentoAtual.imc,
            paEsquerdo: `${atendimentoAtual.pressao_sis_esquerdo}×${atendimentoAtual.pressao_dia_esquerdo}`,
            paDireito: atendimentoAtual.pressao_sis_direito 
                ? `${atendimentoAtual.pressao_sis_direito}×${atendimentoAtual.pressao_dia_direito}` 
                : 'Não medido',
            fc: atendimentoAtual.frequencia_cardiaca,
            spo2: atendimentoAtual.saturacao_oxigenio,
            dataAtendimento: atendimentoAtual.data_triagem
        };
        
        // Preparar dados completos para IA
        const dadosPaciente = {
            nome: paciente.nome,
            idade: paciente.idade,
            sexo: paciente.sexo,
            totalVisitas: totalVisitas,
            especialidadesVisitadas: especialidadesVisitadas,
            isPrimeiraVisita: isPrimeiraVisita,
            isRecorrente: isRecorrente,
            diasDesdeUltimaVisita: diasDesdeUltimaVisita,
            dadosAtuais: dadosAtuais
        };

        // Construir prompt refinado com histórico completo
        let contextoJornada = '';
        
        if (dadosPaciente.isPrimeiraVisita) {
            contextoJornada = `Este é o PRIMEIRO ATENDIMENTO do paciente na clínica. Dê boas-vindas estratégicas e oriente sobre a importância do acompanhamento.`;
        } else {
            contextoJornada = `O paciente já veio ${dadosPaciente.totalVisitas} vezes à clínica. `;
            
            // Fidelidade
            if (dadosPaciente.diasDesdeUltimaVisita !== null) {
                if (dadosPaciente.diasDesdeUltimaVisita <= 30) {
                    contextoJornada += `⭐ PACIENTE FIEL (última visita há ${dadosPaciente.diasDesdeUltimaVisita} dias). `;
                } else if (dadosPaciente.diasDesdeUltimaVisita <= 180) {
                    contextoJornada += `Paciente em acompanhamento regular (última visita há ${dadosPaciente.diasDesdeUltimaVisita} dias). `;
                } else {
                    contextoJornada += `⚠️ Paciente estava AFASTADO (última visita há ${dadosPaciente.diasDesdeUltimaVisita} dias - ${Math.floor(dadosPaciente.diasDesdeUltimaVisita / 30)} meses). `;
                }
            }
            
            // Cruzamento de especialidades
            if (dadosPaciente.especialidadesVisitadas.length > 1) {
                contextoJornada += `Jornada MULTIDISCIPLINAR: ${dadosPaciente.especialidadesVisitadas.join(', ')}. `;
            } else {
                contextoJornada += `Especialidade única: ${dadosPaciente.especialidadesVisitadas[0]}. `;
            }
        }
        
        const prompt = `Você é o gestor clínico da Biocardio. Analise a jornada completa deste paciente:

PACIENTE: ${dadosPaciente.nome}
IDADE: ${dadosPaciente.idade}
SEXO: ${dadosPaciente.sexo}

CONTEXTO DA JORNADA:
${contextoJornada}

DADOS DO ATENDIMENTO DE HOJE (${dadosPaciente.dadosAtuais.dataAtendimento}):
- Especialidade: ${dadosPaciente.dadosAtuais.especialidade}
- Tipo de Atendimento: ${dadosPaciente.dadosAtuais.tipoAtendimento}
- Peso: ${dadosPaciente.dadosAtuais.peso} kg | Altura: ${dadosPaciente.dadosAtuais.altura} cm | IMC: ${dadosPaciente.dadosAtuais.imc}
- PA Esquerdo: ${dadosPaciente.dadosAtuais.paEsquerdo} mmHg
- PA Direito: ${dadosPaciente.dadosAtuais.paDireito} mmHg
- FC: ${dadosPaciente.dadosAtuais.fc} bpm
- SpO₂: ${dadosPaciente.dadosAtuais.spo2}%

TAREFA:
Forneça um insight clínico/gerencial de NO MÁXIMO 2 LINHAS, focado em:
1. FIDELIDADE: Ele é um paciente fiel ou estava sumido? Se primeira visita, dê boas-vindas.
2. CRUZAMENTO: Se ele já passou por múltiplas especialidades, há conexão importante?
3. ALERTA CLÍNICO: Risco cardiovascular ou necessidade de retorno urgente.

Seja estratégico, direto e útil para o Dr. Salomão durante a consulta.`;

        // Chamar OpenAI API
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'Você é um assistente médico especializado em análise de dados vitais e gestão clínica. Seja conciso, objetivo e focado em insights acionáveis.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!openaiResponse.ok) {
            const errorData = await openaiResponse.json();
            console.error('Erro OpenAI:', errorData);
            return new Response(
                JSON.stringify({ 
                    error: 'Erro ao processar com IA.',
                    details: errorData.error?.message 
                }),
                { status: 500, headers }
            );
        }

        const data = await openaiResponse.json();
        const insight = data.choices[0]?.message?.content?.trim();

        if (!insight) {
            return new Response(
                JSON.stringify({ error: 'IA não retornou insight.' }),
                { status: 500, headers }
            );
        }

        // Retornar insight com metadados completos
        return new Response(
            JSON.stringify({ 
                success: true,
                insight: insight,
                metadata: {
                    model: 'gpt-4o-mini',
                    timestamp: new Date().toISOString(),
                    totalVisitas: dadosPaciente.totalVisitas,
                    isPrimeiraVisita: dadosPaciente.isPrimeiraVisita,
                    pacienteRecorrente: dadosPaciente.isRecorrente,
                    especialidadesVisitadas: dadosPaciente.especialidadesVisitadas,
                    diasDesdeUltimaVisita: dadosPaciente.diasDesdeUltimaVisita
                }
            }),
            { status: 200, headers }
        );

    } catch (error) {
        console.error('Erro na função:', error);
        return new Response(
            JSON.stringify({ 
                error: 'Erro interno no servidor.',
                message: error.message 
            }),
            { status: 500, headers }
        );
    }
};

