import { useState } from "react";
import { streamMessage } from "../services/api";

export type Message = {
  role: "user" | "assistant";
  content: string;
  image?: string;
  error?: boolean;
};

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);

  const sendMessage = async (text: string, imageBase64?: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, image: imageBase64 },
    ]);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    setStreaming(true);

    await streamMessage(
      sessionId,
      text,
      imageBase64,
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
      (error) => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: error,
            error: true,
          };
          return updated;
        });
        setStreaming(false);
      },
    );
  };

  return { messages, streaming, sendMessage };
}
