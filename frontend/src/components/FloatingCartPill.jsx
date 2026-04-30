import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function FloatingCartPill() {
  const { totals, setOpen, open, checkoutOpen } = useCart();
  const visible = totals.count > 0 && !open && !checkoutOpen;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="floating-cart"
          initial={{ y: 80, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpen(true)}
          data-testid="floating-cart-pill"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] inline-flex items-center gap-3 rounded-full bg-charcoal text-ivory pl-4 pr-2 py-2 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)]"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--charcoal)) 0%, hsl(var(--charcoal)) 60%, hsl(var(--munchy-red)) 130%)",
          }}
        >
          <ShoppingBag size={16} strokeWidth={1.75} />
          <span className="text-sm font-body" data-testid="floating-cart-count">
            {totals.count} {totals.count === 1 ? "item" : "items"}
          </span>
          <span className="h-5 w-px bg-ivory/25" />
          <span className="text-sm font-mono-spaced" data-testid="floating-cart-total">
            ${totals.total.toFixed(2)}
          </span>
          <span className="ml-1 inline-flex items-center justify-center rounded-full bg-ivory text-charcoal text-[11px] font-medium px-3 py-1.5">
            View
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
