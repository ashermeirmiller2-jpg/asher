import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { RESTAURANT } from "@/data/menu";

const links = [
  { id: "menu", label: "Menu" },
  { id: "story", label: "Story" },
  { id: "visit", label: "Visit" },
];

export default function GlassNav() {
  const [scrolled, setScrolled] = useState(false);
  const { totals, setOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50"
      data-testid="glass-nav"
    >
      <div
        className={`mx-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled ? "mt-3 max-w-3xl" : "mt-5 max-w-6xl"
        } px-5`}
      >
        <div
          className={`glass rounded-full px-5 md:px-7 flex items-center justify-between transition-all duration-500 ${
            scrolled ? "py-2.5" : "py-3.5"
          }`}
          style={{ boxShadow: "0 10px 40px -20px rgba(0,0,0,0.18)" }}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-testid="nav-brand-btn"
            className="flex items-center gap-2.5 group"
          >
            <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-charcoal text-ivory font-display text-lg leading-none">
              M
            </span>
            <span className="font-display text-xl tracking-tight hidden sm:block">
              Munchy<span className="italic">'s</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-8 font-body text-sm">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => goTo(l.id)}
                data-testid={`nav-${l.id}-btn`}
                className="link-underline text-charcoal/80 hover:text-charcoal transition-colors"
              >
                {l.label}
              </button>
            ))}
            <a
              href={`tel:${RESTAURANT.phone.replace(/\D/g, "")}`}
              data-testid="nav-phone-link"
              className="link-underline text-charcoal/80 hover:text-charcoal font-mono-spaced"
            >
              {RESTAURANT.phone}
            </a>
          </nav>

          <button
            onClick={() => setOpen(true)}
            data-testid="nav-cart-btn"
            className="group relative inline-flex items-center gap-2 rounded-full bg-charcoal text-ivory pl-4 pr-3 py-2 text-sm font-medium magnetic hover:bg-munchy"
          >
            <ShoppingBag size={16} strokeWidth={1.75} />
            <span className="hidden sm:inline">Cart</span>
            <AnimatePresence>
              {totals.count > 0 && (
                <motion.span
                  key={totals.count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 24 }}
                  className="ml-1 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-ivory text-charcoal text-xs font-mono-spaced"
                  data-testid="nav-cart-badge"
                >
                  {totals.count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
