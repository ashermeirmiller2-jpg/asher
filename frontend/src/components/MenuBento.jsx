import React, { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { CATEGORIES, MENU } from "@/data/menu";
import ItemCard from "@/components/ItemCard";

export default function MenuBento({ onItemClick }) {
  const ref = useRef(null);
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [query, setQuery] = useState("");

  const groupedByCategory = useMemo(() => {
    const out = {};
    CATEGORIES.forEach((c) => {
      out[c.id] = MENU.filter((m) => m.category === c.id);
    });
    return out;
  }, []);

  const filteredByCategory = useMemo(() => {
    if (!query.trim()) return groupedByCategory;
    const q = query.toLowerCase();
    const out = {};
    CATEGORIES.forEach((c) => {
      out[c.id] = groupedByCategory[c.id].filter(
        (m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
      );
    });
    return out;
  }, [groupedByCategory, query]);

  // Scroll-spy
  useEffect(() => {
    const handler = () => {
      let current = CATEGORIES[0].id;
      for (const c of CATEGORIES) {
        const el = document.getElementById(`cat-${c.id}`);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top < 220) current = c.id;
        }
      }
      setActiveCat(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const jumpTo = useCallback((id) => {
    const el = document.getElementById(`cat-${id}`);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 200;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, []);

  const totalResults = Object.values(filteredByCategory).reduce((s, arr) => s + arr.length, 0);

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
          className="mb-10 md:mb-14 max-w-3xl"
        >
          <p className="text-charcoal/50 text-[11px] uppercase tracking-[0.32em] font-body mb-4">
            The Menu
          </p>
          <h2 className="font-display text-6xl md:text-8xl tracking-[-0.025em] leading-[0.9] text-balance">
            Everything we make,
            <br />
            <span className="italic text-munchy">made to order.</span>
          </h2>
          <p className="mt-6 max-w-xl text-charcoal/65 leading-relaxed">
            Tap any dish to pick toppings, sauces, and how you want it cooked. Card
            orders carry a 3% surcharge — Toast policy, not ours.
          </p>
        </motion.div>
      </div>

      {/* STICKY pill nav + search */}
      <div className="sticky top-[88px] z-30 mb-10 md:mb-14" data-testid="menu-sticky-nav">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <div className="glass-strong rounded-full px-3 py-2 flex items-center gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1">
              {CATEGORIES.map((c) => {
                const isActive = activeCat === c.id;
                const count = filteredByCategory[c.id].length;
                return (
                  <button
                    key={c.id}
                    onClick={() => jumpTo(c.id)}
                    data-testid={`menu-nav-${c.id}`}
                    className={`flex-shrink-0 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-body transition-all ${
                      isActive ? "text-ivory" : "text-charcoal/70 hover:bg-charcoal/8"
                    }`}
                    style={isActive ? { backgroundColor: c.hex } : undefined}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-ivory/80" : ""}`}
                      style={!isActive ? { backgroundColor: c.hex } : undefined}
                    />
                    <span>{c.name}</span>
                    <span className={`text-[10px] font-mono-spaced ${isActive ? "opacity-70" : "opacity-45"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 border-l hairline ml-1">
              <Search size={14} strokeWidth={1.75} className="text-charcoal/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes"
                data-testid="menu-search-input"
                className="bg-transparent outline-none text-sm font-body w-36 placeholder:text-charcoal/40"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        {totalResults === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-3xl md:text-5xl mb-3 text-balance">
              Nothing matches "<span className="italic">{query}</span>".
            </p>
            <button
              onClick={() => setQuery("")}
              data-testid="menu-search-clear"
              className="mt-4 inline-flex items-center rounded-full bg-charcoal text-ivory px-5 py-2.5 text-sm"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-20 md:space-y-28">
            {CATEGORIES.map((cat, idx) => {
              const items = filteredByCategory[cat.id];
              if (items.length === 0) return null;
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
        )}
      </div>
    </section>
  );
}

function CategoryBlock({ cat, items, index, onItemClick }) {
  return (
    <div id={`cat-${cat.id}`} data-testid={`menu-cat-${cat.id}`} className="scroll-mt-44">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8 }}
        className="flex items-end justify-between mb-8 md:mb-10"
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block w-8 h-1 rounded-full" style={{ backgroundColor: cat.hex }} />
            <p className="text-charcoal/45 text-[10px] uppercase tracking-[0.32em] font-body font-mono-spaced">
              {String(index + 1).padStart(2, "0")} / {String(CATEGORIES.length).padStart(2, "0")}
            </p>
          </div>
          <h3
            className="font-display text-5xl md:text-7xl tracking-[-0.025em] leading-[0.9]"
            style={{ color: cat.hex }}
          >
            {cat.name}
          </h3>
          <p className="mt-2 text-charcoal/55 italic font-display text-xl md:text-2xl">{cat.tagline}</p>
        </div>
        <span className="text-charcoal/40 text-sm font-mono-spaced hidden sm:block">
          {items.length} items
        </span>
      </motion.div>

      {/* Uniform grid — every card is the size/style of the featured "dishes
          people keep coming back for" cards. */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.6, delay: (i % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <ItemCard item={item} onClick={() => onItemClick(item)} variant="tall" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
