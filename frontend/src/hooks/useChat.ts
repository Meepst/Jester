import { useState } from "react";
import { streamMessage } from "../services/api";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);

  const sendMessage = (text: string) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    setStreaming(true);

    streamMessage(
      sessionId,
      text,
      (token) => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + token,
          };
          return updated;
        });
      },
      () => setStreaming(false),
    );
  };

  return { messages, streaming, sendMessage };
}
