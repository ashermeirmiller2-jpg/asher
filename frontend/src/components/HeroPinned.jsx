import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";
import { RESTAURANT } from "@/data/menu";

// Hero: real Munchy's interior on the right (the actual restaurant, not stock),
// with the headline + brand block on the left. No floating serif on top of busy
// interior. No yellow/orange gradient buttons.

const HERO_FOOD = RESTAURANT.banner;

export default function HeroPinned() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.08]);
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0px", "-80px"]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const scrollToMenu = () => {
    const el = document.getElementById("menu");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      className="relative h-[160vh] -mt-px"
      data-testid="hero-section"
      aria-label="Hero"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ivory">
        <div className="relative h-full w-full grid grid-cols-1 md:grid-cols-12">
          {/* LEFT — copy block */}
          <motion.div
            style={{ y: headlineY, opacity: headlineOpacity }}
            className="md:col-span-7 relative z-10 flex flex-col justify-end md:justify-center px-6 md:px-12 lg:px-20 pb-20 md:pb-0 pt-32 md:pt-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-2 mb-6 text-charcoal/55 text-[11px] uppercase tracking-[0.32em] font-body"
            >
              <span className="inline-block w-6 h-px bg-munchy" />
              Kosher grill · Woodmere, NY
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              className="font-display text-charcoal text-balance text-[14vw] sm:text-[10vw] md:text-[7.4vw] leading-[0.92] tracking-[-0.02em] max-w-[14ch]"
              data-testid="hero-headline"
            >
              If you ain't here,
              <br />
              <span className="italic font-light text-munchy">you ain't munching.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.85 }}
              className="mt-7 md:mt-9 text-charcoal/70 text-base md:text-lg max-w-md font-body leading-relaxed"
            >
              Schnitzel pulled hot from the fryer. Shawarma off the spit. Burgers
              hand-formed every morning. Open till 2:30 AM Thursdays.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.05 }}
              className="mt-9 md:mt-11 flex flex-wrap items-center gap-3"
            >
              <button
                onClick={scrollToMenu}
                data-testid="hero-order-btn"
                className="group inline-flex items-center gap-2 rounded-full bg-munchy text-ivory px-7 py-3.5 font-body text-sm font-medium magnetic hover:-translate-y-0.5 hover:bg-charcoal transition-colors shadow-[0_18px_40px_-14px_rgba(199,45,60,0.55)]"
              >
                Order pickup
                <ArrowDown
                  size={16}
                  className="transition-transform group-hover:translate-y-0.5"
                />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("visit");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                data-testid="hero-story-btn"
                className="inline-flex items-center gap-2 rounded-full text-charcoal px-6 py-3.5 font-body text-sm font-medium hover:bg-charcoal/5 transition-colors"
              >
                <MapPin size={15} strokeWidth={1.75} />
                12 Irving Place
              </button>
            </motion.div>

            {/* Tiny meta strip - asymmetric editorial detail */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="mt-12 md:mt-16 hidden md:flex items-center gap-8 text-charcoal/55 text-[11px] uppercase tracking-[0.28em] font-body font-mono-spaced"
            >
              <span>Est. 2018</span>
              <span className="w-px h-3 bg-charcoal/20" />
              <span>40+ items</span>
              <span className="w-px h-3 bg-charcoal/20" />
              <span>Open late</span>
            </motion.div>
          </motion.div>

          {/* RIGHT — single hero food shot */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ scale: imgScale }}
            className="md:col-span-5 relative h-[55vh] md:h-screen overflow-hidden"
          >
            <img
              src={HERO_FOOD}
              alt="Munchy's signature schnitzel"
              className="absolute inset-0 w-full h-full object-cover"
              draggable="false"
            />
            {/* Soft fade into the page on left edge */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-ivory to-transparent pointer-events-none hidden md:block" />
            {/* Editorial caption bottom-right */}
            <div className="absolute bottom-6 right-6 chip-dark rounded-full px-4 py-1.5 text-[10.5px] uppercase tracking-[0.28em] font-body">
              Inside · 12 Irving Place
            </div>
          </motion.div>
        </div>

        {/* Bottom scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-charcoal/45 text-[9.5px] uppercase tracking-[0.4em] font-body">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-7 bg-charcoal/30"
          />
        </motion.div>
      </div>
    </section>
  );
}
