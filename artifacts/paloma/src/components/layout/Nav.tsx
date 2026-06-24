import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useRole } from "@/context/RoleContext";
import { useCompare } from "@/context/CompareContext";

const CUSTOMER_LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/marketplace", label: "Boutique" },
  { href: "/compare", label: "Compare", showCount: true },
  { href: "/help", label: "Concierge" },
];

const OWNER_LINKS = [
  { href: "/dashboard", label: "Salon Dashboard" },
  { href: "/discover", label: "Preview Site" },
];

const ADMIN_LINKS = [
  { href: "/admin", label: "Admin Portal" },
  { href: "/discover", label: "Preview Site" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [location, navigate] = useLocation();
  const { role, setRole } = useRole();
  const { compareIds } = useCompare();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleRoleSwitch = (newRole: "customer" | "owner" | "admin") => {
    setRole(newRole);
    if (newRole === "owner") navigate("/dashboard");
    else if (newRole === "admin") navigate("/admin");
    else navigate("/");
  };

  const links = role === "owner" ? OWNER_LINKS : role === "admin" ? ADMIN_LINKS : CUSTOMER_LINKS;

  const isHome = location === "/";

  return (
    <>
      {/* TOP BAR — LuxeGlow dark purple, always on top */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "rgba(18,5,32,0.97)",
        borderBottom: "1px solid rgba(212,175,55,0.15)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: "8px 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.25rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "0.04em",
            cursor: "pointer",
          }}>
            Paloma
          </span>
        </Link>

        {/* Role switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.58rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#D4AF37",
            fontWeight: 600,
          }}>
            Switch View
          </span>

          <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.05)",
            padding: "3px",
            borderRadius: 30,
            border: "1px solid rgba(255,255,255,0.10)",
          }}>
            {([
              { key: "customer", label: "◆ Customer" },
              { key: "owner",    label: "◈ Salon Owner" },
              { key: "admin",    label: "✦ Admin" },
            ] as const).map(r => {
              const isActive = role === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => handleRoleSwitch(r.key)}
                  style={{
                    padding: "5px 15px",
                    borderRadius: 20,
                    fontSize: "0.68rem",
                    fontWeight: isActive ? 600 : 400,
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    border: "none",
                    outline: "none",
                    transition: "all 0.25s ease",
                    background: isActive
                      ? "linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #AA771C 100%)"
                      : "transparent",
                    color: isActive ? "#120520" : "rgba(179,164,197,0.75)",
                    boxShadow: isActive ? "0 2px 10px rgba(212,175,55,0.30)" : "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN NAV BAR */}
      <header style={{
        position: "fixed",
        top: 40,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled
          ? (role === "owner" || role === "admin")
            ? "rgba(18,5,32,0.97)"
            : "rgba(245,232,236,0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.20)" : "none",
        transition: "all 0.35s ease",
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
        }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{
              fontFamily: "'Safira March', 'Playfair Display', serif",
              fontSize: "1.6rem",
              color: (role === "owner" || role === "admin")
                ? "#D4AF37"
                : scrolled ? "var(--paloma-charcoal)" : "#fff",
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition: "color 0.35s ease",
            }}>
              Paloma
            </span>
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
            {links.map(link => {
              const isActive = location === link.href || location.startsWith(link.href + "/");
              const count = (link as any).showCount ? compareIds.length : 0;
              const isDark = role === "owner" || role === "admin";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    color: isDark
                      ? isActive ? "#D4AF37" : "rgba(255,255,255,0.65)"
                      : scrolled ? "var(--paloma-charcoal)" : "rgba(255,255,255,0.85)",
                    paddingBottom: "2px",
                    borderBottom: isActive
                      ? "1.5px solid #D4AF37"
                      : "1.5px solid transparent",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  {link.label}
                  {count > 0 && (
                    <span style={{
                      background: "#D4AF37",
                      color: "#120520",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {role === "customer" && (
            <Link href="/book">
              <button className="btn-gold" style={{ fontSize: "0.68rem", padding: "0.5rem 1.5rem" }}>
                Book Now
              </button>
            </Link>
          )}

          {(role === "owner" || role === "admin") && (
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", letterSpacing: "0.08em", color: "rgba(212,175,55,0.65)" }}>
              {role === "admin" ? "Platform Admin" : "Partner Portal"}
            </div>
          )}
        </div>
      </header>
    </>
  );
}
