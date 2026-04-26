import React, { useState, useEffect, useRef } from "react";

const BASE_URL = "https://seva-mitra.onrender.com";

const EMPTY_FORM = {
  name: "", category: "Electrician", phone: "",
  location: "Mysuru City", experience: 1, rating: "4.5", base_price: 99
};

const CATEGORIES = ["Electrician", "Plumber", "Mechanics", "Maids", "Local Chefs", "Priests"];

const CAT_ICONS = {
  Electrician: "⚡", Plumber: "🔧", Mechanics: "🛠️",
  Maids: "🏠", "Local Chefs": "👨‍🍳", Priests: "🙏"
};

const CAT_COLORS = {
  Electrician: "#f59e0b", Plumber: "#3b82f6", Mechanics: "#6366f1",
  Maids: "#ec4899", "Local Chefs": "#ef4444", Priests: "#8b5cf6"
};

// Inject Google Font
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f1117; font-family: 'DM Sans', sans-serif; color: #e2e8f0; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #1a1d27; }
  ::-webkit-scrollbar-thumb { background: #2d3148; border-radius: 3px; }
  @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes fadeUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
  .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; color: white; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 14px; padding: 13px 20px; border-radius: 12px; cursor: pointer; width: 100%; transition: opacity 0.2s, transform 0.15s; }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .input-field { width: 100%; background: #1a1d27; border: 1.5px solid #2d3148; border-radius: 10px; color: #e2e8f0; font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 11px 14px; outline: none; transition: border-color 0.2s; }
  .input-field:focus { border-color: #6366f1; }
  .input-field::placeholder { color: #4a5068; }
  select.input-field option { background: #1a1d27; }
  .row { display: flex; gap: 12px; }
  .fade-up { animation: fadeUp 0.4s ease forwards; }
`;
document.head.appendChild(style);

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{
      background: "#16192a", border: "1.5px solid #2d3148", borderRadius: 16,
      padding: "20px 24px", display: "flex", alignItems: "center", gap: 16,
      flex: 1, minWidth: 140
    }} className="card-hover">
      <div style={{
        width: 48, height: 48, borderRadius: 12, display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: 22,
        background: color + "22", border: `1.5px solid ${color}44`
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: "#f1f5f9" }}>{value}</div>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 1000,
      background: toast.type === "error" ? "#ef4444" : "#22c55e",
      color: "white", padding: "14px 20px", borderRadius: 12,
      fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center",
      gap: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      animation: "slideIn 0.3s ease"
    }}>
      {toast.type === "error" ? "✕" : "✓"} {toast.msg}
    </div>
  );
}

function WorkerCard({ p, onEdit, onDelete }) {
  const color = CAT_COLORS[p.category] || "#6366f1";
  return (
    <div className="card-hover fade-up" style={{
      background: "#16192a", border: "1.5px solid #2d3148",
      borderRadius: 16, padding: 20, display: "flex",
      alignItems: "center", gap: 16, position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 3, background: color, borderRadius: "3px 0 0 3px"
      }} />
      <img
        src={p.photo_url}
        alt={p.name}
        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=1e2235&color=6366f1&bold=true`; }}
        style={{ width: 52, height: 52, borderRadius: 14, objectFit: "cover", border: `2px solid ${color}44`, flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9", marginBottom: 4 }}>{p.name}</div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>📞 {p.phone} &nbsp;·&nbsp; 📍 {p.location}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{
            background: color + "22", color: color, border: `1px solid ${color}44`,
            borderRadius: 8, fontSize: 11, fontWeight: 700, padding: "3px 10px"
          }}>{CAT_ICONS[p.category]} {p.category}</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>⭐ {p.rating}</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>{p.experience} yr{p.experience !== 1 ? "s" : ""}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", marginLeft: "auto" }}>₹{p.base_price}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
        <button onClick={() => onEdit(p)} style={{
          background: "#f59e0b22", border: "1px solid #f59e0b44", color: "#f59e0b",
          borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
        }}>Edit</button>
        <button onClick={() => onDelete(p.id)} style={{
          background: "#ef444422", border: "1px solid #ef444444", color: "#ef4444",
          borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
        }}>Delete</button>
      </div>
    </div>
  );
}

export default function App() {
  const [providers, setProviders] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const fileRef = useRef();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchWorkers = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${BASE_URL}/providers/`);
      setProviders(await res.json());
    } catch {
      showToast("Failed to connect to server.", "error");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchWorkers(); }, []);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setPhotoFile(null);
    setEditingId(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.location)
      return showToast("Fill Name, Phone and Location.", "error");
    if (!editingId && !photoFile)
      return showToast("Please upload a photo.", "error");

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (photoFile) fd.append("file", photoFile);

      const res = await fetch(
        editingId ? `${BASE_URL}/providers/${editingId}` : `${BASE_URL}/providers/`,
        { method: editingId ? "PUT" : "POST", body: fd }
      );
      if (res.ok) {
        showToast(editingId ? "Worker updated!" : "Worker added!");
        resetForm();
        fetchWorkers();
      } else {
        showToast("Server error. Try again.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setFormData({ name: p.name, category: p.category, phone: p.phone, location: p.location, experience: p.experience, rating: p.rating, base_price: p.base_price });
    setPhotoFile(null);
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this worker permanently?")) return;
    try {
      const res = await fetch(`${BASE_URL}/providers/${id}`, { method: "DELETE" });
      if (res.ok) { showToast("Worker deleted."); fetchWorkers(); }
      else showToast("Delete failed.", "error");
    } catch { showToast("Network error.", "error"); }
  };

  const filtered = providers.filter(p => {
    const matchCat = filterCat === "All" || p.category === filterCat;
    const q = search.toLowerCase();
    return matchCat && (p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.phone.includes(q));
  });

  const catCounts = CATEGORIES.reduce((acc, c) => {
    acc[c] = providers.filter(p => p.category === c).length;
    return acc;
  }, {});

  const set = (k) => (e) => setFormData({ ...formData, [k]: e.target.value });

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117" }}>
      <Toast toast={toast} />

      <div style={{ display: "flex", minHeight: "100vh" }}>

        {/* Sidebar */}
        <aside style={{
          width: 240, background: "#12141f", borderRight: "1.5px solid #1e2235",
          padding: "28px 0", position: "sticky", top: 0, height: "100vh",
          display: "flex", flexDirection: "column", flexShrink: 0
        }}>
          <div style={{ padding: "0 24px 28px", borderBottom: "1px solid #1e2235" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#f1f5f9", letterSpacing: 1 }}>
              SEVA<span style={{ color: "#6366f1" }}>MITRA</span>
            </div>
            <div style={{ fontSize: 11, color: "#4a5068", marginTop: 4, fontWeight: 500 }}>Admin Dashboard</div>
          </div>

          <div style={{ padding: "20px 16px 0", flex: 1 }}>
            <div style={{ fontSize: 10, color: "#4a5068", fontWeight: 700, letterSpacing: 1.5, marginBottom: 10, paddingLeft: 8 }}>CATEGORIES</div>
            {["All", ...CATEGORIES].map(c => (
              <button key={c} onClick={() => setFilterCat(c)} style={{
                width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 10,
                border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: filterCat === c ? 700 : 400,
                background: filterCat === c ? "#6366f122" : "transparent",
                color: filterCat === c ? "#818cf8" : "#64748b",
                marginBottom: 2, display: "flex", alignItems: "center", justifyContent: "space-between"
              }}>
                <span>{c === "All" ? "🗂 All Workers" : `${CAT_ICONS[c]} ${c}`}</span>
                <span style={{
                  fontSize: 11, background: filterCat === c ? "#6366f133" : "#1e2235",
                  color: filterCat === c ? "#818cf8" : "#4a5068",
                  borderRadius: 6, padding: "1px 7px", fontWeight: 700
                }}>
                  {c === "All" ? providers.length : catCounts[c]}
                </span>
              </button>
            ))}
          </div>

          <div style={{ padding: "16px 24px", borderTop: "1px solid #1e2235", fontSize: 11, color: "#4a5068" }}>
            Sevamitra © 2025 · VVCE
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#f1f5f9" }}>
              Worker Management
            </h1>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 6 }}>
              Manage local service providers across Mysuru
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
            <StatCard label="Total Workers" value={providers.length} icon="👷" color="#6366f1" />
            <StatCard label="Electricians" value={catCounts["Electrician"]} icon="⚡" color="#f59e0b" />
            <StatCard label="Plumbers" value={catCounts["Plumber"]} icon="🔧" color="#3b82f6" />
            <StatCard label="Mechanics" value={catCounts["Mechanics"]} icon="🛠️" color="#8b5cf6" />
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 24, alignItems: "start" }}>

            {/* Form Panel */}
            <div style={{
              background: "#16192a", border: "1.5px solid #2d3148",
              borderRadius: 20, padding: 28, position: "sticky", top: 24
            }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>
                  {editingId ? "✏️ Edit Worker" : "➕ Add New Worker"}
                </div>
                <div style={{ fontSize: 12, color: "#4a5068", marginTop: 4 }}>
                  {editingId ? "Update the worker's information below." : "Fill in details to add a new provider."}
                </div>
              </div>

              <form onSubmit={handleSave}>
                {[
                  { label: "Full Name", key: "name", placeholder: "e.g. Raju Kumar", type: "text" },
                  { label: "Phone", key: "phone", placeholder: "10-digit number", type: "text" },
                  { label: "Area / Location", key: "location", placeholder: "e.g. Kuvempunagar", type: "text" },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{label}</label>
                    <input className="input-field" type={type} placeholder={placeholder} value={formData[key]} onChange={set(key)} />
                  </div>
                ))}

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Category</label>
                  <select className="input-field" value={formData.category} onChange={set("category")}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Photo</label>
                  <label style={{
                    display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                    background: "#1a1d27", border: "1.5px dashed #2d3148", borderRadius: 10, padding: "11px 14px"
                  }}>
                    <span style={{ fontSize: 18 }}>📷</span>
                    <span style={{ fontSize: 13, color: photoFile ? "#818cf8" : "#4a5068", fontWeight: photoFile ? 600 : 400 }}>
                      {photoFile ? photoFile.name : editingId ? "Change photo (optional)" : "Choose a photo"}
                    </span>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => setPhotoFile(e.target.files[0])} />
                  </label>
                </div>

                <div className="row" style={{ marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Exp (Yrs)</label>
                    <input className="input-field" type="number" min="0" value={formData.experience} onChange={e => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Rating</label>
                    <input className="input-field" placeholder="4.5" value={formData.rating} onChange={set("rating")} />
                  </div>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <label style={{ fontSize: 11, color: "#64748b", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Base Fee (₹)</label>
                  <input className="input-field" type="number" min="0" value={formData.base_price} onChange={e => setFormData({ ...formData, base_price: parseInt(e.target.value) || 0 })} />
                </div>

                <button className="btn-primary" type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingId ? "Update Worker" : "Add to Database"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} style={{
                    width: "100%", marginTop: 10, background: "transparent", border: "none",
                    color: "#4a5068", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", padding: 8
                  }}>Cancel</button>
                )}
              </form>
            </div>

            {/* Workers List */}
            <div>
              <div style={{ marginBottom: 20 }}>
                <input
                  className="input-field"
                  placeholder="🔍  Search by name, area or phone..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {fetching ? (
                <div style={{ textAlign: "center", padding: 80, color: "#4a5068" }}>
                  <div style={{ fontSize: 32, animation: "pulse 1.5s infinite", marginBottom: 12 }}>⚙️</div>
                  Loading workers...
                </div>
              ) : filtered.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: 80, color: "#4a5068",
                  background: "#16192a", borderRadius: 20, border: "1.5px dashed #2d3148"
                }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                  <div style={{ fontWeight: 600 }}>No workers found</div>
                  <div style={{ fontSize: 13, marginTop: 6 }}>Try a different search or category</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: 12, color: "#4a5068", fontWeight: 600, marginBottom: 4 }}>
                    Showing {filtered.length} of {providers.length} workers
                  </div>
                  {filtered.map(p => (
                    <WorkerCard key={p.id} p={p} onEdit={handleEdit} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
