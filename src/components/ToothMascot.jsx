import React from "react";

export function ToothMascot({ className = "w-9 h-9" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Dente sorridente">
      <path
        d="M24 5C16 5 12 10 12 18c0 7 1.6 12 3.2 17 .8 2.6 1.8 5 3 5 1.4 0 1.8-2.2 2.2-5 .3-2 .6-4 2.6-4s2.3 2 2.6 4c.4 2.8.8 5 2.2 5 1.2 0 2.2-2.4 3-5C35.6 30 37 25 37 18 37 10 32 5 24 5Z"
        fill="#ffffff"
        stroke="#1e3a8a"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="19.5" cy="22" r="2" fill="#1e3a8a" />
      <circle cx="28.5" cy="22" r="2" fill="#1e3a8a" />
      <path d="M19 27c1.6 2.2 4 3.2 6.5 3.2S30.4 29.2 32 27" fill="none" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="37.5" cy="11" r="1.6" fill="#fbbf24" />
      <circle cx="11" cy="13" r="1.3" fill="#fbbf24" />
    </svg>
  );
}