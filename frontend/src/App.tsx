import {
  useState,
  useRef,
  useEffect,
  type HTMLInputTypeAttribute,
} from "react";
import { useChat } from "./hooks/useChat";

const SESSION_ID = crypto.randomUUID();

function App() {
  const { messages, streaming, sendMessage } = useChat(SESSION_ID);
  const [input, setInput] = useState("");
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageBase64(undefined);
    setImagePreview(undefined);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSend = () => {
    if ((!input.trim() && !imageBase64) || streaming) return;
    sendMessage(input.trim(), imageBase64);
    setInput("");
    clearImage();
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      {/* Message thread */}
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
              {/* show attached image in message bubble */}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="attachment"
                  className="rounded-lg mb-2 max-w-xs max-h-48 object-cover"
                />
              )}
              {msg.content}
              {msg.role === "assistant" &&
                streaming &&
                i === messages.length - 1 && (
                  <span className="animate-pulse ml-1">▋</span>
                )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Image preview above input bar */}
      {imagePreview && (
        <div className="relative w-fit mb-2">
          <img
            src={imagePreview}
            alt="preview"
            className="h-20 rounded-lg object-cover border border-gray-200"
          />
          <button
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
          >
            ×
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="flex gap-2 pt-2 border-t border-gray-200">
        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {/* Image attach button */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={streaming}
          className="text-gray-400 hover:text-gray-600 disabled:opacity-40 px-2 text-xl"
          title="Attach image"
        >
          📎
        </button>
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
          disabled={streaming || (!input.trim() && !imageBase64)}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
