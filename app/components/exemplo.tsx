"use client";

import { useState } from "react";
import { Mensagem } from "@/app/types/chat";

export default function Exemplo() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [entrada, setEntrada] = useState<string>("");
  const [carregando, setCarregando] = useState<boolean>(false);

  async function enviarMensagem(): Promise<void> {
    if (!entrada.trim() || carregando) return;

    const novaMensagem: Mensagem = { autor: "usuario", texto: entrada };
    const mensagensAtualizadas = [...mensagens, novaMensagem];

    setMensagens(mensagensAtualizadas);
    setEntrada("");
    setCarregando(true);

    try {
      const resposta = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagens: mensagensAtualizadas }),
      });

      const dados = await resposta.json();

      setMensagens([
        ...mensagensAtualizadas,
        {
          autor: "assistente",
          texto: dados.erro ? `${dados.erro}` : dados.resposta,
        },
      ]);
    } catch {
      setMensagens([
        ...mensagensAtualizadas,
        { autor: "assistente", texto: "Erro ao conectar com o servidor." },
      ]);
    } finally {
      setCarregando(false);
    }
  }

  function aoApertarTecla(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  }

  return (
    <div>
      <div>
        {mensagens.map((msg, i) => (
          <p key={i}>
            <strong>{msg.autor === "usuario" ? "Você" : "Gemini"}:</strong>{" "}
            {msg.texto}
          </p>
        ))}
        {carregando && <p>Digitando...</p>}
      </div>

      <div>
        <input
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          onKeyDown={aoApertarTecla}
          placeholder="Digite sua mensagem..."
        />
        <button onClick={enviarMensagem} disabled={carregando}>
          Enviar
        </button>
      </div>
    </div>
  );
}