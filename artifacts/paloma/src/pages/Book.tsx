import { useState } from "react";
import { Link } from "wouter";
import { useListSalons, useListStylists, useCreateBooking } from "@workspace/api-client-react";
import { GoldDivider } from "@/components/layout/GoldDivider";
import { renderStars } from "@/lib/utils";

const SERVICES = ["Haircut & Styling", "Balayage", "Bridal Makeup", "Facial", "Keratin Treatment", "Hair Spa", "Nail Art", "Eyebrow Sculpting"];
const OCCASIONS = ["Personal", "Wedding", "Party", "Corporate", "Anniversary", "Date Night"];
const TIME_SLOTS = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM"];

type Step = 1 | 2 | 3 | 4 | 5;

export function Book() {
  const [step, setStep] = useState<Step>(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedSalonId, setSelectedSalonId] = useState<number | null>(null);
  const [selectedStylist, setSelectedStylist] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [occasion, setOccasion] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const { data: salons } = useListSalons();
  const { data: stylists } = useListStylists(
    selectedSalonId ? { salonId: selectedSalonId } : {},
    { query: { enabled: !!selectedSalonId } }
  );

  const createBooking = useCreateBooking();

  const STEPS = [
    { n: 1, label: "Service" },
    { n: 2, label: "Stylist" },
    { n: 3, label: "Date & Time" },
    { n: 4, label: "Personalise" },
    { n: 5, label: "Confirm" },
  ];

  const canProceed = () => {
    if (step === 1) return !!selectedService && !!selectedSalonId;
    if (step === 2) return !!selectedStylist;
    if (step === 3) return !!selectedDate && !!selectedTime;
    if (step === 4) return !!occasion && !!customerName;
    return true;
  };

  const handleConfirm = async () => {
    if (!selectedSalonId) return;
    const result = await createBooking.mutateAsync({
      data: {
        salonId: selectedSalonId,
        service: selectedService,
        stylistName: selectedStylist,
        date: selectedDate,
        time: selectedTime,
        customerName,
        occasion,
        notes: notes || undefined,
      }
    });
    setConfirmId(result.id);
    setConfirmed(true);
  };

  if (confirmed) {
    const salon = (salons ?? []).find(s => s.id === selectedSalonId);
    return (
      <div style={{ minHeight: "100vh", background: "var(--paloma-bg)", paddingTop: 72, display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 2rem" }}>
        <div className="frosted-card" style={{ maxWidth: 560, width: "100%", padding: "3.5rem", textAlign: "center", borderRadius: 2 }}>
          <div style={{ color: "var(--paloma-gold)", fontSize: "2.5rem", marginBottom: "1.5rem" }}>◆</div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--paloma-gold)", marginBottom: "1rem" }}>
            Booking Confirmed
          </p>
          <h2 style={{ fontFamily: "'Safira March', serif", fontSize: "2.5rem", color: "var(--paloma-charcoal)", letterSpacing: "0.04em", marginBottom: "0.75rem" }}>
            Your Ritual Awaits
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.1rem", color: "var(--paloma-muted)", marginBottom: "2.5rem" }}>
            We look forward to welcoming you, {customerName}.
          </p>

          <div style={{ textAlign: "left", borderTop: "0.5px solid rgba(201,168,76,0.3)", borderBottom: "0.5px solid rgba(201,168,76,0.3)", padding: "1.5rem 0", margin: "0 0 2rem" }}>
            {[
              { label: "Salon", value: salon?.name ?? "" },
              { label: "Service", value: selectedService },
              { label: "Stylist", value: selectedStylist },
              { label: "Date", value: new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
              { label: "Time", value: selectedTime },
              { label: "Occasion", value: occasion },
              { label: "Booking ID", value: `PAL-${confirmId?.toString().padStart(5, "0") ?? "00001"}` },
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "0.5px solid rgba(201,168,76,0.1)" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--paloma-muted)" }}>{row.label}</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", color: "var(--paloma-charcoal)" }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/discover"><button className="btn-outline-gold">Explore More Salons</button></Link>
            <Link href="/marketplace"><button className="btn-gold">Shop the Boutique</button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--paloma-bg)", paddingTop: 72 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2D1B1F 0%, #4A2430 50%, #C4899A 100%)", padding: "4rem 2rem 3rem", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 16, border: "0.5px solid rgba(201,168,76,0.25)", pointerEvents: "none" }} />
        <h1 style={{ fontFamily: "'Safira March', serif", fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "#fff", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
          Book Your Experience
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.1rem", color: "rgba(242,184,198,0.8)" }}>
          A few steps to your perfect appointment
        </p>
      </div>

      {/* Step Indicator */}
      <div style={{ background: "rgba(255,248,245,0.95)", borderBottom: "1px solid rgba(201,168,76,0.2)", padding: "1.25rem 2rem", position: "sticky", top: 72, zIndex: 50 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", gap: "0", alignItems: "center", justifyContent: "center" }}>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.3rem",
              }}>
                <div style={{
                  width: 28, height: 28,
                  borderRadius: "50%",
                  border: s.n <= step ? "2px solid var(--paloma-gold)" : "1.5px solid rgba(201,168,76,0.35)",
                  background: s.n < step ? "var(--paloma-gold)" : s.n === step ? "rgba(201,168,76,0.15)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.65rem",
                  color: s.n < step ? "var(--paloma-charcoal)" : s.n === step ? "var(--paloma-gold)" : "var(--paloma-muted)",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                }}>
                  {s.n < step ? "✓" : s.n}
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase", color: s.n === step ? "var(--paloma-charcoal)" : "var(--paloma-muted)" }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 32, height: 1, background: s.n < step ? "var(--paloma-gold)" : "rgba(201,168,76,0.25)", margin: "0 0.5rem 1.5rem", flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "4rem 2rem" }}>
        {/* Step 1: Service & Salon */}
        {step === 1 && (
          <div className="fade-in-up">
            <GoldDivider label="Step 1" />
            <h2 style={{ fontFamily: "'Safira March', serif", fontSize: "2rem", color: "var(--paloma-charcoal)", textAlign: "center", margin: "2rem 0", letterSpacing: "0.04em" }}>
              Choose Your Service
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
              {SERVICES.map(svc => (
                <button
                  key={svc}
                  onClick={() => setSelectedService(svc)}
                  style={{
                    padding: "1.25rem",
                    border: selectedService === svc ? "1.5px solid var(--paloma-gold)" : "1px solid rgba(201,168,76,0.3)",
                    background: selectedService === svc ? "rgba(201,168,76,0.12)" : "rgba(255,248,245,0.7)",
                    cursor: "pointer",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.05rem",
                    color: "var(--paloma-charcoal)",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    boxShadow: selectedService === svc ? "0 0 12px rgba(201,168,76,0.2)" : "none",
                  }}
                >
                  {svc}
                </button>
              ))}
            </div>

            <h3 style={{ fontFamily: "'Safira March', serif", fontSize: "1.5rem", color: "var(--paloma-charcoal)", marginBottom: "1.5rem", letterSpacing: "0.03em" }}>Select a Salon</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {(salons ?? []).map(salon => (
                <button
                  key={salon.id}
                  onClick={() => setSelectedSalonId(salon.id)}
                  style={{
                    padding: "1.25rem 1.5rem",
                    border: selectedSalonId === salon.id ? "1.5px solid var(--paloma-gold)" : "1px solid rgba(201,168,76,0.25)",
                    background: selectedSalonId === salon.id ? "rgba(201,168,76,0.10)" : "rgba(255,248,245,0.7)",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "'Safira March', serif", fontSize: "1.25rem", color: "var(--paloma-charcoal)", letterSpacing: "0.03em" }}>{salon.name}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "var(--paloma-muted)", letterSpacing: "0.08em", marginTop: "0.2rem" }}>{salon.neighborhood}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className="stars" style={{ fontSize: "0.75rem" }}>{renderStars(salon.rating)}</span>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "var(--paloma-gold)", marginTop: "0.2rem" }}>{salon.priceRange}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Stylist */}
        {step === 2 && (
          <div className="fade-in-up">
            <GoldDivider label="Step 2" />
            <h2 style={{ fontFamily: "'Safira March', serif", fontSize: "2rem", color: "var(--paloma-charcoal)", textAlign: "center", margin: "2rem 0", letterSpacing: "0.04em" }}>
              Choose Your Artist
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
              {(stylists ?? []).map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStylist(s.name)}
                  style={{
                    padding: "2rem 1.5rem",
                    border: selectedStylist === s.name ? "1.5px solid var(--paloma-gold)" : "1px solid rgba(201,168,76,0.3)",
                    background: selectedStylist === s.name ? "rgba(201,168,76,0.10)" : "rgba(255,248,245,0.7)",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    boxShadow: selectedStylist === s.name ? "0 0 16px rgba(201,168,76,0.22)" : "none",
                  }}
                >
                  <div style={{
                    width: 64, height: 64, margin: "0 auto 1rem",
                    background: "var(--satin-gradient)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: selectedStylist === s.name ? "2px solid var(--paloma-gold)" : "1.5px solid rgba(201,168,76,0.4)",
                  }}>
                    <span style={{ fontFamily: "'Safira March', serif", fontSize: "1.5rem", color: "#fff" }}>{s.name.charAt(0)}</span>
                  </div>
                  <div style={{ fontFamily: "'Safira March', serif", fontSize: "1.15rem", color: "var(--paloma-charcoal)", marginBottom: "0.3rem" }}>{s.name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--paloma-gold)", marginBottom: "0.5rem" }}>{s.specialty}</div>
                  <span className="stars" style={{ fontSize: "0.75rem" }}>{renderStars(s.rating)}</span>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", color: "var(--paloma-muted)", fontStyle: "italic", lineHeight: 1.6, marginTop: "0.75rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {s.bio}
                  </p>
                </button>
              ))}
              {(!stylists || stylists.length === 0) && (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", fontFamily: "'Cormorant Garamond', serif", color: "var(--paloma-muted)", fontStyle: "italic" }}>
                  Loading stylists...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div className="fade-in-up">
            <GoldDivider label="Step 3" />
            <h2 style={{ fontFamily: "'Safira March', serif", fontSize: "2rem", color: "var(--paloma-charcoal)", textAlign: "center", margin: "2rem 0", letterSpacing: "0.04em" }}>
              Select Date & Time
            </h2>
            <div className="frosted-card" style={{ padding: "2rem", borderRadius: 2, marginBottom: "2rem" }}>
              <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--paloma-muted)", display: "block", marginBottom: "0.75rem" }}>
                Preferred Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => setSelectedDate(e.target.value)}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.1rem",
                  padding: "0.625rem 1rem",
                  border: "1px solid rgba(201,168,76,0.4)",
                  background: "rgba(245,232,236,0.5)",
                  color: "var(--paloma-charcoal)",
                  outline: "none",
                  width: "100%",
                }}
              />
            </div>
            {selectedDate && (
              <div className="frosted-card" style={{ padding: "2rem", borderRadius: 2 }}>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--paloma-muted)", display: "block", marginBottom: "1rem" }}>
                  Available Slots
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "0.625rem" }}>
                  {TIME_SLOTS.map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      style={{
                        padding: "0.5rem 0.75rem",
                        border: selectedTime === t ? "1.5px solid var(--paloma-gold)" : "1px solid rgba(201,168,76,0.3)",
                        background: selectedTime === t ? "var(--paloma-gold)" : "transparent",
                        color: selectedTime === t ? "var(--paloma-charcoal)" : "var(--paloma-charcoal)",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Personalise */}
        {step === 4 && (
          <div className="fade-in-up">
            <GoldDivider label="Step 4" />
            <h2 style={{ fontFamily: "'Safira March', serif", fontSize: "2rem", color: "var(--paloma-charcoal)", textAlign: "center", margin: "2rem 0", letterSpacing: "0.04em" }}>
              Personalise Your Visit
            </h2>
            <div className="frosted-card" style={{ padding: "2.5rem", borderRadius: 2, display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              <div>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--paloma-muted)", display: "block", marginBottom: "0.75rem" }}>Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Full name"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", padding: "0.625rem 1rem", border: "1px solid rgba(201,168,76,0.4)", background: "rgba(245,232,236,0.5)", color: "var(--paloma-charcoal)", outline: "none", width: "100%" }}
                />
              </div>
              <div>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--paloma-muted)", display: "block", marginBottom: "0.75rem" }}>Occasion</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
                  {OCCASIONS.map(occ => (
                    <button
                      key={occ}
                      onClick={() => setOccasion(occ)}
                      style={{
                        padding: "0.75rem 1rem",
                        border: occasion === occ ? "1.5px solid var(--paloma-gold)" : "1px solid rgba(201,168,76,0.3)",
                        background: occasion === occ ? "rgba(201,168,76,0.12)" : "transparent",
                        cursor: "pointer",
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1rem",
                        color: "var(--paloma-charcoal)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--paloma-muted)", display: "block", marginBottom: "0.75rem" }}>Special Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any preferences, allergies, or special requests..."
                  rows={4}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", padding: "0.75rem 1rem", border: "1px solid rgba(201,168,76,0.4)", background: "rgba(245,232,236,0.5)", color: "var(--paloma-charcoal)", outline: "none", width: "100%", resize: "vertical" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="fade-in-up">
            <GoldDivider label="Step 5" />
            <h2 style={{ fontFamily: "'Safira March', serif", fontSize: "2rem", color: "var(--paloma-charcoal)", textAlign: "center", margin: "2rem 0", letterSpacing: "0.04em" }}>
              Review & Confirm
            </h2>
            <div className="frosted-card" style={{ padding: "2.5rem", borderRadius: 2 }}>
              {[
                { label: "Salon", value: (salons ?? []).find(s => s.id === selectedSalonId)?.name ?? "" },
                { label: "Service", value: selectedService },
                { label: "Stylist", value: selectedStylist },
                { label: "Date", value: selectedDate ? new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "" },
                { label: "Time", value: selectedTime },
                { label: "Occasion", value: occasion },
                { label: "Name", value: customerName },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.875rem 0", borderBottom: "0.5px solid rgba(201,168,76,0.2)" }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--paloma-muted)" }}>{row.label}</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "var(--paloma-charcoal)" }}>{row.value}</span>
                </div>
              ))}
              {notes && (
                <div style={{ padding: "0.875rem 0" }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--paloma-muted)", marginBottom: "0.4rem" }}>Notes</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "var(--paloma-charcoal)", fontStyle: "italic" }}>{notes}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between", marginTop: "3rem" }}>
          {step > 1 ? (
            <button className="btn-outline-gold" onClick={() => setStep((step - 1) as Step)} style={{ padding: "0.75rem 2rem" }}>
              Back
            </button>
          ) : <div />}
          {step < 5 ? (
            <button
              className="btn-gold"
              onClick={() => setStep((step + 1) as Step)}
              disabled={!canProceed()}
              style={{ padding: "0.75rem 2rem", opacity: canProceed() ? 1 : 0.45, cursor: canProceed() ? "pointer" : "not-allowed" }}
            >
              Continue
            </button>
          ) : (
            <button
              className="btn-gold"
              onClick={handleConfirm}
              disabled={createBooking.isPending}
              style={{ padding: "0.875rem 2.5rem" }}
            >
              {createBooking.isPending ? "Confirming..." : "Confirm Booking"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
