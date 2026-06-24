import { Link } from "wouter";
import { useListFeaturedSalons, useGetSalonsSummary, useListProducts, useListReviews } from "@workspace/api-client-react";
import { GoldDivider } from "@/components/layout/GoldDivider";
import { renderStars, formatPrice } from "@/lib/utils";
import { getSalonImage, getProductImage, HERO_IMAGE } from "@/lib/images";

const SERVICES = ["Balayage", "Bridal Makeup", "Keratin Treatment", "Facials", "Hair Spa", "Nail Art"];
const NEIGHBORHOODS = ["Indiranagar", "Koramangala", "Whitefield", "JP Nagar", "HSR Layout"];

const TESTIMONIALS = [
  { name: "Nisha K.", text: "Paloma found me the perfect colorist in 2 minutes. Priya understood exactly what I wanted — honey-toned balayage that suits my complexion. I've never felt more confident.", salon: "Aurelia, Indiranagar" },
  { name: "Deepa M.", text: "I was anxious about my bridal look. Arjun at Aurelia put me completely at ease and created something timeless. My wedding photos look like they're from Vogue.", salon: "Aurelia, Indiranagar" },
  { name: "Riya S.", text: "Kavya gave me the best haircut I've ever had. She listened, she understood, she executed perfectly. Lumière has my loyalty forever.", salon: "Lumière Studio, Koramangala" },
];

const WHY_PALOMA = [
  { icon: "✦", title: "AI-Curated Discovery", desc: "Our intelligent matching finds salons and stylists that align with your taste, hair type, and occasion — not just proximity." },
  { icon: "✦", title: "Virtual Try-On", desc: "See exactly how a hairstyle or colour will look on you before you commit, powered by real-time AI simulation technology." },
  { icon: "✦", title: "Seamless Booking", desc: "Reserve with precision. Select your stylist, your slot, and your occasion. Your luxury experience begins the moment you confirm." },
  { icon: "✦", title: "Beauty Concierge", desc: "Our AI concierge is available 24 hours a day to answer every beauty question, recommend products, and manage your appointments." },
];

export function Home() {
  const { data: featuredSalons, isLoading: salonsLoading } = useListFeaturedSalons();
  const { data: summary } = useGetSalonsSummary();
  const { data: products } = useListProducts({ featured: true });
  const { data: reviews } = useListReviews();

  return (
    <div style={{ background: "var(--paloma-bg)", minHeight: "100vh", marginTop: -100 }}>
      {/* Hero — full-bleed behind both nav bars */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* Real photo background */}
        <img
          src={HERO_IMAGE}
          alt="Luxury salon"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        {/* Dark overlay with satin tint */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(155deg, rgba(45,27,31,0.88) 0%, rgba(74,36,48,0.78) 40%, rgba(196,137,154,0.45) 75%, rgba(242,184,198,0.30) 100%)",
        }} />
        {/* Gold border frame */}
        <div style={{ position: "absolute", inset: 24, border: "1px solid rgba(201,168,76,0.35)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 28, border: "0.5px solid rgba(201,168,76,0.15)", pointerEvents: "none" }} />

        <div style={{ position: "relative", textAlign: "center", padding: "8rem 2rem 6rem", maxWidth: 900, margin: "0 auto" }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.65rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(232,213,163,0.85)",
            marginBottom: "2rem",
          }}>
            Bangalore's Finest Beauty Experience
          </p>

          <h1 style={{
            fontFamily: "'Playfair Display', 'Safira March', serif",
            fontSize: "clamp(4rem, 10vw, 8rem)",
            color: "#fff",
            letterSpacing: "0.04em",
            lineHeight: 1.05,
            marginBottom: "1.5rem",
            textShadow: "0 2px 40px rgba(44,27,31,0.5)",
            fontWeight: 700,
          }}>
            Paloma
          </h1>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            color: "rgba(242,184,198,0.95)",
            fontWeight: 300,
            fontStyle: "italic",
            letterSpacing: "0.04em",
            lineHeight: 1.6,
            marginBottom: "3rem",
            maxWidth: 560,
            margin: "0 auto 3rem",
          }}>
            Where Bangalore's most discerning clients discover their beauty rituals — curated, elevated, and entirely personal.
          </p>

          <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/discover">
              <button className="btn-gold" style={{ padding: "0.875rem 2.5rem" }}>
                Discover Salons
              </button>
            </Link>
            <Link href="/book">
              <button className="btn-outline-gold" style={{ padding: "0.875rem 2.5rem", color: "#fff", borderColor: "rgba(201,168,76,0.7)" }}>
                Book an Appointment
              </button>
            </Link>
          </div>

          {summary && (
            <div style={{ display: "flex", gap: "3rem", justifyContent: "center", marginTop: "4rem", flexWrap: "wrap" }}>
              {[
                { value: summary.totalSalons + "+", label: "Partner Salons" },
                { value: summary.avgRating.toFixed(1), label: "Avg. Rating" },
                { value: "500K+", label: "Clients Served" },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.25rem", color: "var(--paloma-gold-light)", letterSpacing: "0.04em", fontWeight: 700 }}>{stat.value}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(242,184,198,0.70)", marginTop: "0.25rem" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Salons */}
      <section style={{ padding: "5rem 2rem 0" }}>
        <GoldDivider label="Featured Salons" />
      </section>
      <section style={{ padding: "3rem 2rem 5rem", maxWidth: 1280, margin: "0 auto" }}>
        {salonsLoading ? (
          <div style={{ textAlign: "center", padding: "3rem", fontFamily: "'Cormorant Garamond', serif", color: "var(--paloma-muted)", fontSize: "1.1rem" }}>
            Curating the finest salons for you...
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
            {(featuredSalons ?? []).map((salon, i) => (
              <Link key={salon.id} href={`/salon/${salon.id}`} style={{ textDecoration: "none" }}>
                <div className={`frosted-card hover-lift fade-in-up stagger-${Math.min(i + 1, 5)}`}
                  style={{ borderRadius: 2, overflow: "hidden", cursor: "pointer" }}>
                  {/* Real salon photo */}
                  <div style={{ position: "relative", height: 210, overflow: "hidden" }}>
                    <img
                      src={getSalonImage(i)}
                      alt={salon.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                      onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(44,27,31,0.85) 0%, transparent 55%)",
                    }} />
                    <div style={{ position: "absolute", bottom: "1rem", left: "1.25rem" }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--paloma-gold-light)", marginBottom: "0.2rem" }}>
                        {salon.neighborhood}
                      </div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#fff", letterSpacing: "0.02em", fontWeight: 700, textShadow: "0 2px 8px rgba(44,27,31,0.6)" }}>
                        {salon.name}
                      </div>
                    </div>
                    {salon.featured && (
                      <div style={{
                        position: "absolute", top: 12, right: 12,
                        background: "var(--paloma-gold)",
                        color: "var(--paloma-charcoal)",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.55rem", letterSpacing: "0.12em", textTransform: "uppercase",
                        padding: "0.25rem 0.6rem",
                      }}>★ Featured</div>
                    )}
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.975rem", color: "var(--paloma-muted)", lineHeight: 1.6, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {salon.description}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span className="stars" style={{ fontSize: "0.875rem" }}>{renderStars(salon.rating)}</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "var(--paloma-muted)", marginLeft: "0.5rem" }}>
                          {salon.rating} ({salon.reviewCount})
                        </span>
                      </div>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "var(--paloma-gold)", letterSpacing: "0.08em" }}>{salon.priceRange}</span>
                    </div>
                    <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {salon.services.slice(0, 3).map(svc => (
                        <span key={svc} style={{
                          fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase",
                          background: "rgba(201,168,76,0.10)", border: "0.5px solid rgba(201,168,76,0.35)",
                          color: "var(--paloma-charcoal)", padding: "0.2rem 0.6rem",
                        }}>
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link href="/discover"><button className="btn-outline-gold" style={{ padding: "0.75rem 2.5rem" }}>View All Salons</button></Link>
        </div>
      </section>

      {/* Why Paloma */}
      <section style={{ background: "linear-gradient(180deg, rgba(44,27,31,0.04) 0%, rgba(44,27,31,0.08) 100%)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <GoldDivider label="The Paloma Difference" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", textAlign: "center", color: "var(--paloma-charcoal)", margin: "2.5rem 0", letterSpacing: "0.02em", fontWeight: 700 }}>
            Crafted for the Discerning Few
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "2rem", marginTop: "3rem" }}>
            {WHY_PALOMA.map((item, i) => (
              <div key={item.title} className={`frosted-card fade-in-up stagger-${i + 1}`} style={{ padding: "2rem", borderRadius: 2 }}>
                <div style={{ color: "var(--paloma-gold)", fontSize: "1.25rem", marginBottom: "1rem" }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", color: "var(--paloma-charcoal)", letterSpacing: "0.02em", marginBottom: "0.75rem", fontWeight: 700 }}>{item.title}</h3>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "var(--paloma-muted)", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Try-On Banner — from Person A's concept */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "5rem 2rem" }}>
        <div className="frosted-card" style={{ padding: "3.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center", borderRadius: 2, border: "1px solid rgba(201,168,76,0.3)" }}>
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--paloma-gold)", marginBottom: "1rem" }}>Try It Now</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", color: "var(--paloma-charcoal)", marginBottom: "1rem", fontWeight: 700 }}>Virtual Hairstyle Try-On</h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--paloma-muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
              Wondering how a textured bob or curtain bangs would look on you? Upload your photo and overlay luxury styles instantly before booking your slot.
            </p>
            <Link href="/help">
              <button className="btn-gold" style={{ padding: "0.875rem 2rem" }}>Talk to AI Concierge ✦</button>
            </Link>
          </div>
          <div style={{ position: "relative", borderRadius: 2, overflow: "hidden", border: "1px solid rgba(201,168,76,0.25)", boxShadow: "0 10px 40px rgba(44,27,31,0.15)" }}>
            <img
              src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80"
              alt="Virtual Try-On Preview"
              style={{ width: "100%", display: "block", height: 280, objectFit: "cover" }}
            />
            <div style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(44,27,31,0.85)", padding: "0.5rem 1.25rem", border: "1px solid var(--paloma-gold)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "var(--paloma-gold)" }}>◆ Curtain Bangs Preview</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: "3rem 2rem 5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <GoldDivider label="Our Services" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.25rem)", textAlign: "center", color: "var(--paloma-charcoal)", margin: "2.5rem 0 3rem", fontWeight: 700 }}>
            Every Beauty Ritual, Perfected
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            {SERVICES.map((svc, i) => (
              <Link key={svc} href={`/discover?service=${encodeURIComponent(svc)}`}>
                <div className="hover-lift" style={{ background: i % 2 === 0 ? "rgba(201,168,76,0.08)" : "rgba(196,137,154,0.10)", border: "1px solid rgba(201,168,76,0.35)", padding: "1rem 2rem", cursor: "pointer", borderRadius: 2, transition: "all 0.25s ease" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--paloma-charcoal)", letterSpacing: "0.04em" }}>{svc}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section style={{ background: "linear-gradient(135deg, #2D1B1F 0%, #4A2430 60%, #C4899A 100%)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--paloma-gold-light)", marginBottom: "1.5rem" }}>Serving Bangalore's Finest</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.25rem)", color: "#fff", marginBottom: "3rem", fontWeight: 700 }}>Your Neighborhood, Your Salon</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", justifyContent: "center" }}>
            {NEIGHBORHOODS.map(n => (
              <Link key={n} href={`/discover?neighborhood=${encodeURIComponent(n)}`}>
                <div style={{ border: "1px solid rgba(201,168,76,0.4)", padding: "0.875rem 1.75rem", cursor: "pointer", transition: "all 0.25s ease", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "rgba(242,184,198,0.9)", letterSpacing: "0.04em" }}>
                  {n}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products && products.length > 0 && (
        <section style={{ padding: "5rem 2rem", maxWidth: 1280, margin: "0 auto" }}>
          <GoldDivider label="The Beauty Boutique" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.25rem)", textAlign: "center", color: "var(--paloma-charcoal)", margin: "2.5rem 0 3rem", fontWeight: 700 }}>
            Salon-Curated Treasures
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.75rem" }}>
            {products.slice(0, 4).map((product, i) => (
              <div key={product.id} className={`frosted-card hover-lift fade-in-up stagger-${i + 1}`} style={{ borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
                  <img
                    src={getProductImage(i)}
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                    onMouseOver={e => (e.currentTarget.style.transform = "scale(1.06)")}
                    onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <div style={{ position: "absolute", bottom: 8, left: 8, fontFamily: "'Inter', sans-serif", fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", background: "rgba(44,27,31,0.8)", color: "var(--paloma-gold-light)", padding: "0.2rem 0.6rem" }}>
                    {product.category}
                  </div>
                </div>
                <div style={{ padding: "1.25rem" }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--paloma-gold)", marginBottom: "0.3rem" }}>{product.brand}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "var(--paloma-charcoal)", marginBottom: "0.5rem", lineHeight: 1.3, fontWeight: 600 }}>{product.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="stars" style={{ fontSize: "0.75rem" }}>{renderStars(product.rating)}</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "var(--paloma-charcoal)", fontSize: "1.05rem" }}>{formatPrice(product.price)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link href="/marketplace"><button className="btn-outline-gold" style={{ padding: "0.75rem 2.5rem" }}>Explore the Boutique</button></Link>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section style={{ background: "linear-gradient(180deg, rgba(44,27,31,0.05) 0%, rgba(196,137,154,0.08) 100%)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <GoldDivider label="Client Stories" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.25rem)", textAlign: "center", color: "var(--paloma-charcoal)", margin: "2.5rem 0 3rem", fontWeight: 700 }}>
            Voices of Paloma
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`frosted-card fade-in-up stagger-${i + 1}`} style={{ padding: "2rem", borderRadius: 2 }}>
                <div style={{ color: "var(--paloma-gold)", fontSize: "2rem", lineHeight: 1, marginBottom: "1rem", fontFamily: "'Playfair Display', serif" }}>"</div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "var(--paloma-charcoal)", lineHeight: 1.75, fontStyle: "italic", marginBottom: "1.5rem" }}>{t.text}</p>
                <div style={{ borderTop: "0.5px solid rgba(201,168,76,0.3)", paddingTop: "1rem" }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.8rem", color: "var(--paloma-charcoal)" }}>{t.name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "var(--paloma-gold)", letterSpacing: "0.08em", marginTop: "0.2rem" }}>{t.salon}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: "var(--satin-gradient)", padding: "5rem 2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 16, border: "0.5px solid rgba(255,255,255,0.3)", pointerEvents: "none" }} />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginBottom: "1rem" }}>Begin Your Ritual</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--paloma-charcoal)", marginBottom: "1.5rem", fontWeight: 700 }}>Your Transformation Awaits</h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "rgba(44,27,31,0.75)", fontStyle: "italic", marginBottom: "2.5rem", maxWidth: 480, margin: "0 auto 2.5rem" }}>
          Join Bangalore's most coveted beauty community and discover a new standard of excellence.
        </p>
        <Link href="/book">
          <button style={{ background: "var(--paloma-charcoal)", color: "#fff", border: "none", padding: "0.9rem 2.75rem", fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
            Reserve Your Appointment
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--paloma-charcoal)", padding: "3rem 2rem", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#fff", letterSpacing: "0.04em", marginBottom: "1rem", fontWeight: 700 }}>Paloma</div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "rgba(242,184,198,0.6)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Luxury Salon Discovery, Bangalore</p>
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
          {["/discover", "/book", "/marketplace", "/dashboard", "/help"].map(href => (
            <Link key={href} href={href} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(242,184,198,0.5)", textDecoration: "none" }}>
              {href.replace("/", "")}
            </Link>
          ))}
        </div>
        <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "0.5px solid rgba(201,168,76,0.2)", fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
          © 2026 Paloma. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
