import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const SELECTED_WORKS = [
  {
    id: "ai-mixing",
    category: "AI · Music",
    year: "2025",
    title: "AI Mixing Experience Redesign",
    description:
      "Redesigned the recording and mixing experience to simplify the creation flow and introduce real-time preview, leading to a 22% increase in user uploads.",
    href: null,
  },
  {
    id: "admin-cms",
    category: "Internal Tools",
    year: "2025",
    title: "Admin CMS & Internal Tools",
    description:
      "Designed an admin system that enables non-technical teams to manage content and operations independently, reducing task time by up to 60%.",
    href: null,
  },
];

const MORE_WORKS = [
  { id: "ringle", title: "Ringle App Revamp", category: "AI · Education", year: "2025", href: null },
  { id: "suno", title: "Suno AI App Revamp", category: "AI · Music", year: "2025", href: "/works/suno" },
  { id: "heymood", title: "HeyMood App Case Study", category: "Healthcare · Teen", year: "2025", href: null },
  { id: "ecolab", title: "Ecolab Responsive Website Revamp", category: "Web · B2B", year: "2025", href: null },
];

function SectionHeader({ label }) {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "stretch" }}>
      <div style={{ width: "6px", background: C.textSecondary, flexShrink: 0 }} />
      <p
        style={{
          fontFamily: F.label,
          fontWeight: 700,
          fontSize: "20px",
          lineHeight: 1.3,
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: C.textSecondary,
          margin: 0,
        }}
      >
        {label}
      </p>
    </div>
  );
}

function MetaText({ category, year }) {
  return (
    <div
      style={{
        fontFamily: F.base,
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: 1.4,
        color: C.textMuted,
        display: "flex",
        gap: "4px",
      }}
    >
      <span>{category}</span>
      <span>|</span>
      <span>{year}</span>
    </div>
  );
}

function Thumbnail({ style }) {
  return (
    <div
      style={{
        background: C.surfaceSubtle,
        borderRadius: "6px",
        overflow: "hidden",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M4 14L14 4M14 4H7M14 4V11"
        stroke={C.textSecondary}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function WorksPage() {
  useScrollable();
  const navigate = useNavigate();
  const { hPad, isMobile } = useHPad();

  function handleClick(href) {
    if (href) {
      navigate(href);
    } else {
      alert("Coming soon");
    }
  }

  return (
    <div style={{ background: C.surfaceDefault, minHeight: "100vh" }}>
      <Header />
      <main style={{ paddingTop: "184px", paddingBottom: "120px" }}>
        <div
          style={{
            padding: `0 ${hPad}`,
            display: "flex",
            flexDirection: "column",
            gap: "80px",
          }}
        >
          {/* Selected Works */}
          <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <SectionHeader label="Selected Works" />
            <div style={{ display: "flex", flexDirection: "column", gap: "60px" }}>
              {SELECTED_WORKS.map((project) => (
                <div
                  key={project.id}
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "60px",
                    alignItems: "flex-start",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClick(project.href)}
                >
                  {/* Content */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "36px",
                      minWidth: 0,
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <MetaText category={project.category} year={project.year} />
                      <p
                        style={{
                          fontFamily: F.display,
                          fontWeight: 600,
                          fontSize: "32px",
                          lineHeight: 1.4,
                          color: C.textPrimary,
                          margin: 0,
                        }}
                      >
                        {project.title}
                      </p>
                    </div>
                    <p
                      style={{
                        fontFamily: F.base,
                        fontWeight: 400,
                        fontSize: "18px",
                        lineHeight: 1.55,
                        color: C.textSecondary,
                        margin: 0,
                      }}
                    >
                      {project.description}
                    </p>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        background: C.surfaceSubtle,
                        padding: "6px 8px",
                        borderRadius: "4px",
                        alignSelf: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: F.base,
                          fontWeight: 500,
                          fontSize: "16px",
                          lineHeight: 1.4,
                          color: C.textSecondary,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Discover More
                      </span>
                      <ArrowIcon />
                    </div>
                  </div>
                  {/* Thumbnail */}
                  <Thumbnail
                    style={{
                      width: isMobile ? "100%" : "600px",
                      height: isMobile ? "auto" : "337px",
                      aspectRatio: isMobile ? "16/9" : undefined,
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* More Works */}
          <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <SectionHeader label="More Works" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                gap: "60px",
              }}
            >
              {MORE_WORKS.map((project) => (
                <div
                  key={project.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClick(project.href)}
                >
                  <Thumbnail style={{ width: "100%", aspectRatio: "16/9" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <p
                      style={{
                        fontFamily: F.display,
                        fontWeight: 600,
                        fontSize: "20px",
                        lineHeight: 1.4,
                        color: C.textPrimary,
                        margin: 0,
                      }}
                    >
                      {project.title}
                    </p>
                    <MetaText category={project.category} year={project.year} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
