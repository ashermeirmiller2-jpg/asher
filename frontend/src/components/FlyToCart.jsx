import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

// Animates a small image flying from the click position to the cart button (top-right area)
export default function FlyToCart() {
  const { flyTrigger, setFlyTrigger } = useCart();
  const [target, setTarget] = useState({ x: 100, y: 60 });

  useEffect(() => {
    const compute = () => {
      const el = document.querySelector('[data-testid="nav-cart-btn"]');
      if (el) {
        const r = el.getBoundingClientRect();
        setTarget({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
    };
    compute();
    window.addEventListener("scroll", compute);
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <AnimatePresence>
      {flyTrigger && (
        <motion.div
          key={flyTrigger.ts}
          initial={{
            x: flyTrigger.from.x - 32,
            y: flyTrigger.from.y - 32,
            scale: 1,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: target.x - 16,
            y: target.y - 16,
            scale: 0.25,
            opacity: 0,
            rotate: 90,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.55, -0.05, 0.6, 1.1] }}
          onAnimationComplete={() => setFlyTrigger(null)}
          className="fixed top-0 left-0 z-[200] pointer-events-none"
          style={{ width: 64, height: 64 }}
        >
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)] ring-2 ring-ivory">
            {flyTrigger.image && (
              <img src={flyTrigger.image} alt="" className="w-full h-full object-cover" />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
