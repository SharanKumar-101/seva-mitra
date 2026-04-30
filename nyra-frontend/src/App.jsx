import React, { useState, useEffect } from "react";

const BASE_URL = "https://seva-mitra.onrender.com";
const ADMIN_PHONE = "1234567890"; // ⚠️ CHANGE THIS TO YOUR ACTUAL 10-DIGIT MOBILE NUMBER!

// ── Fonts & Global Styles ──────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const styleEl = document.createElement("style");
styleEl.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; background: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif; }
  ::-webkit-scrollbar { display: none; }
  input, button, select { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
  @keyframes slideUp   { from { opacity:0; transform:translateY(44px); } to { opacity:1; transform:translateY(0); } }
  @keyframes bouncePop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  @keyframes spin      { to { transform: rotate(360deg); } }
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.45} }
  @keyframes ringPulse { 0%{box-shadow:0 0 0 0 rgba(99,102,241,0.5)} 70%{box-shadow:0 0 0 14px rgba(99,102,241,0)} 100%{box-shadow:0 0 0 0 rgba(99,102,241,0)} }
  @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  .fade-up    { animation: fadeUp    0.35s ease forwards; }
  .fade-in    { animation: fadeIn    0.3s  ease forwards; }
  .slide-up   { animation: slideUp   0.42s ease forwards; }
  .bounce-pop { animation: bouncePop 0.5s  ease forwards; }
  .ring-pulse { animation: ringPulse 1.5s ease infinite; }

  .tap { transition: transform 0.14s ease, opacity 0.14s ease, box-shadow 0.14s ease; cursor: pointer; }
  .tap:active { transform: scale(0.96); opacity: 0.88; }
  .tap:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }
`;
document.head.appendChild(styleEl);

// ── Constants ─────────────────────────────────────────────────────────────────
const CAT_ICONS  = { Electrician:"⚡", Plumber:"🚰", Mechanics:"🔧", Maids:"🧹", "Local Chefs":"🥘", Priests:"🕉️" };
const CAT_COLORS = { Electrician:"#f59e0b", Plumber:"#3b82f6", Mechanics:"#6366f1", Maids:"#ec4899", "Local Chefs":"#ef4444", Priests:"#8b5cf6" };
const CAT_BG     = { Electrician:"#fffbeb", Plumber:"#eff6ff", Mechanics:"#eef2ff", Maids:"#fdf2f8", "Local Chefs":"#fff1f2", Priests:"#f5f3ff" };

const PROBLEMS = {
  Electrician:   ["Power Outage","Wiring Issue","Appliance Install","Short Circuit","Other"],
  Plumber:       ["Leaky Pipe","Blocked Drain","Water Tank","Tap Repair","Other"],
  Mechanics:     ["Car Won't Start","Flat Tire","Engine Noise","Brake Issue","Other"],
  Maids:         ["Full House Clean","Utensils Only","Monthly Contract","Deep Cleaning"],
  "Local Chefs": ["Party Catering","Daily Meals","Traditional Fest","Diet Food"],
  Priests:       ["Pooja at Home","House Warming","Marriage","Astrology"],
};

const CANCEL_REASONS = ["Booked by mistake","Price too high","Problem solved","Found another expert","Other"];

// ── Translations ───────────────────────────────────────────────────────────────
const T = {
  en: {
    appName:"Sevamitra", tagline:"Mysuru's Trusted Service Platform",
    namaste:"Namaste", whatService:"What service do you need today?",
    browseServices:"Browse Services", activeBookings:"Active Bookings",
    expertsNearYou:"Experts Near You", myBookings:"My Bookings",
    noBookings:"No bookings yet", bookService:"Book a service to see it here",
    cancelBooking:"Cancel Booking", whyCancelling:"Why are you cancelling?",
    markComplete:"Mark as Completed", callExpert:"Call Expert via Sevamitra",
    connecting:"Connecting your call...", confirmBooking:"Confirm Booking",
    callAgain:"Call Again", bookingConfirmed:"Booking Confirmed!",
    viewBookings:"View My Bookings", backHome:"Back to Home",
    selectProblem:"Select Problem Type", whatIssue:"What's the issue you're facing?",
    callRinging:"Your phone will ring shortly...",
    ivrInstruction:"Answer the call & press 1 to speak with the expert",
    pressOneTo:"When answered, press 1 to connect with",
    howItWorks:"How it works",
    step1:"Tap 'Call Expert' — Sevamitra calls your number",
    step2:"Answer the call and press 1 to connect with the expert",
    step3:"Discuss your problem, then tap 'Confirm Booking'",
    totalBookings:"Total Bookings", activeServices:"Active Services",
    available:"available", adminDashboard:"Admin Dashboard",
    allBookings:"All Bookings", customer:"Customer", worker:"Worker",
    logout:"Log Out", profile:"Profile", home:"Home", bookings:"Bookings",
    confirmed:"Confirmed", cancelled:"Cancelled", completed:"Completed",
    goBack:"Go Back", confirm:"Confirm", experience:"Experience",
    rating:"Rating", baseFee:"Base Fee", verified:"Verified", in:"in",
    experts:"Experts", noExperts:"No experts found", checkLater:"Check back later",
    problemFor:"Problem", yourBookings:"Your Bookings", totalBooked:"total booking",
    totalBookedP:"total bookings", createAccount:"Create your account",
    fullName:"Full Name", phone:"10-Digit Phone Number", getStarted:"Get Started →",
    termsNote:"By continuing you agree to our Terms of Service",
    willReach:"will reach you soon.", support:"Customer Support",
    about:"About Sevamitra", facebook:"Official Facebook", admin:"Admin",
  },
  kn: {
    appName:"ಸೇವಾಮಿತ್ರ", tagline:"ಮೈಸೂರಿನ ವಿಶ್ವಾಸಾರ್ಹ ಸೇವಾ ವೇದಿಕೆ",
    namaste:"ನಮಸ್ಕಾರ", whatService:"ಇಂದು ನಿಮಗೆ ಯಾವ ಸೇವೆ ಬೇಕು?",
    browseServices:"ಸೇವೆಗಳನ್ನು ನೋಡಿ", activeBookings:"ಸಕ್ರಿಯ ಬುಕ್ಕಿಂಗ್‌ಗಳು",
    expertsNearYou:"ಹತ್ತಿರದ ತಜ್ಞರು", myBookings:"ನನ್ನ ಬುಕ್ಕಿಂಗ್‌ಗಳು",
    noBookings:"ಯಾವ ಬುಕ್ಕಿಂಗ್ ಇಲ್ಲ", bookService:"ಸೇವೆ ಬುಕ್ ಮಾಡಿ",
    cancelBooking:"ಬುಕ್ಕಿಂಗ್ ರದ್ದು", whyCancelling:"ಯಾಕೆ ರದ್ದು ಮಾಡುತ್ತಿದ್ದೀರಿ?",
    markComplete:"ಪೂರ್ಣಗೊಂಡಿದೆ ಎಂದು ಗುರುತಿಸಿ", callExpert:"ತಜ್ಞರಿಗೆ ಕರೆ ಮಾಡಿ",
    connecting:"ಕರೆ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...", confirmBooking:"ಬುಕ್ಕಿಂಗ್ ದೃಢೀಕರಿಸಿ",
    callAgain:"ಮತ್ತೆ ಕರೆ ಮಾಡಿ", bookingConfirmed:"ಬುಕ್ಕಿಂಗ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ!",
    viewBookings:"ನನ್ನ ಬುಕ್ಕಿಂಗ್‌ ನೋಡಿ", backHome:"ಮನೆಗೆ ಹಿಂದಿರಿ",
    selectProblem:"ಸಮಸ್ಯೆ ಆಯ್ಕೆ ಮಾಡಿ", whatIssue:"ನಿಮ್ಮ ಸಮಸ್ಯೆ ಏನು?",
    callRinging:"ನಿಮ್ಮ ಫೋನ್ ಶೀಘ್ರದಲ್ಲಿ ರಿಂಗ್ ಆಗುತ್ತದೆ...",
    ivrInstruction:"ಕರೆ ಸ್ವೀಕರಿಸಿ, ತಜ್ಞರ ಜೊತೆ ಮಾತಾಡಲು 1 ಒತ್ತಿ",
    pressOneTo:"ಕರೆ ಸ್ವೀಕರಿಸಿದ ನಂತರ 1 ಒತ್ತಿ",
    howItWorks:"ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    step1:"'ತಜ್ಞರಿಗೆ ಕರೆ' ಒತ್ತಿ — ಸೇವಾಮಿತ್ರ ನಿಮ್ಮ ನಂಬರ್‌ಗೆ ಕರೆ ಮಾಡುತ್ತದೆ",
    step2:"ಕರೆ ಸ್ವೀಕರಿಸಿ ಮತ್ತು 1 ಒತ್ತಿ ತಜ್ಞರ ಜೊತೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ",
    step3:"ಸಮಸ್ಯೆ ಚರ್ಚಿಸಿ, ನಂತರ 'ಬುಕ್ಕಿಂಗ್ ದೃಢೀಕರಿಸಿ' ಒತ್ತಿ",
    totalBookings:"ಒಟ್ಟು ಬುಕ್ಕಿಂಗ್‌", activeServices:"ಸಕ್ರಿಯ ಸೇವೆಗಳು",
    available:"ಲಭ್ಯ", adminDashboard:"ಆಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    allBookings:"ಎಲ್ಲಾ ಬುಕ್ಕಿಂಗ್‌ಗಳು", customer:"ಗ್ರಾಹಕ", worker:"ಕೆಲಸಗಾರ",
    logout:"ಲಾಗ ಔಟ್", profile:"ಪ್ರೊಫೈಲ್", home:"ಮನೆ", bookings:"ಬುಕ್ಕಿಂಗ್‌",
    confirmed:"ದೃಢೀಕರಿಸಲಾಗಿದೆ", cancelled:"ರದ್ದು", completed:"ಪೂರ್ಣ",
    goBack:"ಹಿಂದೆ", confirm:"ದೃಢೀಕರಿಸಿ", experience:"ಅನುಭವ",
    rating:"ರೇಟಿಂಗ್", baseFee:"ಮೂಲ ಶುಲ್ಕ", verified:"ದೃಢೀಕರಿಸಲಾಗಿದೆ", in:"ನಲ್ಲಿ",
    experts:"ತಜ್ಞರು", noExperts:"ತಜ್ಞರು ಸಿಕ್ಕಿಲ್ಲ", checkLater:"ನಂತರ ಮತ್ತೆ ನೋಡಿ",
    problemFor:"ಸಮಸ್ಯೆ", yourBookings:"ನಿಮ್ಮ ಬುಕ್ಕಿಂಗ್‌ಗಳು", totalBooked:"ಒಟ್ಟು ಬುಕ್ಕಿಂಗ್",
    totalBookedP:"ಒಟ್ಟು ಬುಕ್ಕಿಂಗ್‌ಗಳು", createAccount:"ಖಾತೆ ರಚಿಸಿ",
    fullName:"ಪೂರ್ಣ ಹೆಸರು", phone:"10 ಅಂಕಿ ಮೊಬೈಲ್ ನಂಬರ್", getStarted:"ಪ್ರಾರಂಭಿಸಿ →",
    termsNote:"ಮುಂದುವರಿಯುವ ಮೂಲಕ ನೀವು ನಮ್ಮ ನಿಯಮಗಳಿಗೆ ಒಪ್ಪುತ್ತೀರಿ",
    willReach:"ಶೀಘ್ರದಲ್ಲೇ ತಲುಪುತ್ತಾರೆ.", support:"ಗ್ರಾಹಕ ಸೇವೆ",
    about:"ಸೇವಾಮಿತ್ರ ಬಗ್ಗೆ", facebook:"ಅಧಿಕೃತ ಫೇಸ್‌ಬುಕ್", admin:"ಆಡ್ಮಿನ್",
  }
};

// ── Shared UI Components ───────────────────────────────────────────────────────

function Badge({ status }) {
  const cfg = {
    Confirmed: { bg:"#dcfce7", color:"#16a34a", dot:"#22c55e" },
    Cancelled:  { bg:"#fee2e2", color:"#dc2626", dot:"#ef4444" },
    Completed:  { bg:"#dbeafe", color:"#1d4ed8", dot:"#3b82f6" },
  };
  const s = cfg[status] || cfg.Confirmed;
  return (
    <span style={{
      fontSize:10, fontWeight:800, letterSpacing:0.6, padding:"4px 10px",
      borderRadius:20, background:s.bg, color:s.color,
      display:"inline-flex", alignItems:"center", gap:5
    }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot, display:"inline-block" }} />
      {status.toUpperCase()}
    </span>
  );
}

function Spinner({ color = "#fff" }) {
  return (
    <div style={{
      width:18, height:18, borderRadius:"50%",
      border:`2.5px solid ${color}33`, borderTopColor:color,
      animation:"spin 0.7s linear infinite", display:"inline-block"
    }} />
  );
}

function LangToggle({ lang, setLang }) {
  return (
    <button onClick={() => setLang(l => l === "en" ? "kn" : "en")} style={{
      display:"flex", alignItems:"center", gap:4,
      background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)",
      border:"1px solid rgba(255,255,255,0.25)",
      color:"#fff", borderRadius:20, padding:"5px 12px",
      fontSize:12, fontWeight:700, cursor:"pointer", letterSpacing:0.4
    }}>
      🌐 {lang === "en" ? "ಕನ್ನಡ" : "English"}
    </button>
  );
}

function BottomNav({ tab, onSwitch, t }) {
  const items = [
    { id:"home",    icon:"🏠", label:t.home },
    { id:"history", icon:"📋", label:t.bookings },
    { id:"profile", icon:"👤", label:t.profile },
  ];
  return (
    <div style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:430,
      background:"rgba(255,255,255,0.97)", backdropFilter:"blur(24px)",
      borderTop:"1px solid #e8edf5",
      display:"flex", justifyContent:"space-around",
      padding:"10px 0 22px", zIndex:50,
      boxShadow:"0 -4px 24px rgba(0,0,0,0.06)"
    }}>
      {items.map(it => {
        const active = tab === it.id;
        return (
          <button key={it.id} onClick={() => onSwitch(it.id)} style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            gap:4, background:"none", border:"none", cursor:"pointer",
            color: active ? "#6366f1" : "#94a3b8", padding:"0 24px"
          }}>
            <div style={{
              fontSize:20, lineHeight:1,
              background: active ? "#eef2ff" : "transparent",
              borderRadius:12, padding:"6px 12px", transition:"all 0.2s"
            }}>{it.icon}</div>
            <span style={{ fontSize:10, fontWeight:active?800:600, letterSpacing:0.5, transition:"color 0.2s" }}>
              {it.label}
            </span>
            {active && <div style={{ width:4, height:4, borderRadius:"50%", background:"#6366f1" }} />}
          </button>
        );
      })}
    </div>
  );
}

// ── Login Screen ───────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [name,  setName]  = useState("");
  const [phone, setPhone] = useState("");
  const [lang,  setLang]  = useState(() => localStorage.getItem("sevamitra_lang") || "en");
  const t = T[lang];

  const valid = name.trim().length > 1 && phone.replace(/\D/g,"").length === 10;

  const inp = {
    width:"100%", padding:"16px 18px", borderRadius:16,
    border:"1.5px solid #e2e8f0", background:"#f8faff",
    fontSize:15, fontWeight:500, color:"#1e293b",
    outline:"none", marginBottom:14, transition:"border-color 0.2s"
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(145deg,#312e81 0%,#4f46e5 45%,#7c3aed 100%)",
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", padding:24, position:"relative", overflow:"hidden"
    }}>
      {/* Decorative blobs */}
      {[{s:240,top:"-80px",left:"-80px"},{s:320,bottom:"-90px",right:"-70px"},{s:150,top:"52%",left:"72%"}].map((b,i) => (
        <div key={i} style={{ position:"absolute", width:b.s, height:b.s, borderRadius:"50%", background:"rgba(255,255,255,0.05)", top:b.top, bottom:b.bottom, left:b.left, right:b.right, pointerEvents:"none" }} />
      ))}

      <div style={{ position:"absolute", top:20, right:20 }}>
        <LangToggle lang={lang} setLang={v => { setLang(v); localStorage.setItem("sevamitra_lang", v); }} />
      </div>

      <div className="bounce-pop" style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ width:88, height:88, borderRadius:28, background:"rgba(255,255,255,0.15)", border:"1.5px solid rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, margin:"0 auto 16px" }}>🛠️</div>
        <h1 style={{ fontSize:38, fontWeight:800, color:"#fff", letterSpacing:-1 }}>{t.appName}</h1>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:14, marginTop:8, fontWeight:500 }}>{t.tagline}</p>
      </div>

      <div className="slide-up" style={{
        background:"#fff", borderRadius:28, padding:"32px 28px",
        width:"100%", maxWidth:380, boxShadow:"0 32px 64px rgba(0,0,0,0.28)"
      }}>
        <p style={{ fontSize:11, fontWeight:800, color:"#94a3b8", letterSpacing:1.5, textTransform:"uppercase", textAlign:"center", marginBottom:24 }}>
          {t.createAccount}
        </p>
        <input style={inp} placeholder={t.fullName} value={name} onChange={e => setName(e.target.value)}
          onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
        <input style={{...inp, marginBottom:24}} placeholder={t.phone} type="tel"
          value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,"").slice(0,10))}
          onFocus={e => e.target.style.borderColor="#6366f1"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
        <button onClick={() => { if(valid) { localStorage.setItem("sevamitra_lang", lang); onLogin({name:name.trim(), phone}); } }}
          className="tap" disabled={!valid}
          style={{
            width:"100%", padding:"17px", borderRadius:16, border:"none",
            background: valid ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#e2e8f0",
            color: valid ? "#fff" : "#94a3b8", fontSize:16, fontWeight:800,
            boxShadow: valid ? "0 8px 24px rgba(99,102,241,0.35)" : "none",
            transition:"all 0.2s"
          }}>
          {t.getStarted}
        </button>
        <p style={{ textAlign:"center", fontSize:12, color:"#cbd5e1", marginTop:16, fontWeight:500 }}>{t.termsNote}</p>
      </div>
    </div>
  );
}

// ── Admin Dashboard ────────────────────────────────────────────────────────────
function AdminDashboard({ bookings, onBack, t }) {
  const [filter, setFilter] = useState("All");
  const statuses = ["All","Confirmed","Completed","Cancelled"];
  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter);

  const counts = {
    All: bookings.length,
    Confirmed: bookings.filter(b=>b.status==="Confirmed").length,
    Completed: bookings.filter(b=>b.status==="Completed").length,
    Cancelled: bookings.filter(b=>b.status==="Cancelled").length,
  };

  const statColors = { All:"#6366f1", Confirmed:"#22c55e", Completed:"#3b82f6", Cancelled:"#ef4444" };

  return (
    <div style={{ minHeight:"100vh", background:"#f0f4ff", display:"flex", flexDirection:"column", maxWidth:430, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1e293b,#334155)", padding:"52px 20px 28px" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:"#fff", fontWeight:700, fontSize:13, marginBottom:20, borderRadius:12, padding:"8px 14px" }}>
          ← Back
        </button>
        <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, marginBottom:4 }}>🛡️ {t.adminDashboard}</h2>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13 }}>{t.allBookings} — {bookings.length} total</p>

        {/* Stat pills */}
        <div style={{ display:"flex", gap:8, marginTop:16, flexWrap:"wrap" }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding:"7px 14px", borderRadius:20, border:"none", cursor:"pointer",
              background: filter===s ? statColors[s] : "rgba(255,255,255,0.1)",
              color: "#fff", fontSize:12, fontWeight:700, transition:"all 0.2s"
            }}>{s} ({counts[s]})</button>
          ))}
        </div>
      </div>

      {/* Booking cards */}
      <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 40px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", paddingTop:60, color:"#94a3b8" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
            <div style={{ fontWeight:700 }}>No bookings found</div>
          </div>
        ) : filtered.map((b, i) => (
          <div key={b.id} className="fade-up"
            style={{
              background:"#fff", borderRadius:18, padding:16, marginBottom:10,
              border:"1.5px solid #e8edf5", boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
              animationDelay:`${i*0.04}s`
            }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <p style={{ fontWeight:800, fontSize:15, color:"#1e293b" }}>#{b.id} · {b.worker_name}</p>
                <span style={{ background:CAT_BG[b.category]||"#f0f4ff", color:CAT_COLORS[b.category]||"#6366f1", fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:8 }}>
                  {CAT_ICONS[b.category]} {b.category}
                </span>
              </div>
              <Badge status={b.status} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, fontSize:12, color:"#64748b" }}>
              <div style={{ background:"#f8faff", borderRadius:8, padding:"8px 10px" }}>
                <p style={{ fontSize:10, color:"#94a3b8", fontWeight:700, marginBottom:2 }}>CUSTOMER</p>
                <p style={{ fontWeight:700, color:"#1e293b" }}>{b.customer_name}</p>
              </div>
              <div style={{ background:"#f8faff", borderRadius:8, padding:"8px 10px" }}>
                <p style={{ fontSize:10, color:"#94a3b8", fontWeight:700, marginBottom:2 }}>DATE</p>
                <p style={{ fontWeight:700, color:"#1e293b" }}>{new Date(b.time).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</p>
              </div>
            </div>
            {b.cancel_reason && (
              <div style={{ marginTop:8, background:"#fff1f2", borderRadius:8, padding:"8px 10px", fontSize:12, color:"#ef4444", fontWeight:600 }}>
                Reason: {b.cancel_reason}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [user,         setUser]         = useState(null);
  const [lang,         setLang]         = useState(() => localStorage.getItem("sevamitra_lang") || "en");
  const [tab,          setTab]          = useState("home");
  const [screen,       setScreen]       = useState("home");
  const [providers,    setProviders]    = useState([]);
  const [bookings,     setBookings]     = useState([]);
  const [selCat,       setSelCat]       = useState(null);
  const [selProv,      setSelProv]      = useState(null);
  const [selProblem,   setSelProblem]   = useState(null);
  const [callState,    setCallState]    = useState("idle");
  const [callError,    setCallError]    = useState("");
  const [showCancel,   setShowCancel]   = useState(false);
  const [cancelId,     setCancelId]     = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showAdmin,    setShowAdmin]    = useState(false);

  const t = T[lang];

  const toggleLang = () => {
    const nl = lang === "en" ? "kn" : "en";
    setLang(nl);
    localStorage.setItem("sevamitra_lang", nl);
  };

  useEffect(() => {
    const saved = localStorage.getItem("sevamitra_user");
    if (saved) setUser(JSON.parse(saved));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [p, b] = await Promise.all([
        fetch(`${BASE_URL}/providers/`).then(r => r.json()),
        fetch(`${BASE_URL}/bookings/`).then(r => r.json()),
      ]);
      setProviders(p); setBookings(b);
    } catch {}
  };

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("sevamitra_user", JSON.stringify(u));
  };

  // ── Twilio Call (unchanged logic) ──────────────────────────────────────────
  const handleCall = async () => {
    setCallState("calling"); setCallError("");
    try {
      const res = await fetch(`${BASE_URL}/initiate-call/`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ customer_phone:user.phone, provider_phone:selProv.phone }),
      });
      if (res.ok) { setCallState("called"); }
      else { const err = await res.json(); setCallError(err.detail || "Call failed. Try again."); setCallState("idle"); }
    } catch { setCallError("Could not reach server. Check your connection."); setCallState("idle"); }
  };

  // ── Booking (unchanged logic) ──────────────────────────────────────────────
  const handleBook = async () => {
    setCallState("booking");
    await fetch(`${BASE_URL}/bookings/`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ customer_name:user.name, customer_phone:user.phone, provider_id:selProv.id }),
    });
    await fetchData(); setCallState("done"); setScreen("success");
  };

  // ── Cancel (unchanged logic) ───────────────────────────────────────────────
  const handleCancel = async () => {
    if (!cancelReason) return;
    await fetch(`${BASE_URL}/bookings/${cancelId}/cancel`, {
      method:"PUT", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ reason:cancelReason }),
    });
    setShowCancel(false); setCancelReason(""); await fetchData();
  };

  // ── Mark Complete (new endpoint — add PUT /bookings/{id}/complete to backend)
  const handleComplete = async (bookingId) => {
    try {
      await fetch(`${BASE_URL}/bookings/${bookingId}/complete`, { method:"PUT" });
      await fetchData();
    } catch {}
  };

  const switchTab = (t) => { setTab(t); setScreen("home"); setCallState("idle"); setCallError(""); setSelProblem(null); };
  const goBack    = (s)  => { setScreen(s); setCallState("idle"); setCallError(""); };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  const myBookings   = bookings.filter(b => b.customer_phone === user.phone);
  const catProviders = providers.filter(p => p.category === selCat);

  if (showAdmin) return <AdminDashboard bookings={bookings} onBack={() => setShowAdmin(false)} t={t} />;

  // ── Shell wrapper ──────────────────────────────────────────────────────────
  const shell = (children) => (
    <div style={{
      minHeight:"100vh", background:"#f0f4ff",
      display:"flex", flexDirection:"column",
      maxWidth:430, margin:"0 auto", position:"relative",
      boxShadow:"0 0 80px rgba(99,102,241,0.1)"
    }}>
      {children}
      <BottomNav tab={tab} onSwitch={switchTab} t={t} />
    </div>
  );

  // ── HOME ──────────────────────────────────────────────────────────────────

  if (tab === "home") {

    // Service Grid
    if (screen === "home") return shell(<>
      <div style={{
        background:"linear-gradient(145deg,#4f46e5 0%,#6d28d9 55%,#7c3aed 100%)",
        padding:"52px 24px 32px", borderRadius:"0 0 36px 36px",
        boxShadow:"0 12px 40px rgba(99,102,241,0.3)"
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>{t.appName}</p>
            <h2 style={{ color:"#fff", fontSize:26, fontWeight:800, lineHeight:1.2, marginBottom:2 }}>
              {t.namaste}, {user.name.split(" ")[0]} 🙏
            </h2>
            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13, fontWeight:500 }}>{t.whatService}</p>
          </div>
          <LangToggle lang={lang} setLang={toggleLang} />
        </div>

        {/* Quick stats */}
        <div style={{ display:"flex", gap:10, marginTop:4 }}>
          {[
            { label:t.activeBookings, value:myBookings.filter(b=>b.status==="Confirmed").length, icon:"📋", color:"rgba(255,255,255,0.18)" },
            { label:t.expertsNearYou, value:providers.length, icon:"⚡", color:"rgba(255,255,255,0.18)" },
          ].map(s => (
            <div key={s.label} style={{ flex:1, background:s.color, borderRadius:16, padding:"12px 14px", border:"1px solid rgba(255,255,255,0.2)", backdropFilter:"blur(8px)" }}>
              <div style={{ fontSize:18, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>{s.value}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)", fontWeight:600, lineHeight:1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"24px 20px 100px" }}>
        <h3 style={{ fontSize:16, fontWeight:800, color:"#1e293b", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:4, height:18, background:"#6366f1", borderRadius:4, display:"inline-block" }} />
          {t.browseServices}
        </h3>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {Object.keys(PROBLEMS).map((c, i) => (
            <button key={c} onClick={() => { setSelCat(c); setScreen("list"); }}
              className="tap fade-up"
              style={{
                background:"#fff", border:`1.5px solid ${CAT_COLORS[c]}22`,
                borderRadius:22, padding:"20px 14px",
                display:"flex", flexDirection:"column", alignItems:"center",
                cursor:"pointer", boxShadow:"0 2px 12px rgba(0,0,0,0.05)",
                animationDelay:`${i*0.06}s`, position:"relative", overflow:"hidden"
              }}>
              {/* accent bar top */}
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:CAT_COLORS[c], borderRadius:"22px 22px 0 0" }} />
              <div style={{
                width:54, height:54, borderRadius:18,
                background:CAT_BG[c], border:`1.5px solid ${CAT_COLORS[c]}33`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:26, marginBottom:10
              }}>{CAT_ICONS[c]}</div>
              <span style={{ fontSize:13, fontWeight:700, color:"#1e293b", textAlign:"center" }}>{c}</span>
              <span style={{ fontSize:11, color:CAT_COLORS[c], marginTop:4, fontWeight:700 }}>
                {providers.filter(p=>p.category===c).length} {t.available}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>);

    // Provider List
    if (screen === "list") return shell(<>
      <div style={{ background:"#fff", padding:"52px 20px 20px", borderBottom:"1px solid #f1f5f9" }}>
        <button onClick={() => goBack("home")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:"#6366f1", fontWeight:700, fontSize:14, marginBottom:16 }}>
          ← Back
        </button>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{
              width:50, height:50, borderRadius:16,
              background:CAT_BG[selCat], border:`1.5px solid ${CAT_COLORS[selCat]}33`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:22
            }}>{CAT_ICONS[selCat]}</div>
            <div>
              <h3 style={{ fontSize:20, fontWeight:800, color:"#1e293b" }}>{selCat} {t.experts}</h3>
              <p style={{ fontSize:12, color:"#94a3b8", fontWeight:500 }}>{catProviders.length} {t.available} {t.in} Mysuru</p>
            </div>
          </div>
          <LangToggle lang={lang} setLang={toggleLang} />
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 100px" }}>
        {catProviders.length === 0 ? (
          <div style={{ textAlign:"center", paddingTop:80, color:"#94a3b8" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>😔</div>
            <div style={{ fontWeight:700, fontSize:16 }}>{t.noExperts}</div>
            <div style={{ fontSize:13, marginTop:6 }}>{t.checkLater}</div>
          </div>
        ) : catProviders.map((p, i) => (
          <div key={p.id} className="fade-up"
            style={{
              background:"#fff", borderRadius:20, padding:18, marginBottom:12,
              display:"flex", alignItems:"center", gap:14,
              border:"1.5px solid #e8edf5", boxShadow:"0 2px 12px rgba(0,0,0,0.04)",
              animationDelay:`${i*0.06}s`
            }}>
            <img src={p.photo_url} alt={p.name}
              onError={e => { e.target.onerror=null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=eef2ff&color=6366f1&bold=true`; }}
              style={{ width:62, height:62, borderRadius:18, objectFit:"cover", border:"2px solid #e8edf5", flexShrink:0 }}
            />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, color:"#1e293b", fontSize:15, marginBottom:2 }}>{p.name}</div>
              <div style={{ fontSize:12, color:"#94a3b8", fontWeight:600, marginBottom:7 }}>📍 {p.location}</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                <span style={{ background:"#f0fdf4", color:"#16a34a", borderRadius:8, fontSize:11, fontWeight:700, padding:"3px 8px" }}>⭐ {p.rating}</span>
                <span style={{ background:"#f0f4ff", color:"#6366f1", borderRadius:8, fontSize:11, fontWeight:700, padding:"3px 8px" }}>₹{p.base_price}</span>
                <span style={{ background:"#f8faff", color:"#64748b", borderRadius:8, fontSize:11, fontWeight:600, padding:"3px 8px" }}>{p.experience} yrs</span>
              </div>
            </div>
            <button onClick={() => { setSelProv(p); setSelProblem(null); setCallState("idle"); setCallError(""); setScreen("problem"); }}
              className="tap"
              style={{
                background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                color:"#fff", border:"none", borderRadius:14,
                padding:"10px 16px", fontSize:12, fontWeight:800,
                boxShadow:"0 4px 12px rgba(99,102,241,0.3)", flexShrink:0
              }}>View →</button>
          </div>
        ))}
      </div>
    </>);

    // ── Problem Type Selection Screen ─────────────────────────────────────────
    if (screen === "problem") return shell(<>
      <div style={{
        background:`linear-gradient(160deg,${CAT_COLORS[selCat]}18,#fff)`,
        padding:"52px 20px 28px", borderBottom:"1px solid #e8edf5"
      }}>
        <button onClick={() => goBack("list")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:"#6366f1", fontWeight:700, fontSize:14, marginBottom:20 }}>
          ← Back
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:52, height:52, borderRadius:18, background:CAT_BG[selCat], border:`1.5px solid ${CAT_COLORS[selCat]}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{CAT_ICONS[selCat]}</div>
          <div>
            <h3 style={{ fontSize:22, fontWeight:800, color:"#1e293b" }}>{t.selectProblem}</h3>
            <p style={{ fontSize:13, color:"#94a3b8", fontWeight:500 }}>{selProv?.name}</p>
          </div>
        </div>
        <p style={{ fontSize:14, color:"#64748b", fontWeight:500, marginTop:12 }}>{t.whatIssue}</p>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 100px" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {(PROBLEMS[selCat] || []).map((prob, i) => (
            <button key={prob} onClick={() => { setSelProblem(prob); setScreen("profile"); }}
              className="tap fade-up"
              style={{
                padding:"18px 20px", borderRadius:16, textAlign:"left",
                border:`1.5px solid ${selProblem===prob ? CAT_COLORS[selCat] : "#e8edf5"}`,
                background: selProblem===prob ? `${CAT_COLORS[selCat]}12` : "#fff",
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between",
                boxShadow:"0 2px 8px rgba(0,0,0,0.03)", animationDelay:`${i*0.06}s`
              }}>
              <span style={{ fontSize:14, fontWeight:700, color:"#1e293b" }}>{prob}</span>
              <span style={{ color:CAT_COLORS[selCat], fontWeight:800, fontSize:18 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </>);

    // Provider Profile
    if (screen === "profile") {
      const color = CAT_COLORS[selProv.category];
      return shell(<>
        <div style={{ background:`linear-gradient(160deg,${color}18,#fff)`, padding:"52px 20px 28px", borderBottom:"1px solid #e8edf5" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <button onClick={() => goBack("problem")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:"#6366f1", fontWeight:700, fontSize:14, marginBottom:20 }}>
              ← Back
            </button>
            <LangToggle lang={lang} setLang={toggleLang} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>
            <img src={selProv.photo_url} alt={selProv.name}
              onError={e => { e.target.onerror=null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(selProv.name)}&background=eef2ff&color=6366f1&bold=true&size=128`; }}
              style={{ width:106, height:106, borderRadius:32, objectFit:"cover", border:"4px solid #fff", boxShadow:"0 8px 32px rgba(0,0,0,0.14)", marginBottom:14 }}
            />
            <h2 style={{ fontSize:24, fontWeight:800, color:"#1e293b", marginBottom:4 }}>
              {selProv.name} <span style={{ color, fontSize:17 }}>✓</span>
            </h2>
            <p style={{ color:"#64748b", fontSize:14, fontWeight:600 }}>
              {t.verified} {selProv.category} · {selProv.location}
            </p>
            {/* Problem type badge */}
            {selProblem && (
              <div style={{ marginTop:10, background:CAT_BG[selProv.category], border:`1px solid ${color}33`, borderRadius:20, padding:"6px 16px", display:"inline-flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:12 }}>🔍</span>
                <span style={{ fontSize:12, fontWeight:700, color }}>{t.problemFor}: {selProblem}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"22px 20px 110px" }}>
          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:22 }}>
            {[
              { label:t.experience, value:`${selProv.experience} Yrs`, icon:"🏆" },
              { label:t.rating,     value:`⭐ ${selProv.rating}`,     icon:"" },
              { label:t.baseFee,    value:`₹${selProv.base_price}`,   icon:"💰" },
            ].map(s => (
              <div key={s.label} style={{
                background:"#fff", borderRadius:16, padding:"14px 10px",
                textAlign:"center", border:"1.5px solid #e8edf5",
                boxShadow:"0 2px 8px rgba(0,0,0,0.04)"
              }}>
                <div style={{ fontSize:12, fontWeight:800, color:"#1e293b", marginBottom:3 }}>{s.value}</div>
                <div style={{ fontSize:10, color:"#94a3b8", fontWeight:600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* How it works — with IVR "Press 1" instruction */}
          <div style={{ background:"#fff", borderRadius:18, padding:20, border:"1.5px solid #e8edf5", marginBottom:22, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <p style={{ fontSize:11, fontWeight:800, color:"#94a3b8", letterSpacing:0.8, textTransform:"uppercase", marginBottom:14 }}>{t.howItWorks}</p>
            {[t.step1, t.step2, t.step3].map((s, i) => (
              <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:i<2?12:0 }}>
                <div style={{
                  width:26, height:26, borderRadius:8,
                  background: i===1 ? "#fef3c7" : "#eef2ff",
                  color: i===1 ? "#d97706" : "#6366f1",
                  fontSize:12, fontWeight:800,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
                }}>{i===1 ? "1️⃣" : i+1}</div>
                <p style={{ fontSize:13, color:"#64748b", fontWeight:500, lineHeight:1.55 }}>{s}</p>
              </div>
            ))}
          </div>

          {/* Error */}
          {callError && (
            <div style={{ background:"#fff1f2", border:"1.5px solid #fecdd3", borderRadius:14, padding:"12px 16px", marginBottom:16, fontSize:13, color:"#ef4444", fontWeight:600 }}>
              ⚠️ {callError}
            </div>
          )}

          {/* ── Call states ── */}
          {callState === "idle" && (
            <button onClick={handleCall} className="tap" style={{
              width:"100%", background:"#1e293b", color:"#fff",
              border:"none", borderRadius:20, padding:"20px",
              fontSize:16, fontWeight:800,
              boxShadow:"0 8px 24px rgba(0,0,0,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10
            }}>
              📞 {t.callExpert}
            </button>
          )}

          {callState === "calling" && (
            <div style={{
              width:"100%", background:"#6366f1", color:"#fff",
              borderRadius:20, padding:"20px", fontSize:15, fontWeight:700,
              display:"flex", alignItems:"center", justifyContent:"center", gap:12,
              boxShadow:"0 8px 24px rgba(99,102,241,0.35)"
            }}>
              <Spinner /> {t.connecting}
            </div>
          )}

          {callState === "called" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {/* IVR "Press 1" instruction card */}
              <div style={{
                background:"linear-gradient(135deg,#fffbeb,#fef3c7)",
                border:"1.5px solid #fde68a", borderRadius:18,
                padding:"18px 20px"
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div className="ring-pulse" style={{
                    width:40, height:40, borderRadius:"50%",
                    background:"#f59e0b", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20
                  }}>📱</div>
                  <div>
                    <p style={{ fontSize:14, fontWeight:800, color:"#92400e" }}>{t.callRinging}</p>
                    <p style={{ fontSize:12, color:"#b45309", fontWeight:500 }}>{t.ivrInstruction}</p>
                  </div>
                </div>
                <div style={{ background:"#fff", borderRadius:12, padding:"12px 16px", border:"1px solid #fde68a", display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:28, fontWeight:800, color:"#f59e0b", background:"#fffbeb", width:44, height:44, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>1</span>
                  <p style={{ fontSize:13, color:"#78350f", fontWeight:600, lineHeight:1.4 }}>
                    {t.pressOneTo} <strong>{selProv.name}</strong>
                  </p>
                </div>
              </div>

              {/* Confirm booking */}
              <button onClick={handleBook} disabled={callState==="booking"} className="tap" style={{
                width:"100%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                color:"#fff", border:"none", borderRadius:20, padding:"20px",
                fontSize:16, fontWeight:800,
                boxShadow:"0 8px 24px rgba(99,102,241,0.35)",
                display:"flex", alignItems:"center", justifyContent:"center", gap:10
              }}>
                {callState==="booking" ? <><Spinner /> Confirming...</> : `✅ ${t.confirmBooking}`}
              </button>

              <button onClick={handleCall} className="tap" style={{
                background:"none", border:"1.5px solid #e8edf5", color:"#64748b",
                borderRadius:16, padding:"12px", fontSize:13, fontWeight:700
              }}>
                📞 {t.callAgain}
              </button>
            </div>
          )}
        </div>
      </>);
    }

    // Success Screen
    if (screen === "success") return shell(
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 32px 100px" }}>
        <div className="bounce-pop" style={{
          width:100, height:100, borderRadius:32,
          background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:48, marginBottom:24, boxShadow:"0 16px 40px rgba(99,102,241,0.4)"
        }}>🎉</div>
        <h2 style={{ fontSize:28, fontWeight:800, color:"#1e293b", marginBottom:8, textAlign:"center" }}>{t.bookingConfirmed}</h2>
        <p style={{ color:"#64748b", fontSize:15, fontWeight:500, textAlign:"center", marginBottom:12, lineHeight:1.6 }}>
          Your {selProv?.category?.toLowerCase()} {t.willReach}
        </p>
        {selProblem && (
          <div style={{ background:"#eef2ff", borderRadius:12, padding:"10px 20px", marginBottom:28, display:"inline-flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:13, color:"#6366f1", fontWeight:700 }}>🔍 {selProblem}</span>
          </div>
        )}
        <button onClick={() => switchTab("history")} className="tap" style={{
          background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff",
          border:"none", borderRadius:18, padding:"16px 36px",
          fontSize:15, fontWeight:800, boxShadow:"0 8px 24px rgba(99,102,241,0.35)", marginBottom:14
        }}>{t.viewBookings}</button>
        <button onClick={() => switchTab("home")} style={{
          background:"none", border:"none", color:"#94a3b8",
          fontSize:14, fontWeight:600, cursor:"pointer"
        }}>{t.backHome}</button>
      </div>
    );
  }

  // ── HISTORY ───────────────────────────────────────────────────────────────
  if (tab === "history") return shell(<>
    <div style={{ background:"#fff", padding:"52px 20px 20px", borderBottom:"1px solid #f1f5f9" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <h2 style={{ fontSize:24, fontWeight:800, color:"#1e293b" }}>{t.myBookings}</h2>
          <p style={{ fontSize:13, color:"#94a3b8", marginTop:4, fontWeight:500 }}>
            {myBookings.length} {myBookings.length!==1 ? t.totalBookedP : t.totalBooked}
          </p>
        </div>
        <LangToggle lang={lang} setLang={toggleLang} />
      </div>
    </div>

    <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 100px" }}>
      {myBookings.length === 0 ? (
        <div style={{ textAlign:"center", paddingTop:80, color:"#94a3b8" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
          <div style={{ fontWeight:700, fontSize:16 }}>{t.noBookings}</div>
          <div style={{ fontSize:13, marginTop:6 }}>{t.bookService}</div>
        </div>
      ) : myBookings.map((b, i) => (
        <div key={b.id} className="fade-up"
          style={{
            background: b.status==="Cancelled" ? "#f8faff" : b.status==="Completed" ? "#f0f9ff" : "#fff",
            border:`1.5px solid ${b.status==="Cancelled" ? "#fecdd3" : b.status==="Completed" ? "#bfdbfe" : "#e8edf5"}`,
            borderRadius:20, padding:20, marginBottom:12,
            opacity: b.status==="Cancelled" ? 0.65 : 1,
            boxShadow:"0 2px 8px rgba(0,0,0,0.04)", animationDelay:`${i*0.05}s`
          }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <div>
              <p style={{ fontWeight:800, fontSize:15, color:"#1e293b", marginBottom:5 }}>{b.worker_name}</p>
              <span style={{
                background:CAT_BG[b.category]||"#f0f4ff", color:CAT_COLORS[b.category]||"#6366f1",
                fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:8
              }}>{CAT_ICONS[b.category]} {b.category}</span>
            </div>
            <Badge status={b.status} />
          </div>
          <p style={{ fontSize:12, color:"#94a3b8", fontWeight:600, marginBottom:14 }}>
            🕐 {new Date(b.time).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
          </p>

          {b.status === "Confirmed" && (
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => handleComplete(b.id)} className="tap" style={{
                flex:1, background:"#eff6ff", border:"1.5px solid #bfdbfe",
                color:"#1d4ed8", borderRadius:12, padding:"10px",
                fontSize:13, fontWeight:700, cursor:"pointer"
              }}>✅ {t.markComplete}</button>
              <button onClick={() => { setCancelId(b.id); setShowCancel(true); }} style={{
                flex:1, background:"#fff1f2", border:"1.5px solid #fecdd3",
                color:"#ef4444", borderRadius:12, padding:"10px",
                fontSize:13, fontWeight:700, cursor:"pointer"
              }}>{t.cancelBooking}</button>
            </div>
          )}

          {b.cancel_reason && (
            <p style={{ fontSize:12, color:"#94a3b8", marginTop:8, fontWeight:500, fontStyle:"italic" }}>
              Reason: {b.cancel_reason}
            </p>
          )}
        </div>
      ))}
    </div>

    {/* Cancel Modal */}
    {showCancel && (
      <div className="fade-in" style={{
        position:"fixed", inset:0, background:"rgba(15,23,42,0.75)",
        backdropFilter:"blur(10px)", zIndex:100,
        display:"flex", alignItems:"flex-end", justifyContent:"center"
      }}>
        <div className="slide-up" style={{
          background:"#fff", borderRadius:"28px 28px 0 0",
          padding:"28px 24px 40px", width:"100%", maxWidth:430
        }}>
          <div style={{ width:40, height:4, background:"#e2e8f0", borderRadius:2, margin:"0 auto 24px" }} />
          <h3 style={{ fontSize:20, fontWeight:800, color:"#1e293b", marginBottom:6 }}>{t.cancelBooking}</h3>
          <p style={{ fontSize:14, color:"#94a3b8", fontWeight:500, marginBottom:20 }}>{t.whyCancelling}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
            {CANCEL_REASONS.map(r => (
              <button key={r} onClick={() => setCancelReason(r)} style={{
                padding:"13px 18px", borderRadius:14, textAlign:"left",
                fontSize:14, fontWeight:600, cursor:"pointer",
                border:cancelReason===r?"2px solid #6366f1":"1.5px solid #e8edf5",
                background:cancelReason===r?"#eef2ff":"#f8faff",
                color:cancelReason===r?"#6366f1":"#64748b"
              }}>{r}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button onClick={() => { setShowCancel(false); setCancelReason(""); }} style={{
              flex:1, padding:"15px", borderRadius:16, border:"1.5px solid #e8edf5",
              background:"#f8faff", color:"#64748b", fontSize:14, fontWeight:700, cursor:"pointer"
            }}>{t.goBack}</button>
            <button onClick={handleCancel} disabled={!cancelReason} className="tap" style={{
              flex:1, padding:"15px", borderRadius:16, border:"none",
              background:cancelReason?"#ef4444":"#fca5a5",
              color:"#fff", fontSize:14, fontWeight:800,
              boxShadow:cancelReason?"0 4px 16px rgba(239,68,68,0.3)":"none"
            }}>{t.confirm}</button>
          </div>
        </div>
      </div>
    )}
  </>);

  // ── PROFILE ───────────────────────────────────────────────────────────────
  if (tab === "profile") return shell(<>
    <div style={{
      background:"linear-gradient(145deg,#312e81,#4f46e5,#6d28d9)",
      padding:"52px 20px 36px"
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div />
        <LangToggle lang={lang} setLang={toggleLang} />
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <div style={{
          width:72, height:72, borderRadius:24,
          background:"rgba(255,255,255,0.18)", border:"2.5px solid rgba(255,255,255,0.35)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:30, fontWeight:800, color:"#fff"
        }}>{user.name[0].toUpperCase()}</div>
        <div>
          <h2 style={{ fontSize:22, fontWeight:800, color:"#fff", marginBottom:3 }}>{user.name}</h2>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:13, fontWeight:600 }}>{user.phone}</p>
        </div>
      </div>
    </div>

    <div style={{ flex:1, overflowY:"auto", padding:"22px 20px 100px" }}>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:22 }}>
        {[
          { label:t.totalBookings, value:myBookings.length, color:"#6366f1", bg:"#eef2ff" },
          { label:t.confirmed,     value:myBookings.filter(b=>b.status==="Confirmed").length, color:"#16a34a", bg:"#f0fdf4" },
          { label:t.completed,     value:myBookings.filter(b=>b.status==="Completed").length, color:"#1d4ed8", bg:"#eff6ff" },
        ].map(s => (
          <div key={s.label} style={{
            background:s.bg, borderRadius:16, padding:"14px 10px",
            textAlign:"center"
          }}>
            <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:10, color:s.color+"99", fontWeight:700, marginTop:2, lineHeight:1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Admin access */}
      {user.phone === ADMIN_PHONE && (
        <button onClick={() => setShowAdmin(true)} className="tap" style={{
          width:"100%", marginBottom:16, padding:"16px 20px", borderRadius:18,
          background:"linear-gradient(135deg,#1e293b,#334155)",
          color:"#fff", border:"none", fontSize:15, fontWeight:700,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          boxShadow:"0 4px 16px rgba(0,0,0,0.12)"
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>🛡️</span>{t.adminDashboard}
          </div>
          <span style={{ color:"#94a3b8" }}>›</span>
        </button>
      )}

      {/* Menu items */}
      <div style={{ background:"#fff", borderRadius:20, border:"1.5px solid #e8edf5", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", marginBottom:16 }}>
        {[
          { label:t.support,  icon:"🎧" },
          { label:t.about,    icon:"ℹ️" },
          { label:t.facebook, icon:"🔵" },
        ].map((item, i, arr) => (
          <button key={item.label} style={{
            width:"100%", padding:"17px 20px", background:"none",
            border:"none", borderBottom:i<arr.length-1?"1px solid #f1f5f9":"none",
            display:"flex", justifyContent:"space-between", alignItems:"center",
            cursor:"pointer", color:"#1e293b"
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, fontSize:14, fontWeight:700 }}>
              <span style={{ fontSize:20 }}>{item.icon}</span>{item.label}
            </div>
            <span style={{ color:"#94a3b8", fontSize:16 }}>›</span>
          </button>
        ))}
      </div>

      <button onClick={() => { localStorage.clear(); window.location.reload(); }}
        className="tap"
        style={{
          width:"100%", padding:"16px", borderRadius:18,
          background:"#fff1f2", border:"1.5px solid #fecdd3",
          color:"#ef4444", fontSize:15, fontWeight:800, cursor:"pointer"
        }}>
        🚪 {t.logout}
      </button>
    </div>
  </>);

  return null;
}
