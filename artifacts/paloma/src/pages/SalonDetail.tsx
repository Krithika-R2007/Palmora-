import { Link } from "wouter";
import { useGetSalon, useListStylists, useListReviews } from "@workspace/api-client-react";
import { GoldDivider } from "@/components/layout/GoldDivider";
import { renderStars, formatDateDisplay } from "@/lib/utils";
import { getSalonImage, getStylistImage } from "@/lib/images";

interface Props { params: { id: string } }

export function SalonDetail({ params }: Props) {
  const id = parseInt(params.id, 10);
  const { data: salon, isLoading } = useGetSalon(id, { query: { enabled: !!id } });
  const { data: stylists } = useListStylists({ salonId: id }, { query: { enabled: !!id } });
  const { data: reviews } = useListReviews({ salonId: id }, { query: { enabled: !!id } });

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--paloma-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.25rem", color: "var(--paloma-muted)", fontStyle: "italic" }}>Preparing your experience...</div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--paloma-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", color: "var(--paloma-mauve)", marginBottom: "1rem", fontWeight: 700 }}>Salon not found</div>
          <Link href="/discover"><button className="btn-outline-gold">Back to Discover</button></Link>
        </div>
      </div>
    );
  }

  const salonImg = getSalonImage((id - 1) % 5);

  return (
    <div style={{ minHeight: "100vh", background: "var(--paloma-bg)" }}>
      {/* Hero with real photo */}
      <div style={{ position: "relative", height: 480, overflow: "hidden" }}>
        <img
          src={salonImg}
          alt={salon.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(44,27,31,0.95) 0%, rgba(44,27,31,0.5) 50%, rgba(44,27,31,0.2) 100%)" }} />
        {/* Gold frame overlay */}
        <div style={{ position: "absolute", inset: 20, border: "0.5px solid rgba(201,168,76,0.3)", pointerEvents: "none" }} />

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "3rem 4rem" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <Link href="/discover" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(242,184,198,0.6)", textDecoration: "none", display: "block", marginBottom: "1.5rem" }}>
              ← Back to Discover
            </Link>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--paloma-gold-light)", marginBottom: "0.75rem" }}>{salon.neighborhood}</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#fff", fontWeight: 700, marginBottom: "1rem", textShadow: "0 2px 20px rgba(44,27,31,0.5)" }}>
              {salon.name}
            </h1>
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <span className="stars">{renderStars(salon.rating)}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "rgba(242,184,198,0.75)", marginLeft: "0.5rem" }}>{salon.rating} · {salon.reviewCount} reviews</span>
              </div>
              <span style={{ color: "var(--paloma-gold)", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem" }}>{salon.priceRange}</span>
              {salon.openingHours && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "rgba(242,184,198,0.65)" }}>{salon.openingHours}</span>}
            </div>
            <Link href={`/book?salonId=${salon.id}`}>
              <button className="btn-gold" style={{ padding: "0.875rem 2.5rem" }}>Book an Appointment</button>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem" }}>
        {/* Description */}
        {salon.description && (
          <div style={{ marginBottom: "4rem", textAlign: "center", maxWidth: 720, margin: "0 auto 4rem" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "var(--paloma-charcoal)", lineHeight: 1.8, fontStyle: "italic" }}>
              {salon.description}
            </p>
          </div>
        )}

        {/* Services */}
        <GoldDivider label="Services" />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "var(--paloma-charcoal)", textAlign: "center", margin: "2rem 0", fontWeight: 700 }}>What We Offer</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center", marginBottom: "4rem" }}>
          {salon.services.map(svc => (
            <div key={svc} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem", color: "var(--paloma-charcoal)", padding: "0.625rem 1.5rem", border: "1px solid rgba(201,168,76,0.4)", background: "rgba(201,168,76,0.07)", letterSpacing: "0.03em" }}>
              {svc}
            </div>
          ))}
        </div>

        {/* Stylists with real photos */}
        {stylists && stylists.length > 0 && (
          <>
            <GoldDivider label="Our Stylists" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "var(--paloma-charcoal)", textAlign: "center", margin: "2rem 0", fontWeight: 700 }}>Meet the Artists</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.75rem", marginBottom: "4rem" }}>
              {stylists.map((stylist, idx) => (
                <div key={stylist.id} className="frosted-card hover-lift" style={{ padding: "2rem", borderRadius: 2, textAlign: "center" }}>
                  <div style={{ width: 80, height: 80, margin: "0 auto 1.25rem", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--paloma-gold)" }}>
                    <img
                      src={getStylistImage(idx)}
                      alt={stylist.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", color: "var(--paloma-charcoal)", marginBottom: "0.3rem", fontWeight: 700 }}>{stylist.name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--paloma-gold)", marginBottom: "0.75rem" }}>{stylist.specialty}</div>
                  <div><span className="stars" style={{ fontSize: "0.8rem" }}>{renderStars(stylist.rating)}</span></div>
                  {stylist.experience && (
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "var(--paloma-muted)", marginTop: "0.4rem" }}>{stylist.experience} experience</div>
                  )}
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "var(--paloma-muted)", lineHeight: 1.6, marginTop: "1rem", fontStyle: "italic" }}>
                    {stylist.bio}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Gallery strip — multiple angles of the same salon */}
        <GoldDivider label="Gallery" />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "var(--paloma-charcoal)", textAlign: "center", margin: "2rem 0", fontWeight: 700 }}>Inside the Salon</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "4rem" }}>
          {[0, 1, 2].map(offset => (
            <div key={offset} style={{ borderRadius: 2, overflow: "hidden", height: 180, border: "1px solid rgba(201,168,76,0.25)" }}>
              <img
                src={getSalonImage((id + offset) % 5)}
                alt={`${salon.name} interior`}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                onMouseOver={e => (e.currentTarget.style.transform = "scale(1.06)")}
                onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
          ))}
        </div>

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <>
            <GoldDivider label="Client Reviews" />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "var(--paloma-charcoal)", textAlign: "center", margin: "2rem 0", fontWeight: 700 }}>What Clients Say</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
              {reviews.map(review => (
                <div key={review.id} className="frosted-card" style={{ padding: "1.75rem", borderRadius: 2 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.85rem", color: "var(--paloma-charcoal)" }}>{review.customerName}</div>
                    <span className="stars" style={{ fontSize: "0.8rem" }}>{renderStars(review.rating)}</span>
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "var(--paloma-charcoal)", fontStyle: "italic", lineHeight: 1.7, marginBottom: "0.75rem" }}>
                    "{review.comment}"
                  </p>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: "var(--paloma-muted)" }}>{formatDateDisplay(review.createdAt)}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Book CTA */}
        <div className="frosted-card" style={{ padding: "3rem", textAlign: "center", borderRadius: 2 }}>
          <GoldDivider />
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "var(--paloma-charcoal)", margin: "1.5rem 0 0.75rem", fontWeight: 700 }}>Reserve Your Visit</h3>
          {salon.address && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "var(--paloma-muted)", marginBottom: "0.4rem" }}>{salon.address}</p>}
          {salon.phone && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "var(--paloma-muted)", marginBottom: "1.5rem" }}>{salon.phone}</p>}
          <Link href={`/book?salonId=${salon.id}`}>
            <button className="btn-gold" style={{ padding: "0.875rem 2.75rem" }}>Book Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
