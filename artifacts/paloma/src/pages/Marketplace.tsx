import { useState } from "react";
import { useListProducts } from "@workspace/api-client-react";
import { GoldDivider } from "@/components/layout/GoldDivider";
import { renderStars, formatPrice } from "@/lib/utils";

const CATEGORIES = ["All", "Haircare", "Skincare", "Styling Tools"];

export function Marketplace() {
  const [category, setCategory] = useState("All");
  const { data: products, isLoading } = useListProducts(
    category !== "All" ? { category } : {}
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--paloma-bg)", paddingTop: 72 }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #2D1B1F 0%, #C4899A 60%, #F2B8C6 100%)",
        padding: "5rem 2rem 4rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 20, border: "0.5px solid rgba(201,168,76,0.25)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 24, border: "0.5px solid rgba(201,168,76,0.10)", pointerEvents: "none" }} />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>
          The Beauty Boutique
        </p>
        <h1 style={{ fontFamily: "'Safira March', serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#fff", letterSpacing: "0.04em", marginBottom: "0.75rem" }}>
          Salon-Curated Treasures
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.15rem", color: "rgba(242,184,198,0.85)", maxWidth: 480, margin: "0 auto" }}>
          Discover the luxury products used at Paloma's partner salons — curated for India's most discerning beauty connoisseurs.
        </p>
      </div>

      {/* Category Filter */}
      <div style={{ background: "rgba(255,248,245,0.95)", borderBottom: "1px solid rgba(201,168,76,0.2)", padding: "1.25rem 2rem", position: "sticky", top: 72, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "0.45rem 1.25rem",
                border: category === cat ? "1px solid var(--paloma-gold)" : "1px solid rgba(201,168,76,0.3)",
                background: category === cat ? "var(--paloma-gold)" : "transparent",
                color: category === cat ? "var(--paloma-charcoal)" : "var(--paloma-muted)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 2rem" }}>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "4rem", fontFamily: "'Cormorant Garamond', serif", color: "var(--paloma-muted)", fontSize: "1.15rem", fontStyle: "italic" }}>
            Curating your selection...
          </div>
        ) : (
          <>
            {(products ?? []).some(p => p.featured) && (
              <>
                <GoldDivider label="Editor's Picks" />
                <h2 style={{ fontFamily: "'Safira March', serif", fontSize: "2rem", color: "var(--paloma-charcoal)", textAlign: "center", margin: "2rem 0 2.5rem", letterSpacing: "0.04em" }}>
                  The Essentials
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
                  {(products ?? []).filter(p => p.featured).map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              </>
            )}

            {(products ?? []).some(p => !p.featured) && (
              <>
                <GoldDivider label="The Collection" />
                <h2 style={{ fontFamily: "'Safira March', serif", fontSize: "2rem", color: "var(--paloma-charcoal)", textAlign: "center", margin: "2rem 0 2.5rem", letterSpacing: "0.04em" }}>
                  Discover More
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2rem" }}>
                  {(products ?? []).filter(p => !p.featured).map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Affiliate Note */}
      <div style={{ background: "rgba(44,27,31,0.04)", borderTop: "0.5px solid rgba(201,168,76,0.2)", borderBottom: "0.5px solid rgba(201,168,76,0.2)", padding: "2rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "var(--paloma-muted)", fontStyle: "italic", maxWidth: 600, margin: "0 auto" }}>
          All products in the Paloma Boutique are personally vetted and used by our partner salon professionals. Paloma earns a commission on purchases, which helps support the platform.
        </p>
      </div>
    </div>
  );
}

function ProductCard({ product, index }: { product: any; index: number }) {
  const gradients = [
    "linear-gradient(135deg, #F2B8C6 0%, #E8D5A3 100%)",
    "linear-gradient(135deg, #FBCDD8 0%, #F2B8C6 100%)",
    "linear-gradient(135deg, #E8D5A3 0%, #F2B8C6 100%)",
    "linear-gradient(135deg, #C4899A 0%, #F2B8C6 100%)",
  ];

  return (
    <div className={`frosted-card hover-lift fade-in-up stagger-${Math.min(index + 1, 5)}`} style={{ borderRadius: 2, overflow: "hidden" }}>
      {/* Product Image Area */}
      <div style={{
        height: 200,
        background: gradients[index % gradients.length],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}>
        {product.featured && (
          <div style={{
            position: "absolute",
            top: 12, right: 12,
            background: "var(--paloma-charcoal)",
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.55rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "0.25rem 0.625rem",
          }}>
            Editor's Pick
          </div>
        )}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Safira March', serif", fontSize: "3rem", color: "rgba(44,27,31,0.15)" }}>◆</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(44,27,31,0.45)", marginTop: "0.25rem" }}>
            {product.category}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div style={{ padding: "1.5rem" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--paloma-gold)", marginBottom: "0.3rem" }}>
          {product.brand}
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--paloma-charcoal)", marginBottom: "0.625rem", lineHeight: 1.3 }}>
          {product.name}
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.875rem", color: "var(--paloma-muted)", lineHeight: 1.6, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.description}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "0.5px solid rgba(201,168,76,0.2)", paddingTop: "1rem" }}>
          <div>
            <span className="stars" style={{ fontSize: "0.75rem" }}>{renderStars(product.rating)}</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: "var(--paloma-muted)", marginLeft: "0.3rem" }}>{product.rating}</span>
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontWeight: 600, color: "var(--paloma-charcoal)" }}>
            {formatPrice(product.price)}
          </div>
        </div>
        <button className="btn-gold" style={{ width: "100%", marginTop: "1rem", padding: "0.625rem" }}>
          Add to Wishlist
        </button>
      </div>
    </div>
  );
}
