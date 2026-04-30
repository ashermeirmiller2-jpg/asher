import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { TOPPING_GROUPS } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function ItemModal({ item, onClose }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState({});
  const [instructions, setInstructions] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = () => setIsMobile(window.innerWidth < 768);
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  useEffect(() => {
    if (!item) return;
    setQuantity(1);
    setSelections({});
    setInstructions("");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [item]);

  const optionGroups = useMemo(
    () => (item?.options ? item.options.map((g) => ({ key: g, ...TOPPING_GROUPS[g] })) : []),
    [item]
  );

  if (!item) return null;

  const toggleOption = (groupKey, value, type, max) => {
    setSelections((prev) => {
      const current = prev[groupKey] || [];
      if (type === "single") return { ...prev, [groupKey]: [value] };
      const has = current.includes(value);
      if (has) return { ...prev, [groupKey]: current.filter((v) => v !== value) };
      if (max && current.length >= max) {
        toast.error(`Up to ${max} ${TOPPING_GROUPS[groupKey].name.toLowerCase()}`);
        return prev;
      }
      return { ...prev, [groupKey]: [...current, value] };
    });
  };

  const handleAdd = () => {
    const flatOptions = Object.entries(selections).flatMap(([groupKey, values]) =>
      values.map((v) => ({ group: TOPPING_GROUPS[groupKey].name, value: v }))
    );
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      options: flatOptions,
      instructions: instructions.trim() || undefined,
      quantity,
    });
    toast.success(`Added ${quantity} × ${item.name}`);
    onClose();
  };

  const Backdrop = (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-black/55"
      data-testid="item-modal-backdrop"
    />
  );

  const isAside = !isMobile;

  return (
    <AnimatePresence>
      {Backdrop}
      <motion.div
        key="panel"
        initial={isAside ? { x: "100%" } : { y: "100%" }}
        animate={isAside ? { x: 0 } : { y: 0 }}
        exit={isAside ? { x: "100%" } : { y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 36 }}
        className={`fixed z-[81] bg-ivory shadow-2xl flex flex-col ${
          isAside
            ? "top-0 right-0 h-full w-full max-w-[640px]"
            : "bottom-0 left-0 right-0 max-h-[92vh] rounded-t-[28px]"
        }`}
        data-testid="item-modal"
        role="dialog"
        aria-modal="true"
      >
        {/* Header image */}
        <div className="relative aspect-[16/10] flex-shrink-0">
          <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          <button
            onClick={onClose}
            data-testid="item-modal-close"
            className="absolute top-5 right-5 w-10 h-10 rounded-full glass flex items-center justify-center text-charcoal hover:scale-105 transition-transform"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
          <div className="absolute bottom-5 left-6 right-6">
            <p className="text-ivory/75 text-[10px] uppercase tracking-[0.32em] font-body mb-2">
              Customize
            </p>
            <h2 className="font-display text-ivory text-4xl md:text-5xl tracking-[-0.02em] leading-tight text-balance">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 md:py-8 space-y-7">
          <p className="text-charcoal/75 leading-relaxed">{item.description}</p>

          {optionGroups.map((g) => (
            <div key={g.key} data-testid={`option-group-${g.key}`}>
              <div className="flex items-baseline justify-between mb-3">
                <h4 className="font-display text-2xl tracking-tight">{g.name}</h4>
                <span className="text-charcoal/40 text-xs uppercase tracking-[0.24em] font-body">
                  {g.type === "single" ? "Pick one" : g.max ? `Up to ${g.max}` : "Any"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.options.map((o) => {
                  const active = (selections[g.key] || []).includes(o);
                  return (
                    <button
                      key={o}
                      onClick={() => toggleOption(g.key, o, g.type, g.max)}
                      data-testid={`option-${g.key}-${o.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`rounded-full px-4 py-2 text-sm font-body transition-all border ${
                        active
                          ? "bg-charcoal text-ivory border-charcoal"
                          : "bg-bone text-charcoal/80 border-charcoal/10 hover:border-charcoal/30"
                      }`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div>
            <h4 className="font-display text-2xl tracking-tight mb-3">Special instructions</h4>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Allergies, prep notes, anything else..."
              data-testid="item-instructions-input"
              className="w-full rounded-2xl border border-charcoal/10 bg-bone px-4 py-3 text-sm font-body outline-none focus:border-charcoal/40 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer add bar */}
        <div className="flex-shrink-0 border-t border-charcoal/8 p-5 md:p-6 bg-ivory/95 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 rounded-full bg-bone px-1 py-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                data-testid="item-qty-minus"
                className="w-9 h-9 rounded-full bg-charcoal text-ivory flex items-center justify-center hover:bg-munchy transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-mono-spaced" data-testid="item-qty-value">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                data-testid="item-qty-plus"
                className="w-9 h-9 rounded-full bg-charcoal text-ivory flex items-center justify-center hover:bg-munchy transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              data-testid="item-add-to-cart-btn"
              className="flex-1 inline-flex items-center justify-between rounded-full bg-charcoal text-ivory px-6 py-3.5 font-body text-sm font-medium magnetic hover:bg-munchy hover:-translate-y-0.5"
            >
              <span>Add to cart</span>
              <span className="font-mono-spaced">
                ${(item.price * quantity).toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
