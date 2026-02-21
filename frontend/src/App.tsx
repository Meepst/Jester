import { useState, useRef, useEffect } from "react";
import { useChat } from "./hooks/useChat";

// ─── Embedded SVG Components ──────────────────────────────────────────────────

const SVG_DEFAULT = ({ color = "#fff", size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    fill={color}
  >
    <path d="M22.248,47.6572 L28.758,46.0302 C28.916,45.9902 29.084,45.9902 29.242,46.0302 L35.753,47.6572 L34.214,38.5982 C33.844,38.8112 33.541,39.1372 33.368,39.5452 C31.833,43.1672 29.688,45.9152 29.009,46.0002 C28.313,45.9132 26.169,43.1642 24.633,39.5442 C24.474,39.1682 24.198,38.8692 23.867,38.6572 L22.248,47.6572 Z" />
    <path d="M53.9805,51.8037 C52.1075,42.4367 45.7965,39.6687 36.2165,38.4397 L37.9855,48.8297 C38.0425,49.1627 37.9285,49.5027 37.6805,49.7327 C37.4325,49.9627 37.0835,50.0527 36.7575,49.9707 L28.9995,48.0307 L21.2425,49.9707 C21.1625,49.9907 21.0815,49.9997 20.9995,49.9997 C20.7495,49.9997 20.5065,49.9067 20.3195,49.7327 C20.0715,49.5027 19.9565,49.1627 20.0145,48.8287 L21.8765,38.4277 C12.2435,39.6497 5.8955,42.4057 4.0195,51.8047 C4.0065,51.8687 3.9995,51.9337 3.9995,51.9997 C3.9995,54.7387 7.3005,56.3937 13.8125,56.9207 C16.5555,59.7697 26.0495,59.9997 28.9995,59.9997 C31.9505,59.9997 41.4445,59.7697 44.1875,56.9207 C50.6995,56.3937 53.9995,54.7387 53.9995,51.9997 C53.9995,51.9337 53.9935,51.8687 53.9805,51.8037" />
    <path d="M34.498,31.5996 C34.032,31.8676 33.516,31.9996 33,31.9996 C32.376,31.9996 31.754,31.8056 31.23,31.4216 C30.271,30.7206 29.816,29.5206 30.069,28.3606 L31.02,23.9996 L29,23.9996 C28.621,23.9996 28.275,23.7866 28.106,23.4476 L27,21.2366 L25.894,23.4476 C25.725,23.7866 25.379,23.9996 25,23.9996 L18,23.9996 L18,25.9996 C18,28.0766 19.278,29.6006 21.195,29.9326 C22.563,35.2876 25.187,37.9996 29,37.9996 C32.714,37.9996 35.295,35.4186 36.692,30.3356 L34.498,31.5996 Z" />
    <path d="M42.8818,32.4229 C42.2798,32.0019 41.3688,31.3569 40.7328,29.7539 C40.1378,30.5119 39.3658,31.1229 38.4388,31.5119 C37.5608,34.3839 36.3418,36.3189 34.9938,37.6139 C39.6848,37.0309 43.9998,35.7969 43.9998,33.9999 C43.9998,33.2029 43.4068,32.7889 42.8818,32.4229" />
    <path d="M19.5684,31.5361 C18.6374,31.1551 17.8624,30.5451 17.2664,29.7841 C16.6224,31.4101 15.6974,32.0581 15.0864,32.4791 C14.6024,32.8131 14.0004,33.2291 14.0004,34.0001 C14.0004,35.7341 18.2774,36.9971 22.9914,37.6011 C21.6514,36.3091 20.4414,34.3861 19.5684,31.5361" />
    <path d="M33,30 C32.792,30 32.585,29.935 32.41,29.807 C32.09,29.574 31.938,29.174 32.023,28.787 L33.194,23.414 C31.13,21.309 30,18.697 30,16 C30,9.383 36.729,4 45,4 C53.271,4 60,9.383 60,16 C60,22.617 53.271,28 45,28 C42.782,28 40.656,27.626 38.672,26.887 L33.499,29.867 C33.344,29.956 33.172,30 33,30" />
    <path d="M28,16 C28,14.615 28.254,13.279 28.711,12.014 C22.512,12.166 18.531,17.092 18.049,22 L24.382,22 L26.106,18.553 C26.445,17.875 27.555,17.875 27.894,18.553 L29.116,20.996 C28.389,19.416 28,17.727 28,16" />
  </svg>
);

const SVG_HORUS = ({ color = "#fff", size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 465 465"
    xmlns="http://www.w3.org/2000/svg"
    fill={color}
  >
    <path d="M390.782,301.798c-3.364-2.412-8.053-1.642-10.465,1.725c-2.414,3.366-1.642,8.052,1.725,10.465c7.42,5.32,13.621,11.982,18.365,19.521c-14.329,4.715-24.707,18.217-24.707,34.104V457.5c0,4.142,3.357,7.5,7.5,7.5s7.5-3.358,7.5-7.5v-89.887c0-9.966,7.017-18.313,16.367-20.391c2.646,7.402,4.058,15.277,4.058,23.31c0,4.142,3.357,7.5,7.5,7.5s7.5-3.358,7.5-7.5C426.125,343.361,412.913,317.666,390.782,301.798z" />
    <path d="M295.287,323.635c23.915-33.415,40.796-91.77,42.154-145.166c15.178-2.49,27.85-12.503,34.071-26.066c3.417,5.953,6.506,12.153,9.228,18.589c1.613,3.816,6.019,5.599,9.829,3.987c3.815-1.613,5.601-6.014,3.987-9.829C365.529,96.503,298.639,52.132,224.12,52.079c-0.005,0-0.01-0.001-0.015-0.001c-0.009,0-0.018,0-0.028,0c-0.03,0-0.06-0.001-0.09-0.001C121.916,52.078,38.874,135.12,38.874,237.191V457.5c0,4.142,3.358,7.5,7.5,7.5h177.613c4.142,0,7.5-3.358,7.5-7.5V328.686h48.8l0.001,128.814c0,4.142,3.357,7.5,7.5,7.5h49.787c4.143,0,7.5-3.358,7.5-7.5V294.509c0-4.142-3.357-7.5-7.5-7.5s-7.5,3.358-7.5,7.5V390h-34.788L295.287,323.635z" />
    <path d="M273.413,126.293c-7.444-14.916-27.942-30.344-49.36-30.344c-21.645,0-39.255,15.115-39.255,33.693s17.61,33.693,39.255,33.693c21.418,0,41.916-15.428,49.36-30.344C274.465,130.883,274.465,128.402,273.413,126.293z" />
  </svg>
);

const SVG_CACTUS = ({ color = "#fff", size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    xmlns="http://www.w3.org/2000/svg"
    fill={color}
  >
    <path d="m 5.4501598,11.753877 c -0.129791,0.2622 -0.231671,0.4786 -0.226531,0.4863 0.0076,0.01 0.845022,0.1349 1.865755,0.2902 1.020723,0.1527 2.148237,0.3232 2.504678,0.3768 0.356331,0.053 0.6515522,0.097 0.6515522,0.094 0.01016,-0.01 -0.4225722,-0.8806 -0.4353022,-0.8806 -0.01017,0 -0.936732,-0.1884 -2.059216,-0.42 -1.122493,-0.2317 -2.046486,-0.42 -2.051626,-0.42 -0.0075,0 -0.11951,0.2137 -0.24931,0.4732 z" />
    <path d="m 6.717802,4.085077 c -0.0916,0.02 -0.280041,0.092 -0.422572,0.1628 -0.13996,0.069 -0.2749,0.1273 -0.2978,0.1273 -0.02289,0 -0.142531,-0.051 -0.264731,-0.1145 -0.386941,-0.1985 -0.671992,-0.23409998 -0.936733,-0.1171 -0.11449,0.051 -0.290201,0.1961 -0.366491,0.3054 l -0.04836,0.066 0.246851,0 c 0.30294,0 0.384371,0.038 0.384371,0.1782 0,0.1222 -0.05596,0.1399 -0.420002,0.1399 -1.254853,0 -1.944605,0.3717 -2.252686,1.2167 -0.117061,0.3233 -0.155261,0.5422 -0.170571,1.0232996 -0.01775,0.5727 0.02804,0.9774 0.201061,1.8199 0.12723,0.6237 0.1298,0.6466 0.13237,1.0946 0.0026,0.3691 -0.0051,0.4861 -0.04078,0.6007 -0.05853,0.1884 -0.18575,0.3717 -0.320691,0.4684 -0.10432,0.071 -0.12477,0.076 -0.356321,0.076 -0.21637,0 -0.262161,-0.01 -0.376771,-0.069 -0.11682,-0.061 -0.249191,-0.1857 -0.335761,-0.3155 -0.05351,-0.079 -0.01788,0.3003 0.0458,0.5115 0.178161,0.5651 0.503992,0.9724 0.911263,1.1378 0.12722,0.051 0.18832,0.059 0.501421,0.059 0.402122,0 0.572692,-0.036 0.865473,-0.1756 0.0993,-0.046 0.229101,-0.1298 0.292771,-0.1859 l 0.11204,-0.1018 -0.10433,-0.2265 c -0.134931,-0.2928 -0.252001,-0.6618 -0.302931,-0.9596 -0.06368,-0.3589 -0.03821,-0.9927 0.05093,-1.316 0.147681,-0.5243 0.427591,-1.013 0.822122,-1.4254 0.239271,-0.252 0.432732,-0.4073 0.705063,-0.5651 0.0993,-0.059 0.18587,-0.1095 0.19347,-0.1145 0.0076,-0.01 -0.02033,-0.041 -0.06368,-0.074 -0.213791,-0.1732 -0.671992,-0.1833 -1.142813,-0.025 -0.287631,0.097 -0.422562,0.1121 -0.516732,0.059 -0.05853,-0.033 -0.17314,-0.1654 -0.15526,-0.1833 0.0051,-0.01 0.05596,0.01 0.10947,0.025 0.05596,0.02 0.1222,0.036 0.1451,0.038 0.02547,0 0.139961,-0.087 0.254571,-0.1908996 0.11706,-0.1069 0.272321,-0.2342 0.348731,-0.285 0.155261,-0.1044 0.391961,-0.1858 0.534492,-0.1858 0.24942,0 0.557381,0.168 0.837422,0.4556 l 0.170321,0.1730996 0.17315,-0.041 0.173141,-0.041 -0.01531,-0.1399996 c -0.03061,-0.2723 -0.124771,-0.4811 -0.280041,-0.6184 -0.183301,-0.1629 -0.626202,-0.2903 -0.913833,-0.2596 l -0.12979,0.013 0.10175,-0.038 c 0.05596,-0.023 0.206201,-0.059 0.330861,-0.079 0.419991,-0.074 0.748282,0 0.987543,0.219 0.16543,0.1501 0.267311,0.3487 0.318121,0.6236 l 0.03821,0.2036 0.473501,0 c 0.465792,0 0.865473,0.043 1.249714,0.1272996 l 0.16542,0.036 0.142531,-0.1526996 c 0.257151,-0.2723 0.3716312,-0.56 0.3971012,-0.98 0.01788,-0.3029 -0.01787,-0.5573 -0.1170602,-0.8475 -0.101871,-0.2953 -0.213791,-0.471 -0.448032,-0.7051 -0.2291,-0.2317 -0.460651,-0.3691 -0.727962,-0.4327 -0.20081,-0.046 -0.661592,-0.046 -0.888112,0 z" />
  </svg>
);

const SVG_DIAMOND = ({ color = "#fff", size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fill={color}
  >
    <polygon points="50,5 90,38 70,95 30,95 10,38" />
    <polygon points="50,5 90,38 50,30 10,38" opacity="0.45" />
    <polygon points="10,38 30,95 50,58" opacity="0.55" />
    <polygon points="90,38 70,95 50,58" opacity="0.35" />
    <polygon points="50,30 90,38 50,58 10,38" opacity="0.2" fill="#fff" />
  </svg>
);

const SVG_SWORD = ({ color = "#fff", size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fill={color}
  >
    <polygon points="50,4 56,42 44,42" />
    <rect x="47" y="42" width="6" height="34" />
    <rect x="28" y="42" width="44" height="8" rx="3" />
    <rect x="44" y="76" width="12" height="18" rx="3" />
    <circle cx="50" cy="97" r="5" />
  </svg>
);

const SVG_VOLCANO = ({ color = "#fff", size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fill={color}
  >
    <polygon points="50,14 82,76 18,76" opacity="0.9" />
    <rect x="18" y="76" width="64" height="8" rx="2" />
    <path d="M43,14 Q38,4 45,7 Q50,2 55,7 Q62,4 57,14" opacity="0.9" />
    <ellipse cx="50" cy="14" rx="9" ry="5" opacity="0.6" />
  </svg>
);

// ─── Casino Definitions ───────────────────────────────────────────────────────
const CASINOS = [
  {
    id: "fontainebleau",
    name: "Fontainebleau",
    shortName: "FONTAINEBLEAU",
    Icon: SVG_DIAMOND,
    tagline: "Ultra-luxury on the Strip",
    theme: "fontainebleau",
    accent: "#C9A84C",
    accentSoft: "#e8d08a",
    bg: "linear-gradient(160deg, #0a0800 0%, #1a1400 40%, #0f0c00 100%)",
    bubbleUser: "#2a1f00",
    bubbleAssistant: "#111000",
    borderColor: "#C9A84C",
    headerBg: "rgba(10,8,0,0.88)",
    font: "'Didot','Bodoni MT','Playfair Display',Georgia,serif",
    pattern: "diamonds",
  },
  {
    id: "santafe",
    name: "Santa Fe Station",
    shortName: "SANTA FE",
    Icon: SVG_CACTUS,
    tagline: "Locals' favorite, heart of the valley",
    theme: "santafe",
    accent: "#E8632A",
    accentSoft: "#f4a06c",
    bg: "linear-gradient(160deg, #1a0800 0%, #2d1200 40%, #180a00 100%)",
    bubbleUser: "#3d1a00",
    bubbleAssistant: "#1a0d00",
    borderColor: "#E8632A",
    headerBg: "rgba(26,8,0,0.88)",
    font: "'Trebuchet MS','Gill Sans',sans-serif",
    pattern: "triangles",
  },
  {
    id: "excalibur",
    name: "Excalibur",
    shortName: "EXCALIBUR",
    Icon: SVG_SWORD,
    tagline: "Where legends are made",
    theme: "excalibur",
    accent: "#C41E3A",
    accentSoft: "#e86070",
    bg: "linear-gradient(160deg, #0d0005 0%, #1a000a 40%, #0a0008 100%)",
    bubbleUser: "#2d000f",
    bubbleAssistant: "#120008",
    borderColor: "#C41E3A",
    headerBg: "rgba(13,0,5,0.88)",
    font: "'Palatino Linotype','Book Antiqua',Palatino,serif",
    pattern: "shields",
  },
  {
    id: "mirage",
    name: "The Mirage",
    shortName: "THE MIRAGE",
    Icon: SVG_VOLCANO,
    tagline: "The iconic volcano awaits",
    theme: "mirage",
    accent: "#FF6B00",
    accentSoft: "#ffaa55",
    bg: "linear-gradient(160deg, #0a0500 0%, #1f0f00 40%, #0d0800 100%)",
    bubbleUser: "#3a1a00",
    bubbleAssistant: "#120800",
    borderColor: "#FF6B00",
    headerBg: "rgba(10,5,0,0.88)",
    font: "'Copperplate Gothic','Copperplate',Georgia,serif",
    pattern: "waves",
  },
  {
    id: "luxor",
    name: "Luxor",
    shortName: "LUXOR",
    Icon: SVG_HORUS,
    tagline: "Mysteries of ancient Egypt await",
    theme: "luxor",
    accent: "#D4AF37",
    accentSoft: "#edd97a",
    bg: "linear-gradient(160deg, #000000 0%, #0d0d00 40%, #000800 100%)",
    bubbleUser: "#1a1600",
    bubbleAssistant: "#080800",
    borderColor: "#D4AF37",
    headerBg: "rgba(0,0,0,0.92)",
    font: "'Trajan Pro','Optima','Palatino',serif",
    pattern: "pyramids",
  },
];

type Casino = (typeof CASINOS)[0];

// One stable session ID per casino so switching resets context
const sessionIds: Record<string, string> = {};
CASINOS.forEach((c) => {
  sessionIds[c.id] = crypto.randomUUID();
});

// ─── Pattern Background ───────────────────────────────────────────────────────
function PatternBg({ type, accent }: { type: string; accent: string }) {
  const c = accent + "14";
  const pats: Record<string, React.ReactElement> = {
    diamonds: (
      <pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse">
        <polygon
          points="20,2 38,20 20,38 2,20"
          fill="none"
          stroke={c}
          strokeWidth="1"
        />
      </pattern>
    ),
    triangles: (
      <pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse">
        <polygon
          points="20,4 36,34 4,34"
          fill="none"
          stroke={c}
          strokeWidth="1"
        />
      </pattern>
    ),
    shields: (
      <pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse">
        <path
          d="M20 4 L34 10 L34 24 L20 36 L6 24 L6 10 Z"
          fill="none"
          stroke={c}
          strokeWidth="1"
        />
      </pattern>
    ),
    waves: (
      <pattern id="p" width="40" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M0 10 Q10 0 20 10 Q30 20 40 10"
          fill="none"
          stroke={c}
          strokeWidth="1"
        />
      </pattern>
    ),
    pyramids: (
      <pattern id="p" width="40" height="34" patternUnits="userSpaceOnUse">
        <polygon
          points="20,4 38,32 2,32"
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
      <defs>{pats[type]}</defs>
      <rect width="100%" height="100%" fill="url(#p)" />
    </svg>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────
function ChatPanel({ casino }: { casino: Casino }) {
  const sessionId = sessionIds[casino.id];

  // useChat from hooks/useChat.ts — passes theme key to backend
  const { messages, streaming, sendMessage } = useChat(sessionId, casino.theme);

  const [input, setInput] = useState("");
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const CIcon = casino.Icon;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [input]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result as string;
      setImagePreview(r);
      setImageBase64(r.split(",")[1]);
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
    <main
      className="main"
      style={
        {
          "--cf": casino.font,
          "--cbg": casino.bg,
          "--ca": casino.accent,
          "--cas": casino.accentSoft,
          "--cbu": casino.bubbleUser,
          "--cba": casino.bubbleAssistant,
          "--cb": casino.borderColor,
          "--chbg": casino.headerBg,
        } as React.CSSProperties
      }
    >
      <div className="mpat">
        <PatternBg type={casino.pattern} accent={casino.accent} />
      </div>

      <header className="hdr">
        <div className="hdr-ring">
          <CIcon color={casino.accent} size={28} />
        </div>
        <div className="hdr-div" />
        <div>
          <div className="hdr-name">{casino.name}</div>
          <div className="hdr-tag">{casino.tagline}</div>
        </div>
        <div className="live">
          <div className="live-dot" />
          LIVE
        </div>
      </header>

      <div className="msgs">
        {messages.length === 0 && (
          <div className="empty">
            <div className="empty-ring">
              <CIcon color={casino.accent} size={42} />
            </div>
            <div className="empty-name">{casino.name}</div>
            <div className="empty-sub">{casino.tagline}</div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`mrow ${msg.role}`}>
            {msg.role === "assistant" && (
              <div className="av">
                <CIcon color={casino.accent} size={18} />
              </div>
            )}
            <div className="bwrap">
              <span className="blabel">
                {msg.role === "user" ? "YOU" : casino.shortName}
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
                <SVG_DEFAULT color="rgba(255,255,255,0.45)" size={18} />
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
          onChange={handleFileChange}
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
          ref={textareaRef}
          className="ti"
          placeholder={`Speak with ${casino.name}...`}
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
          <span>{streaming ? "···" : "ENTER"}</span>
        </button>
      </div>
    </main>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [casino, setCasino] = useState<Casino>(CASINOS[0]);
  const [pendingCasino, setPendingCasino] = useState<Casino | null>(null);
  const [showModal, setShowModal] = useState(false);

  const requestSwitch = (ca: Casino) => {
    if (ca.id === casino.id) return;
    setPendingCasino(ca);
    setShowModal(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=IM+Fell+English:ital@0;1&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;overflow:hidden;background:#000}
        .app{display:flex;height:100vh;font-family:var(--cf)}

        .sb{width:208px;flex-shrink:0;background:#040404;border-right:1px solid #111;display:flex;flex-direction:column}
        .sb-head{padding:18px 14px 16px;border-bottom:1px solid #111;display:flex;align-items:center;gap:10px}
        .sb-logo{font-family:'Cinzel Decorative',serif;font-size:9px;letter-spacing:2px;color:#3a3a3a;line-height:1.5}
        .ci-list{flex:1;overflow-y:auto;scrollbar-width:none}
        .ci-list::-webkit-scrollbar{display:none}
        .ci{display:flex;align-items:center;gap:11px;padding:13px 14px;cursor:pointer;border:none;background:transparent;width:100%;text-align:left;position:relative;transition:background 0.2s;border-bottom:1px solid #0a0a0a}
        .ci::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--ia);opacity:0;transition:opacity 0.25s}
        .ci:hover{background:#0c0c0c}
        .ci:hover::before,.ci.active::before{opacity:1}
        .ci.active{background:#0e0e0e}
        .ci-ico{width:30px;height:30px;flex-shrink:0;display:flex;align-items:center;justify-content:center;opacity:0.3;transition:opacity 0.25s}
        .ci.active .ci-ico,.ci:hover .ci-ico{opacity:1}
        .ci-txt{display:flex;flex-direction:column;gap:2px}
        .ci-name{font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:#444;font-weight:700;transition:color 0.2s}
        .ci.active .ci-name,.ci:hover .ci-name{color:var(--ia)}
        .ci-sub{font-family:'IM Fell English',serif;font-style:italic;font-size:10px;color:#252525;line-height:1.3;transition:color 0.2s}
        .ci:hover .ci-sub{color:#3a3a3a}
        .ci.active .ci-sub{color:#444}

        .main{flex:1;display:flex;flex-direction:column;position:relative;background:var(--cbg);overflow:hidden;transition:background 0.6s}
        .mpat{position:absolute;inset:0;z-index:0}
        .main::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 30%,rgba(0,0,0,0.78) 100%);pointer-events:none;z-index:1}

        .hdr{position:relative;z-index:10;padding:0 24px;height:76px;display:flex;align-items:center;gap:16px;border-bottom:1px solid rgba(255,255,255,0.04);background:var(--chbg);backdrop-filter:blur(14px)}
        .hdr-ring{width:48px;height:48px;flex-shrink:0;border-radius:50%;border:1px solid var(--ca);display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.45);box-shadow:0 0 16px -5px var(--ca),inset 0 0 12px -7px var(--ca);animation:rp 3s ease-in-out infinite}
        @keyframes rp{0%,100%{box-shadow:0 0 14px -5px var(--ca),inset 0 0 10px -7px var(--ca)}50%{box-shadow:0 0 28px -2px var(--ca),inset 0 0 20px -4px var(--ca)}}
        .hdr-div{width:1px;height:36px;background:linear-gradient(to bottom,transparent,var(--ca),transparent);opacity:0.3}
        .hdr-name{font-family:'Cinzel Decorative',serif;font-size:15px;color:var(--ca);letter-spacing:2px;text-shadow:0 0 18px var(--cas);line-height:1.2}
        .hdr-tag{font-family:'IM Fell English',serif;font-style:italic;font-size:11px;color:rgba(255,255,255,0.28);margin-top:3px}
        .live{margin-left:auto;display:flex;align-items:center;gap:5px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:20px;padding:4px 10px;font-size:9px;color:rgba(255,255,255,0.3);letter-spacing:2px;font-family:'Cinzel',serif}
        .live-dot{width:6px;height:6px;border-radius:50%;background:var(--ca);box-shadow:0 0 6px var(--ca);animation:lp 1.5s ease-in-out infinite}
        @keyframes lp{0%,100%{opacity:1}50%{opacity:0.3}}

        .msgs{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:20px;position:relative;z-index:5;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.06) transparent}
        .msgs::-webkit-scrollbar{width:3px}
        .msgs::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:2px}
        .empty{margin:auto;text-align:center;animation:fi 0.8s ease}
        @keyframes fi{from{opacity:0}to{opacity:1}}
        .empty-ring{width:84px;height:84px;border-radius:50%;border:1px solid var(--ca);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;box-shadow:0 0 30px -8px var(--ca),inset 0 0 20px -10px var(--ca);animation:rp 3s ease-in-out infinite;background:rgba(0,0,0,0.5)}
        .empty-name{font-family:'Cinzel Decorative',serif;font-size:16px;color:var(--ca);letter-spacing:3px;margin-bottom:6px;text-shadow:0 0 20px var(--cas)}
        .empty-sub{font-family:'IM Fell English',serif;font-style:italic;font-size:12px;color:rgba(255,255,255,0.17)}
        .mrow{display:flex;gap:10px;animation:ms 0.3s ease}
        @keyframes ms{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .mrow.user{justify-content:flex-end}
        .mrow.assistant{justify-content:flex-start}
        .av{width:34px;height:34px;flex-shrink:0;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid var(--cb);background:rgba(0,0,0,0.5);margin-top:20px}
        .av.uav{border-color:rgba(255,255,255,0.1);background:rgba(255,255,255,0.04)}
        .bwrap{display:flex;flex-direction:column;max-width:66%}
        .mrow.user .bwrap{align-items:flex-end}
        .blabel{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:rgba(255,255,255,0.16);margin-bottom:5px}
        .mrow.user .blabel{color:var(--ca);opacity:0.55}
        .bubble{padding:12px 17px;border-radius:16px;font-size:14px;line-height:1.7;white-space:pre-wrap;font-family:var(--cf);border:1px solid transparent}
        .bubble.user{background:var(--cbu);color:#fff;border-color:var(--cb);border-bottom-right-radius:4px;box-shadow:0 0 18px -9px var(--ca)}
        .bubble.assistant{background:var(--cba);color:rgba(255,255,255,0.82);border-color:rgba(255,255,255,0.05);border-bottom-left-radius:4px}
        .bubble img{max-width:210px;max-height:150px;border-radius:8px;display:block;margin-bottom:10px;object-fit:cover;border:1px solid var(--cb)}
        .cur{animation:blink 1s step-end infinite;color:var(--ca)}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

        .prev-zone{position:relative;z-index:5;padding:0 24px 10px}
        .prev-inner{display:inline-block;position:relative}
        .prev-inner img{height:68px;border-radius:8px;object-fit:cover;border:1px solid var(--cb);box-shadow:0 0 10px -4px var(--ca)}
        .prev-rm{position:absolute;top:-7px;right:-7px;background:#111;border:1px solid #333;color:#999;border-radius:50%;width:20px;height:20px;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center}

        .ibar{position:relative;z-index:5;padding:14px 24px 20px;border-top:1px solid rgba(255,255,255,0.04);display:flex;align-items:flex-end;gap:10px;background:rgba(0,0,0,0.4);backdrop-filter:blur(12px)}
        .att{background:none;border:1px solid rgba(255,255,255,0.06);border-radius:10px;color:rgba(255,255,255,0.22);padding:10px;cursor:pointer;font-size:15px;line-height:1;transition:all 0.2s;min-height:44px;width:44px;display:flex;align-items:center;justify-content:center}
        .att:hover{border-color:var(--cb);color:var(--ca)}
        .att:disabled{opacity:0.12;cursor:not-allowed}
        .ti{flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:11px 17px;color:rgba(255,255,255,0.88);font-family:var(--cf);font-size:13px;outline:none;resize:none;line-height:1.5;transition:all 0.2s;min-height:44px;max-height:120px}
        .ti:focus{border-color:var(--cb);background:rgba(255,255,255,0.055);box-shadow:inset 0 0 20px -10px var(--ca)}
        .ti::placeholder{color:rgba(255,255,255,0.14)}
        .ti:disabled{opacity:0.28}
        .sbtn{background:transparent;border:1px solid var(--cb);border-radius:12px;color:var(--ca);font-family:'Cinzel',serif;font-size:10px;font-weight:700;letter-spacing:2px;padding:0 18px;cursor:pointer;transition:all 0.2s;min-height:44px;white-space:nowrap;text-shadow:0 0 8px var(--cas);position:relative;overflow:hidden}
        .sbtn::before{content:'';position:absolute;inset:0;background:var(--ca);opacity:0;transition:opacity 0.2s}
        .sbtn:hover::before{opacity:0.1}
        .sbtn:hover{box-shadow:0 0 14px -4px var(--ca)}
        .sbtn:disabled{opacity:0.15;cursor:not-allowed;box-shadow:none}
        .sbtn span{position:relative;z-index:1}

        .moverlay{position:fixed;inset:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:100;backdrop-filter:blur(8px);animation:fi 0.2s ease}
        .mbox{background:#060606;border:1px solid var(--ma);border-radius:22px;padding:36px 30px;max-width:390px;width:90%;text-align:center;box-shadow:0 0 60px -12px var(--ma),0 24px 60px rgba(0,0,0,0.95);position:relative;overflow:hidden}
        .mbox::before{content:'';position:absolute;top:-50%;left:-50%;right:-50%;bottom:-50%;background:radial-gradient(circle at center,var(--ma) 0%,transparent 60%);opacity:0.025;pointer-events:none}
        .micon-ring{width:68px;height:68px;border-radius:50%;border:1px solid var(--ma);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow:0 0 24px -6px var(--ma);background:rgba(0,0,0,0.5)}
        .mtitle{font-family:'Cinzel Decorative',serif;font-size:13px;color:var(--ma);letter-spacing:2px;margin-bottom:10px;text-shadow:0 0 14px var(--ma)}
        .mdesc{font-family:'IM Fell English',serif;font-style:italic;font-size:13px;color:rgba(255,255,255,0.28);line-height:1.7;margin-bottom:26px}
        .mdesc strong{color:var(--ma);font-style:normal;font-family:'Cinzel',serif;font-size:10px;letter-spacing:1px}
        .macts{display:flex;gap:10px;justify-content:center}
        .mstay{padding:10px 22px;border:1px solid #1e1e1e;border-radius:10px;background:transparent;color:rgba(255,255,255,0.22);font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;cursor:pointer;transition:all 0.2s}
        .mstay:hover{border-color:#333;color:rgba(255,255,255,0.5)}
        .mgo{padding:10px 22px;border:1px solid var(--ma);border-radius:10px;background:transparent;color:var(--ma);font-family:'Cinzel',serif;font-size:9px;font-weight:700;letter-spacing:2px;cursor:pointer;transition:all 0.2s;text-shadow:0 0 8px var(--ma)}
        .mgo:hover{box-shadow:0 0 14px -4px var(--ma)}
      `}</style>

      <div className="app">
        {/* Sidebar */}
        <aside className="sb">
          <div className="sb-head">
            <SVG_DEFAULT color="#333" size={22} />
            <div className="sb-logo">
              Las Vegas
              <br />
              Concierge
            </div>
          </div>
          <div className="ci-list">
            {CASINOS.map((ca) => {
              const IIcon = ca.Icon;
              return (
                <button
                  key={ca.id}
                  className={`ci ${ca.id === casino.id ? "active" : ""}`}
                  style={{ "--ia": ca.accent } as React.CSSProperties}
                  onClick={() => requestSwitch(ca)}
                >
                  <div className="ci-ico">
                    <IIcon
                      color={ca.id === casino.id ? ca.accent : "#555"}
                      size={24}
                    />
                  </div>
                  <div className="ci-txt">
                    <span className="ci-name">{ca.shortName}</span>
                    <span className="ci-sub">{ca.tagline}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* key={casino.id} forces ChatPanel to remount on switch, clearing local state */}
        <ChatPanel key={casino.id} casino={casino} />
      </div>

      {/* Switch Modal */}
      {showModal &&
        pendingCasino &&
        (() => {
          const PIcon = pendingCasino.Icon;
          return (
            <div
              className="moverlay"
              style={{ "--ma": pendingCasino.accent } as React.CSSProperties}
              onClick={() => {
                setShowModal(false);
                setPendingCasino(null);
              }}
            >
              <div className="mbox" onClick={(e) => e.stopPropagation()}>
                <div className="micon-ring">
                  <PIcon color={pendingCasino.accent} size={36} />
                </div>
                <div className="mtitle">{pendingCasino.name}</div>
                <div className="mdesc">
                  Step away from <strong>{casino.shortName}</strong> and enter{" "}
                  <strong>{pendingCasino.shortName}</strong>?<br />
                  Your current conversation will be cleared.
                </div>
                <div className="macts">
                  <button
                    className="mstay"
                    onClick={() => {
                      setShowModal(false);
                      setPendingCasino(null);
                    }}
                  >
                    STAY
                  </button>
                  <button
                    className="mgo"
                    onClick={() => {
                      setCasino(pendingCasino);
                      setShowModal(false);
                      setPendingCasino(null);
                    }}
                  >
                    ENTER
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </>
  );
}
