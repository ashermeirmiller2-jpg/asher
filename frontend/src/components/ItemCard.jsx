import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Single source of truth for dish tags — used by both the featured rail and the
// main menu grid so every card looks identical.
export const itemTags = (item) => {
  const tags = [];
  if (item.featured) tags.push({ label: "Bestseller", color: "munchy" });
  if (item.options && item.options.includes("spice_level")) tags.push({ label: "Spicy", color: "tomato" });
  if (
    item.category === "salads" ||
    item.id === "falafel-pita" ||
    item.id === "falafel-10pc" ||
    item.id === "hummus"
  ) {
    tags.push({ label: "Veg", color: "sage" });
  }
  if (item.id === "shnitzel-baguette") tags.push({ label: "Signature", color: "sun" });
  return tags;
};

export default function ItemCard({ item, onClick, variant = "default" }) {
  const { addItem } = useCart();
  const tags = itemTags(item);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (item.options && item.options.length > 0) {
      onClick();
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    addItem(
      { id: item.id, name: item.name, price: item.price, image: item.image, options: [] },
      { fly: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } }
    );
  };

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  const heightClass =
    variant === "tall" ? "aspect-[3/4]" : variant === "wide" ? "aspect-[4/3]" : "aspect-square";

  return (
    <div className="card-3d-wrap relative w-full h-full">
      {/* Card surface — a single role=button so it's keyboard-accessible and the
          quick-add control below is a real <button> sibling (no nested buttons). */}
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={handleKey}
        data-testid={`item-card-${item.id}`}
        aria-label={`${item.name}, $${item.price.toFixed(2)} — view details`}
        className={`card-3d group relative w-full ${heightClass} cursor-pointer overflow-hidden rounded-[22px] md:rounded-[26px] bg-bone outline-none focus-visible:ring-2 focus-visible:ring-munchy focus-visible:ring-offset-2 focus-visible:ring-offset-ivory shadow-[0_1px_2px_rgba(20,10,6,0.04),0_14px_32px_-18px_rgba(20,10,6,0.22)] hover:shadow-[0_6px_12px_rgba(20,10,6,0.07),0_36px_60px_-22px_rgba(20,10,6,0.32)] transition-shadow`}
      >
        <motion.img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          draggable="false"
          className="absolute inset-0 w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Bottom gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

        {/* Glass sheen on hover */}
        <span className="card-3d-sheen rounded-[22px] md:rounded-[26px]" aria-hidden="true" />

        {/* Tags top-left */}
        {tags.length > 0 && (
          <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 max-w-[68%] z-[2]">
            {tags.map((t) => (
              <span
                key={t.label}
                className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white font-body font-semibold"
                style={{ backgroundColor: `hsl(var(--${t.color}) / 0.96)` }}
              >
                {t.label}
              </span>
            ))}
          </div>
        )}

        {/* Price top-right */}
        <div className="absolute top-3.5 right-3.5 chip-dark rounded-full px-2.5 py-1 text-[12px] font-mono-spaced font-semibold z-[2]">
          ${item.price.toFixed(2)}
        </div>

        {/* Name + description (leave room bottom-right for the add button) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 pr-16 z-[2]">
          <h3 className="font-display text-ivory text-2xl md:text-[26px] tracking-tight leading-[1.04] text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
            {item.name}
          </h3>
          <p className="mt-1 text-ivory/85 text-[12.5px] leading-snug font-body line-clamp-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]">
            {item.description}
          </p>
        </div>
      </div>

      {/* Quick-add — real button, sibling of the card surface */}
      <button
        type="button"
        onClick={handleQuickAdd}
        data-testid={`item-add-${item.id}`}
        aria-label={`Add ${item.name} to cart`}
        className="absolute bottom-4 right-4 z-[3] w-11 h-11 rounded-full bg-ivory text-charcoal flex items-center justify-center magnetic hover:scale-110 hover:bg-munchy hover:text-ivory outline-none focus-visible:ring-2 focus-visible:ring-munchy focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal shadow-[0_8px_20px_-6px_rgba(0,0,0,0.55)] transition-colors"
      >
        <Plus size={18} strokeWidth={2.25} />
      </button>
    </div>
  );
}
