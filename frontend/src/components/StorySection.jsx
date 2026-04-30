import React from "react";
import { motion } from "framer-motion";

export default function StorySection() {
  return (
    <section
      id="story"
      className="relative py-32 md:py-44 overflow-hidden"
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
          <div className="aspect-[4/5] overflow-hidden rounded-[28px]">
            <img
              src="https://images.unsplash.com/photo-1676716260600-217008b2e00a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400"
              alt="Inside Munchy's Grill"
              className="w-full h-full object-cover"
              draggable="false"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute -bottom-6 -right-6 glass rounded-2xl px-5 py-4 max-w-[220px]"
          >
            <p className="font-display text-2xl leading-tight">Open till 2:30 AM</p>
            <p className="text-charcoal/60 text-xs mt-1 font-body">Thursdays</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="md:col-span-7"
        >
          <p className="text-charcoal/50 text-[11px] uppercase tracking-[0.32em] font-body mb-6">
            The Story
          </p>
          <h2 className="font-display text-5xl md:text-7xl tracking-[-0.02em] leading-[0.96] text-balance">
            A neighborhood grill,
            <br />
            <span className="italic">obsessively</span> made.
          </h2>
          <div className="mt-8 md:mt-10 max-w-2xl space-y-5 text-charcoal/75 leading-relaxed font-body text-base md:text-lg">
            <p>
              Munchy's started with one idea: kosher food shouldn't compromise.
              Not on flavor, not on craft, not on the moment a baguette gets
              pulled from the oven.
            </p>
            <p>
              We grind the beef. We bread the schnitzel. We marinate the
              shawarma overnight and stack it on the spit ourselves. Every
              sandwich, every burger, every wrap is built to order — exactly the
              way you ask for it.
            </p>
            <p>
              Twelve Irving Place. Late hours. No shortcuts.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 md:gap-10 max-w-md">
            {[
              { k: "Est.", v: "2018" },
              { k: "Items", v: "40+" },
              { k: "Open", v: "Late" },
            ].map((s) => (
              <div key={s.k}>
                <p className="font-display text-3xl md:text-4xl">{s.v}</p>
                <p className="text-charcoal/50 text-[10px] uppercase tracking-[0.28em] mt-1 font-body">
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
