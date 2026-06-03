import React from "react";
import { ArrowUpRight } from "lucide-react";
import { RESTAURANT } from "@/data/menu";

export default function Footer() {
  return (
    <footer className="relative bg-charcoal text-ivory overflow-hidden" data-testid="footer">
      <div className="px-6 md:px-12 max-w-7xl mx-auto pt-20 md:pt-28 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
          <div className="col-span-2">
            <p className="font-display text-4xl md:text-5xl tracking-tight leading-[1.05] max-w-md text-balance">
              {RESTAURANT.tagline}
            </p>
            <a
              href={RESTAURANT.toastUrl}
              target="_blank"
              rel="noreferrer"
              data-testid="footer-order-cta"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-munchy text-ivory px-6 py-3 text-sm font-medium hover:bg-ivory hover:text-charcoal transition-colors"
            >
              Order pickup on Toast
              <ArrowUpRight size={16} strokeWidth={2} />
            </a>
          </div>
          <div>
            <p className="text-ivory/40 text-[10px] uppercase tracking-[0.28em] mb-4 font-body">
              Visit
            </p>
            <p className="text-sm leading-relaxed text-ivory/80 font-body">
              {RESTAURANT.address}
            </p>
            <a
              href={`tel:${RESTAURANT.phone.replace(/\D/g, "")}`}
              className="block mt-2 text-sm text-ivory/80 hover:text-ivory link-underline font-mono-spaced"
              data-testid="footer-phone-link"
            >
              {RESTAURANT.phone}
            </a>
          </div>
          <div>
            <p className="text-ivory/40 text-[10px] uppercase tracking-[0.28em] mb-4 font-body">
              Order
            </p>
            <a
              href={RESTAURANT.toastUrl}
              target="_blank"
              rel="noreferrer"
              className="block text-sm text-ivory/80 hover:text-ivory link-underline"
              data-testid="footer-toast-link"
            >
              Order on Toast
            </a>
            <a
              href="https://www.ubereats.com/store/munchys-grill/u6EqBpiHX4OpsE156Ka8fg"
              target="_blank"
              rel="noreferrer"
              className="block mt-2 text-sm text-ivory/80 hover:text-ivory link-underline"
            >
              Uber Eats
            </a>
          </div>
        </div>

        <div className="select-none pointer-events-none mt-4 md:mt-6">
          <p
            className="font-display leading-none tracking-[-0.04em] text-ivory/85"
            style={{ fontSize: "clamp(48px, 9vw, 128px)" }}
          >
            Munchy<span className="italic text-munchy">'s</span>
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-ivory/10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-xs text-ivory/45 font-body">
          <p>&copy; {new Date().getFullYear()} Munchy's Grill. All rights reserved.</p>
          <p>
            Card payments incur a 3.00% surcharge to offset processing fees.
          </p>
        </div>
      </div>
    </footer>
  );
}
