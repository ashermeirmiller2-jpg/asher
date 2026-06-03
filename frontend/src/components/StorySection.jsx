import React from "react";
import { motion } from "framer-motion";
import { RESTAURANT } from "@/data/menu";

export default function StorySection() {
  return (
    <section
      id="story"
      className="relative py-32 md:py-44 overflow-hidden bg-charcoal text-ivory"
      data-testid="story-section"
      aria-label="Our Story"
    >
      <div className="px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-5 relative"
        >
          <div className="aspect-[4/5] overflow-hidden rounded-[24px]">
            <img
              src={RESTAURANT.banner}
              alt="Inside Munchy's Grill, Woodmere"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              draggable="false"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute -bottom-5 -right-5 chip-dark rounded-2xl px-5 py-4 max-w-[230px]"
          >
            <p className="font-display text-2xl leading-tight text-ivory">Open till 2:30 AM</p>
            <p className="text-ivory/65 text-xs mt-1 font-body">Thursday nights</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="md:col-span-7"
        >
          <p className="text-gold text-[11px] uppercase tracking-[0.32em] font-body mb-6">
            The story
          </p>
          <h2 className="font-display text-6xl md:text-8xl tracking-[-0.025em] leading-[0.9] text-balance">
            A neighborhood grill
            <br />
            in <span className="italic text-munchy">Woodmere</span>.
          </h2>
          <div className="mt-8 md:mt-10 max-w-2xl space-y-5 text-ivory/75 leading-relaxed font-body text-base md:text-lg">
            <p>
              Munchy's opened on Irving Place in 2018 with one rule: kosher food
              shouldn't compromise. Not on flavor, not on craft, not on the moment
              the schnitzel comes out of the fryer.
            </p>
            <p>
              We grind the beef. We bread the schnitzel. We marinate the shawarma
              overnight and stack it on the spit ourselves. Every sandwich, every
              burger, every wrap is built when you order it.
            </p>
            <p>
              Twelve Irving Place. Late nights. No shortcuts.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 md:gap-10 max-w-md">
            {[
              { k: "Est.", v: "2018" },
              { k: "Items", v: "40+" },
              { k: "Open", v: "Late" },
            ].map((s) => (
              <div key={s.k}>
                <p className="font-display text-4xl md:text-5xl text-ivory">{s.v}</p>
                <p className="text-ivory/50 text-[10px] uppercase tracking-[0.28em] mt-1 font-body">
                  {s.k}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
