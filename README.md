# chat-inteligente

### Chatbot de assistente de atendimento.

App web

Para este desafio escolhi o framework Next, que me possibilitou implementar uma api para segurança da conexão com a LLM. Além da utilização de React que era um pré-requisito.
O chatbot responde a dúvidas do usuário em tempo real, utilizando IA generativa.
O chatbot utiliza informações fictícias da empresa FinTechX e só responde perguntas referentes a esse conteúdo.

## Implementações
 
- [x] treinamento e implementação LLM Groq implementado na api.
- [x] pixel perfect baseado no protótipo figma.
- [x] temas dark, light conforme preferência do navegador
- [x] Melhora de UX/UI com implementação de todas as funcionalidades dos ícones.
- [x] responsividade
- [x] Componentização
- [x] Testes
- [x] CI
- [x] Deploy Vercel

## Tecnologias utilizadas

- Next.js
- React
- API Routes (Next.js)
- Groq API (LLM)
- Vercel (Deploy)

## Fluxo

- Commit
- Pull Request
- Ci - Testes
- Merge só é liberado se os testes passarem
- Após o Merge o Deploy com a Vercel é feito automaticamente
