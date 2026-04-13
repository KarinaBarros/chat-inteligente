import { NextRequest } from "next/server";
import { documento } from "@/app/data/documento";

async function gerarRespostaComRetry(fn: () => Promise<any>, tentativas = 3) {
    let erro;

    for (let i = 0; i < tentativas; i++) {
        try {
            return await fn();
        } catch (e: any) {
            erro = e;

            const isErroRetry =
                e.message?.includes("429") ||
                e.message?.includes("503") ||
                e.message?.includes("UNAVAILABLE");

            if (!isErroRetry) {
                throw e;
            }

            const delay = 500 * Math.pow(2, i);
            console.warn(`Tentativa ${i + 1} falhou. Tentando novamente em ${delay}ms...`);

            await new Promise(res => setTimeout(res, delay));
        }
    }

    throw erro;
}

export async function POST(requisicao: NextRequest) {
    try {
        const { mensagens } = await requisicao.json();

        if (!mensagens || mensagens.length === 0) {
            return Response.json(
                { erro: "Nenhuma mensagem enviada." },
                { status: 400 }
            );
        }

        const perguntaDoUsuario = mensagens[mensagens.length - 1].texto;

        const resultado = await gerarRespostaComRetry(async () => {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_CHAVE}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.3,
                    messages: [
                        {
                            role: "system",
                            content: `
                                Você é um assistente virtual da empresa e deve responder APENAS 
                                com base nos dados abaixo.

                                Regras:
                                - Responda sempre em português
                                - Seja educado e objetivo
                                - Se a pergunta não estiver relacionada aos dados da empresa, 
                                diga: "Desculpe, só posso responder dúvidas relacionadas à nossa empresa."
                                - Nunca invente informações que não estejam nos dados abaixo

                                Dados da empresa:
                                ${documento}
                            `,
                        },
                        {
                            role: "user",
                            content: perguntaDoUsuario,
                        },
                    ],
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            return response.json();
        });

        const resposta =
            resultado.choices?.[0]?.message?.content ||
            "Desculpe, não consegui processar sua resposta.";

        return Response.json({ resposta });

    } catch (erro: any) {
        console.error("Erro no Chat:", erro.message);

        if (erro.message?.includes("429")) {
            return Response.json(
                { erro: "Limite de cota atingido. Aguarde alguns segundos." },
                { status: 429 }
            );
        }

        if (erro.message?.includes("503") || erro.message?.includes("UNAVAILABLE")) {
            return Response.json(
                { erro: "Servidor da IA está ocupado. Tente novamente em instantes." },
                { status: 503 }
            );
        }

        return Response.json(
            { erro: "Erro ao conectar com a inteligência artificial." },
            { status: 500 }
        );
    }
}