export interface Mensagem {
  autor: "usuario" | "assistente";
  texto: string;
}

export interface RespostaChat {
  resposta: string;
}