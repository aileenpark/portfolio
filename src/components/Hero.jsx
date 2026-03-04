import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">

      {/* Intro text — bottom right */}
      <div className="hero-intro">
        <p>I'm Nayun Park — A product designer connects</p>
        <p>systems, stories, creative energy and coherence.</p>
      </div>

      {/* Headline SVG — fills viewport width, height proportional to viewBox */}
      <svg
        className="hero-headline"
        viewBox="0 0 1920 103"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Designed to function"
      >
        <text
          y="90"
          fontFamily="'Roboto', sans-serif"
          fontWeight="900"
          fill="#121212"
          textLength="1920"
          lengthAdjust="spacingAndGlyphs"
        >
          DESIGNED TO FUNCTION
        </text>
      </svg>

      {/* Copyright — bottom left */}
      <p className="hero-copyright">© Nayun Park. All rights reserved.</p>

    </section>
  );
}
