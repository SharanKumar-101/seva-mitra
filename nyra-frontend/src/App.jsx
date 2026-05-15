import React, { useState, useEffect } from "react";

const BASE_URL = "https://seva-mitra.onrender.com";

// ── Fonts & Global Styles ──────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const styleEl = document.createElement("style");
styleEl.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; background: #f4f7f9; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { display: none; }
  input, button { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
  @keyframes slideUp   { from { opacity:0; transform:translateY(100%); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin      { to { transform: rotate(360deg); } }
  @keyframes shake     { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-4px); } 40%, 80% { transform: translateX(4px); } }
  @keyframes pulse     { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .fade-up  { animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .fade-in  { animation: fadeIn 0.3s ease forwards; }
  .slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .shake    { animation: shake 0.4s ease-in-out; }
  .skeleton { animation: pulse 1.5s ease-in-out infinite; background: #e2e8f0; border-radius: 8px; }

  .tap { transition: all 0.15s ease; cursor: pointer; }
  .tap:active { transform: scale(0.96); opacity: 0.9; }
  .tap:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
`;
document.head.appendChild(styleEl);

// ── Professional "Trust Blue" Theme ──────────────────────────────────────────
const BRAND = { 
  primary: "#2563eb",       // Vibrant Blue
  primaryDark: "#1e3a8a",   // Deep Navy Blue for headers
  primaryLight: "#eff6ff",  // Soft Blue for icon backgrounds
  dark: "#0f172a",          // Near black for text
  subtle: "#64748b",        // Slate grey for secondary text
  border: "#e2e8f0",        // Light grey for borders
  bg: "#f4f7f9"             // Off-white app background
};

const Icons = {
  Electrician: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Plumber: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>,
  Mechanics: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 9.36l-7.1 7.1a1 1 0 0 1-1.4 0l-2.8-2.8a1 1 0 0 1 0-1.4l7.1-7.1a6 6 0 0 1 9.36-7.94l-3.77 3.77z"/></svg>,
  Maids: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  Chefs: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>,
  Priests: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15"/></svg>,
  Home: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  List: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  User: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  MapPin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  CheckCircle: () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  QR: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="7" y="7" width="3" height="3"/><rect x="14" y="7" width="3" height="3"/><rect x="7" y="14" width="3" height="3"/><path d="M14 14h.01M17 14h.01M14 17h.01M17 17h.01"/></svg>
};

const CAT_ICONS = { 
  Electrician: Icons.Electrician, Plumber: Icons.Plumber, Mechanics: Icons.Mechanics, 
  Maids: Icons.Maids, "Local Chefs": Icons.Chefs, Priests: Icons.Priests 
};

// ── Constants ─────────────────────────────────────────────────────────────────
const PROBLEMS = {
  Electrician:   ["Power Outage","Wiring Issue","Appliance Install","Short Circuit","Other"],
  Plumber:       ["Leaky Pipe","Blocked Drain","Water Tank","Tap Repair","Other"],
  Mechanics:     ["Car Won't Start","Flat Tire","Engine Noise","Brake Issue","Other"],
  Maids:         ["Full House Clean","Utensils Only","Monthly Contract","Deep Cleaning"],
  "Local Chefs": ["Party Catering","Daily Meals","Traditional Fest","Diet Food"],
  Priests:       ["Pooja at Home","House Warming","Marriage","Astrology"],
};

const CANCEL_REASONS = ["Booked by mistake","Price too high","Problem solved","Found another expert","Other"];

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Badge({ status }) {
  const ok = status === "Confirmed" || status === "Completed";
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
      padding: "4px 10px", borderRadius: 6,
      background: ok ? "#f0fdf4" : "#fef2f2",
      color: ok ? "#166534" : "#991b1b",
      border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}`
    }}>{status}</span>
  );
}

function Spinner({ color = "#fff" }) {
  return (
    <div style={{
      width:20, height:20, borderRadius:"50%",
      border:`2.5px solid ${color}40`,
      borderTopColor: color,
      animation:"spin 0.7s linear infinite", display:"inline-block"
    }} />
  );
}

function Skeleton({ width = "100%", height = "20px", borderRadius = "8px", style = {} }) {
  return <div className="skeleton" style={{ width, height, borderRadius, ...style }} />;
}

function BottomNav({ tab, onSwitch }) {
  const items = [
    { id:"home",    icon: Icons.Home, label:"Home" },
    { id:"history", icon: Icons.List, label:"Bookings" },
    { id:"profile", icon: Icons.User, label:"Profile" },
  ];
  return (
    <div style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:430,
      background:"rgba(255,255,255,0.95)", backdropFilter:"blur(12px)",
      borderTop:`1px solid ${BRAND.border}`,
      display:"flex", justifyContent:"space-around",
      padding:"12px 0 20px", zIndex:50,
    }}>
      {items.map(it => {
        const active = tab === it.id;
        const IconComponent = it.icon;
        return (
          <button key={it.id} onClick={() => onSwitch(it.id)} style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            gap:4, background:"none", border:"none", cursor:"pointer",
            color: active ? BRAND.primary : BRAND.subtle, padding:"0 24px",
            position: "relative"
          }}>
            <IconComponent />
            <span style={{ fontSize:11, fontWeight: active ? 700 : 500 }}>{it.label}</span>
            {active && (
              <div style={{ position: "absolute", bottom: -6, width: 4, height: 4, borderRadius: "50%", background: BRAND.primary }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [name,  setName]  = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleStart = () => {
    if (name.trim().length < 2 || phone.replace(/\D/g, "").length !== 10) {
      setError("Please enter a valid name and 10-digit number.");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setError("");
    onLogin({ name: name.trim(), phone: phone.replace(/\D/g, "") });
  };

  const inp = {
    width:"100%", padding:"16px", borderRadius: 12,
    border:`1px solid ${BRAND.border}`, background:"#fff",
    fontSize:15, fontWeight:500, color: BRAND.dark,
    outline:"none", transition:"border-color 0.2s",
  };

  return (
    <div style={{
      minHeight:"100vh", background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 100%)`,
      display:"flex", flexDirection:"column",
      justifyContent:"center", padding:24
    }}>
      <div className="fade-up" style={{ textAlign: "center", marginBottom:40 }}>
        <h1 style={{ fontSize:38, fontWeight:800, letterSpacing:"-0.5px", marginBottom:8, color: "#fff" }}>
          Sevamitra.
        </h1>
        <p style={{ color: BRAND.primaryLight, fontSize:15, fontWeight:500, lineHeight: 1.5 }}>
          Mysuru's verified service experts,<br/>on demand.
        </p>
      </div>

      <div className={`fade-up ${shake ? "shake" : ""}`} style={{ animationDelay: "0.1s", background: "#fff", padding: 28, borderRadius: 24, boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}>
        {error && (
          <div style={{ color: "#dc2626", fontSize: 13, fontWeight: 600, marginBottom: 16, background: "#fef2f2", padding: "12px", borderRadius: 8, border: "1px solid #fecaca" }}>
            {error}
          </div>
        )}
        
        <input style={{...inp, marginBottom: 16}} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
          onFocus={e => e.target.style.borderColor=BRAND.primary}
          onBlur={e  => e.target.style.borderColor=BRAND.border} />
          
        {/* Professional +91 Locked Input */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          <div style={{ 
            ...inp, width: "auto", marginBottom: 0, background: "#f1f5f9", 
            color: BRAND.subtle, display: "flex", alignItems: "center", fontWeight: 700 
          }}>
            +91
          </div>
          <input style={{...inp, flex: 1, marginBottom: 0}} placeholder="Mobile Number" type="tel" maxLength={10}
            value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
            onFocus={e => e.target.style.borderColor=BRAND.primary}
            onBlur={e  => e.target.style.borderColor=BRAND.border} />
        </div>

        <button onClick={handleStart} className="tap"
          style={{
            width:"100%", padding:"16px", borderRadius: 12, border:"none",
            background: BRAND.primary, color:"#fff", fontSize:15, fontWeight:700,
            boxShadow:`0 8px 20px ${BRAND.primary}40`
          }}>
          Get Started
        </button>
        <p style={{ textAlign:"center", fontSize:12, color: BRAND.subtle, marginTop:24, fontWeight:500 }}>
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user,         setUser]         = useState(null);
  const [tab,          setTab]          = useState("home");
  const [screen,       setScreen]       = useState("home");
  const [providers,    setProviders]    = useState([]);
  const [bookings,     setBookings]     = useState([]);
  const [isLoading,    setIsLoading]    = useState(true); 
  const [selCat,       setSelCat]       = useState(null);
  const [selProv,      setSelProv]      = useState(null);
  const [callState,    setCallState]    = useState("idle"); 
  const [callError,    setCallError]    = useState("");
  const [showCancel,   setShowCancel]   = useState(false);
  const [cancelId,     setCancelId]     = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showQR,       setShowQR]       = useState(false); 
  const [qrBooking,    setQrBooking]    = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("sevamitra_user");
    if (saved) setUser(JSON.parse(saved));
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [p, b] = await Promise.all([
        fetch(`${BASE_URL}/providers/`).then(r => r.json()),
        fetch(`${BASE_URL}/bookings/`).then(r => r.json()),
      ]);
      setProviders(p); setBookings(b);
    } catch {
      // Catch errors silently for demo
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("sevamitra_user", JSON.stringify(u));
  };

  const handleCall = async () => {
    setCallState("calling");
    setCallError("");

    // Automatically format numbers for Twilio (adds +91 if missing)
    const formattedCustomer = user.phone.startsWith("+91") ? user.phone : `+91${user.phone}`;
    const formattedProvider = selProv.phone.startsWith("+91") ? selProv.phone : `+91${selProv.phone}`;

    try {
      const res = await fetch(`${BASE_URL}/initiate-call/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_phone: formattedCustomer,
          provider_phone: formattedProvider,
        }),
      });
      if (res.ok) {
        setCallState("called");
      } else {
        const err = await res.json();
        setCallError(err.detail || "Call failed. Try again.");
        setCallState("idle");
      }
    } catch {
      setCallError("Could not reach server. Check your connection.");
      setCallState("idle");
    }
  };

  const handleBook = async () => {
    setCallState("booking");
    await fetch(`${BASE_URL}/bookings/`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: user.name,
        customer_phone: user.phone,
        provider_id: selProv.id,
      }),
    });
    await fetchData();
    setCallState("done");
    setScreen("success");
  };

  const handleCancel = async () => {
    if (!cancelReason) return;
    await fetch(`${BASE_URL}/bookings/${cancelId}/cancel`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: cancelReason }),
    });
    setShowCancel(false); setCancelReason(""); await fetchData();
  };

  const handleComplete = async (bookingId) => {
    try {
      await fetch(`${BASE_URL}/bookings/${bookingId}/complete`, { method:"PUT" });
      await fetchData();
    } catch {}
  };

  const switchTab = (t) => { setTab(t); setScreen("home"); setCallState("idle"); setCallError(""); };
  const goBack    = (s)  => { setScreen(s); setCallState("idle"); setCallError(""); };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  const myBookings    = bookings.filter(b => b.customer_phone === user.phone);
  const catProviders  = providers.filter(p => p.category === selCat);

  // Wrapper shell
  const shell = (children) => (
    <div style={{
      minHeight:"100vh", background: BRAND.bg,
      display:"flex", flexDirection:"column",
      maxWidth:430, margin:"0 auto", position:"relative",
      boxShadow:"0 0 40px rgba(0,0,0,0.08)"
    }}>
      {children}
      <BottomNav tab={tab} onSwitch={switchTab} />
    </div>
  );

  // ── HOME ──────────────────────────────────────────────────────────────────

  if (tab === "home") {

    if (screen === "home") return shell(<>
      <div style={{ background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 100%)`, padding: "48px 24px 32px", borderRadius: "0 0 24px 24px", color: "#fff", boxShadow: "0 12px 24px rgba(37, 99, 235, 0.15)" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>Sevamitra.</h1>
        <p style={{ color: BRAND.primaryLight, fontSize: 14, marginTop: 4, fontWeight: 500 }}>
          Welcome back, {user.name.split(" ")[0]}
        </p>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"24px 20px 100px" }}>
        
        {/* Metric Cards */}
        <div style={{ display:"flex", gap:12, marginBottom:28, marginTop: -12 }}>
          {[
            { label:"Active", value: myBookings.filter(b=>b.status==="Confirmed").length, highlight: true },
            { label:"Experts", value: providers.length, highlight: false },
          ].map((s, i) => (
            <div key={s.label} className="fade-up" style={{
              flex:1, background: s.highlight ? BRAND.primary : "#ffffff", 
              borderRadius: 16, padding: "18px 20px",
              border: s.highlight ? "none" : `1px solid ${BRAND.border}`,
              boxShadow: s.highlight ? `0 8px 20px ${BRAND.primary}40` : "0 2px 8px rgba(0,0,0,0.04)"
            }}>
              {isLoading ? <Skeleton width="40px" height="28px" style={{ marginBottom: 4, background: s.highlight ? `${BRAND.primaryDark}80` : BRAND.border }} /> : 
                <div style={{ fontSize: 26, fontWeight: 800, color: s.highlight ? "#fff" : BRAND.dark }}>{s.value}</div>
              }
              <div style={{ fontSize: 12, color: s.highlight ? BRAND.primaryLight : BRAND.subtle, fontWeight: 600, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 700, color: BRAND.dark, marginBottom: 16 }}>Services</h3>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {Object.keys(PROBLEMS).map((c, i) => {
            const IconComponent = CAT_ICONS[c];
            return (
              <button key={c} onClick={() => { setSelCat(c); setScreen("list"); }}
                className="tap fade-up"
                style={{
                  background:"#fff", border:`1px solid ${BRAND.border}`,
                  borderRadius: 16, padding:"20px 16px",
                  display:"flex", flexDirection:"column", alignItems:"center",
                  boxShadow:"0 2px 6px rgba(0,0,0,0.02)",
                  animationDelay:`${i*0.04}s`
                }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: BRAND.primaryLight, color: BRAND.primary,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  marginBottom: 12
                }}>
                  <IconComponent />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: BRAND.dark, textAlign: "center" }}>{c}</span>
                {isLoading ? <Skeleton width="60px" height="12px" style={{ marginTop: 6 }} /> : 
                  <span style={{ fontSize: 11, color: BRAND.subtle, marginTop: 6, fontWeight: 600 }}>
                    {providers.filter(p=>p.category===c).length} available
                  </span>
                }
              </button>
            )
          })}
        </div>
      </div>
    </>);

    // Provider List
    if (screen === "list") return shell(<>
      <div style={{ background:"#fff", padding:"40px 20px 16px", borderBottom:`1px solid ${BRAND.border}`, display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => goBack("home")} className="tap" style={{ background:BRAND.primaryLight, border:"none", width: 36, height: 36, borderRadius: 18, display:"flex", alignItems:"center", justifyContent:"center", color:BRAND.primary }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div>
          <h3 style={{ fontSize:18, fontWeight:700, color:BRAND.dark }}>{selCat}</h3>
          {isLoading ? <Skeleton width="100px" height="14px" style={{ marginTop: 4 }} /> :
            <p style={{ fontSize:13, color:BRAND.subtle, fontWeight:500 }}>{catProviders.length} experts nearby</p>
          }
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 100px" }}>
        {isLoading ? (
           <>
             {[1, 2, 3].map(i => (
               <div key={i} style={{ background:"#fff", borderRadius: 16, padding: 16, marginBottom: 12, border:`1px solid ${BRAND.border}`, display:"flex", gap:16 }}>
                 <Skeleton width="60px" height="60px" borderRadius="12px" />
                 <div style={{ flex: 1, display:"flex", flexDirection:"column", justifyContent:"center", gap: 8 }}>
                   <Skeleton width="60%" height="16px" />
                   <Skeleton width="40%" height="12px" />
                 </div>
               </div>
             ))}
           </>
        ) : catProviders.length === 0 ? (
          <div style={{ textAlign:"center", paddingTop:60, color:BRAND.subtle }}>
            <div style={{ fontWeight:700, fontSize:16, color: BRAND.dark }}>No experts available</div>
            <div style={{ fontSize:14, marginTop:6 }}>Check back later</div>
          </div>
        ) : catProviders.map((p, i) => (
          <div key={p.id} className="fade-up"
            style={{
              background:"#fff", borderRadius: 16, padding: 16, marginBottom: 12,
              display:"flex", alignItems:"center", gap: 16,
              border:`1px solid ${BRAND.border}`, boxShadow:"0 2px 8px rgba(0,0,0,0.02)",
              animationDelay:`${i*0.04}s`
            }}>
            <img src={p.photo_url} alt={p.name}
              onError={e => { e.target.onerror=null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=eff6ff&color=2563eb&bold=true`; }}
              style={{ width:60, height:60, borderRadius: 12, objectFit:"cover", flexShrink:0, background: BRAND.bg }}
            />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:BRAND.dark, fontSize:15, marginBottom:4 }}>{p.name}</div>
              <div style={{ display: "flex", gap: 4, alignItems: "center", color: BRAND.subtle, fontSize: 12, marginBottom: 8, fontWeight: 500 }}>
                <Icons.MapPin /> {p.location}
              </div>
              <div style={{ display:"flex", gap: 8, alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, background:BRAND.primaryLight, color:BRAND.primary, borderRadius: 6, fontSize: 11, fontWeight:700, padding:"4px 8px" }}>
                  <Icons.Star /> {p.rating}
                </span>
                <span style={{ color:BRAND.subtle, fontSize: 11, fontWeight: 600 }}>₹{p.base_price} base</span>
              </div>
            </div>
            <button onClick={() => { setSelProv(p); setCallState("idle"); setCallError(""); setScreen("profile"); }}
              className="tap"
              style={{
                background: BRAND.primary, color:"#fff", border:"none", borderRadius: 10,
                padding:"10px 16px", fontSize: 13, fontWeight: 700, flexShrink:0,
                boxShadow:`0 4px 12px ${BRAND.primary}40`
              }}>Select</button>
          </div>
        ))}
      </div>
    </>);

    // Provider Profile
    if (screen === "profile") {
      return shell(<>
        <div style={{ background: "#fff", borderBottom: `1px solid ${BRAND.border}` }}>
          <div style={{ padding: "40px 20px 16px", display: "flex", alignItems: "center", gap: 16 }}>
             <button onClick={() => goBack("list")} className="tap" style={{ background:BRAND.primaryLight, border:"none", width: 36, height: 36, borderRadius: 18, display:"flex", alignItems:"center", justifyContent:"center", color:BRAND.primary }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          </div>
          
          <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <img src={selProv.photo_url} alt={selProv.name}
              onError={e => { e.target.onerror=null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(selProv.name)}&background=eff6ff&color=2563eb&bold=true&size=128`; }}
              style={{ width:96, height:96, borderRadius: 24, objectFit:"cover", marginBottom: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
            />
            <h2 style={{ fontSize:22, fontWeight:800, color:BRAND.dark, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
              {selProv.name} <svg width="20" height="20" viewBox="0 0 24 24" fill={BRAND.primary} stroke="#fff" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </h2>
            <p style={{ color: BRAND.primary, background: BRAND.primaryLight, padding: "4px 12px", borderRadius: 12, fontSize:13, fontWeight:700, marginTop: 4 }}>
              Verified {selProv.category}
            </p>
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"24px 20px 110px" }}>
          
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:32 }}>
            {[
              { label:"Experience", value:`${selProv.experience} Yrs` },
              { label:"Rating",     value: selProv.rating },
              { label:"Base Fee",   value:`₹${selProv.base_price}` },
            ].map(s => (
              <div key={s.label} style={{
                background:"#fff", borderRadius: 14, padding:"16px 12px",
                textAlign:"center", border:`1px solid ${BRAND.border}`,
              }}>
                <div style={{ fontSize:15, fontWeight:800, color:BRAND.dark, marginBottom:4 }}>{s.value}</div>
                <div style={{ fontSize:11, color:BRAND.subtle, fontWeight:600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: BRAND.dark, marginBottom: 16 }}>How it works</h3>
          <div style={{ background:"#fff", borderRadius: 16, padding:20, border:`1px solid ${BRAND.border}`, marginBottom:24 }}>
            {[
              "Tap call below — we secure your number.",
              "Discuss the issue and finalize pricing.",
              "Tap 'Confirm' here to lock the service.",
            ].map((s, i) => (
              <div key={i} style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:i<2?16:0 }}>
                <div style={{
                  width:24, height:24, borderRadius:12, background:BRAND.primaryLight,
                  color:BRAND.primary, fontSize:12, fontWeight:700,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
                }}>{i+1}</div>
                <p style={{ fontSize:14, color:BRAND.subtle, fontWeight:500, lineHeight:1.5 }}>{s}</p>
              </div>
            ))}
          </div>

          {callError && (
            <div style={{
              background:"#fef2f2", border:"1px solid #fecaca", borderRadius: 12,
              padding:"12px 16px", marginBottom:20, fontSize:13, color:"#991b1b", fontWeight:600
            }}>
              {callError}
            </div>
          )}

          {callState === "idle" && (
            <button onClick={handleCall} className="tap" style={{
              width:"100%", background: BRAND.primary, color:"#fff",
              border:"none", borderRadius: 14, padding:"16px",
              fontSize:15, fontWeight:700,
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              boxShadow: `0 8px 20px ${BRAND.primary}40`
            }}>
              <Icons.Phone /> Secure Call
            </button>
          )}

          {callState === "calling" && (
            <div style={{
              width:"100%", background:BRAND.primaryLight, color: BRAND.primary,
              borderRadius: 14, padding:"16px", fontSize:15, fontWeight:700,
              display:"flex", alignItems:"center", justifyContent:"center", gap:12,
            }}>
              <Spinner color={BRAND.primary} /> Connecting...
            </div>
          )}

          {callState === "called" && (
            <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{
                background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius: 12,
                padding:"16px", fontSize:14, color:"#166534", fontWeight:600,
                display:"flex", alignItems:"center", gap:10
              }}>
                <Icons.CheckCircle /> Connected! Please confirm below once agreed.
              </div>

              <button onClick={handleBook} disabled={callState==="booking"} className="tap" style={{
                width:"100%", background: BRAND.primary,
                color:"#fff", border:"none", borderRadius: 14, padding:"16px",
                fontSize:15, fontWeight:700,
                display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                boxShadow: `0 8px 20px ${BRAND.primary}40`
              }}>
                {callState === "booking" ? <><Spinner /> Confirming</> : "Confirm Booking"}
              </button>

              <button onClick={handleCall} className="tap" style={{
                background:"none", border:`1px solid ${BRAND.border}`, color:BRAND.subtle,
                borderRadius: 14, padding:"14px", fontSize:14, fontWeight:600
              }}>
                Call Again
              </button>
            </div>
          )}
        </div>
      </>);
    }

    // Success
    if (screen === "success") return shell(
      <div className="fade-in" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32 }}>
        <div style={{ marginBottom: 24, color: "#10b981" }}><Icons.CheckCircle /></div>
        <h2 style={{ fontSize:26, fontWeight:800, color:BRAND.dark, marginBottom:8 }}>Confirmed!</h2>
        <p style={{ color:BRAND.subtle, fontSize:15, fontWeight:500, textAlign:"center", marginBottom:40, lineHeight:1.6 }}>
          Your {selProv?.category?.toLowerCase()} has been booked securely.
        </p>
        <button onClick={() => switchTab("history")} className="tap" style={{
          background: BRAND.primary, color:"#fff", border:"none", borderRadius: 14, padding:"16px 36px",
          fontSize:15, fontWeight:700, width: "100%", marginBottom: 12,
          boxShadow: `0 8px 20px ${BRAND.primary}40`
        }}>View Bookings</button>
        <button onClick={() => switchTab("home")} style={{
          background:"none", border:"none", color:BRAND.subtle,
          fontSize:14, fontWeight:600, cursor:"pointer", padding: "12px"
        }}>Return Home</button>
      </div>
    );
  }

  // ── HISTORY / BOOKINGS ────────────────────────────────────────────────────
  if (tab === "history") return shell(<>
    <div style={{ background:"#fff", padding:"40px 24px 20px", borderBottom:`1px solid ${BRAND.border}` }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: BRAND.dark }}>My Bookings</h2>
    </div>

    <div style={{ flex:1, overflowY:"auto", padding:"24px 20px 100px" }}>
      {isLoading ? (
        <>
          {[1, 2].map(i => (
             <div key={i} style={{ background:"#fff", borderRadius: 16, padding: 20, marginBottom: 16, border:`1px solid ${BRAND.border}` }}>
               <Skeleton width="40%" height="18px" style={{ marginBottom: 8 }} />
               <Skeleton width="25%" height="14px" style={{ marginBottom: 20 }} />
               <Skeleton width="100%" height="40px" borderRadius="10px" />
             </div>
          ))}
        </>
      ) : myBookings.length === 0 ? (
        <div style={{ textAlign:"center", paddingTop:60, color:BRAND.subtle }}>
          <div style={{ fontWeight:700, fontSize:16, color: BRAND.dark }}>No history yet</div>
          <div style={{ fontSize:14, marginTop:6, fontWeight: 500 }}>Your past bookings will appear here</div>
        </div>
      ) : myBookings.map((b, i) => (
        <div key={b.id} className="fade-up"
          style={{
            background: "#fff",
            border: b.status==="Completed" ? "1.5px solid #bbf7d0" : `1px solid ${BRAND.border}`, 
            borderRadius: 16, padding:20, marginBottom:16,
            opacity: b.status==="Cancelled" ? 0.6 : 1,
            boxShadow:"0 2px 8px rgba(0,0,0,0.02)", animationDelay:`${i*0.04}s`
          }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div>
              <p style={{ fontWeight:700, fontSize:16, color:BRAND.dark, marginBottom:6 }}>{b.worker_name}</p>
              <span style={{ 
                background: BRAND.primaryLight, color: BRAND.primary,
                padding: "4px 10px", borderRadius: 8, fontSize:12, fontWeight:700 
              }}>{b.category}</span>
            </div>
            <Badge status={b.status} />
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize:13, color:BRAND.subtle, fontWeight:600 }}>
              {new Date(b.time).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
            </p>
            {b.status === "Confirmed" && (
               <div style={{ display: "flex", gap: 8 }}>
                 <button onClick={() => handleComplete(b.id)} className="tap" style={{
                   background:"#f0fdf4", border:"1px solid #bbf7d0", color:"#166534", 
                   borderRadius: 8, padding:"8px 12px", fontSize:12, fontWeight:700, cursor:"pointer"
                 }}>Complete</button>
                 <button onClick={() => { setCancelId(b.id); setShowCancel(true); }} className="tap" style={{
                   background:"#fef2f2", border:"1px solid #fecaca", color:"#991b1b", 
                   borderRadius: 8, padding:"8px 12px", fontSize:12, fontWeight:700, cursor:"pointer"
                 }}>Cancel</button>
               </div>
            )}
          </div>

          {/* ── DEMO PAYMENT UI FALLBACK ── */}
          {b.status === "Completed" && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px dashed ${BRAND.border}` }}>
              <button onClick={() => { setQrBooking(b); setShowQR(true); }} className="tap" style={{
                width: "100%", background: BRAND.primary, color: "#fff",
                border: "none", borderRadius: 10, padding: "14px",
                fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: `0 4px 12px ${BRAND.primary}40`
              }}>
                <Icons.QR /> Platform Fee / Review
              </button>
            </div>
          )}

        </div>
      ))}
    </div>

    {/* Cancel Modal */}
    {showCancel && (
      <div className="fade-in" style={{
        position:"fixed", inset:0, background:"rgba(15,23,42,0.6)",
        backdropFilter:"blur(6px)", zIndex:100,
        display:"flex", alignItems:"flex-end", justifyContent:"center"
      }}>
        <div className="slide-up" style={{
          background:"#fff", borderRadius:"24px 24px 0 0",
          padding:"24px 24px 40px", width:"100%", maxWidth:430
        }}>
          <div style={{ width:40, height:5, background:"#cbd5e1", borderRadius:4, margin:"0 auto 24px" }} />
          <h3 style={{ fontSize:20, fontWeight:800, color:BRAND.dark, marginBottom:6 }}>Cancel Booking</h3>
          <p style={{ fontSize:14, color:BRAND.subtle, fontWeight:500, marginBottom:24 }}>Please select a reason.</p>
          
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:32 }}>
            {CANCEL_REASONS.map(r => (
              <button key={r} onClick={() => setCancelReason(r)} style={{
                padding:"16px", borderRadius: 12, textAlign:"left",
                fontSize:14, fontWeight:600, cursor:"pointer",
                border: cancelReason===r ? `1.5px solid ${BRAND.primary}` : `1px solid ${BRAND.border}`,
                background: cancelReason===r ? BRAND.primaryLight : "#fff",
                color: cancelReason===r ? BRAND.primary : BRAND.subtle,
                transition: "all 0.2s"
              }}>{r}</button>
            ))}
          </div>
          
          <div style={{ display:"flex", gap:12 }}>
            <button onClick={() => { setShowCancel(false); setCancelReason(""); }} className="tap" style={{
              flex:1, padding:"16px", borderRadius: 12, border:`1px solid ${BRAND.border}`,
              background:"#fff", color:BRAND.dark, fontSize:15, fontWeight:700
            }}>Back</button>
            <button onClick={handleCancel} disabled={!cancelReason} className="tap" style={{
              flex:1, padding:"16px", borderRadius: 12, border:"none",
              background: cancelReason ? "#dc2626" : "#fca5a5",
              color:"#fff", fontSize:15, fontWeight:700,
            }}>Confirm</button>
          </div>
        </div>
      </div>
    )}

    {/* ── PROFESSIONAL DEMO QR MODAL ── */}
    {showQR && (
      <div className="fade-in" style={{
        position:"fixed", inset:0, background:"rgba(15,23,42,0.7)",
        backdropFilter:"blur(8px)", zIndex:100,
        display:"flex", alignItems:"center", justifyContent:"center", padding: 24
      }}>
        <div className="slide-up" style={{
          background:"#fff", borderRadius:"24px",
          padding:"32px 24px", width:"100%", maxWidth:320, textAlign: "center",
          boxShadow: "0 24px 48px rgba(0,0,0,0.2)"
        }}>
          {/* Professional Demo/Test Badge */}
          <div style={{ display: "inline-block", background: "#fef3c7", color: "#b45309", fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 8, marginBottom: 16, letterSpacing: "0.5px" }}>
            DEMO GATEWAY
          </div>
          
          <h3 style={{ fontSize:20, fontWeight:800, color:BRAND.dark, marginBottom:8 }}>Pay {qrBooking?.worker_name}</h3>
          <p style={{ fontSize:14, color:BRAND.subtle, fontWeight:500, marginBottom:24 }}>
            Scan to securely transfer platform fee and base charges.
          </p>
          
          <div style={{ background: BRAND.bg, padding: 16, borderRadius: 16, border: `1.5px solid ${BRAND.border}`, marginBottom: 24, display: "inline-block" }}>
            {/* Dynamic Placeholder QR - Shows the worker name encoded in the URI visually */}
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=demo@ybl&pn=Sevamitra%20Demo%20(${encodeURIComponent(qrBooking?.worker_name)})`} 
                 alt="Demo Payment QR" 
                 style={{ width: 160, height: 160, borderRadius: 8 }} />
          </div>
          
          <button onClick={() => setShowQR(false)} className="tap" style={{
            width: "100%", padding:"16px", borderRadius: 12, border:`1.5px solid ${BRAND.border}`,
            background:"#fff", color:BRAND.dark, fontSize:15, fontWeight:700
          }}>Close Demo</button>
        </div>
      </div>
    )}
  </>);

  // ── PROFILE ───────────────────────────────────────────────────────────────
  if (tab === "profile") return shell(<>
    <div style={{ background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 100%)`, padding: "48px 24px 32px", borderRadius: "0 0 24px 24px", color: "#fff", boxShadow: "0 12px 24px rgba(37, 99, 235, 0.15)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 800, color: "#fff",
        }}>{user.name[0].toUpperCase()}</div>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{user.name}</h2>
          <p style={{ color: BRAND.primaryLight, fontSize: 14, fontWeight: 500 }}>{user.phone}</p>
        </div>
      </div>
    </div>

    <div style={{ flex:1, overflowY:"auto", padding:"32px 20px 100px" }}>
      
      <div style={{ background:"#fff", borderRadius: 16, border:`1px solid ${BRAND.border}`, overflow:"hidden", marginBottom: 24, boxShadow:"0 2px 8px rgba(0,0,0,0.02)" }}>
        {[
          { label:"Help & Support" },
          { label:"Terms of Service" },
          { label:"About Sevamitra" },
        ].map((item, i, arr) => (
          <button key={item.label} className="tap" style={{
            width:"100%", padding:"20px 24px", background:"none",
            border:"none", borderBottom:i<arr.length-1?`1px solid ${BRAND.border}`:"none",
            display:"flex", justifyContent:"space-between", alignItems:"center",
            color:BRAND.dark, fontSize: 15, fontWeight: 600
          }}>
            {item.label}
            <span style={{ color:"#94a3b8" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </span>
          </button>
        ))}
      </div>

      <button onClick={() => { localStorage.clear(); window.location.reload(); }}
        className="tap"
        style={{
          width:"100%", padding:"18px", borderRadius: 16,
          background:"#fef2f2", border:"1.5px solid #fecaca",
          color:"#dc2626", fontSize:15, fontWeight:700,
        }}>
        Log Out
      </button>
    </div>
  </>);

  return null;
}
