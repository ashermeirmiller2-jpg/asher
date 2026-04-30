import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RESTAURANT } from "@/data/menu";
import { ArrowDown } from "lucide-react";

export default function HeroPinned() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Image scale + fade as user scrolls
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.45, 0.72, 0.92]);

  // Text staggers
  const taglineY = useTransform(scrollYProgress, [0, 1], ["0px", "-160px"]);
  const taglineOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const scrollToMenu = () => {
    const el = document.getElementById("menu");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      className="relative h-[170vh] -mt-px"
      data-testid="hero-section"
      aria-label="Hero"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background image */}
        <motion.div
          style={{ scale: imgScale, y: imgY }}
          className="absolute inset-0 will-change-transform"
        >
          <img
            src={RESTAURANT.banner}
            alt="Munchy's Grill"
            className="w-full h-full object-cover"
            draggable="false"
          />
        </motion.div>

        {/* Overlay - warm tinted */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#3a1a14]/55 to-[#1a0a06]/95" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#c72d3c]/0 via-transparent to-[#f8c42e]/15 mix-blend-overlay" />
        </motion.div>

        {/* Grain */}
        <div className="absolute inset-0 grain pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Top eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="pt-32 md:pt-36 px-8 text-center"
          >
            <p className="text-ivory/80 text-[11px] uppercase tracking-[0.32em] font-body">
              Woodmere &middot; New York &middot; Est. 2018
            </p>
          </motion.div>

          {/* Center tagline */}
          <motion.div
            style={{ y: taglineY, opacity: taglineOpacity }}
            className="flex-1 flex items-center justify-center px-6"
          >
            <div className="text-center max-w-5xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                className="font-display text-ivory text-balance text-[15vw] sm:text-[12vw] md:text-[9vw] leading-[0.92] tracking-[-0.02em]"
                data-testid="hero-headline"
              >
                If you ain't here,
                <br />
                <span className="italic font-light">you ain't munching.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="mt-8 md:mt-10 text-ivory/85 text-base md:text-lg max-w-xl mx-auto text-pretty font-body font-light"
              >
                A kosher grill in Woodmere &mdash; schnitzel, shawarma, burgers,
                and baguettes worth showing up for.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
                className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-3"
              >
                <button
                  onClick={scrollToMenu}
                  data-testid="hero-order-btn"
                  className="group inline-flex items-center gap-2 rounded-full text-charcoal px-7 py-3.5 font-body text-sm font-medium magnetic hover:-translate-y-0.5 shadow-[0_15px_40px_-10px_rgba(248,196,46,0.6)]"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--sun)) 0%, hsl(var(--gold)) 55%, hsl(var(--terracotta)) 100%)",
                  }}
                >
                  Order Now
                  <ArrowDown
                    size={16}
                    className="transition-transform group-hover:translate-y-0.5"
                  />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("story");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  data-testid="hero-story-btn"
                  className="inline-flex items-center gap-2 rounded-full glass-dark text-ivory px-7 py-3.5 font-body text-sm font-medium magnetic hover:-translate-y-0.5"
                >
                  Our Story
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="pb-10 flex flex-col items-center gap-3"
          >
            <span className="text-ivory/60 text-[10px] uppercase tracking-[0.4em] font-body">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-10 bg-ivory/40"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
