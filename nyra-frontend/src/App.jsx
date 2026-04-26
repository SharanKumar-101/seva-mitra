import React, { useState, useEffect, useRef } from "react";

const BASE_URL = "";

// Inject fonts & global styles
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const styleEl = document.createElement("style");
styleEl.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; background: #f0f4ff; font-family: 'Plus Jakarta Sans', sans-serif; }
  ::-webkit-scrollbar { display: none; }
  input, button { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
  @keyframes slideUp   { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
  @keyframes bouncePop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes spin      { to { transform: rotate(360deg); } }
  @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.5} }

  .fade-up    { animation: fadeUp    0.35s ease forwards; }
  .fade-in    { animation: fadeIn    0.3s  ease forwards; }
  .slide-up   { animation: slideUp   0.4s  ease forwards; }
  .bounce-pop { animation: bouncePop 0.5s  ease forwards; }

  .tap { transition: transform 0.15s ease, opacity 0.15s ease; cursor: pointer; }
  .tap:active { transform: scale(0.95); opacity: 0.85; }
  .tap:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
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

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Badge({ status }) {
  const ok = status !== "Cancelled";
  return (
    <span style={{
      fontSize:10, fontWeight:800, letterSpacing:0.5,
      padding:"4px 10px", borderRadius:20,
      background: ok ? "#dcfce7" : "#fee2e2",
      color: ok ? "#16a34a" : "#dc2626"
    }}>{status.toUpperCase()}</span>
  );
}

function Spinner() {
  return (
    <div style={{
      width:20, height:20, borderRadius:"50%",
      border:"3px solid rgba(255,255,255,0.3)",
      borderTopColor:"#fff",
      animation:"spin 0.7s linear infinite", display:"inline-block"
    }} />
  );
}

function BottomNav({ tab, onSwitch }) {
  const items = [
    { id:"home",    icon:"🏠", label:"Home" },
    { id:"history", icon:"📋", label:"Bookings" },
    { id:"profile", icon:"👤", label:"Profile" },
  ];
  return (
    <div style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:430,
      background:"rgba(255,255,255,0.94)", backdropFilter:"blur(20px)",
      borderTop:"1px solid #e8edf5",
      display:"flex", justifyContent:"space-around",
      padding:"12px 0 22px", zIndex:50,
      boxShadow:"0 -8px 32px rgba(99,102,241,0.07)"
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
              borderRadius:10, padding:"6px 10px", transition:"background 0.2s"
            }}>{it.icon}</div>
            <span style={{ fontSize:10, fontWeight: active ? 800 : 600, letterSpacing:0.5 }}>{it.label}</span>
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

  const inp = {
    width:"100%", padding:"16px 18px", borderRadius:16,
    border:"1.5px solid #e2e8f0", background:"#f8faff",
    fontSize:15, fontWeight:500, color:"#1e293b",
    outline:"none", marginBottom:14, transition:"border-color 0.2s"
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(145deg,#4f46e5 0%,#7c3aed 50%,#6366f1 100%)",
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", padding:24, overflow:"hidden", position:"relative"
    }}>
      {/* Decorative blobs */}
      {[
        { s:220, top:"-70px", left:"-70px" },
        { s:300, bottom:"-80px", right:"-60px" },
        { s:140, top:"55%",  left:"70%" },
      ].map((b, i) => (
        <div key={i} style={{
          position:"absolute", width:b.s, height:b.s, borderRadius:"50%",
          background:"rgba(255,255,255,0.06)",
          top:b.top, bottom:b.bottom, left:b.left, right:b.right,
          pointerEvents:"none"
        }} />
      ))}

      <div className="bounce-pop" style={{ textAlign:"center", marginBottom:40 }}>
        <div style={{ fontSize:60, marginBottom:12 }}>🛠️</div>
        <h1 style={{ fontSize:36, fontWeight:800, color:"#fff", letterSpacing:-1 }}>Sevamitra</h1>
        <p style={{ color:"rgba(255,255,255,0.65)", fontSize:14, marginTop:8, fontWeight:500 }}>
          Mysuru's Trusted Service Platform
        </p>
      </div>

      <div className="slide-up" style={{
        background:"#fff", borderRadius:28, padding:"32px 28px",
        width:"100%", maxWidth:380, boxShadow:"0 32px 64px rgba(0,0,0,0.22)"
      }}>
        <p style={{ fontSize:12, fontWeight:800, color:"#94a3b8", letterSpacing:1.5, textTransform:"uppercase", textAlign:"center", marginBottom:24 }}>
          Create your account
        </p>
        <input style={inp} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
          onFocus={e => e.target.style.borderColor="#6366f1"}
          onBlur={e  => e.target.style.borderColor="#e2e8f0"} />
        <input style={{...inp, marginBottom:24}} placeholder="10-Digit Phone Number" type="tel"
          value={phone} onChange={e => setPhone(e.target.value)}
          onFocus={e => e.target.style.borderColor="#6366f1"}
          onBlur={e  => e.target.style.borderColor="#e2e8f0"} />

        <button onClick={() => { if(name && phone) onLogin({name, phone}); }}
          className="tap"
          style={{
            width:"100%", padding:"17px", borderRadius:16, border:"none",
            background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
            color:"#fff", fontSize:16, fontWeight:800,
            boxShadow:"0 8px 24px rgba(99,102,241,0.35)"
          }}>
          Get Started →
        </button>
        <p style={{ textAlign:"center", fontSize:12, color:"#cbd5e1", marginTop:16, fontWeight:500 }}>
          By continuing you agree to our Terms of Service
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
  const [selCat,       setSelCat]       = useState(null);
  const [selProv,      setSelProv]      = useState(null);
  const [callState,    setCallState]    = useState("idle"); // idle | calling | called | booking | done
  const [callError,    setCallError]    = useState("");
  const [showCancel,   setShowCancel]   = useState(false);
  const [cancelId,     setCancelId]     = useState(null);
  const [cancelReason, setCancelReason] = useState("");

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

  // ── Twilio Call ────────────────────────────────────────────────────────────
  const handleCall = async () => {
    setCallState("calling");
    setCallError("");
    try {
      const res = await fetch(`${BASE_URL}/initiate-call/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_phone: user.phone,
          provider_phone: selProv.phone,
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

  // ── Booking ────────────────────────────────────────────────────────────────
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

  const switchTab = (t) => { setTab(t); setScreen("home"); setCallState("idle"); setCallError(""); };
  const goBack    = (s)  => { setScreen(s); setCallState("idle"); setCallError(""); };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  const myBookings    = bookings.filter(b => b.customer_phone === user.phone);
  const catProviders  = providers.filter(p => p.category === selCat);

  // Wrapper shell
  const shell = (children) => (
    <div style={{
      minHeight:"100vh", background:"#f0f4ff",
      display:"flex", flexDirection:"column",
      maxWidth:430, margin:"0 auto", position:"relative",
      boxShadow:"0 0 60px rgba(99,102,241,0.08)"
    }}>
      {children}
      <BottomNav tab={tab} onSwitch={switchTab} />
    </div>
  );

  // ── HOME ──────────────────────────────────────────────────────────────────

  if (tab === "home") {

    // Service Grid
    if (screen === "home") return shell(<>
      <div style={{
        background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
        padding:"52px 24px 36px", borderRadius:"0 0 32px 32px",
        boxShadow:"0 8px 32px rgba(99,102,241,0.25)"
      }}>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:12, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>Sevamitra</p>
        <h2 style={{ color:"#fff", fontSize:26, fontWeight:800, lineHeight:1.2, marginBottom:4 }}>
          Namaste, {user.name.split(" ")[0]} 🙏
        </h2>
        <p style={{ color:"rgba(255,255,255,0.65)", fontSize:14, fontWeight:500 }}>What service do you need today?</p>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"24px 20px 100px" }}>
        <div style={{ display:"flex", gap:12, marginBottom:28 }}>
          {[
            { label:"Active Bookings",  value: myBookings.filter(b=>b.status!=="Cancelled").length, color:"#6366f1" },
            { label:"Experts Near You", value: providers.length, color:"#22c55e" },
          ].map(s => (
            <div key={s.label} style={{
              flex:1, background:"#fff", borderRadius:18, padding:"16px 18px",
              boxShadow:"0 2px 12px rgba(0,0,0,0.05)", border:"1px solid #e8edf5"
            }}>
              <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:12, color:"#94a3b8", fontWeight:600, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize:17, fontWeight:800, color:"#1e293b", marginBottom:16 }}>Browse Services</h3>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {Object.keys(PROBLEMS).map((c, i) => (
            <button key={c} onClick={() => { setSelCat(c); setScreen("list"); }}
              className="tap fade-up"
              style={{
                background:"#fff", border:`1.5px solid ${CAT_COLORS[c]}22`,
                borderRadius:22, padding:"22px 16px",
                display:"flex", flexDirection:"column", alignItems:"center",
                boxShadow:"0 2px 12px rgba(0,0,0,0.04)",
                animationDelay:`${i*0.05}s`
              }}>
              <div style={{
                width:56, height:56, borderRadius:18,
                background:CAT_BG[c], border:`1.5px solid ${CAT_COLORS[c]}33`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:26, marginBottom:12
              }}>{CAT_ICONS[c]}</div>
              <span style={{ fontSize:13, fontWeight:700, color:"#1e293b", textAlign:"center" }}>{c}</span>
              <span style={{ fontSize:11, color:"#94a3b8", marginTop:4, fontWeight:600 }}>
                {providers.filter(p=>p.category===c).length} available
              </span>
            </button>
          ))}
        </div>
      </div>
    </>);

    // Provider List (skipped problem screen — goes straight to list now, simpler UX)
    if (screen === "list") return shell(<>
      <div style={{ background:"#fff", padding:"52px 20px 20px", borderBottom:"1px solid #f1f5f9" }}>
        <button onClick={() => goBack("home")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:"#6366f1", fontWeight:700, fontSize:14, marginBottom:16 }}>
          ← Back
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{
            width:52, height:52, borderRadius:16,
            background:CAT_BG[selCat], border:`1.5px solid ${CAT_COLORS[selCat]}33`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:24
          }}>{CAT_ICONS[selCat]}</div>
          <div>
            <h3 style={{ fontSize:22, fontWeight:800, color:"#1e293b" }}>{selCat} Experts</h3>
            <p style={{ fontSize:13, color:"#94a3b8", fontWeight:500 }}>{catProviders.length} available in Mysuru</p>
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 100px" }}>
        {catProviders.length === 0 ? (
          <div style={{ textAlign:"center", paddingTop:80, color:"#94a3b8" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>😔</div>
            <div style={{ fontWeight:700, fontSize:16 }}>No experts found</div>
            <div style={{ fontSize:13, marginTop:6 }}>Check back later</div>
          </div>
        ) : catProviders.map((p, i) => (
          <div key={p.id} className="fade-up"
            style={{
              background:"#fff", borderRadius:20, padding:18, marginBottom:12,
              display:"flex", alignItems:"center", gap:16,
              border:"1.5px solid #e8edf5", boxShadow:"0 2px 12px rgba(0,0,0,0.04)",
              animationDelay:`${i*0.06}s`
            }}>
            <img src={p.photo_url} alt={p.name}
              onError={e => { e.target.onerror=null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=eef2ff&color=6366f1&bold=true`; }}
              style={{ width:60, height:60, borderRadius:18, objectFit:"cover", border:"2px solid #e8edf5", flexShrink:0 }}
            />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, color:"#1e293b", fontSize:15, marginBottom:2 }}>{p.name}</div>
              <div style={{ fontSize:12, color:"#94a3b8", fontWeight:600, marginBottom:6 }}>📍 {p.location}</div>
              <div style={{ display:"flex", gap:8 }}>
                <span style={{ background:"#f0fdf4", color:"#16a34a", borderRadius:8, fontSize:11, fontWeight:700, padding:"3px 8px" }}>⭐ {p.rating}</span>
                <span style={{ background:"#f8faff", color:"#6366f1", borderRadius:8, fontSize:11, fontWeight:700, padding:"3px 8px" }}>₹{p.base_price}</span>
                <span style={{ background:"#f8faff", color:"#64748b", borderRadius:8, fontSize:11, fontWeight:600, padding:"3px 8px" }}>{p.experience} yrs</span>
              </div>
            </div>
            <button onClick={() => { setSelProv(p); setCallState("idle"); setCallError(""); setScreen("profile"); }}
              className="tap"
              style={{
                background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                color:"#fff", border:"none", borderRadius:14,
                padding:"10px 16px", fontSize:12, fontWeight:800,
                boxShadow:"0 4px 12px rgba(99,102,241,0.3)", flexShrink:0
              }}>View</button>
          </div>
        ))}
      </div>
    </>);

    // Provider Profile
    if (screen === "profile") {
      const color = CAT_COLORS[selProv.category];
      return shell(<>
        <div style={{
          background:`linear-gradient(160deg,${color}18,#fff)`,
          padding:"52px 20px 28px", borderBottom:"1px solid #e8edf5"
        }}>
          <button onClick={() => goBack("list")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:"#6366f1", fontWeight:700, fontSize:14, marginBottom:20 }}>
            ← Back
          </button>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>
            <img src={selProv.photo_url} alt={selProv.name}
              onError={e => { e.target.onerror=null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(selProv.name)}&background=eef2ff&color=6366f1&bold=true&size=128`; }}
              style={{ width:110, height:110, borderRadius:32, objectFit:"cover", border:"4px solid #fff", boxShadow:"0 8px 32px rgba(0,0,0,0.12)", marginBottom:16 }}
            />
            <h2 style={{ fontSize:26, fontWeight:800, color:"#1e293b", marginBottom:4 }}>
              {selProv.name} <span style={{ color, fontSize:18 }}>✓</span>
            </h2>
            <p style={{ color:"#64748b", fontSize:14, fontWeight:600 }}>
              Verified {selProv.category} · {selProv.location}
            </p>
          </div>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"24px 20px 110px" }}>
          {/* Stats row */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:24 }}>
            {[
              { label:"Experience", value:`${selProv.experience} Yrs` },
              { label:"Rating",     value:`⭐ ${selProv.rating}` },
              { label:"Base Fee",   value:`₹${selProv.base_price}` },
            ].map(s => (
              <div key={s.label} style={{
                background:"#fff", borderRadius:18, padding:"16px 12px",
                textAlign:"center", border:"1.5px solid #e8edf5",
                boxShadow:"0 2px 8px rgba(0,0,0,0.04)"
              }}>
                <div style={{ fontSize:13, fontWeight:800, color:"#1e293b", marginBottom:4 }}>{s.value}</div>
                <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div style={{ background:"#fff", borderRadius:18, padding:20, border:"1.5px solid #e8edf5", marginBottom:24, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#94a3b8", letterSpacing:0.5, textTransform:"uppercase", marginBottom:12 }}>How it works</p>
            {[
              "Tap 'Call Expert' — Sevamitra connects you via phone",
              "Discuss your problem and negotiate the price",
              "Tap 'Confirm Booking' to lock the deal",
            ].map((s, i) => (
              <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:i<2?12:0 }}>
                <div style={{
                  width:24, height:24, borderRadius:8, background:"#eef2ff",
                  color:"#6366f1", fontSize:11, fontWeight:800,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
                }}>{i+1}</div>
                <p style={{ fontSize:13, color:"#64748b", fontWeight:500, lineHeight:1.5 }}>{s}</p>
              </div>
            ))}
          </div>

          {/* Error message */}
          {callError && (
            <div style={{
              background:"#fff1f2", border:"1.5px solid #fecdd3", borderRadius:14,
              padding:"12px 16px", marginBottom:16, fontSize:13, color:"#ef4444", fontWeight:600
            }}>
              ⚠️ {callError}
            </div>
          )}

          {/* Call / Confirm buttons */}
          {callState === "idle" && (
            <button onClick={handleCall} className="tap" style={{
              width:"100%", background:"#1e293b", color:"#fff",
              border:"none", borderRadius:20, padding:"20px",
              fontSize:17, fontWeight:800,
              boxShadow:"0 8px 24px rgba(0,0,0,0.18)",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10
            }}>
              📞 Call Expert via Sevamitra
            </button>
          )}

          {callState === "calling" && (
            <div style={{
              width:"100%", background:"#6366f1", color:"#fff",
              borderRadius:20, padding:"20px", fontSize:16, fontWeight:700,
              display:"flex", alignItems:"center", justifyContent:"center", gap:12,
              boxShadow:"0 8px 24px rgba(99,102,241,0.35)"
            }}>
              <Spinner /> Connecting your call...
            </div>
          )}

          {callState === "called" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{
                background:"#f0fdf4", border:"1.5px solid #bbf7d0", borderRadius:16,
                padding:"14px 18px", fontSize:13, color:"#16a34a", fontWeight:700,
                display:"flex", alignItems:"center", gap:8
              }}>
                ✅ Call connected! Discuss and then confirm below.
              </div>

              <button onClick={handleBook} disabled={callState==="booking"} className="tap" style={{
                width:"100%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                color:"#fff", border:"none", borderRadius:20, padding:"20px",
                fontSize:17, fontWeight:800,
                boxShadow:"0 8px 24px rgba(99,102,241,0.35)",
                display:"flex", alignItems:"center", justifyContent:"center", gap:10
              }}>
                {callState === "booking" ? <><Spinner /> Confirming...</> : "✅ Confirm Booking"}
              </button>

              <button onClick={handleCall} className="tap" style={{
                background:"none", border:"1.5px solid #e8edf5", color:"#64748b",
                borderRadius:16, padding:"12px", fontSize:13, fontWeight:700
              }}>
                📞 Call Again
              </button>
            </div>
          )}
        </div>
      </>);
    }

    // Success
    if (screen === "success") return shell(
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, paddingBottom:100 }}>
        <div className="bounce-pop" style={{
          width:100, height:100, borderRadius:32,
          background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:48, marginBottom:24, boxShadow:"0 16px 40px rgba(99,102,241,0.4)"
        }}>🎉</div>
        <h2 style={{ fontSize:28, fontWeight:800, color:"#1e293b", marginBottom:8 }}>Booking Confirmed!</h2>
        <p style={{ color:"#64748b", fontSize:15, fontWeight:500, textAlign:"center", marginBottom:36, lineHeight:1.6 }}>
          Your {selProv?.category?.toLowerCase()} will reach you soon.
        </p>
        <button onClick={() => switchTab("history")} className="tap" style={{
          background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff",
          border:"none", borderRadius:18, padding:"16px 36px",
          fontSize:16, fontWeight:800,
          boxShadow:"0 8px 24px rgba(99,102,241,0.35)"
        }}>View My Bookings</button>
        <button onClick={() => switchTab("home")} style={{
          background:"none", border:"none", color:"#94a3b8",
          fontSize:14, fontWeight:600, cursor:"pointer", marginTop:14
        }}>Back to Home</button>
      </div>
    );
  }

  // ── HISTORY ───────────────────────────────────────────────────────────────
  if (tab === "history") return shell(<>
    <div style={{ background:"#fff", padding:"52px 20px 20px", borderBottom:"1px solid #f1f5f9" }}>
      <h2 style={{ fontSize:24, fontWeight:800, color:"#1e293b" }}>My Bookings</h2>
      <p style={{ fontSize:14, color:"#94a3b8", marginTop:4, fontWeight:500 }}>
        {myBookings.length} total booking{myBookings.length!==1?"s":""}
      </p>
    </div>

    <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 100px" }}>
      {myBookings.length === 0 ? (
        <div style={{ textAlign:"center", paddingTop:80, color:"#94a3b8" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
          <div style={{ fontWeight:700, fontSize:16 }}>No bookings yet</div>
          <div style={{ fontSize:13, marginTop:6 }}>Book a service to see it here</div>
        </div>
      ) : myBookings.map((b, i) => (
        <div key={b.id} className="fade-up"
          style={{
            background: b.status==="Cancelled" ? "#f8faff" : "#fff",
            border:"1.5px solid #e8edf5", borderRadius:20, padding:20, marginBottom:12,
            opacity: b.status==="Cancelled" ? 0.6 : 1,
            boxShadow:"0 2px 8px rgba(0,0,0,0.03)", animationDelay:`${i*0.05}s`
          }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <div>
              <p style={{ fontWeight:800, fontSize:16, color:"#1e293b", marginBottom:4 }}>{b.worker_name}</p>
              <span style={{
                background:CAT_BG[b.category]||"#f0f4ff",
                color:CAT_COLORS[b.category]||"#6366f1",
                fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:8
              }}>{CAT_ICONS[b.category]} {b.category}</span>
            </div>
            <Badge status={b.status} />
          </div>
          <p style={{ fontSize:12, color:"#94a3b8", fontWeight:600, marginBottom:b.status!=="Cancelled"?14:0 }}>
            🕐 {new Date(b.time).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
          </p>
          {b.status !== "Cancelled" && (
            <button onClick={() => { setCancelId(b.id); setShowCancel(true); }} style={{
              width:"100%", background:"#fff1f2", border:"1.5px solid #fecdd3",
              color:"#ef4444", borderRadius:12, padding:"10px",
              fontSize:13, fontWeight:700, cursor:"pointer"
            }}>Cancel Booking</button>
          )}
        </div>
      ))}
    </div>

    {/* Cancel Modal */}
    {showCancel && (
      <div className="fade-in" style={{
        position:"fixed", inset:0, background:"rgba(15,23,42,0.7)",
        backdropFilter:"blur(8px)", zIndex:100,
        display:"flex", alignItems:"flex-end", justifyContent:"center"
      }}>
        <div className="slide-up" style={{
          background:"#fff", borderRadius:"28px 28px 0 0",
          padding:"28px 24px 40px", width:"100%", maxWidth:430
        }}>
          <div style={{ width:40, height:4, background:"#e2e8f0", borderRadius:2, margin:"0 auto 24px" }} />
          <h3 style={{ fontSize:20, fontWeight:800, color:"#1e293b", marginBottom:6 }}>Cancel Booking</h3>
          <p style={{ fontSize:14, color:"#94a3b8", fontWeight:500, marginBottom:20 }}>Why are you cancelling?</p>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
            {CANCEL_REASONS.map(r => (
              <button key={r} onClick={() => setCancelReason(r)} style={{
                padding:"14px 18px", borderRadius:14, textAlign:"left",
                fontSize:14, fontWeight:600, cursor:"pointer",
                border:cancelReason===r?"2px solid #6366f1":"1.5px solid #e8edf5",
                background:cancelReason===r?"#eef2ff":"#f8faff",
                color:cancelReason===r?"#6366f1":"#64748b"
              }}>{r}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button onClick={() => { setShowCancel(false); setCancelReason(""); }} style={{
              flex:1, padding:"16px", borderRadius:16, border:"1.5px solid #e8edf5",
              background:"#f8faff", color:"#64748b", fontSize:15, fontWeight:700, cursor:"pointer"
            }}>Go Back</button>
            <button onClick={handleCancel} disabled={!cancelReason} className="tap" style={{
              flex:1, padding:"16px", borderRadius:16, border:"none",
              background:cancelReason?"#ef4444":"#fca5a5",
              color:"#fff", fontSize:15, fontWeight:800,
              boxShadow:cancelReason?"0 4px 16px rgba(239,68,68,0.3)":"none"
            }}>Confirm Cancel</button>
          </div>
        </div>
      </div>
    )}
  </>);

  // ── PROFILE ───────────────────────────────────────────────────────────────
  if (tab === "profile") return shell(<>
    <div style={{
      background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
      padding:"52px 20px 40px", textAlign:"center"
    }}>
      <div style={{
        width:84, height:84, borderRadius:26,
        background:"rgba(255,255,255,0.2)", border:"3px solid rgba(255,255,255,0.4)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:36, fontWeight:800, color:"#fff", margin:"0 auto 16px"
      }}>{user.name[0].toUpperCase()}</div>
      <h2 style={{ fontSize:24, fontWeight:800, color:"#fff", marginBottom:4 }}>{user.name}</h2>
      <p style={{ color:"rgba(255,255,255,0.65)", fontSize:14, fontWeight:600 }}>{user.phone}</p>
    </div>

    <div style={{ flex:1, overflowY:"auto", padding:"24px 20px 100px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
        {[
          { label:"Total Bookings",  value:myBookings.length, color:"#6366f1" },
          { label:"Active Services", value:myBookings.filter(b=>b.status!=="Cancelled").length, color:"#22c55e" },
        ].map(s => (
          <div key={s.label} style={{
            background:"#fff", borderRadius:18, padding:18,
            border:"1.5px solid #e8edf5", boxShadow:"0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:"#94a3b8", fontWeight:600, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"#fff", borderRadius:20, border:"1.5px solid #e8edf5", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
        {[
          { label:"Customer Support",  icon:"🎧" },
          { label:"About Sevamitra",   icon:"ℹ️" },
          { label:"Official Facebook", icon:"🔵" },
        ].map((item, i, arr) => (
          <button key={item.label} style={{
            width:"100%", padding:"18px 20px", background:"none",
            border:"none", borderBottom:i<arr.length-1?"1px solid #f1f5f9":"none",
            display:"flex", justifyContent:"space-between", alignItems:"center",
            cursor:"pointer", color:"#1e293b"
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, fontSize:15, fontWeight:700 }}>
              <span style={{ fontSize:20 }}>{item.icon}</span>{item.label}
            </div>
            <span style={{ color:"#94a3b8", fontSize:16 }}>›</span>
          </button>
        ))}
      </div>

      <button onClick={() => { localStorage.clear(); window.location.reload(); }}
        className="tap"
        style={{
          width:"100%", marginTop:16, padding:"16px", borderRadius:18,
          background:"#fff1f2", border:"1.5px solid #fecdd3",
          color:"#ef4444", fontSize:15, fontWeight:800, cursor:"pointer"
        }}>
        🚪 Log Out
      </button>
    </div>
  </>);

  return null;
}