const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function streamMessage(
  sessionId: string,
  message: string,
  imageBase64: string | undefined,
  theme: string = "default",
  onToken: (token: string) => void,
  onDone: () => void,
  onError?: (error: string) => void,
) {
  const response = await fetch(`${API_URL}/chat/${sessionId}/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, image: imageBase64 ?? null, theme }),
  });

  if (!response.ok) {
    onError?.(`Server error: ${response.status}`);
    onDone();
    return;
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    onError?.("No response body");
    onDone();
    return;
  }

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE messages are separated by double newlines
    const lines = buffer.split("\n\n");
    buffer = lines.pop() ?? ""; // keep incomplete chunk in buffer

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();

      if (data === "[DONE]") {
        onDone();
        return;
      }

      try {
        const parsed = JSON.parse(data);
        if (parsed.token) onToken(parsed.token);
        if (parsed.error) onError?.(parsed.error);
        if (parsed.escalated) onError?.("Escalated to human agent");
      } catch {
        // incomplete JSON chunk, will be handled in next read
      }
    }
  }

  onDone();
}
