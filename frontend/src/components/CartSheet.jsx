import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartSheet() {
  const { open, setOpen, items, updateQuantity, removeItem, totals, setCheckoutOpen } = useCart();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] bg-black/55"
            data-testid="cart-backdrop"
          />
          <motion.aside
            key="cart-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed bottom-0 left-0 right-0 z-[71] bg-ivory rounded-t-[28px] shadow-2xl max-h-[92vh] flex flex-col"
            data-testid="cart-sheet"
            role="dialog"
            aria-modal="true"
          >
            {/* Drag indicator */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-12 h-1 rounded-full bg-charcoal/15" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-charcoal/8 flex-shrink-0">
              <div>
                <p className="text-charcoal/45 text-[10px] uppercase tracking-[0.32em] font-body">
                  Your Bag
                </p>
                <h3 className="font-display text-3xl md:text-4xl leading-none mt-1">
                  {totals.count === 0 ? "Empty" : `${totals.count} item${totals.count > 1 ? "s" : ""}`}
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                data-testid="cart-close-btn"
                className="w-10 h-10 rounded-full bg-bone flex items-center justify-center hover:bg-charcoal hover:text-ivory transition-colors"
                aria-label="Close cart"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="font-display text-3xl mb-3">Nothing here yet.</p>
                  <p className="text-charcoal/55 max-w-sm">
                    Pick something from the menu to get started.
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    data-testid="cart-browse-menu-btn"
                    className="mt-8 rounded-full bg-charcoal text-ivory px-6 py-3 text-sm font-medium magnetic hover:-translate-y-0.5"
                  >
                    Browse menu
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-charcoal/8">
                  {items.map((line) => (
                    <li
                      key={line.lineId}
                      className="py-5 flex gap-4"
                      data-testid={`cart-line-${line.id}`}
                    >
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-bone">
                        {line.image && (
                          <img src={line.image} alt={line.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display text-xl md:text-2xl leading-tight text-balance">
                            {line.name}
                          </h4>
                          <p className="font-mono-spaced text-charcoal text-sm">
                            ${(line.price * line.quantity).toFixed(2)}
                          </p>
                        </div>
                        {line.options && line.options.length > 0 && (
                          <p className="mt-1 text-xs text-charcoal/55 font-body">
                            {line.options.map((o) => o.value).join(" · ")}
                          </p>
                        )}
                        {line.instructions && (
                          <p className="mt-1 text-xs text-charcoal/55 italic font-body">"{line.instructions}"</p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full bg-bone px-1 py-1">
                            <button
                              onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                              data-testid={`cart-qty-minus-${line.id}`}
                              className="w-7 h-7 rounded-full bg-charcoal text-ivory flex items-center justify-center"
                              aria-label="Decrease"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm font-mono-spaced">{line.quantity}</span>
                            <button
                              onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                              data-testid={`cart-qty-plus-${line.id}`}
                              className="w-7 h-7 rounded-full bg-charcoal text-ivory flex items-center justify-center"
                              aria-label="Increase"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(line.lineId)}
                            data-testid={`cart-remove-${line.id}`}
                            className="text-xs text-charcoal/45 hover:text-munchy inline-flex items-center gap-1"
                            aria-label="Remove"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer totals */}
            {items.length > 0 && (
              <div className="flex-shrink-0 border-t border-charcoal/8 p-6 md:p-8 bg-ivory/95">
                <dl className="space-y-1.5 text-sm font-body mb-5">
                  <Row k="Subtotal" v={totals.subtotal} />
                  <Row k="Tax (8.875%)" v={totals.tax} muted />
                  <Row k="Card surcharge (3%)" v={totals.surcharge} muted />
                  <div className="pt-3 mt-3 border-t border-charcoal/10 flex justify-between items-baseline">
                    <dt className="font-display text-2xl">Total</dt>
                    <dd className="font-mono-spaced text-xl" data-testid="cart-total">
                      ${totals.total.toFixed(2)}
                    </dd>
                  </div>
                </dl>
                <button
                  onClick={() => {
                    setOpen(false);
                    setTimeout(() => setCheckoutOpen(true), 350);
                  }}
                  data-testid="cart-checkout-btn"
                  className="w-full rounded-full bg-charcoal text-ivory py-4 font-body text-sm font-medium magnetic hover:bg-munchy hover:-translate-y-0.5"
                >
                  Continue to checkout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ k, v, muted }) {
  return (
    <div className={`flex justify-between ${muted ? "text-charcoal/55" : ""}`}>
      <dt>{k}</dt>
      <dd className="font-mono-spaced">${v.toFixed(2)}</dd>
    </div>
  );
}
