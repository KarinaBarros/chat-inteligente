import { describe, it, expect } from 'vitest';
import { Mensagem } from '@/app/types/chat';

function montarTextoResposta(dados: { erro?: string; resposta?: string }): string {
    return dados.erro ? `${dados.erro}` : dados.resposta ?? '';
}

function pegarUltimaMensagem(mensagens: Mensagem[]): string {
    return mensagens[mensagens.length - 2]?.texto ?? '';
}

describe('montarTextoResposta', () => {
    it('retorna resposta quando sucesso', () => {
        expect(montarTextoResposta({ resposta: 'Tudo bem!' })).toBe('Tudo bem!');
    });

    it('retorna erro quando API retorna campo erro', () => {
        expect(montarTextoResposta({ erro: 'Falhou' })).toBe('Falhou');
    });
});

describe('pegarUltimaMensagem', () => {
    it('retorna penúltima mensagem', () => {
        const mensagens: Mensagem[] = [
            { autor: 'usuario', texto: 'Minha pergunta' },
            { autor: 'assistente', texto: 'Resposta' },
        ];
        expect(pegarUltimaMensagem(mensagens)).toBe('Minha pergunta');
    });

    it('retorna string vazia quando não há mensagens suficientes', () => {
        expect(pegarUltimaMensagem([])).toBe('');
    });
});