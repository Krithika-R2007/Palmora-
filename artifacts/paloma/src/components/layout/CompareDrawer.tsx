import { Link, useLocation } from "wouter";
import { useCompare } from "@/context/CompareContext";
import { useGetSalon } from "@workspace/api-client-react";

function MiniSalon({ id }: { id: number }) {
  const { data: salon } = useGetSalon(id, { query: { enabled: !!id } });
  const { removeFromCompare } = useCompare();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "0.85rem",
        color: "#fff",
        fontWeight: 600,
        maxWidth: 140,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {salon?.name ?? "Loading..."}
      </div>
      <button
        onClick={() => removeFromCompare(id)}
        title="Remove"
        style={{
          background: "transparent",
          border: "1px solid rgba(212,175,55,0.3)",
          color: "rgba(212,175,55,0.7)",
          width: 20,
          height: 20,
          borderRadius: 2,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.65rem",
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}

export function CompareDrawer() {
  const { compareIds, clearCompare } = useCompare();
  const [location] = useLocation();

  if (compareIds.length === 0 || location === "/compare") return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 300,
      background: "rgba(18,5,32,0.97)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderTop: "1px solid rgba(212,175,55,0.25)",
      padding: "1rem 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1.5rem",
      flexWrap: "wrap",
    }}>
      {/* Left: title + salons */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", color: "#fff", fontWeight: 700 }}>
            Compare Salons
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.58rem", color: "rgba(179,164,197,0.7)", letterSpacing: "0.1em", marginTop: 2 }}>
            {compareIds.length} of 3 selected
          </div>
        </div>

        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {compareIds.map(id => (
            <MiniSalon key={id} id={id} />
          ))}
          {Array.from({ length: 3 - compareIds.length }).map((_, i) => (
            <div key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "rgba(179,164,197,0.35)", fontStyle: "italic", letterSpacing: "0.06em" }}>
              — empty slot
            </div>
          ))}
        </div>
      </div>

      {/* Right: actions */}
      <div style={{ display: "flex", gap: "0.875rem", alignItems: "center" }}>
        <button
          onClick={clearCompare}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.62rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background: "transparent",
            border: "none",
            color: "rgba(179,164,197,0.55)",
            cursor: "pointer",
            padding: "0.35rem 0",
          }}
        >
          Clear
        </button>
        <Link href="/compare">
          <button style={{
            background: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #AA771C 100%)",
            color: "#120520",
            border: "none",
            padding: "0.6rem 1.75rem",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 2px 12px rgba(212,175,55,0.3)",
          }}>
            Compare Now
          </button>
        </Link>
      </div>
    </div>
  );
}
