import { useState, useRef, useEffect } from "react";
import { useChat } from "./hooks/useChat";

// ── Asset imports ─────────────────────────────────────────────────────────────
import cowboyUrl from "./assets/cowboy.svg";
import horusUrl from "./assets/horus.svg";
import knightUrl from "./assets/knight.svg";
import caesarUrl from "./assets/caesar.svg";
import parrotUrl from "./assets/parrot.svg";
import defaultUrl from "./assets/default.svg";
import jesterUrl from "./assets/jester_nobg.png";

// ── Hotel definitions ─────────────────────────────────────────────────────────
const HOTELS = [
  {
    id: "santafe",
    name: "Santa Fe Station",
    shortName: "Santa Fe Station",
    icon: cowboyUrl,
    tagline: "Locals' favorite, heart of the valley",
    theme: "santafe",
    accent: "#D97B3A",
    accentSoft: "#f0ad72",
    bg: "linear-gradient(160deg, #160900 0%, #2b1200 45%, #190d00 100%)",
    bubbleUser: "#3d1a00",
    bubbleBot: "#1c0d00",
    border: "#D97B3A",
    headerBg: "rgba(22,9,0,0.90)",
    pattern: "stars",
    presets: [
      {
        label: "🎳 Bowling",
        text: "Tell me about the bowling alley — lanes, hours, and cosmic bowling nights.",
      },
      {
        label: "🎬 Movies",
        text: "What films are playing at the Regal Cinemas on the property right now?",
      },
      {
        label: "🍤 Oyster Bar",
        text: "What's the Oyster Bar famous for, and do I need a reservation?",
      },
      {
        label: "🃏 Video Poker",
        text: "Which video poker machines have the best pay tables here?",
      },
      {
        label: "❄️ Ice Skating",
        text: "Does Santa Fe Station have an ice skating rink? How do I get on the ice?",
      },
      {
        label: "🎁 Rewards",
        text: "How does the Boarding Pass loyalty program work and how do I sign up?",
      },
    ],
  },
  {
    id: "luxor",
    name: "Luxor",
    shortName: "Luxor",
    icon: horusUrl,
    tagline: "Where the mysteries of Egypt await",
    theme: "luxor",
    accent: "#D4AF37",
    accentSoft: "#edd97a",
    bg: "linear-gradient(160deg, #000000 0%, #0c0c00 45%, #000900 100%)",
    bubbleUser: "#1a1600",
    bubbleBot: "#080800",
    border: "#D4AF37",
    headerBg: "rgba(0,0,0,0.93)",
    pattern: "pyramids",
    presets: [
      {
        label: "🔦 Sky Beam",
        text: "Tell me the secrets of the great Sky Beam — how powerful is it really?",
      },
      {
        label: "🛗 Inclinators",
        text: "What are the inclinators and what is it like to ride them to my pyramid room?",
      },
      {
        label: "💀 Bodies Exhibit",
        text: "What will I discover in Bodies: The Exhibition?",
      },
      {
        label: "🚢 Titanic",
        text: "What authentic artifacts from the Titanic can I see at the exhibition?",
      },
      {
        label: "🎭 Carrot Top",
        text: "Tell me about Carrot Top's show — is it right for me?",
      },
      {
        label: "🌙 Room Types",
        text: "What makes a pyramid room different from a tower room?",
      },
    ],
  },
  {
    id: "excalibur",
    name: "Excalibur",
    shortName: "Excalibur",
    icon: knightUrl,
    tagline: "Where legends and chivalry reign",
    theme: "excalibur",
    accent: "#B8242E",
    accentSoft: "#e06068",
    bg: "linear-gradient(160deg, #0d0003 0%, #1c0008 45%, #0a0005 100%)",
    bubbleUser: "#2d000c",
    bubbleBot: "#110006",
    border: "#B8242E",
    headerBg: "rgba(13,0,3,0.90)",
    pattern: "shields",
    presets: [
      {
        label: "⚔️ Tournament",
        text: "Tell me everything about the Tournament of Kings dinner show — what happens?",
      },
      {
        label: "🐉 Dragons",
        text: "Are there real dragons at Excalibur? What fire-breathing spectacles await me?",
      },
      {
        label: "🎮 Fun Dungeon",
        text: "What games and attractions are in the Fun Dungeon arcade?",
      },
      {
        label: "🏰 Castle Rooms",
        text: "What room types does Excalibur offer and which has the best views?",
      },
      {
        label: "🔗 Connections",
        text: "How do I get from Excalibur to Luxor and Mandalay Bay without going outside?",
      },
      {
        label: "💰 Best Value",
        text: "Why is Excalibur considered one of the best value stays on the Strip?",
      },
    ],
  },
  {
    id: "caesars",
    name: "Caesars Palace",
    shortName: "Caesars Palace",
    icon: caesarUrl,
    tagline: "All roads lead to the Palace",
    theme: "caesars",
    accent: "#C5A028",
    accentSoft: "#e8cc72",
    bg: "linear-gradient(160deg, #080600 0%, #140e00 45%, #0a0800 100%)",
    bubbleUser: "#241c00",
    bubbleBot: "#0e0b00",
    border: "#C5A028",
    headerBg: "rgba(8,6,0,0.90)",
    pattern: "columns",
    presets: [
      {
        label: "🍽️ Guy Savoy",
        text: "Tell me about Restaurant Guy Savoy — what makes it worthy of Michelin stars?",
      },
      {
        label: "🛁 Qua Spa",
        text: "What awaits me at Qua Baths & Spa — the Roman baths, the ice room?",
      },
      {
        label: "🏟️ Colosseum",
        text: "What legendary performers have graced the Colosseum at Caesars Palace?",
      },
      {
        label: "🛍️ Forum Shops",
        text: "Which luxury brands can I find at the Forum Shops and what are the must-sees?",
      },
      {
        label: "🏊 Pool Oasis",
        text: "Tell me about the Garden of the Gods — which pool should I choose?",
      },
      {
        label: "🃏 Baccarat",
        text: "I've heard Caesars is famous for high-stakes baccarat. What should I know?",
      },
    ],
  },
  {
    id: "treasureisland",
    name: "Treasure Island",
    shortName: "Treasure Island",
    icon: parrotUrl,
    tagline: "Adventure and excitement on the Strip",
    theme: "treasureisland",
    accent: "#2A7FBF",
    accentSoft: "#6ab4e8",
    bg: "linear-gradient(160deg, #000a14 0%, #001828 45%, #000c1a 100%)",
    bubbleUser: "#001830",
    bubbleBot: "#000d1a",
    border: "#2A7FBF",
    headerBg: "rgba(0,10,20,0.90)",
    pattern: "waves",
    presets: [
      {
        label: "🎪 Mystère",
        text: "What makes Mystère by Cirque du Soleil so legendary after 30 years?",
      },
      {
        label: "🤠 Gilley's BBQ",
        text: "Tell me about Gilley's — the BBQ, the mechanical bull, the live music.",
      },
      {
        label: "🃏 Blackjack",
        text: "I hear TI has the best blackjack on the Strip. What are the rules here?",
      },
      {
        label: "🦜 Pirate History",
        text: "Tell me about the legendary Buccaneer Bay pirate battle show.",
      },
      {
        label: "🎡 Señor Frog's",
        text: "What kind of chaos awaits me at Señor Frog's Las Vegas?",
      },
      {
        label: "🆓 Free Parking",
        text: "Is parking really free at TI? How does that work on the Strip?",
      },
    ],
  },
];

// One stable session ID per hotel so switching preserves independent histories
const SESSION_IDS = Object.fromEntries(
  HOTELS.map((h) => [h.id, crypto.randomUUID()]),
);

// ── CSS-filter colorizer (tints white SVGs to any hex color) ──────────────────
function hexToFilter(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    delta = max - min;
  let h = 0;
  if (delta) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  const sat = Math.round(s * 100);
  const lit = Math.round(l * 100);
  return `invert(1) sepia(1) saturate(${sat * 3}%) hue-rotate(${h - 30}deg) brightness(${lit + 20}%)`;
}

function SvgIcon({ src, color, size = 24, style = {} }) {
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      style={{
        display: "block",
        width: size,
        height: size,
        filter: hexToFilter(color),
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

// ── Background patterns ───────────────────────────────────────────────────────
function PatternBg({ type, accent }) {
  const c = accent + "14";
  const shapes = {
    stars: (
      <pattern id="pat" width="44" height="44" patternUnits="userSpaceOnUse">
        <polygon
          points="22,4 24,16 36,16 26,23 30,35 22,28 14,35 18,23 8,16 20,16"
          fill="none"
          stroke={c}
          strokeWidth="1"
        />
      </pattern>
    ),
    pyramids: (
      <pattern id="pat" width="50" height="44" patternUnits="userSpaceOnUse">
        <polygon
          points="25,4 48,40 2,40"
          fill="none"
          stroke={c}
          strokeWidth="1"
        />
      </pattern>
    ),
    shields: (
      <pattern id="pat" width="40" height="46" patternUnits="userSpaceOnUse">
        <path
          d="M20 4 L36 10 L36 28 L20 42 L4 28 L4 10 Z"
          fill="none"
          stroke={c}
          strokeWidth="1"
        />
      </pattern>
    ),
    columns: (
      <pattern id="pat" width="32" height="54" patternUnits="userSpaceOnUse">
        <rect
          x="11"
          y="6"
          width="10"
          height="42"
          fill="none"
          stroke={c}
          strokeWidth="1"
        />
        <rect
          x="7"
          y="4"
          width="18"
          height="4"
          fill="none"
          stroke={c}
          strokeWidth="1"
        />
        <rect
          x="7"
          y="46"
          width="18"
          height="4"
          fill="none"
          stroke={c}
          strokeWidth="1"
        />
      </pattern>
    ),
    waves: (
      <pattern id="pat" width="54" height="26" patternUnits="userSpaceOnUse">
        <path
          d="M0 13 Q13.5 0 27 13 Q40.5 26 54 13"
          fill="none"
          stroke={c}
          strokeWidth="1"
        />
      </pattern>
    ),
  };
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <defs>{shapes[type]}</defs>
      <rect width="100%" height="100%" fill="url(#pat)" />
    </svg>
  );
}

// ── Landing page ──────────────────────────────────────────────────────────────
function LandingPage({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  const n = HOTELS.length;
  const positions = HOTELS.map((_, i) => ((i + 0.5) / n) * 100);

  // Starfield canvas — gold + blue twinkling particles
  useEffect(() => {
    const canvas = document.getElementById("starfield");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const COLORS = [
      "rgba(212,175,55,",
      "rgba(212,175,55,",
      "rgba(42,127,191,",
      "rgba(180,210,255,",
    ];
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      alpha: Math.random(),
      dAlpha: Math.random() * 0.008 + 0.002,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.alpha += s.dAlpha;
        if (s.alpha > 1 || s.alpha < 0) s.dAlpha *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color + s.alpha.toFixed(2) + ")";
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="landing">
      {/* Layered background */}
      <div className="landing-bg" />
      <div className="landing-orbs">
        <div className="orb orb-gold-tl" />
        <div className="orb orb-blue-br" />
        <div className="orb orb-gold-mid" />
        <div className="orb orb-blue-tl" />
      </div>
      {/* Animated star-field */}
      <canvas className="starfield" id="starfield" />
      {/* Decorative ruled lines */}
      <div className="ruled-lines">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="ruled-line" style={{ "--i": i }} />
        ))}
      </div>

      <div className="landing-inner">
        <div className="logo-wrap">
          <div className="logo-halo" />
          <div className="logo-ring-outer" />
          <div className="logo-ring-inner" />
          <img
            src={jesterUrl}
            alt="Las Vegas Hotel Concierge"
            className="logo-img"
          />
          <div className="logo-crown">✦ LAS VEGAS ✦</div>
          <div className="logo-title">Hotel Concierge</div>
          <div className="logo-divider">
            <span />
            <span className="logo-divider-gem">◆</span>
            <span />
          </div>
          <div className="logo-sub">Choose your destination</div>
        </div>

        {/* Tree connector SVG */}
        <div className="tree-connector-wrap">
          <svg
            className="tree-svg"
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="trunkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
              </linearGradient>
            </defs>
            <line
              x1="500"
              y1="0"
              x2="500"
              y2="55"
              stroke="url(#trunkGrad)"
              strokeWidth="1.5"
            />
            <line
              x1={`${positions[0] * 10}`}
              y1="55"
              x2={`${positions[n - 1] * 10}`}
              y2="55"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.5"
            />
            {positions.map((pct, i) => (
              <line
                key={i}
                x1={`${pct * 10}`}
                y1="55"
                x2={`${pct * 10}`}
                y2="120"
                stroke={
                  hovered === i ? HOTELS[i].accent : "rgba(255,255,255,0.12)"
                }
                strokeWidth={hovered === i ? "2" : "1.5"}
                style={{ transition: "stroke 0.3s" }}
              />
            ))}
          </svg>
        </div>

        {/* Hotel cards */}
        <div className="cards-row">
          {HOTELS.map((hotel, i) => (
            <button
              key={hotel.id}
              className={`hotel-card ${hovered === i ? "hovered" : ""}`}
              style={{
                "--card-accent": hotel.accent,
                "--card-soft": hotel.accentSoft,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(hotel)}
            >
              <div className="card-glow" />
              <div className="card-icon-ring">
                <SvgIcon
                  src={hotel.icon}
                  color={hovered === i ? hotel.accent : "#888"}
                  size={38}
                />
              </div>
              <div className="card-name">{hotel.name}</div>
              <div className="card-tagline">{hotel.tagline}</div>
              <div className="card-cta">Enter →</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Chat panel ────────────────────────────────────────────────────────────────
// Extracted so key={hotel.id} forces a clean remount on hotel switch,
// resetting local input/image state without touching session history.
function ChatPanel({ hotel }) {
  const sessionId = SESSION_IDS[hotel.id];
  const { messages, streaming, sendMessage } = useChat(sessionId, hotel.theme);

  const [input, setInput] = useState("");
  const [imageBase64, setImgB64] = useState(null);
  const [imagePreview, setPreview] = useState(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      setPreview(r);
      setImgB64(r.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImgB64(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSend = () => {
    if ((!input.trim() && !imageBase64) || streaming) return;
    sendMessage(input.trim(), imageBase64);
    setInput("");
    clearImage();
  };

  const cssVars = {
    "--ha": hotel.accent,
    "--has": hotel.accentSoft,
    "--hbu": hotel.bubbleUser,
    "--hba": hotel.bubbleBot,
    "--hb": hotel.border,
  };

  return (
    <main className="main" style={{ ...cssVars, background: hotel.bg }}>
      <div className="mpat">
        <PatternBg type={hotel.pattern} accent={hotel.accent} />
      </div>

      {/* Header */}
      <header className="hdr" style={{ background: hotel.headerBg }}>
        <div className="hdr-ring">
          <SvgIcon src={hotel.icon} color={hotel.accent} size={30} />
        </div>
        <div className="hdr-div" />
        <div>
          <div className="hdr-name">{hotel.name}</div>
          <div className="hdr-tag">{hotel.tagline}</div>
        </div>
        <div className="hdr-right">
          <div className="live">
            <div className="live-dot" />
            LIVE
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="msgs">
        {messages.length === 0 && (
          <div className="empty">
            <div className="empty-ring">
              <SvgIcon src={hotel.icon} color={hotel.accent} size={48} />
            </div>
            <div className="empty-name">{hotel.name}</div>
            <div className="empty-sub">{hotel.tagline}</div>
            <div className="empty-divider">
              <span />
              <span className="empty-divider-text">Ask me anything</span>
              <span />
            </div>
            <div className="presets">
              {hotel.presets.map((p, i) => (
                <button
                  key={i}
                  className="preset-chip"
                  onClick={() => sendMessage(p.text)}
                  disabled={streaming}
                >
                  <span className="preset-emoji">{p.label.split(" ")[0]}</span>
                  <span className="preset-label">
                    {p.label.split(" ").slice(1).join(" ")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`mrow ${msg.role}`}>
            {msg.role === "assistant" && (
              <div className="av">
                <SvgIcon src={hotel.icon} color={hotel.accent} size={18} />
              </div>
            )}
            <div className="bwrap">
              <span className="blabel">
                {msg.role === "user" ? "You" : hotel.shortName}
              </span>
              <div className={`bubble ${msg.role}`}>
                {msg.image && <img src={msg.image} alt="attachment" />}
                {msg.content}
                {msg.role === "assistant" &&
                  streaming &&
                  i === messages.length - 1 && <span className="cur">▋</span>}
              </div>
            </div>
            {msg.role === "user" && (
              <div className="av uav">
                <SvgIcon src={defaultUrl} color="#aaaaaa" size={18} />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="prev-zone">
          <div className="prev-inner">
            <img src={imagePreview} alt="preview" />
            <button className="prev-rm" onClick={clearImage}>
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="ibar">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFile}
        />

        {/* Attach button */}
        <div className="ibar-slot">
          <span className="ibar-label">Image</span>
          <button
            className="att"
            onClick={() => fileRef.current?.click()}
            disabled={streaming}
            title="Attach image"
          >
            <span className="att-icon">📎</span>
            <span className="att-text">Attach</span>
          </button>
        </div>

        {/* Text input */}
        <div className="ibar-slot ibar-slot-grow">
          <span className="ibar-label">Message</span>
          <textarea
            ref={textareaRef}
            className="ti"
            placeholder={`Ask ${hotel.name} anything… (Enter to send)`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={streaming}
            rows={1}
          />
        </div>

        {/* Send button */}
        <div className="ibar-slot">
          <span className="ibar-label">Send</span>
          <button
            className="sbtn"
            onClick={handleSend}
            disabled={streaming || (!input.trim() && !imageBase64)}
          >
            <span className="sbtn-icon">{streaming ? "⟳" : "➤"}</span>
            <span className="sbtn-text">{streaming ? "Sending…" : "Send"}</span>
          </button>
        </div>
      </div>
    </main>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [hotel, setHotel] = useState(null); // null = landing
  const [pendingHotel, setPending] = useState(null);
  const [showModal, setModal] = useState(false);

  const requestSwitch = (h) => {
    if (!hotel || h.id === hotel.id) return;
    setPending(h);
    setModal(true);
  };
  const confirmSwitch = () => {
    setHotel(pendingHotel);
    setModal(false);
    setPending(null);
  };
  const cancelSwitch = () => {
    setModal(false);
    setPending(null);
  };

  if (!hotel) {
    return (
      <>
        <GlobalStyles />
        <LandingPage onSelect={setHotel} />
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <div
        className="app"
        style={{ "--ha": hotel.accent, "--hb": hotel.border }}
      >
        {/* Sidebar */}
        <aside className="sb">
          <button className="sb-home" onClick={() => setHotel(null)}>
            <img src={jesterUrl} alt="home" className="sb-jester" />
            <div className="sb-logo">
              <b>Las Vegas</b>
              Concierge
            </div>
          </button>
          <div className="hotel-list">
            {HOTELS.map((h) => (
              <button
                key={h.id}
                className={`hi ${h.id === hotel.id ? "active" : ""}`}
                style={{ "--ia": h.accent }}
                onClick={() => requestSwitch(h)}
              >
                <div className="hi-ico">
                  <SvgIcon
                    src={h.icon}
                    color={h.id === hotel.id ? h.accent : "#555"}
                    size={26}
                  />
                </div>
                <div className="hi-txt">
                  <span className="hi-name">{h.shortName}</span>
                  <span className="hi-sub">{h.tagline}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* key forces full remount on hotel switch */}
        <ChatPanel key={hotel.id} hotel={hotel} />
      </div>

      {/* Switch modal */}
      {showModal && pendingHotel && (
        <div
          className="moverlay"
          style={{ "--ma": pendingHotel.accent }}
          onClick={cancelSwitch}
        >
          <div className="mbox" onClick={(e) => e.stopPropagation()}>
            <div className="micon-ring">
              <SvgIcon
                src={pendingHotel.icon}
                color={pendingHotel.accent}
                size={38}
              />
            </div>
            <div className="mtitle">{pendingHotel.name}</div>
            <div className="mdesc">
              Switch from <strong>{hotel.shortName}</strong> to{" "}
              <strong>{pendingHotel.shortName}</strong>?
              <br />
              Your current conversation will be cleared.
            </div>
            <div className="macts">
              <button className="mstay" onClick={cancelSwitch}>
                Stay
              </button>
              <button className="mgo" onClick={confirmSwitch}>
                Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Global styles ─────────────────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@400;600&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=IM+Fell+English:ital@1&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; overflow: hidden; background: #000; }

      /* ─── LANDING ───────────────────────────────────────────────────────── */
      .landing {
        height: 100vh; overflow-y: auto; overflow-x: hidden;
        background: #020408;
        display: flex; align-items: flex-start; justify-content: center;
        padding: 52px 24px 72px;
      }

      /* Deep layered background */
      .landing-bg {
        position: fixed; inset: 0; pointer-events: none; z-index: 0;
        background:
          radial-gradient(ellipse 70% 55% at 15% 10%,  rgba(212,175,55,0.09)  0%, transparent 65%),
          radial-gradient(ellipse 55% 45% at 85% 85%,  rgba(42,127,191,0.12)  0%, transparent 65%),
          radial-gradient(ellipse 40% 35% at 75% 15%,  rgba(42,127,191,0.07)  0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 30% 80%,  rgba(212,175,55,0.06)  0%, transparent 60%),
          radial-gradient(ellipse 100% 60% at 50% 50%, rgba(5,12,28,0.95)     0%, transparent 100%);
      }

      /* Animated soft orbs */
      .landing-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
      .orb { position: absolute; border-radius: 50%; filter: blur(80px); }
      .orb-gold-tl  { width: 500px; height: 500px; top: -120px; left: -100px;  background: rgba(212,175,55,0.10); animation: orbFloat 14s ease-in-out infinite; }
      .orb-blue-br  { width: 600px; height: 600px; bottom: -150px; right: -120px; background: rgba(42,127,191,0.13); animation: orbFloat 18s ease-in-out infinite reverse; }
      .orb-gold-mid { width: 300px; height: 300px; top: 40%; left: 60%;  background: rgba(212,175,55,0.06); animation: orbFloat 22s ease-in-out infinite 4s; }
      .orb-blue-tl  { width: 280px; height: 280px; top: 20%; left: 10%; background: rgba(42,127,191,0.08); animation: orbFloat 16s ease-in-out infinite 2s; }
      @keyframes orbFloat {
        0%,100% { transform: translate(0,0) scale(1); }
        33%     { transform: translate(30px,-20px) scale(1.05); }
        66%     { transform: translate(-20px,25px) scale(0.97); }
      }

      /* Twinkling starfield */
      .starfield { position: fixed; inset: 0; pointer-events: none; z-index: 0; }

      /* Ruled diagonal lines — subtle Art Deco grid */
      .ruled-lines { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
      .ruled-line {
        position: absolute; left: -50%; right: -50%;
        height: 1px;
        top: calc(8% + var(--i) * 13%);
        background: linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.04) 30%, rgba(42,127,191,0.06) 60%, transparent 100%);
        transform: rotate(-6deg);
      }

      .landing-inner {
        position: relative; z-index: 1;
        width: 100%; max-width: 1140px;
        display: flex; flex-direction: column; align-items: center;
      }

      /* ── LOGO ─────────────────────────────────────────────────────────────── */
      .logo-wrap {
        display: flex; flex-direction: column; align-items: center;
        position: relative; margin-bottom: 4px;
      }

      /* Big atmospheric halo behind the image */
      .logo-halo {
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 520px; height: 520px; border-radius: 50%;
        background: radial-gradient(circle,
          rgba(212,175,55,0.14) 0%,
          rgba(42,127,191,0.08) 45%,
          transparent 70%);
        filter: blur(40px);
        pointer-events: none; z-index: 0;
        animation: haloPulse 5s ease-in-out infinite;
      }
      @keyframes haloPulse {
        0%,100% { opacity: 0.8; transform: translate(-50%,-50%) scale(1); }
        50%      { opacity: 1;   transform: translate(-50%,-50%) scale(1.06); }
      }

      /* Decorative rotating outer ring */
      .logo-ring-outer {
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%,-50%);
        width: 260px; height: 260px; border-radius: 50%;
        border: 1px solid rgba(212,175,55,0.18);
        box-shadow: 0 0 30px -5px rgba(212,175,55,0.2), inset 0 0 30px -5px rgba(42,127,191,0.1);
        animation: ringRotate 30s linear infinite;
        pointer-events: none; z-index: 0;
      }
      .logo-ring-inner {
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%,-50%);
        width: 222px; height: 222px; border-radius: 50%;
        border: 1px dashed rgba(42,127,191,0.22);
        animation: ringRotate 20s linear infinite reverse;
        pointer-events: none; z-index: 0;
      }
      @keyframes ringRotate { to { transform: translate(-50%,-50%) rotate(360deg); } }

      .logo-img {
        width: 200px; height: 200px;
        border-radius: 50%; object-fit: cover;
        border: 2px solid rgba(212,175,55,0.55);
        box-shadow:
          0 0 0 6px rgba(212,175,55,0.06),
          0 0 0 12px rgba(42,127,191,0.06),
          0 0 60px -8px rgba(212,175,55,0.6),
          0 0 100px -20px rgba(42,127,191,0.4);
        position: relative; z-index: 1;
        animation: logoPulse 4s ease-in-out infinite;
      }
      @keyframes logoPulse {
        0%,100% { box-shadow: 0 0 0 6px rgba(212,175,55,0.06), 0 0 0 12px rgba(42,127,191,0.06), 0 0 60px -8px rgba(212,175,55,0.5), 0 0 100px -20px rgba(42,127,191,0.35); }
        50%      { box-shadow: 0 0 0 6px rgba(212,175,55,0.10), 0 0 0 12px rgba(42,127,191,0.09), 0 0 80px -4px rgba(212,175,55,0.7), 0 0 120px -10px rgba(42,127,191,0.5); }
      }

      /* "✦ LAS VEGAS ✦" super-label above title */
      .logo-crown {
        font-family: 'Cinzel', serif;
        font-size: 13px; font-weight: 600;
        color: rgba(42,127,191,0.7);
        letter-spacing: 6px;
        margin-top: 26px;
        position: relative; z-index: 1;
      }

      .logo-title {
        font-family: 'Cinzel Decorative', serif;
        font-size: 38px; font-weight: 700;
        color: #D4AF37;
        letter-spacing: 4px;
        margin-top: 8px;
        text-shadow:
          0 0 20px rgba(212,175,55,0.7),
          0 0 60px rgba(212,175,55,0.3),
          0 2px 4px rgba(0,0,0,0.8);
        text-align: center;
        line-height: 1.15;
        position: relative; z-index: 1;
        animation: titleGlow 4s ease-in-out infinite;
      }
      @keyframes titleGlow {
        0%,100% { text-shadow: 0 0 20px rgba(212,175,55,0.6), 0 0 60px rgba(212,175,55,0.25), 0 2px 4px rgba(0,0,0,0.8); }
        50%      { text-shadow: 0 0 30px rgba(212,175,55,0.9), 0 0 80px rgba(212,175,55,0.4),  0 2px 4px rgba(0,0,0,0.8); }
      }

      /* Gold/blue divider line with diamond centre */
      .logo-divider {
        display: flex; align-items: center; gap: 12px;
        width: 320px; margin-top: 16px;
        position: relative; z-index: 1;
      }
      .logo-divider span:not(.logo-divider-gem) {
        flex: 1; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(212,175,55,0.5), rgba(42,127,191,0.4), transparent);
      }
      .logo-divider-gem { font-size: 10px; color: #D4AF37; opacity: 0.8; }

      .logo-sub {
        font-family: 'DM Sans', sans-serif;
        font-size: 13px; color: rgba(255,255,255,0.32);
        letter-spacing: 4px; margin-top: 14px;
        text-transform: uppercase;
        position: relative; z-index: 1;
      }

      .tree-connector-wrap { width: 100%; height: 120px; margin-top: 10px; }
      .tree-svg { width: 100%; height: 100%; display: block; }

      .cards-row { width: 100%; display: flex; gap: 14px; align-items: flex-start; justify-content: center; }

      .hotel-card { flex: 1; min-width: 0; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; padding: 24px 16px 22px; cursor: pointer; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: transform 0.25s ease, border-color 0.25s, background 0.25s; text-align: center; }
      .hotel-card::before { content: ''; position: absolute; inset: 0; border-radius: 18px; background: radial-gradient(circle at 50% 0%, var(--card-accent) 0%, transparent 65%); opacity: 0; transition: opacity 0.3s; }
      .hotel-card.hovered { transform: translateY(-6px); border-color: var(--card-accent); background: rgba(255,255,255,0.04); }
      .hotel-card.hovered::before { opacity: 0.08; }

      .card-glow { position: absolute; top: -30px; left: 50%; transform: translateX(-50%); width: 80px; height: 80px; border-radius: 50%; background: var(--card-accent); filter: blur(30px); opacity: 0; transition: opacity 0.3s; pointer-events: none; }
      .hotel-card.hovered .card-glow { opacity: 0.18; }

      .card-icon-ring { width: 68px; height: 68px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.4); transition: border-color 0.3s, box-shadow 0.3s; position: relative; z-index: 1; }
      .hotel-card.hovered .card-icon-ring { border-color: var(--card-accent); box-shadow: 0 0 20px -4px var(--card-accent); }

      .card-name { font-family: 'Cinzel', serif; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.9); letter-spacing: 0.5px; line-height: 1.3; position: relative; z-index: 1; transition: color 0.25s; }
      .hotel-card.hovered .card-name { color: var(--card-soft); }

      .card-tagline { font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(255,255,255,0.3); line-height: 1.5; position: relative; z-index: 1; }

      .card-cta { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; color: var(--card-accent); opacity: 0; transform: translateY(4px); transition: opacity 0.25s, transform 0.25s; position: relative; z-index: 1; }
      .hotel-card.hovered .card-cta { opacity: 1; transform: translateY(0); }

      /* ─── APP SHELL ─────────────────────────────────────────────────────── */
      .app { display: flex; height: 100vh; }

      /* ─── SIDEBAR ───────────────────────────────────────────────────────── */
      .sb { width: 228px; flex-shrink: 0; background: #040404; border-right: 1px solid #111; display: flex; flex-direction: column; }

      .sb-home { padding: 14px; border: none; border-bottom: 1px solid #111; background: transparent; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: background 0.2s; width: 100%; text-align: left; }
      .sb-home:hover { background: #0c0c0c; }
      .sb-jester { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(212,175,55,0.3); flex-shrink: 0; }
      .sb-logo { font-family: 'DM Sans', sans-serif; font-size: 11px; color: #3a3a3a; line-height: 1.5; }
      .sb-logo b { display: block; font-size: 12px; color: #666; }

      .hotel-list { flex: 1; overflow-y: auto; scrollbar-width: none; padding: 4px 0; }
      .hotel-list::-webkit-scrollbar { display: none; }

      .hi { display: flex; align-items: center; gap: 11px; padding: 13px 14px; cursor: pointer; border: none; background: transparent; width: 100%; text-align: left; position: relative; transition: background 0.2s; border-bottom: 1px solid #0a0a0a; }
      .hi::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--ia); opacity: 0; transition: opacity 0.25s; }
      .hi:hover { background: #0d0d0d; }
      .hi:hover::before, .hi.active::before { opacity: 1; }
      .hi.active { background: #0f0f0f; }
      .hi-ico { width: 32px; height: 32px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; opacity: 0.3; transition: opacity 0.25s; }
      .hi.active .hi-ico, .hi:hover .hi-ico { opacity: 1; }
      .hi-txt { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
      .hi-name { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; color: #555; letter-spacing: 0.2px; transition: color 0.2s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .hi.active .hi-name, .hi:hover .hi-name { color: var(--ia); }
      .hi-sub { font-family: 'DM Sans', sans-serif; font-size: 10px; color: #2a2a2a; line-height: 1.3; transition: color 0.2s; }
      .hi:hover .hi-sub { color: #3a3a3a; }
      .hi.active .hi-sub { color: #444; }

      /* ─── MAIN ──────────────────────────────────────────────────────────── */
      .main { flex: 1; display: flex; flex-direction: column; position: relative; overflow: hidden; transition: background 0.6s; }
      .mpat { position: absolute; inset: 0; z-index: 0; }
      .main::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 28%, rgba(0,0,0,0.82) 100%); pointer-events: none; z-index: 1; }

      /* ─── HEADER ────────────────────────────────────────────────────────── */
      .hdr { position: relative; z-index: 10; padding: 0 26px; height: 72px; display: flex; align-items: center; gap: 14px; border-bottom: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(16px); }
      .hdr-ring { width: 46px; height: 46px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--ha); display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); animation: rp 3s ease-in-out infinite; }
      @keyframes rp { 0%,100% { box-shadow: 0 0 12px -6px var(--ha), inset 0 0 8px -8px var(--ha); } 50% { box-shadow: 0 0 28px -2px var(--ha), inset 0 0 18px -4px var(--ha); } }
      .hdr-div { width: 1px; height: 34px; background: linear-gradient(to bottom, transparent, var(--ha), transparent); opacity: 0.3; }
      .hdr-name { font-family: 'Cinzel', serif; font-size: 16px; font-weight: 600; color: var(--ha); letter-spacing: 1px; text-shadow: 0 0 18px var(--has); line-height: 1.2; }
      .hdr-tag { font-family: 'DM Sans', sans-serif; font-size: 12px; color: rgba(255,255,255,0.38); margin-top: 3px; }
      .hdr-right { margin-left: auto; }
      .live { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 5px 11px; font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 2px; }
      .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ha); box-shadow: 0 0 6px var(--ha); animation: lp 1.5s ease-in-out infinite; }
      @keyframes lp { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

      /* ─── MESSAGES ──────────────────────────────────────────────────────── */
      .msgs { flex: 1; overflow-y: auto; padding: 26px; display: flex; flex-direction: column; gap: 18px; position: relative; z-index: 5; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.07) transparent; }
      .msgs::-webkit-scrollbar { width: 3px; }
      .msgs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 2px; }

      .empty { margin: auto; text-align: center; animation: fi 0.8s ease; display: flex; flex-direction: column; align-items: center; }
      @keyframes fi { from { opacity: 0; } to { opacity: 1; } }
      .empty-ring { width: 88px; height: 88px; border-radius: 50%; border: 1px solid var(--ha); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; background: rgba(0,0,0,0.5); animation: rp 3s ease-in-out infinite; }
      .empty-name { font-family: 'Cinzel', serif; font-size: 18px; color: var(--ha); letter-spacing: 2px; margin-bottom: 7px; text-shadow: 0 0 22px var(--has); }
      .empty-sub  { font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(255,255,255,0.28); margin-bottom: 28px; }

      .empty-divider { display: flex; align-items: center; gap: 12px; width: 340px; margin-bottom: 18px; }
      .empty-divider span:not(.empty-divider-text) { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); }
      .empty-divider-text { font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.22); white-space: nowrap; }

      /* Preset prompt chips */
      .presets { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-width: 580px; }
      .preset-chip {
        display: flex; align-items: center; gap: 7px;
        padding: 9px 16px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 999px;
        cursor: pointer;
        transition: all 0.2s;
        animation: fi 0.5s ease both;
      }
      .preset-chip:nth-child(1) { animation-delay: 0.05s; }
      .preset-chip:nth-child(2) { animation-delay: 0.10s; }
      .preset-chip:nth-child(3) { animation-delay: 0.15s; }
      .preset-chip:nth-child(4) { animation-delay: 0.20s; }
      .preset-chip:nth-child(5) { animation-delay: 0.25s; }
      .preset-chip:nth-child(6) { animation-delay: 0.30s; }
      .preset-chip:hover {
        background: rgba(255,255,255,0.08);
        border-color: var(--ha);
        transform: translateY(-2px);
        box-shadow: 0 4px 20px -6px var(--ha);
      }
      .preset-chip:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }
      .preset-emoji { font-size: 15px; line-height: 1; }
      .preset-label { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.65); white-space: nowrap; transition: color 0.2s; }
      .preset-chip:hover .preset-label { color: var(--has); }

      .mrow { display: flex; gap: 10px; animation: ms 0.3s ease; }
      @keyframes ms { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      .mrow.user { justify-content: flex-end; }

      .av { width: 32px; height: 32px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--hb); background: rgba(0,0,0,0.5); margin-top: 20px; }
      .av.uav { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); }

      .bwrap { display: flex; flex-direction: column; max-width: 68%; }
      .mrow.user .bwrap { align-items: flex-end; }

      .blabel { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.25); letter-spacing: 0.5px; margin-bottom: 5px; }
      .mrow.user .blabel { color: var(--ha); opacity: 0.7; }

      .bubble { padding: 12px 16px; border-radius: 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.65; white-space: pre-wrap; border: 1px solid transparent; }
      .bubble.user      { background: var(--hbu); color: #fff; border-color: var(--hb); border-bottom-right-radius: 4px; box-shadow: 0 0 16px -9px var(--ha); }
      .bubble.assistant { background: var(--hba); color: rgba(255,255,255,0.88); border-color: rgba(255,255,255,0.05); border-bottom-left-radius: 4px; }
      .bubble img { max-width: 200px; max-height: 140px; border-radius: 8px; display: block; margin-bottom: 10px; object-fit: cover; border: 1px solid var(--hb); }

      .cur { animation: blink 1s step-end infinite; color: var(--ha); }
      @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

      /* ─── IMAGE PREVIEW ─────────────────────────────────────────────────── */
      .prev-zone  { position: relative; z-index: 5; padding: 0 26px 10px; }
      .prev-inner { display: inline-block; position: relative; }
      .prev-inner img { height: 80px; border-radius: 10px; object-fit: cover; border: 1px solid var(--hb); box-shadow: 0 0 14px -4px var(--ha); }
      .prev-rm { position: absolute; top: -8px; right: -8px; background: #1a1a1a; border: 1px solid #444; color: #ccc; border-radius: 50%; width: 22px; height: 22px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s, color 0.2s; }
      .prev-rm:hover { background: #333; color: #fff; }

      /* ─── INPUT BAR ─────────────────────────────────────────────────────── */
      .ibar {
        position: relative; z-index: 5;
        padding: 10px 20px 18px;
        border-top: 1px solid rgba(255,255,255,0.07);
        display: flex; align-items: flex-end; gap: 12px;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(18px);
      }

      /* Wrapper for label + control stacked vertically */
      .ibar-slot {
        display: flex; flex-direction: column; gap: 5px;
      }
      .ibar-slot-grow { flex: 1; }

      .ibar-label {
        font-family: 'DM Sans', sans-serif;
        font-size: 10px; font-weight: 600;
        letter-spacing: 1.5px; text-transform: uppercase;
        color: rgba(255,255,255,0.28);
        padding-left: 4px;
      }

      /* Attach button — clear icon + text */
      .att {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 12px;
        color: rgba(255,255,255,0.55);
        padding: 0 16px;
        cursor: pointer;
        transition: all 0.2s;
        min-height: 54px;
        min-width: 88px;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center; gap: 3px;
      }
      .att-icon { font-size: 20px; line-height: 1; }
      .att-text {
        font-family: 'DM Sans', sans-serif;
        font-size: 10px; font-weight: 600;
        letter-spacing: 1px; text-transform: uppercase;
        color: rgba(255,255,255,0.4);
      }
      .att:hover {
        border-color: var(--hb);
        background: rgba(255,255,255,0.08);
        color: var(--ha);
        box-shadow: 0 0 14px -4px var(--ha);
      }
      .att:hover .att-text { color: var(--ha); }
      .att:disabled { opacity: 0.2; cursor: not-allowed; box-shadow: none; }

      /* Textarea */
      .ti {
        flex: 1; width: 100%;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.13);
        border-radius: 14px;
        padding: 14px 18px;
        color: rgba(255,255,255,0.92);
        font-family: 'DM Sans', sans-serif;
        font-size: 15px; line-height: 1.55;
        outline: none; resize: none;
        transition: all 0.2s;
        min-height: 54px; max-height: 140px;
      }
      .ti:focus {
        border-color: var(--hb);
        background: rgba(255,255,255,0.08);
        box-shadow: 0 0 0 3px rgba(var(--hb-raw, 255,255,255), 0.06), inset 0 0 24px -10px var(--ha);
      }
      .ti::placeholder { color: rgba(255,255,255,0.22); font-style: italic; }
      .ti:disabled { opacity: 0.3; }

      /* Send button — bright solid fill */
      .sbtn {
        background: var(--ha);
        border: 2px solid var(--ha);
        border-radius: 12px;
        color: #000;
        padding: 0 20px;
        cursor: pointer;
        transition: all 0.2s;
        min-height: 54px; min-width: 96px;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center; gap: 3px;
        position: relative; overflow: hidden;
        box-shadow: 0 0 22px -4px var(--ha), 0 0 40px -12px var(--ha);
      }
      .sbtn::before {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%);
        pointer-events: none;
      }
      .sbtn-icon {
        font-size: 18px; line-height: 1;
        position: relative; z-index: 1;
        transition: transform 0.2s;
      }
      .sbtn-text {
        font-family: 'DM Sans', sans-serif;
        font-size: 10px; font-weight: 800;
        letter-spacing: 1.5px; text-transform: uppercase;
        position: relative; z-index: 1;
      }
      .sbtn:hover {
        background: var(--has);
        border-color: var(--has);
        box-shadow: 0 0 32px -2px var(--ha), 0 0 60px -8px var(--ha);
        transform: translateY(-1px);
      }
      .sbtn:hover .sbtn-icon { transform: translateX(2px); }
      .sbtn:active { transform: translateY(0); }
      .sbtn:disabled {
        background: rgba(255,255,255,0.07);
        border-color: rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.3);
        box-shadow: none; cursor: not-allowed; transform: none;
      }
      .sbtn:disabled::before { display: none; }

      /* ─── SWITCH MODAL ──────────────────────────────────────────────────── */
      .moverlay { position: fixed; inset: 0; background: rgba(0,0,0,0.88); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(10px); animation: fi 0.2s ease; }
      .mbox { background: #070707; border: 1px solid var(--ma); border-radius: 22px; padding: 36px 32px; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 0 60px -12px var(--ma), 0 24px 60px rgba(0,0,0,0.95); position: relative; overflow: hidden; }
      .mbox::before { content: ''; position: absolute; top: -50%; left: -50%; right: -50%; bottom: -50%; background: radial-gradient(circle at center, var(--ma) 0%, transparent 60%); opacity: 0.03; pointer-events: none; }
      .micon-ring { width: 68px; height: 68px; border-radius: 50%; border: 1px solid var(--ma); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 0 24px -6px var(--ma); background: rgba(0,0,0,0.5); }
      .mtitle { font-family: 'Cinzel', serif; font-size: 16px; font-weight: 600; color: var(--ma); letter-spacing: 1px; margin-bottom: 12px; text-shadow: 0 0 14px var(--ma); }
      .mdesc { font-family: 'DM Sans', sans-serif; font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.65; margin-bottom: 28px; }
      .mdesc strong { color: rgba(255,255,255,0.75); font-weight: 600; }
      .macts { display: flex; gap: 10px; justify-content: center; }
      .mstay { padding: 11px 24px; border: 1px solid #222; border-radius: 10px; background: transparent; color: rgba(255,255,255,0.35); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
      .mstay:hover { border-color: #3a3a3a; color: rgba(255,255,255,0.65); }
      .mgo { padding: 11px 28px; border: 1px solid var(--ma); border-radius: 10px; background: transparent; color: var(--ma); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
      .mgo:hover { box-shadow: 0 0 16px -4px var(--ma); background: rgba(255,255,255,0.03); }
    `}</style>
  );
}
