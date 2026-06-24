import { useListSalons, useListBookings, useGetDashboardStats } from "@workspace/api-client-react";
import { getSalonImage } from "@/lib/images";

const PLATFORM_OWNER = { name: "Paloma HQ", role: "ADMIN", initials: "PA" };

const S = {
  page: {
    minHeight: "100vh",
    background: "#0D0518",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,

  subNav: {
    background: "rgba(10,3,20,0.98)",
    borderBottom: "1px solid rgba(212,175,55,0.12)",
    padding: "0 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
  } as React.CSSProperties,

  card: {
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(212,175,55,0.15)",
    borderRadius: 12,
    padding: "1.5rem",
  } as React.CSSProperties,

  statCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(212,175,55,0.14)",
    borderRadius: 10,
    padding: "1.25rem 1.5rem",
  } as React.CSSProperties,

  label: {
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.58rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "rgba(212,175,55,0.6)",
    marginBottom: "0.4rem",
  } as React.CSSProperties,
};

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div style={S.statCard}>
      <div style={S.label}>{label}</div>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "2rem",
        fontWeight: 700,
        color: accent ?? "#D4AF37",
        lineHeight: 1.1,
        marginBottom: "0.3rem",
      }}>
        {value}
      </div>
      {sub && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", color: "rgba(255,255,255,0.35)" }}>{sub}</div>}
    </div>
  );
}

const SALON_REVENUE: Record<number, number> = { 1: 87400, 2: 64200, 3: 121500, 4: 43800, 5: 95200 };
const SALON_STATUS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "ACTIVE", color: "#4DD9C0", bg: "rgba(77,217,192,0.1)" },
  2: { label: "ACTIVE", color: "#4DD9C0", bg: "rgba(77,217,192,0.1)" },
  3: { label: "ACTIVE", color: "#4DD9C0", bg: "rgba(77,217,192,0.1)" },
  4: { label: "PENDING", color: "#D4AF37", bg: "rgba(212,175,55,0.1)" },
  5: { label: "ACTIVE", color: "#4DD9C0", bg: "rgba(77,217,192,0.1)" },
};

export function Admin() {
  const { data: salons } = useListSalons({});
  const { data: bookings } = useListBookings({ salonId: 1 });
  const { data: stats } = useGetDashboardStats({ salonId: 1 });

  const totalSalons = salons?.length ?? 0;
  const activeSalons = totalSalons - 1;
  const totalRev = Object.values(SALON_REVENUE).reduce((a, b) => a + b, 0);
  const totalBookings = (bookings?.length ?? 0) + 18;

  return (
    <div style={S.page}>

      {/* Sub-nav */}
      <div style={S.subNav}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)",
            borderRadius: 6, padding: "0.25rem 0.75rem",
          }}>
            <span style={{ fontSize: "0.7rem" }}>✦</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", letterSpacing: "0.12em", color: "#D4AF37" }}>Platform Administration</span>
          </div>
        </div>

        {/* Admin profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#fff" }}>{PLATFORM_OWNER.name}</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(212,175,55,0.6)" }}>{PLATFORM_OWNER.role}</div>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #4DD9C0 0%, #1AA89A 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#0D0518",
            border: "2px solid rgba(77,217,192,0.4)",
          }}>
            {PLATFORM_OWNER.initials}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(212,175,55,0.55)", marginBottom: "0.5rem" }}>
            Paloma Platform
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
            Admin Dashboard
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
            Platform-wide metrics, partner status, and booking oversight across all Paloma venues.
          </p>
        </div>

        {/* Platform KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <StatCard label="Total Partners" value={totalSalons} sub="Registered salons" />
          <StatCard label="Active Venues" value={activeSalons} sub="Currently live" accent="#4DD9C0" />
          <StatCard label="Platform Revenue" value={`₹${(totalRev / 100000).toFixed(1)}L`} sub="All-time gross" />
          <StatCard label="Total Bookings" value={totalBookings} sub="Across all venues" accent="#F2B8C6" />
          <StatCard label="Avg. Rating" value={stats?.avgRating?.toFixed(1) ?? "4.8"} sub="Platform-wide" accent="#BF953F" />
          <StatCard label="Pending Approval" value="1" sub="Awaiting onboarding" accent="#E07070" />
        </div>

        {/* Partner Salons Table */}
        <div style={{ ...S.card, marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: "1.5rem" }}>
            Partner Salons
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr>
                  {["Salon", "Neighborhood", "Rating", "Revenue (₹)", "Bookings", "Status", "Action"].map(h => (
                    <th key={h} style={{
                      fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em",
                      textTransform: "uppercase", color: "#D4AF37", textAlign: "left",
                      padding: "0 0.875rem 0.875rem 0", borderBottom: "1px solid rgba(212,175,55,0.15)",
                      whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(salons ?? []).map((salon, i) => {
                  const st = SALON_STATUS[salon.id] ?? SALON_STATUS[1];
                  const rev = SALON_REVENUE[salon.id] ?? 50000;
                  return (
                    <tr key={salon.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "0.875rem 0.875rem 0.875rem 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ width: 36, height: 36, borderRadius: 6, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(212,175,55,0.2)" }}>
                            <img src={getSalonImage(i)} alt={salon.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.88rem", fontWeight: 600, color: "#fff" }}>{salon.name}</div>
                        </div>
                      </td>
                      <td style={{ padding: "0.875rem 0.875rem 0.875rem 0", fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.55)" }}>{salon.neighborhood}</td>
                      <td style={{ padding: "0.875rem 0.875rem 0.875rem 0", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#D4AF37", fontWeight: 600 }}>{salon.rating}</td>
                      <td style={{ padding: "0.875rem 0.875rem 0.875rem 0", fontFamily: "'Playfair Display', serif", fontSize: "0.88rem", color: "#fff", fontWeight: 700 }}>
                        ₹{rev.toLocaleString("en-IN")}
                      </td>
                      <td style={{ padding: "0.875rem 0.875rem 0.875rem 0", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.75)" }}>
                        {Math.floor(rev / 3500)}
                      </td>
                      <td style={{ padding: "0.875rem 0.875rem 0.875rem 0" }}>
                        <span style={{
                          background: st.bg, color: st.color,
                          fontFamily: "'Inter', sans-serif", fontSize: "0.58rem",
                          fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                          padding: "0.2rem 0.6rem", borderRadius: 4,
                          border: `1px solid ${st.color}44`,
                        }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: "0.875rem 0 0.875rem 0" }}>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.58rem", padding: "0.25rem 0.625rem", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", color: "#D4AF37", borderRadius: 5, cursor: "pointer" }}>
                            View
                          </button>
                          {st.label === "PENDING" && (
                            <button style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.58rem", padding: "0.25rem 0.625rem", background: "rgba(77,217,192,0.1)", border: "1px solid rgba(77,217,192,0.3)", color: "#4DD9C0", borderRadius: 5, cursor: "pointer" }}>
                              Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom two-column: Revenue breakdown + Recent bookings */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

          {/* Revenue by Salon */}
          <div style={S.card}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "1.25rem" }}>
              Revenue by Venue
            </h3>
            {(salons ?? []).map((salon, i) => {
              const rev = SALON_REVENUE[salon.id] ?? 50000;
              const maxRev = Math.max(...Object.values(SALON_REVENUE));
              const pct = (rev / maxRev) * 100;
              return (
                <div key={salon.id} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.75)" }}>{salon.name}</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.82rem", color: "#D4AF37", fontWeight: 700 }}>₹{rev.toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #BF953F, #D4AF37)", borderRadius: 2, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Platform Activity */}
          <div style={S.card}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "1.25rem" }}>
              Platform Activity
            </h3>
            {[
              { dot: "#4DD9C0", msg: "Lumière Studio approved new stylist: Kavya Sharma", time: "2 hrs ago" },
              { dot: "#D4AF37", msg: "New partner onboarding request: Elara Beauty Lounge, HSR Layout", time: "5 hrs ago" },
              { dot: "#F2B8C6", msg: "Celeste Beauty Atelier reached 200 reviews", time: "Yesterday" },
              { dot: "#D4AF37", msg: "Platform revenue crossed ₹4,12,000 this month", time: "Yesterday" },
              { dot: "#E07070", msg: "Booking cancellation spike at Aurelia — 3 same-day cancellations", time: "2 days ago" },
              { dot: "#4DD9C0", msg: "New service added: Advanced HydraFacial MD at Celeste", time: "3 days ago" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", padding: "0.75rem 0", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: item.dot, flexShrink: 0, marginTop: 5 }} />
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{item.msg}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.58rem", color: "rgba(255,255,255,0.3)", marginTop: "0.15rem" }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
