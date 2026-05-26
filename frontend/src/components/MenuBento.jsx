import React, { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { CATEGORIES, MENU } from "@/data/menu";

const itemTags = (item) => {
  const tags = [];
  if (item.featured) tags.push({ label: "Bestseller", color: "munchy" });
  if (item.options && item.options.includes("spice_level")) tags.push({ label: "Spicy", color: "tomato" });
  if (item.category === "salads" || item.id === "falafel-pita" || item.id === "falafel-10pc" || item.id === "hummus") {
    tags.push({ label: "Veg", color: "sage" });
  }
  if (item.id === "shnitzel-baguette") tags.push({ label: "Signature", color: "sun" });
  return tags;
};

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
          <h2 className="font-display text-5xl md:text-7xl tracking-[-0.02em] leading-[0.95] text-balance">
            Everything we make,
            <br />
            <span className="italic">made to order.</span>
          </h2>
          <p className="mt-6 max-w-xl text-charcoal/65 leading-relaxed">
            Tap a dish to pick toppings, sauces, and how you want it cooked. Card
            orders carry a 3% surcharge — Toast policy, not ours.
          </p>
        </motion.div>
      </div>

      {/* STICKY pill nav + search */}
      <div className="sticky top-[88px] z-30 mb-10 md:mb-14" data-testid="menu-sticky-nav">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <div className="glass rounded-full px-3 py-2 flex items-center gap-2">
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
                      isActive
                        ? "text-ivory"
                        : "text-charcoal/70 hover:bg-charcoal/8"
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
          <div className="space-y-24 md:space-y-32">
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
            <span
              className="inline-block w-8 h-1 rounded-full"
              style={{ backgroundColor: cat.hex }}
            />
            <p className="text-charcoal/45 text-[10px] uppercase tracking-[0.32em] font-body font-mono-spaced">
              {String(index + 1).padStart(2, "0")} / {String(CATEGORIES.length).padStart(2, "0")}
            </p>
          </div>
          <h3
            className="font-display text-4xl md:text-6xl tracking-[-0.02em] leading-[0.95]"
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

      {/* Uniform grid — all items as equal-sized boxes, always visible */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.7, delay: (i % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-[4/3]"
          >
            <ItemCardFull item={item} onClick={() => onItemClick(item)} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ItemCardFull({ item, onClick }) {
  const tags = itemTags(item);
  return (
    <div className="card-3d-wrap h-full w-full">
      <button
        type="button"
        onClick={onClick}
        data-testid={`menu-item-${item.id}`}
        className="card-3d group relative w-full h-full overflow-hidden rounded-[20px] md:rounded-[24px] bg-bone text-left"
        style={{
          boxShadow:
            "0 1px 2px rgba(20,10,6,0.04), 0 12px 28px -18px rgba(20,10,6,0.18)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            "0 4px 8px rgba(20,10,6,0.06), 0 30px 50px -20px rgba(20,10,6,0.28)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow =
            "0 1px 2px rgba(20,10,6,0.04), 0 12px 28px -18px rgba(20,10,6,0.18)";
        }}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Glass sheen on hover */}
        <span className="card-3d-sheen rounded-[20px] md:rounded-[24px]" aria-hidden="true" />

        {/* Tags top-left */}
        {tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[70%] z-[2]">
            {tags.map((t) => (
              <span
                key={t.label}
                className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white font-body font-medium"
                style={{ backgroundColor: `hsl(var(--${t.color}) / 0.95)` }}
              >
                {t.label}
              </span>
            ))}
          </div>
        )}

        {/* Price chip top-right - solid dark, no colored border */}
        <div className="absolute top-3 right-3 chip-dark rounded-full px-2.5 py-1 text-[11.5px] font-mono-spaced z-[2]">
          ${item.price.toFixed(2)}
        </div>

        {/* Hover affordance */}
        <div className="absolute right-4 bottom-[88px] md:bottom-[100px] chip-dark rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-body z-[2]">
          Customize
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-[2]">
          <h4 className="font-display text-ivory text-xl md:text-2xl tracking-tight leading-tight text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {item.name}
          </h4>
          <p className="mt-1 text-ivory/80 text-xs md:text-sm font-body line-clamp-2 max-w-md drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            {item.description}
          </p>
        </div>
      </button>
    </div>
  );
}
