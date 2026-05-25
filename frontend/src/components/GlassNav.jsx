import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { RESTAURANT } from "@/data/menu";

const links = [
  { id: "menu", label: "Menu" },
  { id: "story", label: "Story" },
  { id: "visit", label: "Visit" },
];

export default function GlassNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totals, setOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id) => {
    setMenuOpen(false);
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
          scrolled ? "mt-3 max-w-3xl" : "mt-5 max-w-5xl"
        } px-5`}
      >
        <div
          className={`glass rounded-full px-4 md:px-6 flex items-center justify-between transition-all duration-500 ${
            scrolled ? "py-2" : "py-2.5"
          }`}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-testid="nav-brand-btn"
            className="flex items-center gap-2.5 group"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-charcoal overflow-hidden">
              <img
                src={RESTAURANT.logo}
                alt="Munchy's"
                className="w-7 h-7 object-contain"
                draggable="false"
              />
            </span>
            <span className="font-display text-[20px] tracking-[-0.01em] leading-none hidden sm:flex items-baseline">
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
                className="relative rounded-full px-3.5 py-1.5 text-[13px] tracking-[0.01em] text-charcoal/75 hover:text-charcoal transition-colors group"
              >
                <span className="relative z-10">{l.label}</span>
                <span
                  className="absolute inset-0 rounded-full bg-charcoal/0 group-hover:bg-charcoal/8 transition-colors duration-300"
                  aria-hidden="true"
                />
              </button>
            ))}
            <span className="w-px h-4 bg-charcoal/15 mx-2" />
            <a
              href={`tel:${RESTAURANT.phone.replace(/\D/g, "")}`}
              data-testid="nav-phone-link"
              className="link-underline text-charcoal/70 hover:text-charcoal font-mono-spaced text-[12.5px] tracking-[0.02em] px-2"
            >
              {RESTAURANT.phone}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              data-testid="nav-cart-btn"
              className="inline-flex items-center gap-2 rounded-full bg-charcoal text-ivory pl-3.5 pr-3 py-1.5 text-[13px] font-medium magnetic hover:-translate-y-0.5 transition-transform"
            >
              <ShoppingBag size={14} strokeWidth={1.75} />
              <span className="hidden sm:inline">Cart</span>
              <AnimatePresence>
                {totals.count > 0 && (
                  <motion.span
                    key={totals.count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 24 }}
                    className="ml-0.5 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full bg-munchy text-ivory text-[10.5px] font-mono-spaced"
                    data-testid="nav-cart-badge"
                  >
                    {totals.count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              data-testid="nav-menu-toggle"
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full bg-charcoal/5 text-charcoal hover:bg-charcoal/10 transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              key="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden glass rounded-3xl mt-2 p-2 font-body overflow-hidden"
              data-testid="nav-mobile-menu"
            >
              {links.map((l) => (
                <button
                  key={l.id}
                  onClick={() => goTo(l.id)}
                  data-testid={`nav-mobile-${l.id}-btn`}
                  className="w-full text-left rounded-2xl px-4 py-3 text-[15px] text-charcoal/80 hover:bg-charcoal/8 hover:text-charcoal transition-colors"
                >
                  {l.label}
                </button>
              ))}
              <a
                href={`tel:${RESTAURANT.phone.replace(/\D/g, "")}`}
                onClick={() => setMenuOpen(false)}
                data-testid="nav-mobile-phone-link"
                className="mt-1 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-charcoal/80 hover:bg-charcoal/8 hover:text-charcoal transition-colors font-mono-spaced text-[14px] tracking-[0.02em]"
              >
                <Phone size={15} strokeWidth={1.75} />
                {RESTAURANT.phone}
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
