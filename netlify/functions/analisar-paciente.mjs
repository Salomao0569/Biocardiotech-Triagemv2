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
        const tiposAtendimentoSet = new Set();
        let totalConsultas = 0;
        let totalExames = 0;
        let totalEcocardiogramas = 0;
        let fezEcocardiograma = false;
        
        historicoCompleto.forEach(atend => {
            // Especialidades
            if (atend.especialidade) {
                especialidadesSet.add(atend.especialidade);
            }
            
            // Tipos de atendimento
            if (atend.tipo_atendimento) {
                tiposAtendimentoSet.add(atend.tipo_atendimento);
                
                // Classificar por tipo
                const tipo = atend.tipo_atendimento.toLowerCase();
                if (tipo.includes('consulta') && !tipo.includes('+')) {
                    totalConsultas++;
                } else if (tipo.includes('exame') || tipo.includes('ecocardiograma')) {
                    totalExames++;
                    if (tipo.includes('ecocardiograma')) {
                        totalEcocardiogramas++;
                        fezEcocardiograma = true;
                    }
                } else if (tipo.includes('+')) {
                    // Combos contam como consulta + exame
                    totalConsultas++;
                    totalExames++;
                    if (tipo.includes('ecocardiograma')) {
                        totalEcocardiogramas++;
                        fezEcocardiograma = true;
                    }
                }
            }
        });
        
        const especialidadesVisitadas = Array.from(especialidadesSet);
        const tiposAtendimento = Array.from(tiposAtendimentoSet);
        const isMultiEspecialidade = especialidadesVisitadas.length > 1;
        
        // Verificar se é paciente recorrente
        const isPrimeiraVisita = totalVisitas === 1;
        const isRecorrente = totalVisitas > 1;
        
        // Calcular tempo desde última visita e comparar dados vitais
        let diasDesdeUltimaVisita = null;
        let dadosVitaisAnteriores = null;
        let variacaoPA = null;
        let variacaoIMC = null;
        
        if (totalVisitas > 1) {
            const ordenado = [...historicoCompleto].sort((a, b) => 
                new Date(b.data_triagem) - new Date(a.data_triagem)
            );
            const maisRecente = ordenado[0];
            const segundaMaisRecente = ordenado[1];
            
            const dataMaisRecente = new Date(maisRecente.data_triagem);
            const dataSegunda = new Date(segundaMaisRecente.data_triagem);
            diasDesdeUltimaVisita = Math.floor((dataMaisRecente - dataSegunda) / (1000 * 60 * 60 * 24));
            
            // Capturar dados vitais anteriores
            dadosVitaisAnteriores = {
                pa_sis: segundaMaisRecente.pressao_sis_esquerdo,
                pa_dia: segundaMaisRecente.pressao_dia_esquerdo,
                imc: segundaMaisRecente.imc,
                peso: segundaMaisRecente.peso_kg
            };
            
            // Calcular variações
            if (maisRecente.pressao_sis_esquerdo && dadosVitaisAnteriores.pa_sis) {
                const variacaoSis = ((maisRecente.pressao_sis_esquerdo - dadosVitaisAnteriores.pa_sis) / dadosVitaisAnteriores.pa_sis) * 100;
                variacaoPA = Math.round(variacaoSis);
            }
            
            if (maisRecente.imc && dadosVitaisAnteriores.imc) {
                const variacaoIMCCalc = ((maisRecente.imc - dadosVitaisAnteriores.imc) / dadosVitaisAnteriores.imc) * 100;
                variacaoIMC = Math.round(variacaoIMCCalc);
            }
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
            totalConsultas: totalConsultas,
            totalExames: totalExames,
            totalEcocardiogramas: totalEcocardiogramas,
            fezEcocardiograma: fezEcocardiograma,
            especialidadesVisitadas: especialidadesVisitadas,
            isMultiEspecialidade: isMultiEspecialidade,
            tiposAtendimento: tiposAtendimento,
            isPrimeiraVisita: isPrimeiraVisita,
            isRecorrente: isRecorrente,
            diasDesdeUltimaVisita: diasDesdeUltimaVisita,
            dadosVitaisAnteriores: dadosVitaisAnteriores,
            variacaoPA: variacaoPA,
            variacaoIMC: variacaoIMC,
            dadosAtuais: dadosAtuais
        };

        // Construir prompt refinado com histórico completo e cruzamento de exames
        let contextoJornada = '';
        
        if (dadosPaciente.isPrimeiraVisita) {
            contextoJornada = `Este é o PRIMEIRO ATENDIMENTO do paciente na clínica. Dê boas-vindas estratégicas e oriente sobre a importância do acompanhamento e exames preventivos.`;
        } else {
            contextoJornada = `O paciente já veio ${dadosPaciente.totalVisitas} vezes à clínica (${dadosPaciente.totalConsultas} consultas, ${dadosPaciente.totalExames} exames). `;
            
            // Fidelidade
            if (dadosPaciente.diasDesdeUltimaVisita !== null) {
                if (dadosPaciente.diasDesdeUltimaVisita <= 30) {
                    contextoJornada += `⭐ PACIENTE FIEL/DIAMANTE (última visita há ${dadosPaciente.diasDesdeUltimaVisita} dias). `;
                } else if (dadosPaciente.diasDesdeUltimaVisita <= 180) {
                    contextoJornada += `Paciente RECORRENTE em acompanhamento (última visita há ${dadosPaciente.diasDesdeUltimaVisita} dias). `;
                } else {
                    contextoJornada += `⚠️ Paciente estava AFASTADO (última visita há ${dadosPaciente.diasDesdeUltimaVisita} dias - ${Math.floor(dadosPaciente.diasDesdeUltimaVisita / 30)} meses). `;
                }
            }
            
            // Cruzamento de especialidades
            if (dadosPaciente.isMultiEspecialidade) {
                contextoJornada += `TRATAMENTO INTEGRADO em ${dadosPaciente.especialidadesVisitadas.length} especialidades (${dadosPaciente.especialidadesVisitadas.join(', ')}). `;
            } else {
                contextoJornada += `Especialidade única: ${dadosPaciente.especialidadesVisitadas[0]}. `;
            }
            
            // Análise de conversão de exames
            if (dadosPaciente.fezEcocardiograma) {
                contextoJornada += `✅ JÁ REALIZOU ${dadosPaciente.totalEcocardiogramas} Ecocardiograma(s) na clínica. `;
            } else {
                if (dadosPaciente.dadosAtuais.especialidade === 'Cardiologia' || dadosPaciente.especialidadesVisitadas.includes('Cardiologia')) {
                    contextoJornada += `⚠️ OPORTUNIDADE: Paciente de Cardiologia MAS NUNCA FEZ Ecocardiograma na clínica. `;
                }
            }
            
            // Variações nos dados vitais
            if (dadosPaciente.variacaoPA !== null) {
                const sinal = dadosPaciente.variacaoPA > 0 ? '+' : '';
                contextoJornada += `PA ${sinal}${dadosPaciente.variacaoPA}% vs última visita. `;
            }
            if (dadosPaciente.variacaoIMC !== null) {
                const sinal = dadosPaciente.variacaoIMC > 0 ? '+' : '';
                contextoJornada += `IMC ${sinal}${dadosPaciente.variacaoIMC}% vs última visita. `;
            }
        }
        
        const prompt = `Você é o Diretor Clínico da Biocardio. Analise a jornada completa deste paciente:

PACIENTE: ${dadosPaciente.nome}
IDADE: ${dadosPaciente.idade}
SEXO: ${dadosPaciente.sexo}

HISTÓRICO DE ESPECIALIDADES VISITADAS:
${dadosPaciente.especialidadesVisitadas.length > 0 ? dadosPaciente.especialidadesVisitadas.join(', ') : 'Primeira visita'}

HISTÓRICO DE EXAMES/ECOCARDIOGRAMA:
- Total de Consultas: ${dadosPaciente.totalConsultas}
- Total de Exames: ${dadosPaciente.totalExames}
- Ecocardiogramas Realizados: ${dadosPaciente.totalEcocardiogramas}
- Status Ecocardiograma: ${dadosPaciente.fezEcocardiograma ? '✅ JÁ REALIZOU' : '❌ NUNCA FEZ'}

CONTEXTO DA JORNADA:
${contextoJornada}

DADOS DA TRIAGEM DE HOJE (${dadosPaciente.dadosAtuais.dataAtendimento}):
- Especialidade: ${dadosPaciente.dadosAtuais.especialidade}
- Tipo de Atendimento: ${dadosPaciente.dadosAtuais.tipoAtendimento}
- Peso: ${dadosPaciente.dadosAtuais.peso} kg | Altura: ${dadosPaciente.dadosAtuais.altura} cm | IMC: ${dadosPaciente.dadosAtuais.imc}
- PA Esquerdo: ${dadosPaciente.dadosAtuais.paEsquerdo} mmHg
- PA Direito: ${dadosPaciente.dadosAtuais.paDireito} mmHg
- FC: ${dadosPaciente.dadosAtuais.fc} bpm
- SpO₂: ${dadosPaciente.dadosAtuais.spo2}%

TAREFA:
Forneça um insight clínico/gerencial de 2 a 3 LINHAS, focado em:

1. CRUZAMENTO: Identifique se o paciente está integrando o tratamento (ex: 'Paciente acompanhando Cardio e Vascular, excelente adesão').

2. CONVERSÃO DE EXAMES: Se o paciente veio para Consulta Cardio mas NUNCA FEZ Ecocardiograma na clínica, destaque isso como OPORTUNIDADE PREVENTIVA (ex: 'Paciente cardíaco sem Eco na clínica - RECOMENDAR agendamento').

3. RECORRÊNCIA: Classifique o perfil (Novo, Recorrente ou Fiel/Diamante).

4. ALERTA CLÍNICO: Relacione os dados vitais de hoje com o histórico (ex: 'Pressão subiu 20% em relação à última visita').

Seja estratégico, acionável e útil para o Dr. Salomão durante a consulta.`;

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

        // Retornar insight com metadados completos de cruzamento
        return new Response(
            JSON.stringify({ 
                success: true,
                insight: insight,
                metadata: {
                    model: 'gpt-4o-mini',
                    timestamp: new Date().toISOString(),
                    totalVisitas: dadosPaciente.totalVisitas,
                    totalConsultas: dadosPaciente.totalConsultas,
                    totalExames: dadosPaciente.totalExames,
                    totalEcocardiogramas: dadosPaciente.totalEcocardiogramas,
                    fezEcocardiograma: dadosPaciente.fezEcocardiograma,
                    isPrimeiraVisita: dadosPaciente.isPrimeiraVisita,
                    pacienteRecorrente: dadosPaciente.isRecorrente,
                    isMultiEspecialidade: dadosPaciente.isMultiEspecialidade,
                    especialidadesVisitadas: dadosPaciente.especialidadesVisitadas,
                    diasDesdeUltimaVisita: dadosPaciente.diasDesdeUltimaVisita,
                    variacaoPA: dadosPaciente.variacaoPA,
                    variacaoIMC: dadosPaciente.variacaoIMC
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

