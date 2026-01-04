import { OpenAI } from 'openai';

export const handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'OpenAI API Key not configured.' }) 
        };
    }

    try {
        const { pergunta, dadosCompletos } = JSON.parse(event.body);

        if (!pergunta) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: 'Pergunta não fornecida.' }) 
            };
        }

        const openai = new OpenAI({ apiKey: apiKey });

        // PROCESSAR DADOS COMPLETOS DO SUPABASE
        const { totalPacientes, totalAtendimentos, totalEncaminhados, encaminhamentosEndocrinoCardio, pacientes } = dadosCompletos || {};

        // CONSTRUIR CONTEXTO ESTRATÉGICO
        let contexto = `Você é o Diretor de Estratégia da Biocardio. Analise o banco de dados e forneça insights acionáveis.\n\n`;
        
        contexto += `DADOS GERAIS DA CLÍNICA:\n`;
        contexto += `- Total de Pacientes Únicos: ${totalPacientes || 0}\n`;
        contexto += `- Total de Atendimentos: ${totalAtendimentos || 0}\n`;
        contexto += `- Pacientes Encaminhados (multi-especialidade): ${totalEncaminhados || 0}\n`;
        contexto += `- Encaminhamentos Endocrinologia → Cardiologia: ${encaminhamentosEndocrinoCardio || 0}\n\n`;
        
        if (pacientes && pacientes.length > 0) {
            contexto += `JORNADA DOS PACIENTES (com datas e fluxo de encaminhamento):\n`;
            pacientes.slice(0, 30).forEach((p, i) => {
                contexto += `\n${i + 1}. ${p.nome || 'N/A'}:\n`;
                contexto += `   - Total de visitas: ${p.visitas || 0}\n`;
                contexto += `   - Primeira especialidade: ${p.primeiraEspecialidade || 'N/A'}\n`;
                contexto += `   - Fluxo de encaminhamento: ${p.fluxoEncaminhamento || 'Sem encaminhamento'}\n`;
                if (p.foiEncaminhado) {
                    contexto += `   - ENCAMINHADO: ${p.origemEncaminhamento} → ${p.destinoEncaminhamento}\n`;
                }
                contexto += `   - Dias sem retorno: ${p.diasSemRetorno || 0}\n`;
                contexto += `   - Fez Ecocardiograma: ${p.fezEco ? 'Sim' : 'Não'}\n`;
                contexto += `   - Última PA: ${p.ultimaPA || 'N/A'}\n`;
                contexto += `   - Histórico completo: ${p.jornada || 'N/A'}\n`;
            });
        }
        
        contexto += `\n\nPERGUNTA DO DR. SALOMÃO:\n${pergunta}\n\n`;
        contexto += `INSTRUÇÕES:\n`;
        contexto += `1. Pacientes 'Diamante': Fiéis e Multidisciplinares.\n`;
        contexto += `2. Gaps de Retorno: Pacientes hipertensos/diabéticos sumidos há 6+ meses.\n`;
        contexto += `3. Conversão para Ecocardiograma: Pacientes da Cardio sem registro de exame.\n`;
        contexto += `4. Tendências: A média de PA da clínica está subindo ou descendo?\n\n`;
        contexto += `Forneça uma resposta clara, objetiva e acionável em até 5 linhas.`;

        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { 
                    role: 'system', 
                    content: 'Você é o Diretor de Estratégia da Clínica Biocardio. Sua especialidade é analisar dados médicos e gerar insights estratégicos para gestão clínica. Suas respostas devem ser objetivas, acionáveis e focadas em oportunidades de melhoria e receita ética.' 
                },
                { role: 'user', content: contexto }
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        const resposta = chatCompletion.choices[0].message.content.trim();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                resposta: resposta,
                metadata: {
                    model: 'gpt-4o-mini',
                    timestamp: new Date().toISOString(),
                    pergunta: pergunta
                }
            }),
        };

    } catch (error) {
        console.error('Erro na função ia-estrategica:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                error: error.message || 'Erro ao processar análise estratégica.' 
            }),
        };
    }
};

