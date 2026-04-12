import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockGenerateContent = vi.hoisted(() => vi.fn());

vi.mock('@google/genai', () => {
    class GoogleGenAI {
        models = { generateContent: mockGenerateContent };
        constructor(_config: any) {}
    }
    return { GoogleGenAI };
});

vi.mock('@/app/data/documento', () => ({
    documento: 'dados da empresa mockados',
}));

import { POST } from './route';

function criarRequisicao(body: object) {
    return new NextRequest('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('POST /api/chat', () => {

    it('retorna erro 400 quando mensagens está vazio', async () => {
        const req = criarRequisicao({ mensagens: [] });
        const res = await POST(req);
        const dados = await res.json();
        expect(res.status).toBe(400);
        expect(dados.erro).toBe('Nenhuma mensagem enviada.');
    });

    it('retorna erro 400 quando mensagens não é enviado', async () => {
        const req = criarRequisicao({});
        const res = await POST(req);
        const dados = await res.json();
        expect(res.status).toBe(400);
        expect(dados.erro).toBe('Nenhuma mensagem enviada.');
    });

    it('retorna resposta da IA quando sucesso', async () => {
        mockGenerateContent.mockResolvedValue({ text: 'Olá! Como posso ajudar?' });
        const req = criarRequisicao({
            mensagens: [{ autor: 'usuario', texto: 'Qual o horário de atendimento?' }],
        });
        const res = await POST(req);
        const dados = await res.json();
        expect(res.status).toBe(200);
        expect(dados.resposta).toBe('Olá! Como posso ajudar?');
    });

    it('retorna fallback quando resultado.text é vazio', async () => {
        mockGenerateContent.mockResolvedValue({ text: '' });
        const req = criarRequisicao({
            mensagens: [{ autor: 'usuario', texto: 'Olá' }],
        });
        const res = await POST(req);
        const dados = await res.json();
        expect(dados.resposta).toBe('Desculpe, não consegui processar sua resposta.');
    });

    it('retorna erro 429 quando cota é atingida', async () => {
        mockGenerateContent.mockRejectedValue(new Error('429 quota exceeded'));
        const req = criarRequisicao({
            mensagens: [{ autor: 'usuario', texto: 'Olá' }],
        });
        const res = await POST(req);
        const dados = await res.json();
        expect(res.status).toBe(429);
        expect(dados.erro).toBe('Limite de cota atingido. Aguarde alguns segundos.');
    });

    it('retorna erro 500 para erros genéricos', async () => {
        mockGenerateContent.mockRejectedValue(new Error('Erro desconhecido'));
        const req = criarRequisicao({
            mensagens: [{ autor: 'usuario', texto: 'Olá' }],
        });
        const res = await POST(req);
        const dados = await res.json();
        expect(res.status).toBe(500);
        expect(dados.erro).toBe('Erro ao conectar com a inteligência artificial.');
    });

    it('envia apenas a última mensagem para a IA', async () => {
        mockGenerateContent.mockResolvedValue({ text: 'Resposta' });
        const req = criarRequisicao({
            mensagens: [
                { autor: 'usuario', texto: 'primeira' },
                { autor: 'assistente', texto: 'resposta' },
                { autor: 'usuario', texto: 'última pergunta' },
            ],
        });
        await POST(req);
        expect(mockGenerateContent).toHaveBeenCalledWith(
            expect.objectContaining({
                contents: [{ role: 'user', parts: [{ text: 'última pergunta' }] }],
            })
        );
    });
});