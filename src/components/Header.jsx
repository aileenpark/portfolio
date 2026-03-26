import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

// NOTE: This Figma asset URL expires in 7 days — replace with a permanent SVG file.
const NP_LOGO =
  "https://www.figma.com/api/mcp/asset/fa6d1b07-b8d1-4df4-b8da-02d8b9302e74";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo" aria-label="Home">
          <img src={NP_LOGO} alt="NP" width={36} height={36} />
        </Link>

        <nav className="header-nav" aria-label="Main navigation">
          <Link to="/works" className="header-nav-item">Works</Link>
          <a href="#about" className="header-nav-item">About</a>
          <a href="#resume" className="header-nav-item">Résumé</a>
        </nav>

        <button
          className="header-hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen && (
        <nav className="header-mobile-menu" aria-label="Mobile navigation">
          <Link to="/works" className="header-mobile-nav-item" onClick={() => setMenuOpen(false)}>Works</Link>
          <a href="#about" className="header-mobile-nav-item" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#resume" className="header-mobile-nav-item" onClick={() => setMenuOpen(false)}>Résumé</a>
        </nav>
      )}
    </header>
  );
}

function HamburgerIcon({ open }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line
            x1="4" y1="4" x2="20" y2="20"
            stroke="#121212" strokeWidth={1.5} strokeLinecap="round"
          />
          <line
            x1="20" y1="4" x2="4" y2="20"
            stroke="#121212" strokeWidth={1.5} strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <line
            x1="4" y1="7" x2="20" y2="7"
            stroke="#121212" strokeWidth={1.5} strokeLinecap="round"
          />
          <line
            x1="4" y1="12" x2="20" y2="12"
            stroke="#121212" strokeWidth={1.5} strokeLinecap="round"
          />
          <line
            x1="4" y1="17" x2="20" y2="17"
            stroke="#121212" strokeWidth={1.5} strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
