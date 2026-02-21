import { useState, useRef, useEffect } from "react";
import { useChat } from "./hooks/useChat";

/* ─── Google Fonts ─── */
const FONT_LINK = document.createElement("link");
FONT_LINK.rel = "stylesheet";
FONT_LINK.href =
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=IM+Fell+English:ital@0;1&family=Oswald:wght@300;400;600&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=Dancing+Script:wght@700&family=Raleway:wght@200;400;600&display=swap";
document.head.appendChild(FONT_LINK);

/* ─── Animations ─── */
const STYLES = `
  @keyframes flicker { 0%,100%{opacity:1} 50%{opacity:.85} 75%{opacity:.95} }
  @keyframes pyramidPulse { 0%,100%{text-shadow:0 0 10px #d4af37,0 0 20px #d4af3780} 50%{text-shadow:0 0 20px #d4af37,0 0 40px #d4af3760} }
  @keyframes fountain { 0%,100%{transform:translateY(0) scaleX(1)} 50%{transform:translateY(-4px) scaleX(1.02)} }
  @keyframes neonBlink { 0%,100%{opacity:1;filter:drop-shadow(0 0 6px #ff3b3b)} 49%{opacity:1} 50%{opacity:.7} 51%{opacity:1} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes fadeSlideIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .castle-flicker { animation: flicker 8s ease-in-out infinite; }
  .pyramid-glow { animation: pyramidPulse 3s ease-in-out infinite; }
  .fountain-title { animation: fountain 6s ease-in-out infinite; display:inline-block; }
  .neon-text { animation: neonBlink 4s ease-in-out infinite; }
  .cursor-blink { animation: pulse 1s ease-in-out infinite; }
  .msg-enter { animation: fadeSlideIn 0.2s ease-out; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 99px; }
`;
const styleEl = document.createElement("style");
styleEl.textContent = STYLES;
document.head.appendChild(styleEl);

/* ─── Types ─── */
export type ImageAttachment = {
  base64: string;
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  previewUrl: string;
};

/* ─── Hotel Config ─── */
const HOTELS = [
  {
    id: "excalibur",
    name: "Excalibur",
    emoji: "🏰",
    tagline: "Hark! Welcome to the Kingdom, noble guest.",
    subtitle: "Las Vegas Blvd · The Castle on the Strip",
    accent: "#c9a84c",
    accentDark: "#6b3a0a",
    bg: "linear-gradient(160deg, #1a0a00 0%, #2d1000 40%, #1a0505 100%)",
    patternStyle: {
      backgroundImage: `repeating-linear-gradient(0deg,rgba(201,168,76,0.1) 0,rgba(201,168,76,0.1) 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,rgba(201,168,76,0.1) 0,rgba(201,168,76,0.1) 1px,transparent 1px,transparent 32px)`,
    },
    headerBg: "rgba(26,5,0,0.92)",
    bubbleBg: "rgba(80,30,0,0.7)",
    bubbleBorder: "1px solid rgba(201,168,76,0.35)",
    userBg: "#8b0000",
    userColor: "#ffd700",
    inputBg: "rgba(201,168,76,0.07)",
    inputBorder: "rgba(201,168,76,0.3)",
    titleClass: "castle-flicker",
    font: "'Cinzel', serif",
    bodyFont: "'IM Fell English', Georgia, serif",
    systemPrompt: `You are a grand herald of Excalibur Castle hotel in Las Vegas. Speak in regal medieval English using "hark", "forsooth", "thou", "thee", "dost", "verily", "milord", "milady", "prithee". Reference the castle's grand towers, jousting tournaments, feasts, and knights. Be helpful and enthusiastic about the hotel's medieval theme. If the user shares an image, describe or respond to it in your medieval voice. Keep responses vivid and in character, 2-4 sentences.`,
  },
  {
    id: "luxor",
    name: "Luxor",
    emoji: "🔺",
    tagline: "The ancient pyramid awakens to serve you.",
    subtitle: "Las Vegas Blvd · The Great Pyramid Hotel",
    accent: "#d4af37",
    accentDark: "#0a0800",
    bg: "linear-gradient(160deg, #0a0800 0%, #1a1200 50%, #0f0c00 100%)",
    patternStyle: {
      backgroundImage: `repeating-linear-gradient(60deg,rgba(212,175,55,0.08) 0,rgba(212,175,55,0.08) 1px,transparent 1px,transparent 28px),repeating-linear-gradient(120deg,rgba(212,175,55,0.08) 0,rgba(212,175,55,0.08) 1px,transparent 1px,transparent 28px)`,
    },
    headerBg: "rgba(10,8,0,0.95)",
    bubbleBg: "rgba(40,30,0,0.8)",
    bubbleBorder: "1px solid rgba(212,175,55,0.3)",
    userBg: "linear-gradient(135deg, #b8860b, #d4af37)",
    userColor: "#0a0800",
    inputBg: "rgba(212,175,55,0.05)",
    inputBorder: "rgba(212,175,55,0.25)",
    titleClass: "pyramid-glow",
    font: "'Cinzel', serif",
    bodyFont: "'Cormorant Garamond', serif",
    systemPrompt: `You are the mystical oracle of the Luxor pyramid hotel in Las Vegas. Speak with ancient Egyptian gravitas — reference pharaohs, the Sphinx, Ra and the sun gods, sacred mysteries. Also discuss the hotel's famous sky beam, the King Tut museum, and its nightlife. Use poetic, timeless language. If the user shares an image, interpret it through an ancient Egyptian lens. 2-4 sentences, mysterious yet welcoming.`,
  },
  {
    id: "bellagio",
    name: "Bellagio",
    emoji: "⛲",
    tagline: "Benvenuti. The fountains dance for you.",
    subtitle: "Las Vegas Blvd · An Icon of Elegance",
    accent: "#8fb8d4",
    accentDark: "#0f1d2e",
    bg: "linear-gradient(160deg, #080d14 0%, #0f1d2e 50%, #060c18 100%)",
    patternStyle: {
      backgroundImage: `radial-gradient(ellipse 80px 40px at 0 0, rgba(143,184,212,0.08) 0, transparent 70%)`,
      backgroundSize: "80px 40px",
    },
    headerBg: "rgba(8,13,20,0.94)",
    bubbleBg: "rgba(15,30,50,0.8)",
    bubbleBorder: "1px solid rgba(143,184,212,0.3)",
    userBg: "linear-gradient(135deg, #1a3a5c, #2e5f8a)",
    userColor: "#e8f4fd",
    inputBg: "rgba(143,184,212,0.06)",
    inputBorder: "rgba(143,184,212,0.25)",
    titleClass: "fountain-title",
    font: "'Cormorant Garamond', serif",
    bodyFont: "'Playfair Display', serif",
    systemPrompt: `You are the refined concierge at the legendary Bellagio hotel in Las Vegas. Speak with Italian elegance, dropping occasional Italian phrases like "benvenuti", "bellissimo", "magnifico", "prego". Reference the dancing fountains, fine art gallery, Cirque du Soleil, renowned restaurants, and conservatory. If the user shares an image, admire it with sophistication. Be gracious and refined. 2-4 sentences.`,
  },
  {
    id: "nynyc",
    name: "New York New York",
    emoji: "🗽",
    tagline: "Fuggedaboutit — welcome to the city!",
    subtitle: "Las Vegas Blvd · The Big Apple on the Strip",
    accent: "#ff3b3b",
    accentDark: "#1a0000",
    bg: "linear-gradient(160deg, #0a0a0f 0%, #141420 50%, #0a0a14 100%)",
    patternStyle: {
      backgroundImage: `repeating-linear-gradient(0deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 48px),repeating-linear-gradient(90deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 48px)`,
    },
    headerBg: "rgba(10,10,15,0.95)",
    bubbleBg: "rgba(20,20,35,0.85)",
    bubbleBorder: "1px solid rgba(255,59,59,0.3)",
    userBg: "linear-gradient(135deg, #cc0000, #ff3b3b)",
    userColor: "#fff",
    inputBg: "rgba(255,255,255,0.04)",
    inputBorder: "rgba(255,59,59,0.3)",
    titleClass: "neon-text",
    font: "'Oswald', sans-serif",
    bodyFont: "'Raleway', sans-serif",
    systemPrompt: `You are a fast-talking, big-hearted New Yorker working at New York-New York Hotel & Casino in Las Vegas. Say "fuggedaboutit", "howyadoin", reference the Brooklyn Bridge replica, roller coaster, great pizza and deli. If the user shares an image, react to it like a true New Yorker — loud, enthusiastic, opinionated. Be warm, funny. 2-4 punchy sentences.`,
  },
  {
    id: "fontainebleau",
    name: "Fontainebleau",
    emoji: "💎",
    tagline: "Where modern luxury meets the extraordinary.",
    subtitle: "Las Vegas Blvd · The New Crown Jewel",
    accent: "#c8c8dc",
    accentDark: "#0a0a14",
    bg: "linear-gradient(160deg, #080810 0%, #10101e 50%, #080812 100%)",
    patternStyle: {
      backgroundImage: `repeating-linear-gradient(45deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 24px),repeating-linear-gradient(-45deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 24px)`,
    },
    headerBg: "rgba(8,8,16,0.96)",
    bubbleBg: "rgba(16,16,30,0.85)",
    bubbleBorder: "1px solid rgba(200,200,220,0.15)",
    userBg: "linear-gradient(135deg, #2a2a4a, #3a3a5a)",
    userColor: "#e8e8f8",
    inputBg: "rgba(255,255,255,0.03)",
    inputBorder: "rgba(200,200,220,0.2)",
    titleClass: "",
    font: "'Raleway', sans-serif",
    bodyFont: "'Cormorant Garamond', serif",
    systemPrompt: `You are the ultra-sophisticated digital concierge of Fontainebleau Las Vegas. Speak with cool, understated modern luxury: minimal words, maximum impact. Reference the 67-story tower, world-class spa, pools, celebrity chef restaurants, nightlife, breathtaking views. If the user shares an image, respond with refined, discerning taste. 2-4 sentences, polished and precise.`,
  },
  {
    id: "santafe",
    name: "Santa Fe Station",
    emoji: "🌵",
    tagline: "Howdy, partner. Pull up a chair.",
    subtitle: "Rancho Dr · Where the West Is Won",
    accent: "#e07840",
    accentDark: "#1a0805",
    bg: "linear-gradient(160deg, #0f0805 0%, #1e1008 50%, #100c06 100%)",
    patternStyle: {
      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(224,120,64,0.12) 1px, transparent 0)`,
      backgroundSize: "20px 20px",
    },
    headerBg: "rgba(15,8,5,0.95)",
    bubbleBg: "rgba(40,20,8,0.8)",
    bubbleBorder: "1px solid rgba(224,120,64,0.3)",
    userBg: "linear-gradient(135deg, #8b4513, #c1622a)",
    userColor: "#fdf5e6",
    inputBg: "rgba(224,120,64,0.06)",
    inputBorder: "rgba(224,120,64,0.3)",
    titleClass: "",
    font: "'Playfair Display', serif",
    bodyFont: "'Dancing Script', cursive",
    systemPrompt: `You are the friendly host at Santa Fe Station Hotel & Casino in Las Vegas. Speak with easy-going Western warmth: "partner", "y'all", "howdy", "reckon". Reference the Southwest décor, bowling alley, BBQ and Tex-Mex, and the lively casino floor. If the user shares an image, react warmly like a friendly local would. 2-4 sentences, warm as a desert sunset.`,
  },
];

type Hotel = (typeof HOTELS)[0];

/* ─── Hotel Selector ─── */
function HotelSelector({
  active,
  onSelect,
}: {
  active: Hotel;
  onSelect: (h: Hotel) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(10px)",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "linear-gradient(160deg,#08080f,#121220)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: "28px 24px",
          maxWidth: 460,
          width: "100%",
          boxShadow: "0 50px 100px rgba(0,0,0,0.9)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 24,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "0.16em",
              marginBottom: 4,
            }}
          >
            LAS VEGAS
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            Select Your Hotel Concierge
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {HOTELS.map((h) => {
            const isActive = active.id === h.id;
            return (
              <button
                key={h.id}
                onClick={() => onSelect(h)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "11px 14px",
                  borderRadius: 12,
                  cursor: "pointer",
                  textAlign: "left",
                  background: isActive
                    ? `${h.accent}18`
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? h.accent + "60" : "rgba(255,255,255,0.07)"}`,
                  transition: "all 0.2s",
                  outline: "none",
                }}
              >
                <span style={{ fontSize: 26, lineHeight: 1 }}>{h.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: h.font,
                      fontSize: 14,
                      fontWeight: 700,
                      color: isActive ? h.accent : "#ddd",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {h.name}
                  </div>
                  <div
                    style={{
                      fontFamily: h.bodyFont,
                      fontSize: 11,
                      color: "rgba(255,255,255,0.35)",
                      marginTop: 1,
                    }}
                  >
                    {h.subtitle}
                  </div>
                </div>
                {isActive && (
                  <span
                    style={{
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 99,
                      background: `${h.accent}22`,
                      color: h.accent,
                      fontFamily: "'Cinzel', serif",
                      letterSpacing: "0.1em",
                      flexShrink: 0,
                    }}
                  >
                    ✦
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Image Preview Strip ─── */
function ImagePreviewStrip({
  images,
  onRemove,
  accent,
}: {
  images: ImageAttachment[];
  onRemove: (i: number) => void;
  accent: string;
}) {
  if (images.length === 0) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        padding: "8px 16px 0",
        flexWrap: "wrap",
      }}
    >
      {images.map((img, i) => (
        <div
          key={i}
          style={{
            position: "relative",
            width: 64,
            height: 64,
            borderRadius: 10,
            overflow: "hidden",
            border: `1px solid ${accent}50`,
            flexShrink: 0,
          }}
        >
          <img
            src={img.previewUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <button
            onClick={() => onRemove(i)}
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.75)",
              border: "none",
              color: "#fff",
              fontSize: 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Utility: file → ImageAttachment ─── */
function fileToAttachment(file: File): Promise<ImageAttachment> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/"))
      return reject(new Error("Not an image"));
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      resolve({
        base64,
        mediaType: file.type as ImageAttachment["mediaType"],
        previewUrl: dataUrl,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ─── Main App ─── */
const SESSION_ID = crypto.randomUUID();

function App() {
  const [hotel, setHotel] = useState<Hotel>(HOTELS[0]);
  const [showSelector, setShowSelector] = useState(true);
  const { messages, streaming, sendMessage } = useChat(
    SESSION_ID,
    hotel.systemPrompt,
  );
  const [input, setInput] = useState("");
  const [pendingImages, setPendingImages] = useState<ImageAttachment[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Paste images from clipboard */
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items ?? []);
      const imageItems = items.filter((item) => item.type.startsWith("image/"));
      if (imageItems.length === 0) return;
      e.preventDefault();
      const attachments = await Promise.all(
        imageItems.map((item) => fileToAttachment(item.getAsFile()!)),
      );
      setPendingImages((prev) => [...prev, ...attachments].slice(0, 4));
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 4);
    const attachments = await Promise.all(imageFiles.map(fileToAttachment));
    setPendingImages((prev) => [...prev, ...attachments].slice(0, 4));
  };

  const handleSend = () => {
    if ((!input.trim() && pendingImages.length === 0) || streaming) return;
    sendMessage(
      input.trim(),
      pendingImages.length > 0 ? pendingImages : undefined,
    );
    setInput("");
    setPendingImages([]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSelectHotel = (h: Hotel) => {
    setHotel(h);
    setShowSelector(false);
    setPendingImages([]);
  };

  const h = hotel;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: h.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "background 0.8s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          ...h.patternStyle,
        }}
      />

      {/* Drag overlay */}
      {dragOver && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            border: `3px dashed ${h.accent}`,
            borderRadius: 0,
            background: `${h.accent}10`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(2px)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: h.font,
              fontSize: 22,
              color: h.accent,
              letterSpacing: "0.1em",
              textShadow: `0 0 20px ${h.accent}`,
            }}
          >
            DROP IMAGE TO ATTACH
          </div>
        </div>
      )}

      {/* Hotel selector */}
      {showSelector && (
        <HotelSelector active={h} onSelect={handleSelectHotel} />
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Chat container */}
      <div
        style={{
          width: "100%",
          maxWidth: 660,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            background: h.headerBg,
            borderBottom: `1px solid ${h.accent}20`,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontSize: 34,
                lineHeight: 1,
                filter: `drop-shadow(0 0 10px ${h.accent}70)`,
              }}
            >
              {h.emoji}
            </span>
            <div>
              <h1
                className={h.titleClass}
                style={{
                  fontFamily: h.font,
                  fontSize: 19,
                  fontWeight: 900,
                  color: h.accent,
                  letterSpacing: "0.1em",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {h.name.toUpperCase()}
              </h1>
              <p
                style={{
                  fontFamily: h.bodyFont,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.3)",
                  margin: "3px 0 0",
                  letterSpacing: "0.08em",
                }}
              >
                {h.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSelector(true)}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 10,
              letterSpacing: "0.12em",
              padding: "6px 14px",
              borderRadius: 99,
              background: `${h.accent}12`,
              border: `1px solid ${h.accent}35`,
              color: h.accent,
              cursor: "pointer",
              outline: "none",
            }}
          >
            SWITCH HOTEL
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.55,
                textAlign: "center",
                gap: 14,
                padding: "40px 20px",
              }}
            >
              <span
                style={{
                  fontSize: 62,
                  filter: `drop-shadow(0 0 16px ${h.accent}70)`,
                }}
              >
                {h.emoji}
              </span>
              <p
                style={{
                  fontFamily: h.bodyFont,
                  fontSize: 17,
                  color: h.accent,
                  fontStyle: "italic",
                  maxWidth: 320,
                  lineHeight: 1.6,
                }}
              >
                "{h.tagline}"
              </p>
              <p
                style={{
                  fontFamily: h.font,
                  fontSize: 10,
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.2em",
                }}
              >
                TYPE OR DROP AN IMAGE TO BEGIN
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className="msg-enter"
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                alignItems: "flex-end",
                gap: 8,
              }}
            >
              {msg.role === "assistant" && (
                <span
                  style={{
                    fontSize: 20,
                    lineHeight: 1,
                    marginBottom: 4,
                    filter: `drop-shadow(0 0 6px ${h.accent}60)`,
                    flexShrink: 0,
                  }}
                >
                  {h.emoji}
                </span>
              )}
              <div
                style={{
                  maxWidth: "74%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {/* Attached images in message */}
                {msg.images && msg.images.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      flexWrap: "wrap",
                      justifyContent:
                        msg.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    {msg.images.map((img: ImageAttachment, j: number) => (
                      <img
                        key={j}
                        src={img.previewUrl}
                        alt=""
                        style={{
                          maxWidth: 200,
                          maxHeight: 200,
                          borderRadius: 12,
                          objectFit: "cover",
                          border: `1px solid ${h.accent}40`,
                        }}
                      />
                    ))}
                  </div>
                )}
                {/* Text bubble (only if there's text) */}
                {msg.content && (
                  <div
                    style={{
                      padding: "11px 16px",
                      borderRadius:
                        msg.role === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                      fontSize: 14,
                      lineHeight: 1.7,
                      fontFamily: h.bodyFont,
                      background: msg.role === "user" ? h.userBg : h.bubbleBg,
                      color:
                        msg.role === "user"
                          ? h.userColor
                          : "rgba(255,255,255,0.87)",
                      border: msg.role === "user" ? "none" : h.bubbleBorder,
                      boxShadow: "0 2px 14px rgba(0,0,0,0.5)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                    {msg.role === "assistant" &&
                      streaming &&
                      i === messages.length - 1 && (
                        <span
                          className="cursor-blink"
                          style={{ color: h.accent, marginLeft: 2 }}
                        >
                          ▋
                        </span>
                      )}
                  </div>
                )}
                {/* Streaming cursor when message is image-only so far */}
                {!msg.content &&
                  msg.role === "assistant" &&
                  streaming &&
                  i === messages.length - 1 && (
                    <div
                      style={{
                        padding: "11px 16px",
                        borderRadius: "18px 18px 18px 4px",
                        background: h.bubbleBg,
                        border: h.bubbleBorder,
                      }}
                    >
                      <span
                        className="cursor-blink"
                        style={{ color: h.accent }}
                      >
                        ▋
                      </span>
                    </div>
                  )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Image preview strip */}
        <ImagePreviewStrip
          images={pendingImages}
          onRemove={(i) =>
            setPendingImages((prev) => prev.filter((_, idx) => idx !== i))
          }
          accent={h.accent}
        />

        {/* Input bar */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "10px 16px 20px",
            borderTop: `1px solid ${h.accent}15`,
            flexShrink: 0,
            alignItems: "flex-end",
          }}
        >
          {/* Image attach button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Attach image (or paste / drag & drop)"
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: `${h.accent}12`,
              border: `1px solid ${h.accent}30`,
              color: h.accent,
              cursor: "pointer",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              transition: "all 0.2s",
            }}
          >
            🖼️
          </button>

          <input
            style={{
              flex: 1,
              background: h.inputBg,
              border: `1px solid ${h.inputBorder}`,
              borderRadius: 14,
              padding: "12px 16px",
              fontSize: 14,
              color: "#f0f0f0",
              fontFamily: h.bodyFont,
              outline: "none",
              opacity: streaming ? 0.5 : 1,
            }}
            placeholder={
              pendingImages.length > 0
                ? `Add a caption or just hit Send…`
                : `Ask your ${h.name} concierge…`
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={streaming}
          />

          <button
            onClick={handleSend}
            disabled={
              streaming || (!input.trim() && pendingImages.length === 0)
            }
            style={{
              padding: "12px 22px",
              borderRadius: 14,
              border: "none",
              cursor:
                streaming || (!input.trim() && pendingImages.length === 0)
                  ? "not-allowed"
                  : "pointer",
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              background: `linear-gradient(135deg, ${h.accent}, ${h.accent}bb)`,
              color: h.accentDark,
              opacity:
                streaming || (!input.trim() && pendingImages.length === 0)
                  ? 0.3
                  : 1,
              transition: "all 0.2s",
              boxShadow: `0 4px 20px ${h.accent}50`,
              height: 42,
            }}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
