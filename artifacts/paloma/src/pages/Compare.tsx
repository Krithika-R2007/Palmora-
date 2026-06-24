import { Link } from "wouter";
import { useGetSalon, useListStylists } from "@workspace/api-client-react";
import { useCompare } from "@/context/CompareContext";
import { renderStars } from "@/lib/utils";
import { getSalonImage, getStylistImage } from "@/lib/images";

function SalonColumn({ id, index }: { id: number; index: number }) {
  const { data: salon, isLoading } = useGetSalon(id, { query: { enabled: !!id } });
  const { data: stylists } = useListStylists({ salonId: id }, { query: { enabled: !!id } });
  const { removeFromCompare } = useCompare();

  if (isLoading) {
    return (
      <div style={{ flex: 1, minWidth: 240 }}>
        <div style={{ height: 200, background: "linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(196,137,154,0.1) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--paloma-muted)", fontStyle: "italic" }}>Loading...</span>
        </div>
      </div>
    );
  }

  if (!salon) return null;

  return (
    <div style={{ flex: 1, minWidth: 240 }}>
      {/* Photo */}
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <img
          src={getSalonImage(index)}
          alt={salon.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(44,27,31,0.85) 0%, transparent 55%)" }} />
        <button
          onClick={() => removeFromCompare(id)}
          title="Remove from compare"
          style={{
            position: "absolute", top: 10, right: 10,
            background: "rgba(44,27,31,0.8)", border: "1px solid rgba(201,168,76,0.4)",
            color: "rgba(242,184,198,0.8)", width: 28, height: 28, borderRadius: 2,
            cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ✕
        </button>
        <div style={{ position: "absolute", bottom: "1rem", left: "1rem", right: "1rem" }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--paloma-gold-light)", marginBottom: 3 }}>{salon.neighborhood}</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#fff", fontWeight: 700, lineHeight: 1.2 }}>{salon.name}</div>
        </div>
      </div>

      {/* Rating */}
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(201,168,76,0.15)", background: "rgba(255,248,245,0.8)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="stars" style={{ fontSize: "0.85rem" }}>{renderStars(salon.rating)}</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "var(--paloma-charcoal)" }}>{salon.rating}</span>
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "var(--paloma-muted)", marginTop: 2 }}>{salon.reviewCount} reviews</div>
      </div>

      {/* Price */}
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(201,168,76,0.15)", background: "#fff" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "var(--paloma-charcoal)", fontWeight: 700 }}>{salon.priceRange}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: "var(--paloma-muted)", letterSpacing: "0.08em", marginTop: 2 }}>Price range</div>
      </div>

      {/* Hours */}
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(201,168,76,0.15)", background: "rgba(255,248,245,0.8)" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "var(--paloma-charcoal)" }}>{salon.openingHours ?? "—"}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: "var(--paloma-muted)", letterSpacing: "0.08em", marginTop: 2 }}>Opening hours</div>
      </div>

      {/* Services */}
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(201,168,76,0.15)", background: "#fff" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
          {salon.services.slice(0, 6).map(svc => (
            <span key={svc} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.58rem", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0.2rem 0.5rem", background: "rgba(201,168,76,0.10)", border: "0.5px solid rgba(201,168,76,0.3)", color: "var(--paloma-charcoal)" }}>
              {svc}
            </span>
          ))}
        </div>
      </div>

      {/* Stylists */}
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(201,168,76,0.15)", background: "rgba(255,248,245,0.8)" }}>
        {stylists && stylists.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {stylists.slice(0, 3).map((s, idx) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "1px solid var(--paloma-gold)", flexShrink: 0 }}>
                  <img src={getStylistImage(idx)} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500, color: "var(--paloma-charcoal)" }}>{s.name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.58rem", color: "var(--paloma-muted)" }}>{s.specialty}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "var(--paloma-muted)", fontStyle: "italic" }}>No stylists listed</span>
        )}
      </div>

      {/* Description */}
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(201,168,76,0.15)", background: "#fff" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "var(--paloma-muted)", lineHeight: 1.65, fontStyle: "italic", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {salon.description ?? "—"}
        </p>
      </div>

      {/* CTA */}
      <div style={{ padding: "1.25rem", background: "rgba(255,248,245,0.8)", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <Link href={`/book?salonId=${salon.id}`}>
          <button className="btn-gold" style={{ width: "100%", padding: "0.75rem", fontSize: "0.68rem" }}>
            Book at {salon.name.split(" ")[0]}
          </button>
        </Link>
        <Link href={`/salon/${salon.id}`}>
          <button className="btn-outline-gold" style={{ width: "100%", padding: "0.6rem", fontSize: "0.65rem" }}>
            View Full Profile
          </button>
        </Link>
      </div>
    </div>
  );
}

const ROW_LABELS = ["Rating", "Price Range", "Opening Hours", "Services", "Stylists", "About", "Book"];

export function Compare() {
  const { compareIds, clearCompare } = useCompare();

  return (
    <div style={{ minHeight: "100vh", background: "var(--paloma-bg)" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2D1B1F 0%, #4A2430 50%, #C4899A 100%)", padding: "4rem 2rem 3rem", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 16, border: "0.5px solid rgba(201,168,76,0.25)", pointerEvents: "none" }} />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--paloma-gold-light)", marginBottom: "1rem" }}>Side-by-Side</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.25rem, 5vw, 4rem)", color: "#fff", fontWeight: 700, marginBottom: "0.75rem" }}>
          Compare Salons
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.1rem", color: "rgba(242,184,198,0.8)" }}>
          Select up to three salons to see how they measure up
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 2rem" }}>
        {compareIds.length === 0 ? (
          /* Empty state */
          <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
            <div style={{ width: 64, height: 1, background: "var(--paloma-gold)", margin: "0 auto 2rem" }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "var(--paloma-charcoal)", marginBottom: "1rem", fontWeight: 700 }}>No Salons Selected</h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--paloma-muted)", fontStyle: "italic", marginBottom: "2rem" }}>
              Browse Discover and use the "Add to Compare" button on each salon card to begin your comparison.
            </p>
            <Link href="/discover">
              <button className="btn-gold" style={{ padding: "0.875rem 2.5rem" }}>Browse Salons</button>
            </Link>
          </div>
        ) : (
          <>
            {/* Actions row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--paloma-muted)" }}>
                Comparing {compareIds.length} of 3 salons
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                {compareIds.length < 3 && (
                  <Link href="/discover">
                    <button className="btn-outline-gold" style={{ padding: "0.4rem 1.25rem", fontSize: "0.65rem" }}>
                      + Add More
                    </button>
                  </Link>
                )}
                <button
                  onClick={clearCompare}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "transparent", border: "none", color: "var(--paloma-muted)", cursor: "pointer", padding: "0.4rem 0.75rem" }}
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Comparison grid */}
            <div style={{ display: "flex", overflowX: "auto", gap: 0, border: "1px solid rgba(201,168,76,0.25)", boxShadow: "0 4px 30px rgba(44,27,31,0.08)" }}>
              {/* Row labels column */}
              <div style={{ minWidth: 120, flexShrink: 0 }}>
                {/* Photo spacer */}
                <div style={{ height: 200, background: "var(--paloma-charcoal)", display: "flex", alignItems: "flex-end", padding: "1rem" }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)" }}>Paloma Compare</span>
                </div>
                {ROW_LABELS.map((label, i) => (
                  <div
                    key={label}
                    style={{
                      padding: "1rem 1.25rem",
                      borderBottom: "1px solid rgba(201,168,76,0.15)",
                      background: i % 2 === 0 ? "rgba(255,248,245,0.8)" : "#fff",
                      display: "flex",
                      alignItems: "center",
                      minHeight: label === "Services" ? 90 : label === "Stylists" ? 120 : label === "About" ? 110 : label === "Book" ? 112 : 58,
                    }}
                  >
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--paloma-gold)", fontWeight: 600 }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ width: 1, background: "rgba(201,168,76,0.2)", flexShrink: 0 }} />

              {/* Salon columns */}
              {compareIds.map((id, idx) => (
                <div key={id} style={{ flex: 1, minWidth: 0, borderLeft: idx > 0 ? "1px solid rgba(201,168,76,0.15)" : "none" }}>
                  <SalonColumn id={id} index={idx} />
                </div>
              ))}

              {/* Empty column slots */}
              {Array.from({ length: 3 - compareIds.length }).map((_, i) => (
                <div key={`empty-${i}`} style={{ flex: 1, minWidth: 220, borderLeft: "1px solid rgba(201,168,76,0.15)" }}>
                  <div style={{ height: 200, background: "rgba(245,232,236,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                    <div style={{ width: 40, height: 40, border: "1px dashed rgba(201,168,76,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(201,168,76,0.5)", fontSize: "1.25rem" }}>◆</div>
                    <Link href="/discover">
                      <button className="btn-outline-gold" style={{ fontSize: "0.62rem", padding: "0.4rem 1rem" }}>
                        + Add Salon
                      </button>
                    </Link>
                  </div>
                  {ROW_LABELS.map((_, j) => (
                    <div key={j} style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(201,168,76,0.15)", background: j % 2 === 0 ? "rgba(255,248,245,0.5)" : "rgba(255,255,255,0.5)", minHeight: 58 }} />
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
