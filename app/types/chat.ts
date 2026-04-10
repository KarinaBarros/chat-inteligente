export interface Mensagem {
  autor: "usuario" | "assistente";
  texto: string;
  copy?: boolean;
}

export interface RespostaChat {
  resposta: string;
}