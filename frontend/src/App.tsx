import { useState, useRef, useEffect } from "react";
import { useChat } from "./hooks/useChat";

const SESSION_ID = crypto.randomUUID();

function App() {
  const { messages, streaming, sendMessage } = useChat(SESSION_ID);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || streaming) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            Send a message to start
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-prose px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap
                          ${
                            msg.role === "user"
                              ? "bg-blue-500 text-white rounded-br-sm"
                              : "bg-gray-100 text-gray-800 rounded-bl-sm"
                          }`}
            >
              {msg.content}
              {msg.role === "assistant" &&
                streaming &&
                i === messages.length - 1 && (
                  <span className="animate-pulse ml-1">▋</span>
                )}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-gray-200">
        <input
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={streaming}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          onClick={handleSend}
          disabled={streaming || !input.trim()}
        >
          Submit!
        </button>
      </div>
    </div>
  );
}

export default App;
