import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

const itemTags = (item) => {
  const tags = [];
  if (item.featured) tags.push({ label: "Bestseller", color: "munchy" });
  if (item.options && item.options.includes("spice_level")) tags.push({ label: "Spicy", color: "tomato" });
  if (item.id === "shnitzel-baguette") tags.push({ label: "Signature", color: "sun" });
  return tags;
};

export default function ItemCard({ item, onClick, variant = "default" }) {
  const { addItem } = useCart();
  const tags = itemTags(item);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    if (item.options && item.options.length > 0) {
      onClick();
      return;
    }
    addItem(
      { id: item.id, name: item.name, price: item.price, image: item.image, options: [] },
      { fly: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } }
    );
  };

  const heightClass =
    variant === "tall" ? "aspect-[3/4]" : variant === "wide" ? "aspect-[4/3]" : "aspect-square";

  return (
    <div className="card-3d-wrap w-full">
      <button
        type="button"
        onClick={onClick}
        data-testid={`item-card-${item.id}`}
        className="card-3d group relative w-full text-left overflow-hidden rounded-[24px] bg-bone shadow-card hover:shadow-card-hover transition-shadow duration-600"
      >
        <div className={`relative ${heightClass} overflow-hidden`}>
          <motion.img
            src={item.image}
            alt={item.name}
            loading="lazy"
            draggable="false"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

          {/* Glass sheen on hover */}
          <span className="card-3d-sheen rounded-[24px]" aria-hidden="true" />

          {/* Top left tags */}
          {tags.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 max-w-[60%] z-[2]">
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

          {/* Top right price tag - solid dark, readable */}
          <div className="absolute top-4 right-4 chip-dark rounded-full px-3 py-1 text-[12.5px] font-mono-spaced z-[2]">
            ${item.price.toFixed(2)}
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex items-end justify-between gap-3 z-[2]">
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-ivory text-2xl md:text-[28px] tracking-tight leading-tight text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                {item.name}
              </h3>
              <p className="mt-1.5 text-ivory/80 text-[13px] leading-snug font-body line-clamp-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                {item.description}
              </p>
            </div>
            <span
              onClick={handleQuickAdd}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleQuickAdd(e);
              }}
              data-testid={`item-add-${item.id}`}
              className="flex-shrink-0 w-11 h-11 rounded-full bg-ivory text-charcoal flex items-center justify-center magnetic hover:scale-110 hover:bg-munchy hover:text-ivory cursor-pointer shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)]"
              aria-label={`Add ${item.name}`}
            >
              <Plus size={18} strokeWidth={2} />
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
