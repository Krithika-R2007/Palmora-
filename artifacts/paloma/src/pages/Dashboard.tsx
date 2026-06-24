import { useState } from "react";
import { Link } from "wouter";
import {
  useGetDashboardStats,
  useListBookings,
  useUpdateBooking,
  useListSalons,
} from "@workspace/api-client-react";

const DEMO_SALON_ID = 1;

const OWNER = { name: "Rajesh Malhotra", role: "OWNER", initials: "RM" };

interface MenuItem {
  id: number;
  title: string;
  description: string;
  priceMin: number;
  priceMax: number;
  duration: number;
}

const INITIAL_MENU: MenuItem[] = [
  { id: 1, title: "Bespoke Balayage & Styling", description: "Hand-painted highlights with root melt, personalised gloss, and blow dry. (150 mins)", priceMin: 6500, priceMax: 9500, duration: 150 },
  { id: 2, title: "Kerastase Chronologiste Caviar Ritual", description: "Scalp-to-tip regenerating treatment for fragile, over-processed hair. (60 mins)", priceMin: 5000, priceMax: 5000, duration: 60 },
  { id: 3, title: "Advanced HydraFacial MD", description: "Vortex cleanse, peel, extract and hydrate with targeted booster serums. (75 mins)", priceMin: 5525, priceMax: 5525, duration: 75 },
];

const S = {
  page: {
    minHeight: "100vh",
    background: "#120820",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,

  subNav: {
    background: "rgba(18,5,32,0.97)",
    borderBottom: "1px solid rgba(212,175,55,0.15)",
    padding: "0 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
  } as React.CSSProperties,

  content: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "2rem 2rem",
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: "2rem",
    alignItems: "start",
  } as React.CSSProperties,

  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(212,175,55,0.18)",
    borderRadius: 12,
    padding: "1.5rem",
  } as React.CSSProperties,

  label: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.6rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "rgba(212,175,55,0.7)",
    marginBottom: "0.35rem",
  } as React.CSSProperties,

  input: {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(212,175,55,0.2)",
    borderRadius: 8,
    padding: "0.65rem 0.875rem",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.78rem",
    outline: "none",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    completed: { color: "#D4AF37", bg: "rgba(212,175,55,0.1)" },
    confirmed: { color: "#4DD9C0", bg: "rgba(77,217,192,0.1)" },
    pending:   { color: "#F2B8C6", bg: "rgba(242,184,198,0.1)" },
    cancelled: { color: "#E07070", bg: "rgba(224,112,112,0.1)" },
  };
  const { color, bg } = map[status] ?? { color: "#aaa", bg: "rgba(255,255,255,0.06)" };
  return (
    <span style={{
      background: bg,
      color,
      fontFamily: "'Inter', sans-serif",
      fontSize: "0.62rem",
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      padding: "0.25rem 0.7rem",
      borderRadius: 4,
      border: `1px solid ${color}44`,
    }}>
      {status.toUpperCase()}
    </span>
  );
}

export function Dashboard() {
  const { data: stats } = useGetDashboardStats({ salonId: DEMO_SALON_ID });
  const { data: bookings } = useListBookings({ salonId: DEMO_SALON_ID });
  const { data: salons } = useListSalons({});
  const updateBooking = useUpdateBooking();

  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriceMin, setNewPriceMin] = useState("");
  const [newPriceMax, setNewPriceMax] = useState("");
  const [subPage, setSubPage] = useState<"dashboard" | "preview">("dashboard");

  const salonName = salons?.[0]?.name ?? "Aura Luxury Salon & Spa";

  const handleAddItem = () => {
    if (!newTitle.trim()) return;
    const id = Date.now();
    setMenu(prev => [...prev, {
      id,
      title: newTitle,
      description: newDesc,
      priceMin: parseInt(newPriceMin) || 0,
      priceMax: parseInt(newPriceMax) || parseInt(newPriceMin) || 0,
      duration: 60,
    }]);
    setNewTitle(""); setNewDesc(""); setNewPriceMin(""); setNewPriceMax("");
  };

  const handleDelete = (id: number) => setMenu(prev => prev.filter(m => m.id !== id));

  const gross = stats?.revenue ?? 5000;

  return (
    <div style={S.page}>

      {/* Sub-navigation bar */}
      <div style={S.subNav}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["dashboard", "preview"] as const).map(p => (
            <button
              key={p}
              onClick={() => setSubPage(p)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 500,
                padding: "0.4rem 1.1rem",
                border: "none",
                cursor: "pointer",
                borderRadius: 6,
                background: subPage === p ? "rgba(212,175,55,0.18)" : "transparent",
                color: subPage === p ? "#D4AF37" : "rgba(255,255,255,0.55)",
                transition: "all 0.2s",
              }}
            >
              {p === "dashboard" ? "Salon Dashboard" : "Preview Site"}
            </button>
          ))}
        </div>

        {/* Owner profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#fff" }}>{OWNER.name}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(212,175,55,0.7)" }}>{OWNER.role}</div>
          </div>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "linear-gradient(135deg, #BF953F 0%, #B38728 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: "#120820",
            border: "2px solid rgba(212,175,55,0.4)",
          }}>
            {OWNER.initials}
          </div>
        </div>
      </div>

      {subPage === "preview" ? (
        <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.2rem", color: "rgba(242,184,198,0.7)" }}>
            Switch to Customer view from the top bar to preview the site.
          </p>
        </div>
      ) : (
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem" }}>

          {/* Page header */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(212,175,55,0.13)", border: "1px solid rgba(212,175,55,0.3)",
              borderRadius: 20, padding: "0.3rem 0.875rem", marginBottom: "1rem",
            }}>
              <span style={{ fontSize: "0.8rem" }}>♛</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", letterSpacing: "0.1em", color: "#D4AF37" }}>Salon Partner portal</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
              Atelier Hub: {salonName}
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              Manage services, review incoming slots, adjust service availability, and analyse revenue metrics.
            </p>
          </div>

          {/* Two-column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "2rem", alignItems: "start" }}>

            {/* ── LEFT SIDEBAR ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Gross Revenue */}
              <div style={{ ...S.card }}>
                <div style={S.label}>Gross Revenue</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700, color: "#D4AF37", lineHeight: 1.1, marginBottom: "0.5rem" }}>
                  ₹{gross.toLocaleString("en-IN")}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4DD9C0" }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", color: "#4DD9C0" }}>Live tracking active (IST)</span>
                </div>
              </div>

              {/* Add Salon Menu Item form */}
              <div style={{ ...S.card }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "1.25rem" }}>
                  Add Salon Menu Item
                </div>

                <div style={{ marginBottom: "0.875rem" }}>
                  <div style={S.label}>Service Title</div>
                  <input
                    style={S.input}
                    placeholder="e.g. Silk Hydration Blowout"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: "0.875rem" }}>
                  <div style={S.label}>Description</div>
                  <textarea
                    style={{ ...S.input, resize: "vertical", minHeight: 72 }}
                    placeholder="Describe the treatment..."
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem", marginBottom: "1rem" }}>
                  <div>
                    <div style={S.label}>Min Price (₹)</div>
                    <input style={S.input} placeholder="5000" type="number" value={newPriceMin} onChange={e => setNewPriceMin(e.target.value)} />
                  </div>
                  <div>
                    <div style={S.label}>Max Price (₹)</div>
                    <input style={S.input} placeholder="9500" type="number" value={newPriceMax} onChange={e => setNewPriceMax(e.target.value)} />
                  </div>
                </div>

                <button
                  onClick={handleAddItem}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #AA771C 100%)",
                    color: "#120820",
                    border: "none",
                    borderRadius: 8,
                    padding: "0.7rem",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  + Add Item
                </button>
              </div>
            </div>

            {/* ── RIGHT MAIN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

              {/* Schedule & Slots Checklist */}
              <div style={{ ...S.card, padding: "1.75rem" }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: "1.5rem" }}>
                  Schedule &amp; Slots Checklist
                </h2>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                    <thead>
                      <tr>
                        {["Date & Time", "Client", "Requested Treatment", "Total", "Status", "Action"].map(h => (
                          <th key={h} style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.62rem",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#D4AF37",
                            textAlign: "left",
                            padding: "0 0.875rem 0.875rem 0",
                            borderBottom: "1px solid rgba(212,175,55,0.2)",
                            whiteSpace: "nowrap",
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(bookings ?? []).length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ padding: "2rem 0", textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
                            No bookings yet
                          </td>
                        </tr>
                      ) : (bookings ?? []).map(b => (
                        <tr key={b.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          <td style={{ padding: "1rem 0.875rem 1rem 0", fontFamily: "'Inter', sans-serif", fontSize: "0.73rem", color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap" }}>
                            {b.date} at {b.time?.slice(0, 5)}
                          </td>
                          <td style={{ padding: "1rem 0.875rem 1rem 0", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#fff", whiteSpace: "nowrap" }}>
                            {b.customerName}
                          </td>
                          <td style={{ padding: "1rem 0.875rem 1rem 0", fontFamily: "'Inter', sans-serif", fontSize: "0.73rem", color: "rgba(255,255,255,0.8)" }}>
                            {b.service}
                          </td>
                          <td style={{ padding: "1rem 0.875rem 1rem 0", fontFamily: "'Playfair Display', serif", fontSize: "0.92rem", fontWeight: 700, color: "#D4AF37", whiteSpace: "nowrap" }}>
                            {(() => {
                              if (b.price) return `₹${b.price.toLocaleString("en-IN")}`;
                              const map: Record<string, number> = {
                                "Balayage": 8500, "Bridal Makeup": 12000, "Hair Spa": 4500,
                                "Keratin Treatment": 7500, "Haircut": 2500, "Facial": 5500,
                                "Nail Art": 1800, "Hair Color": 6000,
                              };
                              return `₹${(map[b.service ?? ""] ?? 5000).toLocaleString("en-IN")}`;
                            })()}
                          </td>
                          <td style={{ padding: "1rem 0.875rem 1rem 0" }}>
                            <StatusBadge status={b.status} />
                          </td>
                          <td style={{ padding: "1rem 0 1rem 0" }}>
                            {b.status === "confirmed" && (
                              <button
                                onClick={() => updateBooking.mutate({ id: b.id, data: { status: "completed" } })}
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  fontSize: "0.6rem",
                                  fontWeight: 600,
                                  letterSpacing: "0.06em",
                                  padding: "0.3rem 0.75rem",
                                  background: "rgba(212,175,55,0.15)",
                                  border: "1px solid rgba(212,175,55,0.4)",
                                  color: "#D4AF37",
                                  borderRadius: 6,
                                  cursor: "pointer",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Mark Done
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Salon Menu Items */}
              <div style={{ ...S.card, padding: "1.75rem" }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: "1.5rem" }}>
                  Salon Menu Items
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {menu.map(item => (
                    <div key={item.id} style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(212,175,55,0.12)",
                      borderRadius: 10,
                      padding: "1rem 1.25rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: "0.3rem" }}>
                          {item.title}
                        </div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.55, marginBottom: "0.5rem" }}>
                          {item.description}
                        </div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600 }}>
                          <span style={{ color: "rgba(255,255,255,0.4)", textDecoration: "line-through", marginRight: "0.4rem" }}>
                            ₹{item.priceMin.toLocaleString("en-IN")}
                          </span>
                          <span style={{ color: "#D4AF37" }}>
                            ₹{item.priceMax.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                        {editingId === item.id ? (
                          <button
                            onClick={() => setEditingId(null)}
                            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", padding: "0.3rem 0.75rem", background: "rgba(77,217,192,0.15)", border: "1px solid rgba(77,217,192,0.4)", color: "#4DD9C0", borderRadius: 6, cursor: "pointer" }}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingId(item.id)}
                            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", padding: "0.3rem 0.75rem", background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)", color: "#D4AF37", borderRadius: 6, cursor: "pointer" }}
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", padding: "0.3rem 0.75rem", background: "rgba(224,112,112,0.12)", border: "1px solid rgba(224,112,112,0.3)", color: "#E07070", borderRadius: 6, cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  {menu.length === 0 && (
                    <div style={{ textAlign: "center", padding: "2rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
                      No menu items yet — add one from the sidebar
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
