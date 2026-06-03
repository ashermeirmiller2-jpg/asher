import React from "react";
import { useReducedMotion } from "framer-motion";

const DEFAULT_ITEMS = [
  "Charcoal-grilled",
  "Schnitzel baguettes",
  "Shawarma off the spit",
  "Hand-formed burgers",
  "Open late",
  "Kosher",
];

// Bold scrolling ticker band. Decorative (aria-hidden); pauses for users who
// prefer reduced motion.
export default function Marquee({ items = DEFAULT_ITEMS, className = "" }) {
  const reduce = useReducedMotion();
  const sequence = [...items, ...items];

  return (
    <div
      className={`relative overflow-hidden bg-charcoal text-ivory py-5 md:py-7 select-none ${className}`}
      aria-hidden="true"
      data-testid="marquee"
    >
      <div className={`flex w-max ${reduce ? "" : "animate-marquee"} will-change-transform`}>
        {sequence.map((label, i) => (
          <span key={i} className="flex items-center flex-shrink-0">
            <span className="font-display italic text-3xl md:text-5xl tracking-tight px-6 md:px-10">
              {label}
            </span>
            <span className="text-munchy text-xl md:text-3xl">&#9670;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
