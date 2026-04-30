import React, { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CATEGORIES, MENU } from "@/data/menu";
import ItemCard from "@/components/ItemCard";

export default function MenuBento({ onItemClick }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const groupedByCategory = useMemo(() => {
    const out = {};
    CATEGORIES.forEach((c) => {
      out[c.id] = MENU.filter((m) => m.category === c.id);
    });
    return out;
  }, []);

  return (
    <section
      ref={ref}
      id="menu"
      className="relative py-24 md:py-32"
      data-testid="menu-section"
      aria-label="Menu"
    >
      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-24 max-w-3xl"
        >
          <p className="text-charcoal/50 text-[11px] uppercase tracking-[0.32em] font-body mb-4">
            The Menu
          </p>
          <h2 className="font-display text-5xl md:text-7xl tracking-[-0.02em] leading-[0.95] text-balance">
            Every category,
            <br />
            <span className="italic">every craving.</span>
          </h2>
          <p className="mt-6 max-w-xl text-charcoal/70 leading-relaxed">
            Tap any dish to customize toppings, sauces, and special requests.
            Card orders carry a 3% surcharge per Toast policy.
          </p>
        </motion.div>

        {/* Sticky category-morph headline (wow moment 10b) */}
        <CategoryMorph progress={scrollYProgress} />

        {/* Bento per category */}
        <div className="space-y-28 md:space-y-40">
          {CATEGORIES.map((cat, idx) => {
            const items = groupedByCategory[cat.id];
            return (
              <CategoryBlock
                key={cat.id}
                cat={cat}
                items={items}
                index={idx}
                onItemClick={onItemClick}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CategoryMorph({ progress }) {
  // Maps scroll progress through 8 categories
  const totalCats = CATEGORIES.length;
  const activeIndex = useTransform(progress, (p) => {
    const v = Math.min(Math.max(p, 0), 0.999);
    return Math.floor(v * totalCats);
  });

  return (
    <div className="sticky top-24 z-10 -mb-24 md:-mb-32 pointer-events-none">
      <div className="overflow-hidden h-[68px] md:h-[88px] flex items-end">
        <div className="flex flex-col">
          {CATEGORIES.map((c, i) => (
            <CategoryWord key={c.id} cat={c} index={i} activeIndex={activeIndex} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryWord({ cat, index, activeIndex }) {
  const opacity = useTransform(activeIndex, (v) => (v === index ? 1 : 0.0));
  const y = useTransform(activeIndex, (v) => `${(index - v) * 100}%`);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute font-display text-[clamp(40px,7vw,84px)] tracking-[-0.02em] leading-none text-charcoal/85"
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="italic font-light text-charcoal/40">{String(index + 1).padStart(2, "0")}</span>
      <span className="ml-4">{cat.name}</span>
    </motion.div>
  );
}

function CategoryBlock({ cat, items, index, onItemClick }) {
  // Bento layout based on count
  return (
    <div data-testid={`menu-cat-${cat.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8 }}
        className="flex items-end justify-between mb-8 md:mb-12"
      >
        <div>
          <p className="text-charcoal/40 text-[10px] uppercase tracking-[0.32em] font-body mb-3 font-mono-spaced">
            {String(index + 1).padStart(2, "0")} / {String(8).padStart(2, "0")}
          </p>
          <h3 className="font-display text-4xl md:text-6xl tracking-[-0.02em] leading-[0.95]">
            {cat.name}
          </h3>
          <p className="mt-2 text-charcoal/60 italic font-display text-xl md:text-2xl">{cat.tagline}</p>
        </div>
        <span className="text-charcoal/40 text-sm font-mono-spaced hidden sm:block">
          {items.length} items
        </span>
      </motion.div>

      <BentoGrid items={items} onItemClick={onItemClick} />
    </div>
  );
}

function BentoGrid({ items, onItemClick }) {
  // Asymmetric pattern: every 4 items mix of tall + wide
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[220px]">
      {items.map((item, i) => {
        // pattern: 0 = wide(3x2), 1 = tall(2x2), 2 = square(2x2), 3 = square(3x2)
        let span = "col-span-1 md:col-span-2 row-span-2";
        const m = i % 6;
        if (m === 0) span = "col-span-2 md:col-span-3 row-span-2";
        else if (m === 1) span = "col-span-2 md:col-span-3 row-span-2";
        else if (m === 2) span = "col-span-1 md:col-span-2 row-span-2";
        else if (m === 3) span = "col-span-1 md:col-span-2 row-span-2";
        else if (m === 4) span = "col-span-2 md:col-span-2 row-span-2";
        else span = "col-span-2 md:col-span-4 row-span-2";

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.7, delay: (i % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className={span}
          >
            <div className="h-full">
              <ItemCardFull item={item} onClick={() => onItemClick(item)} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function ItemCardFull({ item, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={`menu-item-${item.id}`}
      className="group relative w-full h-full overflow-hidden rounded-[24px] md:rounded-[28px] bg-bone shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] transition-all duration-700 text-left"
    >
      <motion.img
        src={item.image}
        alt={item.name}
        loading="lazy"
        draggable="false"
        className="absolute inset-0 w-full h-full object-cover"
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute top-3 right-3 glass rounded-full px-3 py-1 text-xs font-mono-spaced text-charcoal">
        ${item.price.toFixed(2)}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        <h4 className="font-display text-ivory text-xl md:text-2xl tracking-tight leading-tight text-balance">
          {item.name}
        </h4>
        <p className="mt-1 text-ivory/70 text-xs md:text-sm font-body line-clamp-2 max-w-md">
          {item.description}
        </p>
      </div>
    </button>
  );
}
