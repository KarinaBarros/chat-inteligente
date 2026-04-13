import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockFetch = vi.hoisted(() => vi.fn());
vi.stubGlobal('fetch', mockFetch);

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

function mockGroqSucesso(conteudo: string) {
    mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
            choices: [{ message: { content: conteudo } }],
        }),
    });
}

function mockGroqErro(status: number, mensagem: string) {
    mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: { message: mensagem, code: status } }),
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
        mockGroqSucesso('Olá! Como posso ajudar?');
        const req = criarRequisicao({
            mensagens: [{ autor: 'usuario', texto: 'Qual o horário de atendimento?' }],
        });
        const res = await POST(req);
        const dados = await res.json();
        expect(res.status).toBe(200);
        expect(dados.resposta).toBe('Olá! Como posso ajudar?');
    });

    it('retorna fallback quando conteúdo da resposta é vazio', async () => {
        mockGroqSucesso('');
        const req = criarRequisicao({
            mensagens: [{ autor: 'usuario', texto: 'Olá' }],
        });
        const res = await POST(req);
        const dados = await res.json();
        expect(dados.resposta).toBe('Desculpe, não consegui processar sua resposta.');
    });

    it('retorna erro 429 quando cota é atingida', async () => {
        mockFetch.mockRejectedValue(new Error('429 quota exceeded'));
        const req = criarRequisicao({
            mensagens: [{ autor: 'usuario', texto: 'Olá' }],
        });
        const res = await POST(req);
        const dados = await res.json();
        expect(res.status).toBe(429);
        expect(dados.erro).toBe('Limite de cota atingido. Aguarde alguns segundos.');
    });

    it('retorna erro 500 para erros genéricos', async () => {
        mockFetch.mockRejectedValue(new Error('Erro desconhecido'));
        const req = criarRequisicao({
            mensagens: [{ autor: 'usuario', texto: 'Olá' }],
        });
        const res = await POST(req);
        const dados = await res.json();
        expect(res.status).toBe(500);
        expect(dados.erro).toBe('Erro ao conectar com a inteligência artificial.');
    });

    it('envia apenas a última mensagem para a IA', async () => {
        mockGroqSucesso('Resposta');
        const req = criarRequisicao({
            mensagens: [
                { autor: 'usuario', texto: 'primeira' },
                { autor: 'assistente', texto: 'resposta' },
                { autor: 'usuario', texto: 'última pergunta' },
            ],
        });
        await POST(req);

        const bodyEnviado = JSON.parse(mockFetch.mock.calls[0][1].body);
        const mensagemUsuario = bodyEnviado.messages.find((m: any) => m.role === 'user');
        expect(mensagemUsuario.content).toBe('última pergunta');
    });

    it('chama a API do Groq com o modelo correto', async () => {
        mockGroqSucesso('ok');
        const req = criarRequisicao({
            mensagens: [{ autor: 'usuario', texto: 'teste' }],
        });
        await POST(req);

        const bodyEnviado = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(bodyEnviado.model).toBe('llama-3.3-70b-versatile');
        expect(bodyEnviado.temperature).toBe(0.3);
    });

    it('inclui system prompt com dados da empresa', async () => {
        mockGroqSucesso('ok');
        const req = criarRequisicao({
            mensagens: [{ autor: 'usuario', texto: 'teste' }],
        });
        await POST(req);

        const bodyEnviado = JSON.parse(mockFetch.mock.calls[0][1].body);
        const systemMsg = bodyEnviado.messages.find((m: any) => m.role === 'system');
        expect(systemMsg.content).toContain('dados da empresa mockados');
    });
});