import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";

// Apple iPhone product-page style scroll scene.
// A circular-masked burger pins to viewport, rotates + scales as you scroll,
// while editorial captions fade in/out across four "chapters".

const BURGER_IMG =
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=85&w=1600";

const CHAPTERS = [
  { range: [0.02, 0.22], k: "Eight ounces.", v: "Hand-formed every morning. No filler." },
  { range: [0.27, 0.47], k: "Charcoal-grilled.", v: "Open flame. Smoke-kissed crust." },
  { range: [0.52, 0.72], k: "Toasted bun.", v: "Sesame on top. Butter underneath." },
  { range: [0.77, 0.95], k: "Yours, in ten.", v: "Walk in. Order. Walk out fed." },
];

// Four background color layers - we cross-fade them via opacity (numeric)
// instead of interpolating color strings (which has Web Animations API issues).
const BG_LAYERS = [
  { color: "#0e0a09", peak: 0.0 },
  { color: "#3a1a14", peak: 0.33 },
  { color: "#5b2014", peak: 0.66 },
  { color: "#1e1310", peak: 1.0 },
];

const HALO_LAYERS = [
  { color: "rgba(248,196,46,0.55)", peak: 0.0 },
  { color: "rgba(217,70,42,0.55)", peak: 0.33 },
  { color: "rgba(248,196,46,0.45)", peak: 0.66 },
  { color: "rgba(217,117,82,0.4)", peak: 1.0 },
];

export default function BurgerScrollScene({ onOrderClick }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Continuous burger transforms (numeric, safe). Calmed for reduced-motion users.
  const rotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 380]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [0.7, 1.35, 1.05]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [40, -10, 30]);
  const haloScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1.6, 1.1]);
  const haloOpacityBase = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0, 0.8, 0.6, 0.2]);

  // Final CTA appears in last chapter
  const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.97], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.85, 0.97], [30, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[420vh]"
      data-testid="burger-scroll-scene"
      aria-label="The burger, in detail"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0e0a09]">
        {/* Stacked background color layers cross-fading via opacity */}
        {BG_LAYERS.map((layer, i) => (
          <BgLayer key={i} layer={layer} progress={scrollYProgress} />
        ))}

        {/* Grain */}
        <div className="absolute inset-0 grain pointer-events-none" />

        {/* Section eyebrow top */}
        <div className="absolute top-28 md:top-32 left-0 right-0 z-20 text-center pointer-events-none">
          <p className="text-ivory/55 text-[10px] uppercase tracking-[0.4em] font-body">
            The Burger &middot; In Four Acts
          </p>
        </div>

        {/* Halo behind burger - stacked color layers */}
        <motion.div
          style={{ scale: haloScale, opacity: haloOpacityBase }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] rounded-full blur-3xl"
          aria-hidden="true"
        >
          {HALO_LAYERS.map((layer, i) => (
            <HaloLayer key={i} layer={layer} progress={scrollYProgress} />
          ))}
        </motion.div>

        {/* The burger - circular masked */}
        <motion.div
          style={{ rotate, scale, y }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
        >
          <div
            className="relative rounded-full overflow-hidden ring-1 ring-white/10"
            style={{
              width: "min(58vmin, 600px)",
              height: "min(58vmin, 600px)",
              boxShadow:
                "0 60px 120px -30px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            <img
              src={BURGER_IMG}
              alt="Munchy's burger"
              className="w-full h-full object-cover"
              decoding="async"
              draggable="false"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.18), transparent 55%)",
              }}
            />
          </div>
        </motion.div>

        {/* Captions */}
        {CHAPTERS.map((c, i) => (
          <Chapter key={i} chapter={c} progress={scrollYProgress} index={i} />
        ))}

        {/* Final CTA */}
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="absolute inset-x-0 bottom-24 md:bottom-28 z-20 flex justify-center"
        >
          <button
            onClick={onOrderClick}
            data-testid="burger-scene-order-btn"
            className="group inline-flex items-center gap-2 rounded-full bg-munchy text-ivory px-7 py-3.5 font-body text-sm font-medium magnetic hover:-translate-y-0.5 hover:bg-ivory hover:text-charcoal transition-colors shadow-[0_20px_50px_-10px_rgba(199,45,60,0.45)]"
          >
            Build your burger
            <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
          </button>
        </motion.div>

        {/* Scroll progress dots */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
          {CHAPTERS.map((c, i) => (
            <ProgressDot key={i} chapter={c} progress={scrollYProgress} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BgLayer({ layer, progress }) {
  // Layer is fully visible at peak, fades around it
  const opacity = useTransform(
    progress,
    [Math.max(layer.peak - 0.34, 0), layer.peak, Math.min(layer.peak + 0.34, 1)],
    [0, 1, 0]
  );
  return (
    <motion.div
      style={{ opacity, backgroundColor: layer.color }}
      className="absolute inset-0"
      aria-hidden="true"
    />
  );
}

function HaloLayer({ layer, progress }) {
  const opacity = useTransform(
    progress,
    [Math.max(layer.peak - 0.34, 0), layer.peak, Math.min(layer.peak + 0.34, 1)],
    [0, 1, 0]
  );
  return (
    <motion.div
      style={{ opacity, backgroundColor: layer.color }}
      className="absolute inset-0 rounded-full"
      aria-hidden="true"
    />
  );
}

function Chapter({ chapter, progress, index }) {
  const [a, b] = chapter.range;
  const peak = (a + b) / 2;

  const opacity = useTransform(
    progress,
    [Math.max(a - 0.05, 0), a, b, Math.min(b + 0.05, 1)],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [a, peak, b], [40, 0, -40]);

  const align = index % 2 === 0 ? "items-start text-left" : "items-end text-right";
  const padding = index % 2 === 0 ? "pl-8 md:pl-20" : "pr-8 md:pr-20";

  const words = chapter.k.split(" ");

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-x-0 bottom-[18%] md:bottom-[22%] z-20 flex ${align} ${padding} pointer-events-none`}
    >
      <div className="max-w-2xl">
        <p className="text-ivory/45 text-[10px] uppercase tracking-[0.4em] mb-3 font-body font-mono-spaced">
          0{index + 1} &mdash; chapter
        </p>
        <h3 className="font-display text-ivory text-[clamp(48px,8vw,124px)] tracking-[-0.02em] leading-[0.92] text-balance">
          {words.map((w, i) => (
            <span key={i} className={i === words.length - 1 ? "italic font-light" : ""}>
              {w}
              {i !== words.length - 1 ? " " : ""}
            </span>
          ))}
        </h3>
        <p className="mt-4 md:mt-5 text-ivory/70 text-base md:text-lg font-body max-w-md">
          {chapter.v}
        </p>
      </div>
    </motion.div>
  );
}

function ProgressDot({ chapter, progress }) {
  const [a, b] = chapter.range;
  const peak = (a + b) / 2;
  const scale = useTransform(
    progress,
    [Math.max(a - 0.05, 0), peak, Math.min(b + 0.05, 1)],
    [1, 1.6, 1]
  );
  const opacity = useTransform(
    progress,
    [Math.max(a - 0.05, 0), peak, Math.min(b + 0.05, 1)],
    [0.3, 1, 0.3]
  );
  return (
    <motion.div style={{ scale, opacity }} className="relative">
      <span className="block w-1.5 h-1.5 rounded-full bg-ivory" />
    </motion.div>
  );
}
