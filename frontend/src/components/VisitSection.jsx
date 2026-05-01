import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import { RESTAURANT } from "@/data/menu";
import ContactForm from "@/components/ContactForm";

export default function VisitSection() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(RESTAURANT.address)}&output=embed`;

  return (
    <section
      id="visit"
      className="relative py-32 md:py-44"
      data-testid="visit-section"
      aria-label="Visit"
    >
      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9 }}
          className="mb-12 md:mb-16 max-w-3xl"
        >
          <p className="text-charcoal/50 text-[11px] uppercase tracking-[0.32em] font-body mb-4">
            Visit
          </p>
          <h2 className="font-display text-5xl md:text-7xl tracking-[-0.02em] leading-[0.95] text-balance">
            12 Irving Place,
            <br />
            <span className="italic text-munchy">Woodmere</span>.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="md:col-span-7 rounded-[28px] overflow-hidden bg-bone aspect-[4/3] md:aspect-auto md:h-[480px]"
            data-testid="visit-map"
          >
            <iframe
              title="Munchy's Grill location"
              src={mapSrc}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="md:col-span-5 space-y-6"
          >
            <div className="rounded-[28px] bg-bone p-7 md:p-8">
              <div className="flex items-start gap-4">
                <span className="mt-1 inline-flex w-10 h-10 rounded-full bg-charcoal text-ivory items-center justify-center flex-shrink-0">
                  <MapPin size={16} strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-charcoal/50 text-[10px] uppercase tracking-[0.28em] font-body mb-1.5">
                    Address
                  </p>
                  <p className="font-display text-2xl leading-tight">
                    {RESTAURANT.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-bone p-7 md:p-8">
              <div className="flex items-start gap-4">
                <span className="mt-1 inline-flex w-10 h-10 rounded-full bg-charcoal text-ivory items-center justify-center flex-shrink-0">
                  <Phone size={16} strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-charcoal/50 text-[10px] uppercase tracking-[0.28em] font-body mb-1.5">
                    Call
                  </p>
                  <a
                    href={`tel:${RESTAURANT.phone.replace(/\D/g, "")}`}
                    className="font-display text-2xl leading-tight link-underline"
                    data-testid="visit-phone-link"
                  >
                    {RESTAURANT.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-bone p-7 md:p-8">
              <div className="flex items-start gap-4">
                <span className="mt-1 inline-flex w-10 h-10 rounded-full bg-charcoal text-ivory items-center justify-center flex-shrink-0">
                  <Clock size={16} strokeWidth={1.75} />
                </span>
                <div className="w-full">
                  <p className="text-charcoal/50 text-[10px] uppercase tracking-[0.28em] font-body mb-3">
                    Hours
                  </p>
                  <ul className="space-y-2 font-body text-sm">
                    {RESTAURANT.hours.map((h) => (
                      <li
                        key={h.day}
                        className="flex justify-between border-b border-charcoal/8 last:border-0 pb-2 last:pb-0"
                      >
                        <span className="text-charcoal/85">{h.day}</span>
                        <span className="font-mono-spaced text-charcoal/70">
                          {h.hours}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-16 md:mt-24"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
