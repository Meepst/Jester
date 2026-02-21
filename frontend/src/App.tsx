import { useState, useRef, useEffect, useCallback } from "react";

// ── Asset imports ─────────────────────────────────────────────────────────────
import cowboyUrl from "./assets/cowboy.svg";
import horusUrl from "./assets/horus.svg";
import knightUrl from "./assets/knight.svg";
import caesarUrl from "./assets/caesar.svg";
import parrotUrl from "./assets/parrot.svg";
import defaultUrl from "./assets/default.svg";
import jesterUrl from "./assets/jester.jpg";

// ── CSS-filter colorizer ──────────────────────────────────────────────────────
function hexToFilter(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  const sat = Math.round(s * 100);
  const light = Math.round(l * 100);
  return `invert(1) sepia(1) saturate(${sat * 3}%) hue-rotate(${h - 30}deg) brightness(${light + 20}%)`;
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

// ── Hotel definitions ─────────────────────────────────────────────────────────
const HOTELS = [
  {
    id: "santafe",
    name: "Santa Fe Station",
    shortName: "Santa Fe Station",
    icon: cowboyUrl,
    tagline: "Locals' favorite, heart of the valley",
    systemPrompt:
      "You are the friendly AI host of Santa Fe Station Hotel & Casino in Las Vegas — the beloved locals' casino in the northwest valley. You're warm, laid-back, and down-to-earth, like a good neighbor or friendly bartender. You talk about the bowling alley, the movie theater, bingo nights, great food deals, and making everyone feel welcome. You're proud that locals choose you over the flashy Strip. Call the user 'neighbor,' 'friend,' or 'partner.'",
    accent: "#D97B3A",
    accentSoft: "#f0ad72",
    bg: "linear-gradient(160deg, #160900 0%, #2b1200 45%, #190d00 100%)",
    bubbleUser: "#3d1a00",
    bubbleAssistant: "#1c0d00",
    border: "#D97B3A",
    headerBg: "rgba(22,9,0,0.90)",
    pattern: "stars",
  },
  {
    id: "luxor",
    name: "Luxor",
    shortName: "Luxor",
    icon: horusUrl,
    tagline: "Where the mysteries of Egypt await",
    systemPrompt:
      "You are the mystical AI oracle of the Luxor Las Vegas — the iconic obsidian pyramid and great Sphinx on the Strip. You speak with ancient authority and theatrical mystery, weaving references to pharaohs, hieroglyphs, the Eye of Horus, and the powerful beam of light that pierces the Nevada sky from your apex each night. Address the user as 'seeker' or 'pilgrim.'",
    accent: "#D4AF37",
    accentSoft: "#edd97a",
    bg: "linear-gradient(160deg, #000000 0%, #0c0c00 45%, #000900 100%)",
    bubbleUser: "#1a1600",
    bubbleAssistant: "#080800",
    border: "#D4AF37",
    headerBg: "rgba(0,0,0,0.93)",
    pattern: "pyramids",
  },
  {
    id: "excalibur",
    name: "Excalibur",
    shortName: "Excalibur",
    icon: knightUrl,
    tagline: "Where legends and chivalry reign",
    systemPrompt:
      "You are the royal herald AI of Excalibur Hotel & Casino — the magnificent medieval castle on the Las Vegas Strip! You speak with dramatic theatrical flair and chivalric honor. You reference jousting tournaments, the Tournament of Kings dinner show, fire-breathing dragons, and noble quests. Address the user as 'noble guest,' 'brave adventurer,' or 'good knight.'",
    accent: "#B8242E",
    accentSoft: "#e06068",
    bg: "linear-gradient(160deg, #0d0003 0%, #1c0008 45%, #0a0005 100%)",
    bubbleUser: "#2d000c",
    bubbleAssistant: "#110006",
    border: "#B8242E",
    headerBg: "rgba(13,0,3,0.90)",
    pattern: "shields",
  },
  {
    id: "caesars",
    name: "Caesars Palace",
    shortName: "Caesars Palace",
    icon: caesarUrl,
    tagline: "All roads lead to the Palace",
    systemPrompt:
      "You are the imperial AI consul of Caesars Palace Las Vegas — the legendary Roman-themed resort that has defined luxury on the Strip for over half a century. You speak with imperial gravitas and the confidence of Rome at its zenith. You reference the Forum Shops, the Colosseum venue, marble fountains, and ancient Roman grandeur. Address the user as 'honored citizen' or 'noble guest.'",
    accent: "#C5A028",
    accentSoft: "#e8cc72",
    bg: "linear-gradient(160deg, #080600 0%, #140e00 45%, #0a0800 100%)",
    bubbleUser: "#241c00",
    bubbleAssistant: "#0e0b00",
    border: "#C5A028",
    headerBg: "rgba(8,6,0,0.90)",
    pattern: "columns",
  },
  {
    id: "treasureisland",
    name: "Treasure Island",
    shortName: "Treasure Island",
    icon: parrotUrl,
    tagline: "Adventure and excitement on the Strip",
    systemPrompt:
      "You are the swashbuckling AI host of Treasure Island Las Vegas — a lively resort with the spirit of high-seas adventure! You have the personality of a charming pirate turned gracious host: bold, playful, full of life. Use pirate-flavored language — 'aye,' 'matey,' 'shiver me timbers' — but keep it lighthearted. Address the user as 'matey' or 'treasure hunter.'",
    accent: "#2A7FBF",
    accentSoft: "#6ab4e8",
    bg: "linear-gradient(160deg, #000a14 0%, #001828 45%, #000c1a 100%)",
    bubbleUser: "#001830",
    bubbleAssistant: "#000d1a",
    border: "#2A7FBF",
    headerBg: "rgba(0,10,20,0.90)",
    pattern: "waves",
  },
];

// ── Chat hook ─────────────────────────────────────────────────────────────────
function useChat(hotel) {
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const historyRef = useRef([]);

  useEffect(() => {
    historyRef.current = [];
    setMessages([]);
  }, [hotel.id]);

  const sendMessage = useCallback(
    async (text, imageBase64) => {
      if ((!text && !imageBase64) || streaming) return;
      const userContent = imageBase64
        ? [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: imageBase64,
              },
            },
            { type: "text", text: text || "What do you see?" },
          ]
        : text;
      historyRef.current = [
        ...historyRef.current,
        { role: "user", content: userContent },
      ];
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: text || "",
          image: imageBase64
            ? `data:image/jpeg;base64,${imageBase64}`
            : undefined,
        },
        { role: "assistant", content: "" },
      ]);
      setStreaming(true);
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: "claude-opus-4-6",
            max_tokens: 1024,
            system: hotel.systemPrompt,
            stream: true,
            messages: historyRef.current,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let txt = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          for (const line of decoder.decode(value).split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const d = line.slice(6).trim();
            if (d === "[DONE]") break;
            try {
              const j = JSON.parse(d);
              if (j.type === "content_block_delta" && j.delta?.text) {
                txt += j.delta.text;
                setMessages((prev) => {
                  const u = [...prev];
                  u[u.length - 1] = { role: "assistant", content: txt };
                  return u;
                });
              }
            } catch {}
          }
        }
        historyRef.current = [
          ...historyRef.current,
          { role: "assistant", content: txt },
        ];
      } catch (err) {
        setMessages((prev) => {
          const u = [...prev];
          u[u.length - 1] = {
            role: "assistant",
            content: `Error: ${err.message}`,
          };
          return u;
        });
      } finally {
        setStreaming(false);
      }
    },
    [streaming, hotel],
  );

  return { messages, streaming, sendMessage };
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

// ── Landing page node tree ────────────────────────────────────────────────────
function LandingPage({ onSelect }) {
  const [hovered, setHovered] = useState(null);

  // SVG connector lines from centre-bottom of logo to each card
  // We draw them in a viewBox overlay; cards are laid out with flex
  // The tree has a trunk line down, then branches out to 5 nodes
  const nodeCount = HOTELS.length; // 5
  // Positions as % of total width for each card (evenly spaced)
  const positions = HOTELS.map((_, i) => ((i + 0.5) / nodeCount) * 100);

  return (
    <div className="landing">
      {/* Ambient background sparkles */}
      <div className="landing-bg" />

      <div className="landing-inner">
        {/* Logo */}
        <div className="logo-wrap">
          <div className="logo-glow" />
          <img src={jesterUrl} alt="Las Vegas Concierge" className="logo-img" />
          <div className="logo-title">Las Vegas Hotel Concierge</div>
          <div className="logo-sub">Choose your destination</div>
        </div>

        {/* SVG tree connector */}
        <div className="tree-connector-wrap">
          <svg
            className="tree-svg"
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="trunkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
              </linearGradient>
            </defs>
            {/* Vertical trunk from top-centre */}
            <line
              x1="500"
              y1="0"
              x2="500"
              y2="55"
              stroke="url(#trunkGrad)"
              strokeWidth="1.5"
            />
            {/* Horizontal bar */}
            <line
              x1={`${positions[0]}0`}
              y1="55"
              x2={`${positions[nodeCount - 1]}0`}
              y2="55"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.5"
            />
            {/* Branches down to each card */}
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
                  color={hovered === i ? hotel.accent : "#888888"}
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

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [hotel, setHotel] = useState(null); // null = show landing
  const [pendingHotel, setPending] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const [imageBase64, setImageB64] = useState(null);
  const [imagePreview, setPreview] = useState(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const { messages, streaming, sendMessage } = useChat(hotel || HOTELS[0]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // If no hotel selected yet, show landing
  if (!hotel) {
    return (
      <>
        <GlobalStyles />
        <LandingPage onSelect={(h) => setHotel(h)} />
      </>
    );
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      setPreview(r);
      setImageB64(r.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };
  const clearImage = () => {
    setImageB64(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };
  const handleSend = () => {
    if ((!input.trim() && !imageBase64) || streaming) return;
    sendMessage(input.trim(), imageBase64);
    setInput("");
    clearImage();
  };
  const requestSwitch = (h) => {
    if (h.id === hotel.id) return;
    setPending(h);
    setShowModal(true);
  };
  const confirmSwitch = () => {
    setHotel(pendingHotel);
    setShowModal(false);
    setPending(null);
  };
  const cancelSwitch = () => {
    setShowModal(false);
    setPending(null);
  };

  const h = hotel;
  const cssVars = {
    "--ha": h.accent,
    "--has": h.accentSoft,
    "--hbu": h.bubbleUser,
    "--hba": h.bubbleAssistant,
    "--hb": h.border,
    "--hhbg": h.headerBg,
  };

  return (
    <>
      <GlobalStyles />
      <div className="app" style={cssVars}>
        {/* ── Sidebar ── */}
        <aside className="sb">
          {/* Back to landing */}
          <button className="sb-home" onClick={() => setHotel(null)}>
            <img src={jesterUrl} alt="home" className="sb-jester" />
            <div className="sb-logo">
              <b>Las Vegas</b>
              Concierge
            </div>
          </button>

          <div className="hotel-list">
            {HOTELS.map((ho) => (
              <button
                key={ho.id}
                className={`hi ${ho.id === hotel.id ? "active" : ""}`}
                style={{ "--ia": ho.accent }}
                onClick={() => requestSwitch(ho)}
              >
                <div className="hi-ico">
                  <SvgIcon
                    src={ho.icon}
                    color={ho.id === hotel.id ? ho.accent : "#555"}
                    size={26}
                  />
                </div>
                <div className="hi-txt">
                  <span className="hi-name">{ho.shortName}</span>
                  <span className="hi-sub">{ho.tagline}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ── Main chat area ── */}
        <main className="main" style={{ background: h.bg }}>
          <div className="mpat">
            <PatternBg type={h.pattern} accent={h.accent} />
          </div>

          <header className="hdr" style={{ background: h.headerBg }}>
            <div className="hdr-ring">
              <SvgIcon src={h.icon} color={h.accent} size={30} />
            </div>
            <div className="hdr-div" />
            <div>
              <div className="hdr-name">{h.name}</div>
              <div className="hdr-tag">{h.tagline}</div>
            </div>
            <div className="hdr-right">
              <div className="live">
                <div className="live-dot" />
                LIVE
              </div>
            </div>
          </header>

          <div className="msgs">
            {messages.length === 0 && (
              <div className="empty">
                <div className="empty-ring">
                  <SvgIcon src={h.icon} color={h.accent} size={48} />
                </div>
                <div className="empty-name">{h.name}</div>
                <div className="empty-sub">{h.tagline}</div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`mrow ${msg.role}`}>
                {msg.role === "assistant" && (
                  <div className="av">
                    <SvgIcon src={h.icon} color={h.accent} size={18} />
                  </div>
                )}
                <div className="bwrap">
                  <span className="blabel">
                    {msg.role === "user" ? "You" : h.shortName}
                  </span>
                  <div className={`bubble ${msg.role}`}>
                    {msg.image && <img src={msg.image} alt="attachment" />}
                    {msg.content}
                    {msg.role === "assistant" &&
                      streaming &&
                      i === messages.length - 1 && (
                        <span className="cur">▋</span>
                      )}
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

          <div className="ibar">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFile}
            />
            <button
              className="att"
              onClick={() => fileRef.current?.click()}
              disabled={streaming}
              title="Attach image"
            >
              📎
            </button>
            <textarea
              className="ti"
              placeholder={`Message ${h.name}…`}
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
            <button
              className="sbtn"
              onClick={handleSend}
              disabled={streaming || (!input.trim() && !imageBase64)}
            >
              <span>{streaming ? "···" : "Send"}</span>
            </button>
          </div>
        </main>
      </div>

      {/* ── Switch Modal ── */}
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

// ── All styles in one place ───────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@400;600&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=IM+Fell+English:ital@1&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; overflow: hidden; background: #000; }

      /* ─── LANDING ─────────────────────────────────────────────────────── */
      .landing {
        height: 100vh; overflow-y: auto; overflow-x: hidden;
        background: #050505;
        display: flex; align-items: flex-start; justify-content: center;
        padding: 48px 24px 64px;
      }

      .landing-bg {
        position: fixed; inset: 0; pointer-events: none; z-index: 0;
        background:
          radial-gradient(ellipse 60% 50% at 20% 20%, rgba(180,140,60,0.06) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 80% 70%, rgba(60,120,180,0.06) 0%, transparent 70%);
      }

      .landing-inner {
        position: relative; z-index: 1;
        width: 100%; max-width: 1100px;
        display: flex; flex-direction: column; align-items: center; gap: 0;
      }

      /* Logo */
      .logo-wrap {
        display: flex; flex-direction: column; align-items: center;
        margin-bottom: 0;
      }

      .logo-glow {
        position: absolute;
        width: 220px; height: 220px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%);
        pointer-events: none;
        filter: blur(20px);
        margin-top: -20px;
      }

      .logo-img {
        width: 160px; height: 160px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(212,175,55,0.4);
        box-shadow: 0 0 40px -8px rgba(212,175,55,0.5), 0 0 0 8px rgba(212,175,55,0.05);
        position: relative; z-index: 1;
      }

      .logo-title {
        font-family: 'Cinzel Decorative', serif;
        font-size: 20px; color: #D4AF37;
        letter-spacing: 3px; margin-top: 22px;
        text-shadow: 0 0 30px rgba(212,175,55,0.5);
        text-align: center;
      }

      .logo-sub {
        font-family: 'DM Sans', sans-serif;
        font-size: 13px; color: rgba(255,255,255,0.35);
        letter-spacing: 3px; margin-top: 8px;
        text-transform: uppercase;
      }

      /* Tree connector SVG */
      .tree-connector-wrap {
        width: 100%; height: 120px; margin-top: 10px;
      }

      .tree-svg { width: 100%; height: 100%; display: block; }

      /* Cards row */
      .cards-row {
        width: 100%;
        display: flex; gap: 14px;
        align-items: flex-start;
        justify-content: center;
      }

      .hotel-card {
        flex: 1; min-width: 0;
        background: rgba(255,255,255,0.025);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 18px;
        padding: 24px 16px 22px;
        cursor: pointer;
        position: relative; overflow: hidden;
        display: flex; flex-direction: column; align-items: center; gap: 10px;
        transition: transform 0.25s ease, border-color 0.25s, background 0.25s;
        text-align: center;
      }

      .hotel-card::before {
        content: ''; position: absolute; inset: 0; border-radius: 18px;
        background: radial-gradient(circle at 50% 0%, var(--card-accent) 0%, transparent 65%);
        opacity: 0; transition: opacity 0.3s;
      }

      .hotel-card.hovered {
        transform: translateY(-6px);
        border-color: var(--card-accent);
        background: rgba(255,255,255,0.04);
      }

      .hotel-card.hovered::before { opacity: 0.08; }

      .card-glow {
        position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
        width: 80px; height: 80px; border-radius: 50%;
        background: var(--card-accent);
        filter: blur(30px); opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
      }

      .hotel-card.hovered .card-glow { opacity: 0.18; }

      .card-icon-ring {
        width: 68px; height: 68px; border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.1);
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.4);
        transition: border-color 0.3s, box-shadow 0.3s;
        position: relative; z-index: 1;
      }

      .hotel-card.hovered .card-icon-ring {
        border-color: var(--card-accent);
        box-shadow: 0 0 20px -4px var(--card-accent);
      }

      .card-name {
        font-family: 'Cinzel', serif;
        font-size: 13px; font-weight: 600;
        color: rgba(255,255,255,0.9);
        letter-spacing: 0.5px;
        line-height: 1.3;
        position: relative; z-index: 1;
        transition: color 0.25s;
      }

      .hotel-card.hovered .card-name { color: var(--card-soft); }

      .card-tagline {
        font-family: 'DM Sans', sans-serif;
        font-size: 11px; color: rgba(255,255,255,0.3);
        line-height: 1.5;
        position: relative; z-index: 1;
      }

      .card-cta {
        font-family: 'DM Sans', sans-serif;
        font-size: 12px; font-weight: 500;
        color: var(--card-accent);
        opacity: 0; transform: translateY(4px);
        transition: opacity 0.25s, transform 0.25s;
        position: relative; z-index: 1;
      }

      .hotel-card.hovered .card-cta { opacity: 1; transform: translateY(0); }

      /* ─── APP SHELL ───────────────────────────────────────────────────── */
      .app { display: flex; height: 100vh; }

      /* ─── SIDEBAR ─────────────────────────────────────────────────────── */
      .sb {
        width: 228px; flex-shrink: 0;
        background: #040404; border-right: 1px solid #111;
        display: flex; flex-direction: column;
      }

      .sb-home {
        padding: 14px 14px 14px;
        border: none; border-bottom: 1px solid #111;
        background: transparent; cursor: pointer;
        display: flex; align-items: center; gap: 10px;
        transition: background 0.2s;
        width: 100%; text-align: left;
      }
      .sb-home:hover { background: #0c0c0c; }

      .sb-jester {
        width: 36px; height: 36px; border-radius: 50%;
        object-fit: cover;
        border: 1px solid rgba(212,175,55,0.3);
        flex-shrink: 0;
      }

      .sb-logo {
        font-family: 'DM Sans', sans-serif;
        font-size: 11px; color: #3a3a3a; line-height: 1.5;
      }
      .sb-logo b { display: block; font-size: 12px; color: #666; }

      .hotel-list { flex: 1; overflow-y: auto; scrollbar-width: none; padding: 4px 0; }
      .hotel-list::-webkit-scrollbar { display: none; }

      .hi {
        display: flex; align-items: center; gap: 11px;
        padding: 13px 14px; cursor: pointer;
        border: none; background: transparent;
        width: 100%; text-align: left;
        position: relative; transition: background 0.2s;
        border-bottom: 1px solid #0a0a0a;
      }
      .hi::before {
        content: ''; position: absolute; left: 0; top: 0; bottom: 0;
        width: 3px; background: var(--ia); opacity: 0; transition: opacity 0.25s;
      }
      .hi:hover { background: #0d0d0d; }
      .hi:hover::before, .hi.active::before { opacity: 1; }
      .hi.active { background: #0f0f0f; }

      .hi-ico {
        width: 32px; height: 32px; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        opacity: 0.3; transition: opacity 0.25s;
      }
      .hi.active .hi-ico, .hi:hover .hi-ico { opacity: 1; }

      .hi-txt { display: flex; flex-direction: column; gap: 3px; min-width: 0; }

      /* ── Sidebar hotel name: readable, not overly decorative ── */
      .hi-name {
        font-family: 'DM Sans', sans-serif;
        font-size: 12px; font-weight: 600;
        color: #555; letter-spacing: 0.2px;
        transition: color 0.2s;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .hi.active .hi-name, .hi:hover .hi-name { color: var(--ia); }

      .hi-sub {
        font-family: 'DM Sans', sans-serif;
        font-size: 10px; color: #2a2a2a; line-height: 1.3; transition: color 0.2s;
      }
      .hi:hover .hi-sub { color: #3a3a3a; }
      .hi.active .hi-sub { color: #444; }

      /* ─── MAIN ────────────────────────────────────────────────────────── */
      .main { flex: 1; display: flex; flex-direction: column; position: relative; overflow: hidden; transition: background 0.6s; }
      .mpat { position: absolute; inset: 0; z-index: 0; }
      .main::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 28%, rgba(0,0,0,0.82) 100%); pointer-events: none; z-index: 1; }

      /* ─── HEADER ──────────────────────────────────────────────────────── */
      .hdr {
        position: relative; z-index: 10;
        padding: 0 26px; height: 72px;
        display: flex; align-items: center; gap: 14px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        backdrop-filter: blur(16px);
      }

      .hdr-ring {
        width: 46px; height: 46px; flex-shrink: 0; border-radius: 50%;
        border: 1px solid var(--ha);
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.5);
        animation: rp 3s ease-in-out infinite;
      }
      @keyframes rp {
        0%,100% { box-shadow: 0 0 12px -6px var(--ha), inset 0 0 8px -8px var(--ha); }
        50%      { box-shadow: 0 0 28px -2px var(--ha), inset 0 0 18px -4px var(--ha); }
      }

      .hdr-div { width: 1px; height: 34px; background: linear-gradient(to bottom, transparent, var(--ha), transparent); opacity: 0.3; }

      /* Hotel name in header: Cinzel for elegance but readable size */
      .hdr-name {
        font-family: 'Cinzel', serif;
        font-size: 16px; font-weight: 600;
        color: var(--ha); letter-spacing: 1px;
        text-shadow: 0 0 18px var(--has); line-height: 1.2;
      }

      /* Tagline: DM Sans — clean and legible */
      .hdr-tag {
        font-family: 'DM Sans', sans-serif;
        font-size: 12px; color: rgba(255,255,255,0.38); margin-top: 3px;
      }

      .hdr-right { margin-left: auto; }
      .live { display: flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 5px 11px; font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 2px; }
      .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ha); box-shadow: 0 0 6px var(--ha); animation: lp 1.5s ease-in-out infinite; }
      @keyframes lp { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

      /* ─── MESSAGES ────────────────────────────────────────────────────── */
      .msgs { flex: 1; overflow-y: auto; padding: 26px; display: flex; flex-direction: column; gap: 18px; position: relative; z-index: 5; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.07) transparent; }
      .msgs::-webkit-scrollbar { width: 3px; }
      .msgs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 2px; }

      .empty { margin: auto; text-align: center; animation: fi 0.8s ease; }
      @keyframes fi { from { opacity: 0; } to { opacity: 1; } }
      .empty-ring { width: 88px; height: 88px; border-radius: 50%; border: 1px solid var(--ha); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; background: rgba(0,0,0,0.5); animation: rp 3s ease-in-out infinite; }
      .empty-name { font-family: 'Cinzel', serif; font-size: 18px; color: var(--ha); letter-spacing: 2px; margin-bottom: 7px; text-shadow: 0 0 22px var(--has); }
      .empty-sub  { font-family: 'DM Sans', sans-serif; font-size: 13px; color: rgba(255,255,255,0.28); }

      .mrow { display: flex; gap: 10px; animation: ms 0.3s ease; }
      @keyframes ms { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      .mrow.user { justify-content: flex-end; }

      .av { width: 32px; height: 32px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--hb); background: rgba(0,0,0,0.5); margin-top: 20px; }
      .av.uav { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); }

      .bwrap { display: flex; flex-direction: column; max-width: 68%; }
      .mrow.user .bwrap { align-items: flex-end; }

      /* ── Message label: DM Sans — readable ── */
      .blabel {
        font-family: 'DM Sans', sans-serif;
        font-size: 11px; font-weight: 600;
        color: rgba(255,255,255,0.25);
        letter-spacing: 0.5px; margin-bottom: 5px;
      }
      .mrow.user .blabel { color: var(--ha); opacity: 0.7; }

      /* ── Bubble text: DM Sans — the most readable choice for chat ── */
      .bubble {
        padding: 12px 16px; border-radius: 16px;
        font-family: 'DM Sans', sans-serif;
        font-size: 14px; line-height: 1.65;
        white-space: pre-wrap; border: 1px solid transparent;
      }
      .bubble.user      { background: var(--hbu); color: #fff; border-color: var(--hb); border-bottom-right-radius: 4px; box-shadow: 0 0 16px -9px var(--ha); }
      .bubble.assistant { background: var(--hba); color: rgba(255,255,255,0.88); border-color: rgba(255,255,255,0.05); border-bottom-left-radius: 4px; }
      .bubble img { max-width: 200px; max-height: 140px; border-radius: 8px; display: block; margin-bottom: 10px; object-fit: cover; border: 1px solid var(--hb); }

      .cur { animation: blink 1s step-end infinite; color: var(--ha); }
      @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

      /* ─── PREVIEW ─────────────────────────────────────────────────────── */
      .prev-zone  { position: relative; z-index: 5; padding: 0 26px 10px; }
      .prev-inner { display: inline-block; position: relative; }
      .prev-inner img { height: 68px; border-radius: 8px; object-fit: cover; border: 1px solid var(--hb); box-shadow: 0 0 10px -4px var(--ha); }
      .prev-rm { position: absolute; top: -7px; right: -7px; background: #111; border: 1px solid #333; color: #999; border-radius: 50%; width: 20px; height: 20px; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; }

      /* ─── INPUT BAR ───────────────────────────────────────────────────── */
      .ibar { position: relative; z-index: 5; padding: 12px 24px 20px; border-top: 1px solid rgba(255,255,255,0.04); display: flex; align-items: flex-end; gap: 10px; background: rgba(0,0,0,0.42); backdrop-filter: blur(14px); }

      .att { background: none; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; color: rgba(255,255,255,0.22); padding: 10px; cursor: pointer; font-size: 15px; line-height: 1; transition: all 0.2s; min-height: 44px; width: 44px; display: flex; align-items: center; justify-content: center; }
      .att:hover { border-color: var(--hb); color: var(--ha); }
      .att:disabled { opacity: 0.12; cursor: not-allowed; }

      .ti { flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 11px 16px; color: rgba(255,255,255,0.9); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; resize: none; line-height: 1.5; transition: all 0.2s; min-height: 44px; max-height: 120px; }
      .ti:focus { border-color: var(--hb); background: rgba(255,255,255,0.055); box-shadow: inset 0 0 20px -10px var(--ha); }
      .ti::placeholder { color: rgba(255,255,255,0.18); font-family: 'DM Sans', sans-serif; }
      .ti:disabled { opacity: 0.28; }

      /* Send button: DM Sans for readability */
      .sbtn { background: transparent; border: 1px solid var(--hb); border-radius: 12px; color: var(--ha); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; padding: 0 20px; cursor: pointer; transition: all 0.2s; min-height: 44px; white-space: nowrap; position: relative; overflow: hidden; }
      .sbtn::before { content: ''; position: absolute; inset: 0; background: var(--ha); opacity: 0; transition: opacity 0.2s; }
      .sbtn:hover::before { opacity: 0.1; }
      .sbtn:hover { box-shadow: 0 0 14px -4px var(--ha); }
      .sbtn:disabled { opacity: 0.15; cursor: not-allowed; box-shadow: none; }
      .sbtn span { position: relative; z-index: 1; }

      /* ─── SWITCH MODAL ────────────────────────────────────────────────── */
      .moverlay { position: fixed; inset: 0; background: rgba(0,0,0,0.88); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(10px); animation: fi 0.2s ease; }
      .mbox { background: #070707; border: 1px solid var(--ma); border-radius: 22px; padding: 36px 32px; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 0 60px -12px var(--ma), 0 24px 60px rgba(0,0,0,0.95); position: relative; overflow: hidden; }
      .mbox::before { content: ''; position: absolute; top: -50%; left: -50%; right: -50%; bottom: -50%; background: radial-gradient(circle at center, var(--ma) 0%, transparent 60%); opacity: 0.03; pointer-events: none; }

      .micon-ring { width: 68px; height: 68px; border-radius: 50%; border: 1px solid var(--ma); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 0 24px -6px var(--ma); background: rgba(0,0,0,0.5); }

      /* Modal title: Cinzel for the hotel name (decorative) */
      .mtitle { font-family: 'Cinzel', serif; font-size: 16px; font-weight: 600; color: var(--ma); letter-spacing: 1px; margin-bottom: 12px; text-shadow: 0 0 14px var(--ma); }

      /* Modal body: DM Sans — clear and readable */
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
