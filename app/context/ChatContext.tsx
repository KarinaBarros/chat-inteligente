"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ChatContextType = {
  step: number;
  message: string;
  setMessage: (value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  direction: "next" | "back";
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [direction, setDirection] = useState<"next" | "back">("next");

  const nextStep = () => {
  setDirection("next");
  setStep((s) => s + 1);
};

const prevStep = () => {
  setDirection("back");
  setStep((s) => Math.max(1, s - 1));
};

  return (
    <ChatContext.Provider
      value={{
        step,
        message,
        setMessage,
        nextStep,
        prevStep,
        direction
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
}