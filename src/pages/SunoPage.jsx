import { useState, useEffect, useLayoutEffect } from "react";
import Header from "../components/Header";

function useScrollable() {
  useLayoutEffect(() => {
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);
}

// Design tokens — Semantic (Light mode)
const C = {
  surfaceDefault: "#FFFFFF",
  surfaceSubtle: "#F4F4F4",
  surfaceDark: "#121212",
  textPrimary: "#121212",
  textSecondary: "#444444",
  textMuted: "#777777",
  textInverse: "#FFFFFF",
  textDisabled: "#DADADA",
};

const F = {
  base: "'Inter', sans-serif",
  display: "'Merriweather', serif",
  label: "'Space Grotesk', sans-serif",
};

function useHPad() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  if (width <= 768) return { hPad: "24px", isMobile: true };
  if (width <= 1200) return { hPad: "60px", isMobile: false };
  return { hPad: "352px", isMobile: false };
}

const META_ITEMS = [
  {
    label: "ROLE",
    lines: ["User Research", "Market Research", "Product Design", "Design System", "Prototyping"],
  },
  { label: "TIMELINE", lines: ["2 months"] },
  { label: "TEAM", lines: ["Nayun Park (Product Designer)", "1 Designer"] },
  { label: "TOOLS", lines: ["Figma", "Figjam"] },
];

const SIDE_NAV_ITEMS = [
  { label: "Overview", active: true },
  { label: "Discover", active: false },
  { label: "Define", active: false },
  { label: "Ideate", active: false },
  { label: "Design System", active: false },
  { label: "Key Solutions", active: false },
  { label: "Evaluation", active: false },
  { label: "Reflection", active: false },
];

export default function SunoPage() {
  useScrollable();
  const { hPad, isMobile } = useHPad();

  return (
    <div style={{ background: C.surfaceDefault, minHeight: "100vh" }}>
      <Header />
      <main>
        {/* Project Header */}
        <div style={{ padding: `184px ${hPad} 0` }}>
          {/* Category chips */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "24px" }}>
            {["Case Study", "AI", "2025"].map((chip) => (
              <div
                key={chip}
                style={{
                  background: C.surfaceDark,
                  color: C.textInverse,
                  fontFamily: F.base,
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: 1.4,
                  padding: "5px 16px",
                  borderRadius: "999px",
                  whiteSpace: "nowrap",
                }}
              >
                {chip}
              </div>
            ))}
          </div>

          {/* Title group */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "56px" }}>
            <h1
              style={{
                fontFamily: F.display,
                fontWeight: 600,
                fontSize: isMobile ? "32px" : "48px",
                lineHeight: 1.4,
                color: C.textPrimary,
                margin: 0,
              }}
            >
              Making AI Music Creation Intuitive
            </h1>
            <p
              style={{
                fontFamily: F.base,
                fontWeight: 400,
                fontSize: isMobile ? "20px" : "28px",
                lineHeight: 1.4,
                color: C.textSecondary,
                margin: 0,
              }}
            >
              Suno AI App Revamp
            </p>
          </div>
        </div>

        {/* Hero image — full width */}
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            background: C.surfaceSubtle,
          }}
        />

        {/* Project Meta */}
        <div style={{ padding: `60px ${hPad}` }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              gap: "36px",
            }}
          >
            {META_ITEMS.map((item) => (
              <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p
                  style={{
                    fontFamily: F.label,
                    fontWeight: 700,
                    fontSize: "18px",
                    lineHeight: 1.4,
                    letterSpacing: "0.9px",
                    color: C.textSecondary,
                    margin: 0,
                  }}
                >
                  {item.label}
                </p>
                <div>
                  {item.lines.map((line, i) => (
                    <p
                      key={i}
                      style={{
                        fontFamily: F.base,
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: 1.5,
                        color: C.textPrimary,
                        margin: 0,
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content area — side nav + placeholder */}
        <div
          style={{
            padding: `0 ${hPad} 120px`,
            display: "flex",
            gap: "60px",
            alignItems: "flex-start",
          }}
        >
          {/* Side nav — desktop only */}
          {!isMobile && (
            <nav
              style={{
                width: "310px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {SIDE_NAV_ITEMS.map(({ label, active }) => (
                <div
                  key={label}
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  {active && (
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "1px",
                        background: C.textSecondary,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontFamily: F.base,
                      fontWeight: active ? 600 : 500,
                      fontSize: "18px",
                      lineHeight: 1.4,
                      color: active ? C.textSecondary : C.textDisabled,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </nav>
          )}

          {/* Placeholder content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                height: "400px",
                background: C.surfaceSubtle,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  fontFamily: F.base,
                  fontSize: "16px",
                  color: C.textMuted,
                  margin: 0,
                }}
              >
                Content coming soon
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
