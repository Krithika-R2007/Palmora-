export function GoldDivider({ label }: { label?: string }) {
  return (
    <div className="gold-divider" style={{ margin: "0 auto", maxWidth: 480, padding: "0 1rem" }}>
      {label ? (
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--paloma-gold)",
          whiteSpace: "nowrap",
          padding: "0 1rem",
        }}>
          ◆ {label} ◆
        </span>
      ) : (
        <span style={{ color: "var(--paloma-gold)", fontSize: "0.75rem" }}>◆</span>
      )}
    </div>
  );
}
