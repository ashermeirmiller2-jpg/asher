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
          className={`glass-strong rounded-full px-5 md:px-7 flex items-center justify-between transition-all duration-500 relative overflow-hidden ${
            scrolled ? "py-2.5" : "py-3.5"
          }`}
        >
          {/* Top inner highlight - glass reflection */}
          <span
            className="absolute top-0 left-6 right-6 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
            }}
            aria-hidden="true"
          />

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-testid="nav-brand-btn"
            className="relative flex items-center gap-3 group"
          >
            <span
              className="relative inline-flex items-center justify-center w-9 h-9 rounded-full text-ivory font-display text-xl leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_6px_14px_-4px_rgba(0,0,0,0.4)]"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, hsl(var(--charcoal)) 0%, #1a0f0c 100%)",
              }}
            >
              <span className="relative z-10">M</span>
              <span
                className="absolute top-1 left-1.5 right-2 h-1.5 rounded-full opacity-70 blur-[1px]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0))",
                }}
                aria-hidden="true"
              />
            </span>
            <span className="font-display text-[22px] tracking-[-0.01em] leading-none hidden sm:flex items-baseline">
              <span className="text-charcoal">Munchy</span>
              <span className="italic text-munchy ml-[1px]">'s</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1 font-body">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => goTo(l.id)}
                data-testid={`nav-${l.id}-btn`}
                className="relative rounded-full px-4 py-1.5 text-[13px] tracking-[0.01em] text-charcoal/80 hover:text-charcoal transition-colors group"
              >
                <span className="relative z-10">{l.label}</span>
                <span
                  className="absolute inset-0 rounded-full bg-charcoal/0 group-hover:bg-charcoal/8 transition-colors duration-300"
                  aria-hidden="true"
                />
              </button>
            ))}
            <span className="w-px h-5 bg-charcoal/12 mx-2" />
            <a
              href={`tel:${RESTAURANT.phone.replace(/\D/g, "")}`}
              data-testid="nav-phone-link"
              className="link-underline text-charcoal/75 hover:text-charcoal font-mono-spaced text-[13px] tracking-[0.02em] px-2"
            >
              {RESTAURANT.phone}
            </a>
          </nav>

          <button
            onClick={() => setOpen(true)}
            data-testid="nav-cart-btn"
            className="group relative inline-flex items-center gap-2 rounded-full text-ivory pl-4 pr-3 py-2 text-[13px] font-medium magnetic hover:-translate-y-0.5 transition-transform"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--charcoal)) 0%, #1a120f 60%, hsl(var(--munchy-red)) 140%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.18), 0 10px 25px -10px rgba(0,0,0,0.5)",
            }}
          >
            <ShoppingBag size={15} strokeWidth={1.75} />
            <span className="hidden sm:inline">Cart</span>
            <AnimatePresence>
              {totals.count > 0 && (
                <motion.span
                  key={totals.count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 24 }}
                  className="ml-1 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-ivory text-charcoal text-[11px] font-mono-spaced"
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
