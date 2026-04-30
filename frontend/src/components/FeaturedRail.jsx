import React from "react";
import { motion } from "framer-motion";
import { MENU } from "@/data/menu";
import ItemCard from "@/components/ItemCard";

export default function FeaturedRail({ onItemClick }) {
  const featured = MENU.filter((m) => m.featured);

  return (
    <section className="relative py-24 md:py-32" data-testid="featured-section" aria-label="Featured">
      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between mb-12 md:mb-16"
        >
          <div>
            <p className="text-charcoal/50 text-[11px] uppercase tracking-[0.32em] font-body mb-4">
              The Signatures
            </p>
            <h2 className="font-display text-5xl md:text-7xl tracking-[-0.02em] leading-[0.95] text-balance">
              Eight things <span className="italic">we get</span>
              <br />asked about most.
            </h2>
          </div>
          <p className="hidden md:block max-w-xs text-charcoal/70 text-sm leading-relaxed pb-2">
            Built around a hand-formed patty, a freshly fried schnitzel, and
            slow-roasted shawarma off the spit.
          </p>
        </motion.div>
      </div>

      {/* Horizontal rail */}
      <div className="relative">
        <div
          className="flex gap-5 md:gap-7 overflow-x-auto no-scrollbar px-6 md:px-12 pb-6 snap-x snap-mandatory"
          data-testid="featured-rail"
        >
          {featured.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex-shrink-0 w-[78vw] sm:w-[44vw] md:w-[30vw] lg:w-[24vw] snap-start"
            >
              <ItemCard item={item} onClick={() => onItemClick(item)} variant="tall" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
