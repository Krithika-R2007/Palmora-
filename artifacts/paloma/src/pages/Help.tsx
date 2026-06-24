import { useState, useRef, useEffect } from "react";
import { GoldDivider } from "@/components/layout/GoldDivider";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

const FAQ_ITEMS = [
  { q: "How does Paloma's salon matching work?", a: "Paloma uses an AI-powered matching algorithm that considers your hair type, past services, preferred neighborhood, occasion, and stylist availability to recommend the most suitable salons and artists for you." },
  { q: "Can I reschedule or cancel my booking?", a: "You may reschedule or cancel your appointment up to 24 hours before your scheduled time without any charge. Cancellations within 24 hours may be subject to a 20% cancellation fee at the salon's discretion." },
  { q: "What is the Luxury Pass subscription?", a: "The Paloma Luxury Pass, priced at ₹2,499 per month, grants you priority booking access, exclusive slot reservations, discounts at partner salons, and early access to new salon listings and product launches." },
  { q: "Are the stylists on Paloma vetted?", a: "Every stylist and salon on the Paloma platform is personally evaluated by our curation team. We verify credentials, review portfolios, and conduct in-person assessments before approving any listing." },
  { q: "How do product recommendations work?", a: "After your appointment, Paloma's AI beauty concierge suggests products that complement your specific service and hair or skin profile — the same products your stylist used during your session." },
  { q: "Is my payment information secure?", a: "Yes. All transactions are processed through industry-standard encrypted payment gateways. Paloma does not store any card or financial details on its servers." },
];

const QUICK_PROMPTS = [
  "How do I book an appointment?",
  "What services are available?",
  "Tell me about the Luxury Pass",
  "How does the virtual try-on work?",
];

const AI_RESPONSES: Record<string, string> = {
  "book": "Booking an appointment on Paloma is elegantly simple. Navigate to the Book page, choose your desired service, then select a salon and your preferred stylist. From there, pick your date and time, personalise your visit with your occasion details, and confirm. You will receive a confirmation summary immediately.",
  "service": "Paloma's partner salons offer a curated range of luxury services including Balayage, Bridal Makeup, Haircut & Styling, Facials, Keratin Treatments, Hair Spa, Nail Art, and Eyebrow Sculpting — among others. Each service is delivered by vetted professionals in Bangalore's finest salons.",
  "luxury pass": "The Paloma Luxury Pass is our premium membership at ₹2,499 per month. Members enjoy priority booking, exclusive time slots before general availability, salon discounts, free cancellations, and a dedicated concierge for personalised beauty assistance.",
  "try-on": "Paloma's virtual try-on technology allows you to see exactly how a hairstyle, colour, or makeup look will appear on you before committing to the service. Simply upload a clear photo through the feature and explore different looks in real time — all powered by advanced AI.",
  "cancel": "You may cancel your booking up to 24 hours before your appointment without any charge. For cancellations within 24 hours, a 20% fee may apply at the salon's discretion. To reschedule or cancel, visit your booking details.",
  "default": "Thank you for reaching out to the Paloma concierge. I would be delighted to assist you. Whether you have questions about booking, our partner salons, the Luxury Pass, or any of our services, I am here to help. Could you tell me a little more about what you are looking for?",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (key !== "default" && lower.includes(key)) return response;
  }
  return AI_RESPONSES["default"];
}

export function Help() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", text: "Welcome to Paloma. I am your personal beauty concierge — here to guide you through our platform, help with bookings, recommend services, and answer any question you may have. How may I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = { id: Date.now() + 1, role: "assistant", text: getAIResponse(text) };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900 + Math.random() * 600);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--paloma-bg)", paddingTop: 72 }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #2D1B1F 0%, #4A2430 50%, #C4899A 100%)",
        padding: "4rem 2rem 3rem",
        textAlign: "center",
        position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 16, border: "0.5px solid rgba(201,168,76,0.25)", pointerEvents: "none" }} />
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--paloma-gold-light)", marginBottom: "1rem" }}>
          24 / 7 Support
        </p>
        <h1 style={{ fontFamily: "'Safira March', serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#fff", letterSpacing: "0.04em", marginBottom: "0.75rem" }}>
          Beauty Concierge
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.15rem", color: "rgba(242,184,198,0.8)" }}>
          Your personal Paloma assistant, available at all times
        </p>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 2rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "2.5rem" }} className="help-grid">
        {/* Chat */}
        <div>
          <div className="frosted-card" style={{ borderRadius: 2, overflow: "hidden", display: "flex", flexDirection: "column", height: 560 }}>
            {/* Chat header */}
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(201,168,76,0.25)", display: "flex", alignItems: "center", gap: "0.875rem" }}>
              <div style={{
                width: 36, height: 36,
                background: "var(--satin-gradient)",
                borderRadius: "50%",
                border: "1.5px solid var(--paloma-gold)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: "#fff", fontSize: "1rem", fontFamily: "'Safira March', serif" }}>P</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.8rem", color: "var(--paloma-charcoal)" }}>Paloma AI Concierge</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", color: "#7BAD8A", letterSpacing: "0.08em" }}>Online · Ready to assist</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {messages.map(msg => (
                <div key={msg.id} style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}>
                  <div style={{
                    maxWidth: "78%",
                    padding: "0.875rem 1.125rem",
                    background: msg.role === "user"
                      ? "var(--paloma-charcoal)"
                      : "rgba(255,248,245,0.9)",
                    border: msg.role === "assistant" ? "1px solid rgba(201,168,76,0.3)" : "none",
                    borderRadius: 2,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1rem",
                    color: msg.role === "user" ? "#fff" : "var(--paloma-charcoal)",
                    lineHeight: 1.7,
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ display: "flex", gap: "0.3rem", padding: "0.875rem 1.125rem", background: "rgba(255,248,245,0.9)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 2, width: "fit-content" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "var(--paloma-mauve)",
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            <div style={{ padding: "0.75rem 1.5rem", borderTop: "0.5px solid rgba(201,168,76,0.15)", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.6rem",
                    padding: "0.3rem 0.75rem",
                    border: "1px solid rgba(201,168,76,0.35)",
                    background: "rgba(201,168,76,0.06)",
                    color: "var(--paloma-charcoal)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid rgba(201,168,76,0.2)", display: "flex", gap: "0.75rem" }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask your concierge anything..."
                style={{
                  flex: 1,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1rem",
                  padding: "0.625rem 1rem",
                  border: "1px solid rgba(201,168,76,0.4)",
                  background: "rgba(245,232,236,0.5)",
                  color: "var(--paloma-charcoal)",
                  outline: "none",
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                className="btn-gold"
                style={{ padding: "0.625rem 1.25rem", flexShrink: 0 }}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <GoldDivider label="FAQ" />
          <h3 style={{ fontFamily: "'Safira March', serif", fontSize: "1.5rem", color: "var(--paloma-charcoal)", textAlign: "center", margin: "1.5rem 0", letterSpacing: "0.04em" }}>
            Common Questions
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="frosted-card" style={{ borderRadius: 2, overflow: "hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "left",
                    gap: "0.75rem",
                  }}
                >
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.975rem", color: "var(--paloma-charcoal)", lineHeight: 1.4 }}>
                    {item.q}
                  </span>
                  <span style={{ color: "var(--paloma-gold)", fontSize: "0.875rem", flexShrink: 0, transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.25s ease" }}>
                    ◆
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 1.25rem 1.25rem", borderTop: "0.5px solid rgba(201,168,76,0.2)" }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "var(--paloma-muted)", lineHeight: 1.7, marginTop: "0.875rem" }}>
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @media (max-width: 760px) {
          .help-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
