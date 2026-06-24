import { useState } from "react";
import { Link, useSearch } from "wouter";
import { useListSalons } from "@workspace/api-client-react";
import { GoldDivider } from "@/components/layout/GoldDivider";
import { renderStars } from "@/lib/utils";
import { getSalonImage } from "@/lib/images";
import { useCompare } from "@/context/CompareContext";

const NEIGHBORHOODS = ["All", "Indiranagar", "Koramangala", "Whitefield", "JP Nagar", "HSR Layout"];
const SERVICES = ["All", "Balayage", "Bridal Makeup", "Haircut", "Facial", "Keratin Treatment", "Hair Spa", "Nail Art"];
const PRICE_RANGES = ["All", "₹₹₹", "₹₹₹₹"];

export function Discover() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const initialNeighborhood = params.get("neighborhood") ?? "All";
  const initialService = params.get("service") ?? "All";

  const [neighborhood, setNeighborhood] = useState(initialNeighborhood);
  const [service, setService] = useState(initialService);
  const [priceRange, setPriceRange] = useState("All");
  const [searchText, setSearchText] = useState("");

  const { data: salons, isLoading } = useListSalons({
    neighborhood: neighborhood !== "All" ? neighborhood : undefined,
    service: service !== "All" ? service : undefined,
  });

  const { addToCompare, removeFromCompare, isInCompare, compareIds } = useCompare();

  const filtered = (salons ?? []).filter(s => {
    const matchPrice = priceRange === "All" || s.priceRange === priceRange;
    const matchSearch = !searchText || s.name.toLowerCase().includes(searchText.toLowerCase()) || s.neighborhood.toLowerCase().includes(searchText.toLowerCase());
    return matchPrice && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--paloma-bg)" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2D1B1F 0%, #4A2430 50%, #C4899A 100%)", padding: "4rem 2rem 3rem", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 16, border: "0.5px solid rgba(201,168,76,0.25)", pointerEvents: "none" }} />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--paloma-gold-light)", marginBottom: "1rem" }}>Salon Discovery</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#fff", fontWeight: 700, marginBottom: "0.75rem" }}>
          Discover Paloma Salons
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.15rem", color: "rgba(242,184,198,0.8)" }}>
          Curated luxury salons across Bangalore's finest neighborhoods
        </p>
      </div>

      {/* Filters */}
      <div style={{ background: "rgba(255,248,245,0.95)", borderBottom: "1px solid rgba(201,168,76,0.25)", padding: "1.5rem 2rem", position: "sticky", top: 100, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search salons..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", padding: "0.5rem 1rem", border: "1px solid rgba(201,168,76,0.4)", background: "rgba(245,232,236,0.5)", color: "var(--paloma-charcoal)", outline: "none", minWidth: 180 }}
          />
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {NEIGHBORHOODS.map(n => (
              <button key={n} onClick={() => setNeighborhood(n)} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.08em", padding: "0.35rem 0.875rem", border: neighborhood === n ? "1px solid var(--paloma-gold)" : "1px solid rgba(201,168,76,0.3)", background: neighborhood === n ? "var(--paloma-gold)" : "transparent", color: neighborhood === n ? "var(--paloma-charcoal)" : "var(--paloma-muted)", cursor: "pointer", transition: "all 0.2s ease" }}>
                {n}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {PRICE_RANGES.map(p => (
              <button key={p} onClick={() => setPriceRange(p)} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", padding: "0.35rem 0.875rem", border: priceRange === p ? "1px solid var(--paloma-gold)" : "1px solid rgba(201,168,76,0.3)", background: priceRange === p ? "rgba(201,168,76,0.12)" : "transparent", color: priceRange === p ? "var(--paloma-charcoal)" : "var(--paloma-muted)", cursor: "pointer", transition: "all 0.2s ease" }}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1280, margin: "1rem auto 0", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {SERVICES.map(s => (
            <button key={s} onClick={() => setService(s)} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.25rem 0.75rem", border: service === s ? "1px solid var(--paloma-gold)" : "1px solid rgba(196,137,154,0.3)", background: service === s ? "rgba(196,137,154,0.15)" : "transparent", color: service === s ? "var(--paloma-charcoal)" : "var(--paloma-muted)", cursor: "pointer", transition: "all 0.2s ease" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Salon Grid */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 2rem" }}>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "4rem", fontFamily: "'Cormorant Garamond', serif", color: "var(--paloma-muted)", fontSize: "1.15rem" }}>Curating your selections...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "var(--paloma-mauve)", marginBottom: "1rem" }}>No Salons Found</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--paloma-muted)", fontSize: "1.05rem" }}>Try adjusting your filters or exploring a different neighborhood.</p>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--paloma-muted)", marginBottom: "2rem" }}>
              {filtered.length} salon{filtered.length !== 1 ? "s" : ""} found
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
              {filtered.map((salon, i) => {
                const inCompare = isInCompare(salon.id);
                const canAdd = !inCompare && compareIds.length < 3;
                return (
                <div key={salon.id} style={{ position: "relative" }}>
                  <Link href={`/salon/${salon.id}`} style={{ textDecoration: "none" }}>
                  <div className="frosted-card hover-lift" style={{ borderRadius: 2, overflow: "hidden", cursor: "pointer" }}>
                    {/* Real photo */}
                    <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                      <img
                        src={getSalonImage(i)}
                        alt={salon.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                        onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(44,27,31,0.85) 0%, transparent 50%)" }} />
                      {salon.featured && (
                        <div style={{ position: "absolute", top: 12, right: 12, background: "var(--paloma-gold)", color: "var(--paloma-charcoal)", fontFamily: "'Inter', sans-serif", fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "0.25rem 0.625rem" }}>
                          Featured
                        </div>
                      )}
                      <div style={{ position: "absolute", bottom: "1rem", left: "1.25rem" }}>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--paloma-gold-light)", marginBottom: "0.2rem" }}>{salon.neighborhood}</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#fff", fontWeight: 700 }}>{salon.name}</div>
                      </div>
                    </div>
                    <div style={{ padding: "1.5rem" }}>
                      {salon.description && (
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", color: "var(--paloma-muted)", lineHeight: 1.6, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {salon.description}
                        </p>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                        <div>
                          <span className="stars" style={{ fontSize: "0.8rem" }}>{renderStars(salon.rating)}</span>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "var(--paloma-muted)", marginLeft: "0.4rem" }}>{salon.rating} · {salon.reviewCount} reviews</span>
                        </div>
                        <span style={{ color: "var(--paloma-gold)", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}>{salon.priceRange}</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1.25rem" }}>
                        {salon.services.slice(0, 4).map(svc => (
                          <span key={svc} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", background: "rgba(201,168,76,0.10)", border: "0.5px solid rgba(201,168,76,0.3)", color: "var(--paloma-charcoal)", padding: "0.18rem 0.55rem" }}>
                            {svc}
                          </span>
                        ))}
                      </div>
                      {salon.openingHours && (
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "var(--paloma-muted)", borderTop: "0.5px solid rgba(201,168,76,0.2)", paddingTop: "0.75rem" }}>
                          {salon.openingHours}
                        </div>
                      )}
                    </div>
                  </div>
                  </Link>

                  {/* Compare button — sits outside the Link to avoid navigation */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      inCompare ? removeFromCompare(salon.id) : addToCompare(salon.id);
                    }}
                    disabled={!inCompare && !canAdd}
                    title={inCompare ? "Remove from compare" : canAdd ? "Add to compare" : "Max 3 salons"}
                    style={{
                      position: "absolute",
                      bottom: "1.25rem",
                      right: "1.25rem",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.58rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "0.3rem 0.875rem",
                      border: inCompare
                        ? "1px solid var(--paloma-gold)"
                        : "1px solid rgba(201,168,76,0.4)",
                      background: inCompare
                        ? "var(--paloma-gold)"
                        : "rgba(255,248,245,0.9)",
                      color: inCompare ? "var(--paloma-charcoal)" : "var(--paloma-muted)",
                      cursor: (!inCompare && !canAdd) ? "not-allowed" : "pointer",
                      opacity: (!inCompare && !canAdd) ? 0.4 : 1,
                      transition: "all 0.2s ease",
                      zIndex: 10,
                    }}
                  >
                    {inCompare ? "◆ Added" : "+ Compare"}
                  </button>
                </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
