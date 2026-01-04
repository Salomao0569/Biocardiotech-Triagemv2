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
        const { paciente, atendimento, jornada } = body;

        // Validação
        if (!paciente || !atendimento) {
            return new Response(
                JSON.stringify({ error: 'Dados do paciente ou atendimento ausentes.' }),
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

        // Preparar dados para IA
        const dadosPaciente = {
            nome: paciente.nome,
            idade: paciente.idade,
            sexo: paciente.sexo,
            totalVisitas: paciente.totalVisitas,
            tipoAtendimento: atendimento.tipo_atendimento,
            especialidade: atendimento.especialidade,
            peso: atendimento.peso_kg,
            altura: atendimento.altura_cm,
            imc: atendimento.imc,
            paEsquerdo: `${atendimento.pressao_sis_esquerdo}×${atendimento.pressao_dia_esquerdo}`,
            paDireito: atendimento.pressao_sis_direito 
                ? `${atendimento.pressao_sis_direito}×${atendimento.pressao_dia_direito}` 
                : 'Não medido',
            fc: atendimento.frequencia_cardiaca,
            spo2: atendimento.saturacao_oxigenio,
            dataAtendimento: atendimento.data_triagem,
            isRecorrente: jornada?.pacientesRecorrentes > 0 || paciente.totalVisitas > 1
        };

        // Construir prompt
        const prompt = `Você é o consultor de BI do Dr. Salomão na Clínica Biocardio. Analise estes dados vitais e de jornada:

PACIENTE: ${dadosPaciente.nome}
IDADE: ${dadosPaciente.idade}
SEXO: ${dadosPaciente.sexo}
TOTAL DE VISITAS: ${dadosPaciente.totalVisitas}
TIPO: ${dadosPaciente.isRecorrente ? '⭐ PACIENTE RECORRENTE' : 'Primeira visita'}

DADOS DO ÚLTIMO ATENDIMENTO (${dadosPaciente.dataAtendimento}):
- Especialidade: ${dadosPaciente.especialidade}
- Tipo de Atendimento: ${dadosPaciente.tipoAtendimento}
- Peso: ${dadosPaciente.peso} kg | Altura: ${dadosPaciente.altura} cm | IMC: ${dadosPaciente.imc}
- PA Esquerdo: ${dadosPaciente.paEsquerdo} mmHg
- PA Direito: ${dadosPaciente.paDireito} mmHg
- FC: ${dadosPaciente.fc} bpm
- SpO₂: ${dadosPaciente.spo2}%

TAREFA:
Forneça um insight clínico/gerencial de NO MÁXIMO 2 LINHAS, focado em:
1. Risco cardiovascular (se houver)
2. Necessidade de retorno
3. Se for paciente recorrente, destaque isso positivamente

Seja direto, objetivo e útil para o Dr. Salomão durante a consulta.`;

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

        // Retornar insight
        return new Response(
            JSON.stringify({ 
                success: true,
                insight: insight,
                metadata: {
                    model: 'gpt-4o-mini',
                    timestamp: new Date().toISOString(),
                    pacienteRecorrente: dadosPaciente.isRecorrente
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

