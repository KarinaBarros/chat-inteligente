import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import { Mensagem } from "@/app/types/chat";
import { documento } from "@/app/data/documento";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_CHAVE!);

export async function POST(requisicao: NextRequest) {
    console.log("Chave:", process.env.GEMINI_CHAVE ? "✅ encontrada" : "❌ não encontrada");
    try {
        const { mensagens }: { mensagens: Mensagem[] } = await requisicao.json();

        const modelo = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
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
        });


        const historico = mensagens.slice(0, -1).map((m) => ({
            role: m.autor === "usuario" ? "user" : "model",
            parts: [{ text: m.texto }],
        }));

        const ultimaMensagem = mensagens.at(-1)!.texto;

        const chat = modelo.startChat({ history: historico });
        const resultado = await chat.sendMessage(ultimaMensagem);
        const resposta = resultado.response.text();

        return Response.json({ resposta });

    } catch (erro: unknown) {
        console.log(erro);
        const mensagemErro = erro instanceof Error ? erro.message : "";
        const cotaEsgotada = mensagemErro.includes("429");

        return Response.json(
            {
                erro: cotaEsgotada
                    ? "Cota da API esgotada. Tente novamente em alguns minutos."
                    : "Erro ao processar a mensagem.",
            },
            { status: 500 }
        );
    }
}