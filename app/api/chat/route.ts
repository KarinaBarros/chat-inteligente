import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";
import { documento } from "@/app/data/documento";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_CHAVE!,
});

export async function POST(requisicao: NextRequest) {
    try {
        const { mensagens } = await requisicao.json();

        if (!mensagens || mensagens.length === 0) {
            return Response.json({ erro: "Nenhuma mensagem enviada." }, { status: 400 });
        }

        const perguntaDoUsuario = mensagens[mensagens.length - 1].texto;

        const resultado = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: [{ role: "user", parts: [{ text: perguntaDoUsuario }] }],
            config: {
                systemInstruction: `
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
                temperature: 0.3,
            }
        });

        const resposta = resultado.text || "Desculpe, não consegui processar sua resposta.";
        return Response.json({ resposta });

    } catch (erro: any) {
        console.error("Erro no Chat:", erro.message);

        if (erro.message?.includes("429")) {
            return Response.json(
                { erro: "Limite de cota atingido. Aguarde alguns segundos." },
                { status: 429 }
            );
        }

        return Response.json(
            { erro: "Erro ao conectar com a inteligência artificial." },
            { status: 500 }
        );
    }
}