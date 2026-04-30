import { useState, useEffect, useRef } from "react";

const COLORS = {
  primary: "#F97316",
  primaryDark: "#EA580C",
  primaryLight: "#FED7AA",
  bg: "#FAFAF9",
  card: "#FFFFFF",
  text: "#1C1917",
  muted: "#78716C",
  border: "#E7E5E4",
  success: "#16A34A",
  danger: "#DC2626",
};

const PROVIDERS = [
  { id: 1, name: "Rajesh Kumar", category: "Electrician", rating: 4.8, distance: "0.8 km", available: true, exp: "8 yrs", jobs: 320, avatar: "RK", color: "#3B82F6" },
  { id: 2, name: "Suresh Nair", category: "Plumber", rating: 4.6, distance: "1.2 km", available: true, exp: "6 yrs", jobs: 210, avatar: "SN", color: "#8B5CF6" },
  { id: 3, name: "Mohammed Ali", category: "Mechanic", rating: 4.9, distance: "2.1 km", available: false, exp: "12 yrs", jobs: 540, avatar: "MA", color: "#10B981" },
  { id: 4, name: "Lakshmi Devi", category: "Maid", rating: 4.7, distance: "0.5 km", available: true, exp: "4 yrs", jobs: 180, avatar: "LD", color: "#EC4899" },
  { id: 5, name: "Anita Sharma", category: "Chef", rating: 4.9, distance: "1.8 km", available: true, exp: "10 yrs", jobs: 420, avatar: "AS", color: "#F59E0B" },
  { id: 6, name: "Vikram Singh", category: "Electrician", rating: 4.5, distance: "3.0 km", available: false, exp: "5 yrs", jobs: 150, avatar: "VS", color: "#3B82F6" },
  { id: 7, name: "Priya Menon", category: "Chef", rating: 4.8, distance: "1.1 km", available: true, exp: "7 yrs", jobs: 290, avatar: "PM", color: "#F59E0B" },
];

const CATEGORIES = [
  { key: "All", label: "All", icon: "⊞", color: "#F97316" },
  { key: "Electrician", label: "Electric", icon: "⚡", color: "#F59E0B" },
  { key: "Plumber", label: "Plumber", icon: "🔧", color: "#3B82F6" },
  { key: "Mechanic", label: "Mechanic", icon: "⚙", color: "#6B7280" },
  { key: "Maid", label: "Maids", icon: "✦", color: "#EC4899" },
  { key: "Chef", label: "Chefs", icon: "★", color: "#10B981" },
];

const LANGUAGES = ["English", "हिंदी", "ಕನ್ನಡ", "தமிழ்", "తెలుగు"];

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: "#F59E0B", fontSize: 12 }}>
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
};

// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
function SplashScreen({ onNext }) {
  const [lang, setLang] = useState("English");
  const [anim, setAnim] = useState(false);
  useEffect(() => { setTimeout(() => setAnim(true), 100); }, []);

  return (
    <div style={{ height: "100%", background: "linear-gradient(160deg, #F97316 0%, #EA580C 60%, #C2410C 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "60px 32px 48px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", bottom: 120, left: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, opacity: anim ? 1 : 0, transform: anim ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease" }}>
        <div style={{ width: 90, height: 90, borderRadius: 28, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, border: "1.5px solid rgba(255,255,255,0.3)" }}>🛠</div>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontSize: 38, fontWeight: 800, margin: 0, letterSpacing: -1, fontFamily: "Georgia, serif" }}>Serva</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, margin: "8px 0 0", fontWeight: 400, letterSpacing: 0.3 }}>Trusted local services, at your doorstep</p>
        </div>
      </div>

      <div style={{ width: "100%", opacity: anim ? 1 : 0, transition: "opacity 1s ease 0.4s" }}>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, textAlign: "center", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Choose Language</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          {LANGUAGES.map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: "10px", borderRadius: 12, border: lang === l ? "2px solid #fff" : "1.5px solid rgba(255,255,255,0.3)", background: lang === l ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: lang === l ? 600 : 400 }}>
              {l}
            </button>
          ))}
        </div>
        <button onClick={onNext} style={{ width: "100%", padding: "16px", borderRadius: 16, background: "#fff", color: "#F97316", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3 }}>
          Get Started →
        </button>
      </div>
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onNext }) {
  const [step, setStep] = useState("form");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (step !== "otp") return;
    const interval = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(interval);
  }, [step]);

  const handleOtp = (val, i) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 3) otpRefs[i + 1].current?.focus();
  };

  const handleOtpKey = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs[i - 1].current?.focus();
  };

  return (
    <div style={{ height: "100%", background: COLORS.bg, display: "flex", flexDirection: "column", padding: "0" }}>
      <div style={{ background: "linear-gradient(135deg, #F97316, #EA580C)", padding: "48px 28px 36px", borderRadius: "0 0 32px 32px" }}>
        <div style={{ fontSize: 32 }}>👋</div>
        <h2 style={{ color: "#fff", margin: "12px 0 4px", fontSize: 26, fontWeight: 700 }}>{step === "otp" ? "Verify OTP" : "Welcome!"}</h2>
        <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: 14 }}>{step === "otp" ? `Code sent to +91 ${phone}` : "Sign in to find trusted services"}</p>
      </div>

      <div style={{ padding: "32px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        {step === "form" ? (
          <>
            <div>
              <label style={{ fontSize: 12, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Phone Number</label>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <div style={{ padding: "14px 12px", background: "#fff", border: `1.5px solid ${COLORS.border}`, borderRadius: 12, fontSize: 14, color: COLORS.muted, whiteSpace: "nowrap" }}>🇮🇳 +91</div>
                <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Enter phone number" type="tel" style={{ flex: 1, padding: "14px 16px", border: `1.5px solid ${COLORS.border}`, borderRadius: 12, fontSize: 15, outline: "none", background: "#fff" }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" style={{ width: "100%", marginTop: 8, padding: "14px 16px", border: `1.5px solid ${COLORS.border}`, borderRadius: 12, fontSize: 15, outline: "none", background: "#fff", boxSizing: "border-box" }} />
            </div>
            <button onClick={() => { if (phone.length === 10 && name) setStep("otp"); }} style={{ marginTop: 8, padding: "16px", borderRadius: 14, background: phone.length === 10 && name ? COLORS.primary : "#D4D4D0", color: "#fff", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              Send OTP →
            </button>
            <p style={{ textAlign: "center", color: COLORS.muted, fontSize: 13, margin: 0 }}>By continuing, you agree to our Terms & Privacy Policy</p>
          </>
        ) : (
          <>
            <p style={{ color: COLORS.muted, fontSize: 14, margin: 0, textAlign: "center" }}>Enter the 4-digit code</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", margin: "8px 0" }}>
              {otp.map((d, i) => (
                <input key={i} ref={otpRefs[i]} maxLength={1} value={d} onChange={e => handleOtp(e.target.value, i)} onKeyDown={e => handleOtpKey(e, i)} style={{ width: 56, height: 60, textAlign: "center", fontSize: 24, fontWeight: 700, border: `2px solid ${d ? COLORS.primary : COLORS.border}`, borderRadius: 14, outline: "none", background: "#fff", color: COLORS.text }} />
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              {timer > 0 ? <p style={{ color: COLORS.muted, fontSize: 13 }}>Resend OTP in {timer}s</p> : <button onClick={() => setTimer(30)} style={{ background: "none", border: "none", color: COLORS.primary, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Resend OTP</button>}
            </div>
            <div style={{ background: "#FEF3C7", borderRadius: 12, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center" }}>
              <span>💡</span>
              <p style={{ margin: 0, fontSize: 13, color: "#92400E" }}>Demo: use OTP <strong>1234</strong></p>
            </div>
            <button onClick={() => { if (otp.join("") === "1234") onNext(); }} style={{ padding: "16px", borderRadius: 14, background: otp.join("").length === 4 ? COLORS.primary : "#D4D4D0", color: "#fff", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              Verify & Continue →
            </button>
            <button onClick={() => setStep("form")} style={{ background: "none", border: "none", color: COLORS.muted, fontSize: 14, cursor: "pointer" }}>← Change Number</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── PROVIDER DETAIL SCREEN ───────────────────────────────────────────────────
function ProviderDetail({ provider, onBack, onCall }) {
  const reviews = [
    { user: "Meera K.", text: "Excellent work, very professional and on time!", rating: 5 },
    { user: "Arjun P.", text: "Neat and efficient. Highly recommend!", rating: 5 },
    { user: "Sneha R.", text: "Good service but arrived 15 mins late.", rating: 4 },
  ];
  return (
    <div style={{ height: "100%", overflowY: "auto", background: COLORS.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ background: `linear-gradient(135deg, ${provider.color}22, ${provider.color}44)`, padding: "48px 24px 32px", position: "relative" }}>
        <button onClick={onBack} style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,0.8)", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 18 }}>←</button>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: provider.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 26, fontWeight: 700, border: "3px solid #fff" }}>{provider.avatar}</div>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{provider.name}</h2>
            <p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 14 }}>{provider.category}</p>
            <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", marginTop: 6 }}>
              <Stars rating={provider.rating} />
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{provider.rating}</span>
              <span style={{ color: COLORS.muted, fontSize: 13 }}>({provider.jobs} jobs)</span>
            </div>
          </div>
          <span style={{ background: provider.available ? "#DCFCE7" : "#FEE2E2", color: provider.available ? "#16A34A" : "#DC2626", fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 20 }}>
            {provider.available ? "✓ Available Now" : "✗ Unavailable"}
          </span>
        </div>
      </div>

      <div style={{ padding: "20px 20px", display: "flex", gap: 12 }}>
        {[["📍", provider.distance, "Distance"], ["🏆", provider.exp, "Experience"], ["✅", provider.jobs, "Jobs Done"]].map(([icon, val, label]) => (
          <div key={label} style={{ flex: 1, background: "#fff", borderRadius: 14, padding: "14px 10px", textAlign: "center", border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 18 }}>{icon}</div>
            <div style={{ fontWeight: 700, fontSize: 16, margin: "4px 0 2px" }}>{val}</div>
            <div style={{ color: COLORS.muted, fontSize: 11 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700 }}>Recent Reviews</h3>
        {reviews.map((r, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 10, border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{r.user}</span>
              <Stars rating={r.rating} />
            </div>
            <p style={{ margin: 0, fontSize: 13, color: COLORS.muted, lineHeight: 1.5 }}>{r.text}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 20px 32px", display: "flex", gap: 12 }}>
        <button onClick={() => onCall(provider)} style={{ flex: 1, padding: "16px", borderRadius: 14, background: COLORS.primary, color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          📞 Call via Serva
        </button>
        <button style={{ padding: "16px 20px", borderRadius: 14, background: "#fff", color: COLORS.text, border: `1.5px solid ${COLORS.border}`, fontSize: 15, cursor: "pointer" }}>
          💬
        </button>
      </div>
    </div>
  );
}

// ─── IN-APP CALL SCREEN ───────────────────────────────────────────────────────
function CallScreen({ provider, onEnd }) {
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    const t1 = setTimeout(() => setStatus("Connected"), 1500);
    const interval = setInterval(() => setDuration(d => d + 1), 1000);
    return () => { clearTimeout(t1); clearInterval(interval); };
  }, []);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ height: "100%", background: `linear-gradient(160deg, #1C1917, #292524)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "60px 32px 52px" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#A8A29E", fontSize: 13, margin: "0 0 20px", letterSpacing: 1, textTransform: "uppercase" }}>{status}</p>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: provider.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 34, fontWeight: 700, margin: "0 auto 20px", border: "4px solid rgba(255,255,255,0.1)" }}>{provider.avatar}</div>
        <h2 style={{ color: "#fff", margin: "0 0 4px", fontSize: 26, fontWeight: 700 }}>{provider.name}</h2>
        <p style={{ color: "#A8A29E", margin: "0 0 16px", fontSize: 14 }}>{provider.category}</p>

        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "10px 24px", display: "inline-block" }}>
          <p style={{ color: "#fff", margin: 0, fontSize: 22, fontWeight: 600, fontFamily: "monospace" }}>{fmt(duration)}</p>
        </div>

        <div style={{ marginTop: 20, background: "rgba(249,115,22,0.15)", borderRadius: 12, padding: "12px 20px" }}>
          <p style={{ color: "#FED7AA", margin: 0, fontSize: 13 }}>🔒 Call routed via Serva — phone number hidden</p>
        </div>
      </div>

      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 40 }}>
          {[
            { icon: muted ? "🔇" : "🎙", label: muted ? "Unmute" : "Mute", action: () => setMuted(!muted), active: muted },
            { icon: speaker ? "🔊" : "🔈", label: "Speaker", action: () => setSpeaker(!speaker), active: speaker },
            { icon: "💬", label: "Message", action: () => {}, active: false },
          ].map(btn => (
            <button key={btn.label} onClick={btn.action} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: btn.active ? "rgba(249,115,22,0.25)" : "rgba(255,255,255,0.07)", border: btn.active ? "1.5px solid #F97316" : "1.5px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "18px 24px", cursor: "pointer" }}>
              <span style={{ fontSize: 22 }}>{btn.icon}</span>
              <span style={{ color: "#A8A29E", fontSize: 11 }}>{btn.label}</span>
            </button>
          ))}
        </div>
        <button onClick={onEnd} style={{ width: "100%", padding: "18px", borderRadius: 20, background: "#DC2626", color: "#fff", border: "none", fontSize: 18, cursor: "pointer", fontWeight: 700 }}>
          ✕ End Call
        </button>
      </div>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({ onProvider, onCall }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [listening, setListening] = useState(false);
  const [location] = useState("Koramangala, Bengaluru");
  const [notification] = useState(true);

  const filtered = PROVIDERS.filter(p =>
    (cat === "All" || p.category === cat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const handleVoice = () => {
    setListening(true);
    setTimeout(() => { setSearch("Electrician"); setListening(false); }, 2000);
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", background: COLORS.bg, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #F97316, #EA580C)", padding: "48px 20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: 0 }}>📍 Location</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>{location}</span>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>▾</span>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔔</div>
            {notification && <div style={{ position: "absolute", top: 2, right: 2, width: 10, height: 10, borderRadius: "50%", background: "#FCD34D", border: "2px solid #EA580C" }} />}
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, margin: "0 0 16px" }}>What service do you need today?</p>

        {/* Search */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 14, padding: "12px 16px" }}>
            <span style={{ fontSize: 16 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search electrician, plumber..." style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent", color: COLORS.text }} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, fontSize: 16 }}>✕</button>}
          </div>
          <button onClick={handleVoice} style={{ width: 48, height: 48, borderRadius: 14, background: listening ? "#FCD34D" : "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
            {listening ? "🔴" : "🎤"}
          </button>
        </div>
        {listening && <p style={{ color: "#FCD34D", fontSize: 13, margin: "10px 0 0", textAlign: "center" }}>🎤 Listening... say a service name</p>}
      </div>

      {/* Categories */}
      <div style={{ padding: "20px 0 0" }}>
        <div style={{ padding: "0 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Categories</h3>
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 20px 16px", scrollbarWidth: "none" }}>
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setCat(c.key)} style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 16px", borderRadius: 16, border: cat === c.key ? `2px solid ${c.color}` : `1.5px solid ${COLORS.border}`, background: cat === c.key ? `${c.color}15` : "#fff", cursor: "pointer", minWidth: 64 }}>
              <span style={{ fontSize: 22, color: c.color }}>{c.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: cat === c.key ? c.color : COLORS.muted, whiteSpace: "nowrap" }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Providers */}
      <div style={{ padding: "0 20px 100px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Nearby Providers</h3>
          <span style={{ fontSize: 13, color: COLORS.primary, fontWeight: 600 }}>{filtered.length} found</span>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: COLORS.muted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p>No providers found. Try a different search.</p>
          </div>
        )}

        {filtered.map(p => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 18, padding: "16px", marginBottom: 14, border: `1px solid ${COLORS.border}`, display: "flex", gap: 14, alignItems: "flex-start", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div onClick={() => onProvider(p)} style={{ position: "relative", cursor: "pointer", flex: "0 0 auto" }}>
              <div style={{ width: 58, height: 58, borderRadius: 16, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 700 }}>{p.avatar}</div>
              {p.available && <div style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "#22C55E", border: "2px solid #fff" }} />}
            </div>
            <div style={{ flex: 1, cursor: "pointer" }} onClick={() => onProvider(p)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{p.name}</h4>
                  <p style={{ margin: "2px 0 0", color: COLORS.muted, fontSize: 13 }}>{p.category} · {p.exp}</p>
                </div>
                {p.available ? (
                  <span style={{ background: "#DCFCE7", color: "#16A34A", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>Available</span>
                ) : (
                  <span style={{ background: "#FEE2E2", color: "#DC2626", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>Busy</span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Stars rating={p.rating} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.rating}</span>
                </div>
                <span style={{ color: COLORS.border }}>|</span>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>📍 {p.distance}</span>
                <span style={{ color: COLORS.border }}>|</span>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>✅ {p.jobs} jobs</span>
              </div>
            </div>
            <button onClick={() => p.available && onCall(p)} style={{ alignSelf: "center", width: 40, height: 40, borderRadius: 12, background: p.available ? `${COLORS.primary}15` : "#F5F5F4", border: `1.5px solid ${p.available ? COLORS.primary : COLORS.border}`, cursor: p.available ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              📞
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
function BottomNav({ active, onChange }) {
  const tabs = [
    { key: "home", icon: "🏠", label: "Home" },
    { key: "bookings", icon: "📋", label: "Bookings" },
    { key: "chat", icon: "💬", label: "Chat" },
    { key: "profile", icon: "👤", label: "Profile" },
  ];
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: `1px solid ${COLORS.border}`, display: "flex", padding: "8px 0 16px", zIndex: 10 }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span style={{ fontSize: 11, fontWeight: active === t.key ? 700 : 400, color: active === t.key ? COLORS.primary : COLORS.muted }}>{t.label}</span>
          {active === t.key && <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.primary }} />}
        </button>
      ))}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [callingProvider, setCallingProvider] = useState(null);
  const [navTab, setNavTab] = useState("home");

  const handleCall = (provider) => {
    setCallingProvider(provider);
    setSelectedProvider(null);
    setScreen("call");
  };

  const handleProvider = (provider) => {
    setSelectedProvider(provider);
    setScreen("detail");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "20px", background: "#F5F5F4" }}>
      <div style={{ width: 375, height: 780, borderRadius: 44, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08)", position: "relative", background: COLORS.bg }}>
        {/* Status bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 44, background: screen === "splash" ? "transparent" : (screen === "call" ? "#1C1917" : "transparent"), zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", pointerEvents: "none" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: screen === "call" ? "#fff" : (screen === "splash" ? "#fff" : COLORS.text) }}>9:41</span>
          <div style={{ width: 120, height: 30, borderRadius: 20, background: "#000", position: "absolute", left: "50%", transform: "translateX(-50%)", top: 4 }} />
          <span style={{ fontSize: 11, color: screen === "call" ? "#fff" : (screen === "splash" ? "#fff" : COLORS.text) }}>●●● 📶 🔋</span>
        </div>

        {/* Screen content */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {screen === "splash" && <SplashScreen onNext={() => setScreen("login")} />}
          {screen === "login" && <LoginScreen onNext={() => setScreen("home")} />}
          {screen === "home" && (
            <div style={{ position: "relative", height: "100%" }}>
              <HomeScreen onProvider={handleProvider} onCall={handleCall} />
              <BottomNav active={navTab} onChange={setNavTab} />
            </div>
          )}
          {screen === "detail" && selectedProvider && (
            <ProviderDetail provider={selectedProvider} onBack={() => setScreen("home")} onCall={handleCall} />
          )}
          {screen === "call" && callingProvider && (
            <CallScreen provider={callingProvider} onEnd={() => setScreen("home")} />
          )}
        </div>
      </div>
    </div>
  );
}
