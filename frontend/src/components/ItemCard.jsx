import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ItemCard({ item, onClick, variant = "default" }) {
  const { addItem } = useCart();

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
    <button
      type="button"
      onClick={onClick}
      data-testid={`item-card-${item.id}`}
      className="group relative w-full text-left overflow-hidden rounded-[28px] bg-bone shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

        {/* Top right price tag */}
        <div className="absolute top-4 right-4 glass rounded-full px-3 py-1.5 text-[13px] font-mono-spaced text-charcoal">
          ${item.price.toFixed(2)}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-ivory text-2xl md:text-3xl tracking-tight leading-tight text-balance">
              {item.name}
            </h3>
            <p className="mt-1.5 text-ivory/75 text-[13px] leading-snug font-body line-clamp-2">
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
            className="flex-shrink-0 w-11 h-11 rounded-full bg-ivory text-charcoal flex items-center justify-center magnetic hover:scale-110 hover:bg-munchy hover:text-ivory cursor-pointer"
            aria-label={`Add ${item.name}`}
          >
            <Plus size={18} strokeWidth={2} />
          </span>
        </div>
      </div>
    </button>
  );
}
