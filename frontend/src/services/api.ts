const API_URL = import.meta.env.VITE_API_URL ?? "https://localhost:8000";

export function streamMessage(
  sessionId: string,
  message: string,
  onToken: (token: string) => void,
  onDone: () => void,
) {
  fetch(`${API_URL}/chat/${sessionId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const source = new EventSource(`${API_URL}/chat/${sessionId}/stream`);
  source.onmessage = (e) => {
    if (e.data == "[DONE]") {
      source.close();
      onDone();
      return;
    }
    onToken(JSON.parse(e.data).token);
  };
  source.onerror = () => source.close();
}
