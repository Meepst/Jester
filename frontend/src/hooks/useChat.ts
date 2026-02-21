// src/hooks/useChat.ts

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type Message = {
  role: "user" | "assistant";
  content: string;
  image?: string; // base64 data URL — for display only, never re-sent to backend
  error?: boolean;
};

// ── shared SSE stream reader ───────────────────────────────────────────────────
// Reads a fetch Response body as a stream of SSE events, calling onToken for
// each token and returning the full assembled response string when done.
async function readStream(
  response: Response,
  onToken: (token: string) => void,
): Promise<string> {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) throw new Error("No response body");

  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE messages are separated by double newlines
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? ""; // keep any incomplete trailing chunk

    for (const part of parts) {
      if (!part.startsWith("data: ")) continue;
      const data = part.slice(6).trim();

      if (data === "[DONE]") return fullText;

      try {
        const parsed = JSON.parse(data);
        if (parsed.token) {
          fullText += parsed.token;
          onToken(parsed.token);
        }
        // escalation and error events are intentionally ignored here —
        // callers can extend this if needed
      } catch {
        // incomplete JSON chunk — will be handled on next read
      }
    }
  }

  return fullText;
}

// ── useChat hook ───────────────────────────────────────────────────────────────
import { useState, useCallback } from "react";

export function useChat(sessionId: string, theme: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);

  // ── sendMessage ─────────────────────────────────────────────────────────────
  // Normal user-initiated message. Adds the user bubble immediately, then
  // streams the assistant response token by token into a second bubble.
  const sendMessage = useCallback(
    async (text: string, imageBase64?: string | null) => {
      if (streaming) return;

      // Optimistically add user bubble
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: text,
          image: imageBase64
            ? `data:image/jpeg;base64,${imageBase64}`
            : undefined,
        },
      ]);

      // Add empty assistant bubble that will fill in as tokens arrive
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      setStreaming(true);

      try {
        const response = await fetch(`${API_URL}/chat/${sessionId}/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            image: imageBase64 ?? null,
            theme,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        await readStream(response, (token) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            updated[updated.length - 1] = {
              ...last,
              content: last.content + token,
            };
            return updated;
          });
        });
      } catch (err) {
        // Replace the empty assistant bubble with an error message
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Something went wrong. Please try again.",
            error: true,
          };
          return updated;
        });
      } finally {
        setStreaming(false);
      }
    },
    [streaming, sessionId, theme],
  );

  // ── sendGreeting ────────────────────────────────────────────────────────────
  // Called automatically on mount. Hits the /greeting endpoint which streams
  // the character's opening line WITHOUT adding a user message to history on
  // the backend. The greeting IS saved to backend history as an assistant turn
  // so the model has context of what it said when the user replies.
  const sendGreeting = useCallback(async () => {
    if (streaming) return;

    // Add empty assistant bubble that will fill as tokens stream in
    setMessages([{ role: "assistant", content: "" }]);
    setStreaming(true);

    try {
      const response = await fetch(`${API_URL}/chat/${sessionId}/greeting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, message: "" }),
      });

      if (!response.ok) {
        throw new Error(`Greeting error: ${response.status}`);
      }

      await readStream(response, (token) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...last,
            content: last.content + token,
          };
          return updated;
        });
      });
    } catch {
      // If greeting fails, show a soft fallback — don't block the UI
      setMessages([
        {
          role: "assistant",
          content: "Welcome! How can I help you today?",
        },
      ]);
    } finally {
      setStreaming(false);
    }
  }, [streaming, sessionId, theme]);

  return { messages, streaming, sendMessage, sendGreeting };
}
