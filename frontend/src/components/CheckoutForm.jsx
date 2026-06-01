import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ExternalLink } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { RESTAURANT } from "@/data/menu";
import { API } from "@/lib/api";

export default function CheckoutForm() {
  const { checkoutOpen, setCheckoutOpen, items, totals, clear } = useCart();
  const [step, setStep] = useState("form"); // form | success
  const [order, setOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    pickup_time: "asap",
    pickup_when: "",
    notes: "",
    payment_method: "toast_handoff",
  });

  useEffect(() => {
    if (checkoutOpen) {
      document.body.style.overflow = "hidden";
      setStep("form");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [checkoutOpen]);

  const close = () => {
    setCheckoutOpen(false);
    setTimeout(() => {
      if (step === "success") clear();
      setStep("form");
      setOrder(null);
    }, 400);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.customer_name.trim() || !form.customer_phone.trim()) {
      toast.error("Name and phone are required.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        customer_name: form.customer_name.trim(),
        customer_phone: form.customer_phone.trim(),
        pickup_time: form.pickup_time === "asap" ? "asap" : form.pickup_when,
        notes: form.notes || null,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          options: i.options || [],
          instructions: i.instructions || null,
          image: i.image,
        })),
        subtotal: totals.subtotal,
        tax: totals.tax,
        surcharge: totals.surcharge,
        total: totals.total,
        payment_method: form.payment_method,
      };
      const { data } = await axios.post(`${API}/orders`, payload);
      setOrder(data);
      setStep("success");
    } catch (err) {
      console.error(err);
      toast.error("Could not place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {checkoutOpen && (
        <>
          <motion.div
            key="checkout-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 z-[90] bg-black/60"
            data-testid="checkout-backdrop"
          />
          <motion.div
            key="checkout-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed bottom-0 left-0 right-0 z-[91] bg-ivory rounded-t-[28px] shadow-2xl max-h-[94vh] flex flex-col"
            data-testid="checkout-sheet"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-12 h-1 rounded-full bg-charcoal/15" />
            </div>
            <div className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-charcoal/8 flex-shrink-0">
              <div>
                <p className="text-charcoal/45 text-[10px] uppercase tracking-[0.32em] font-body">
                  {step === "form" ? "Checkout" : "Order placed"}
                </p>
                <h3 className="font-display text-3xl md:text-4xl leading-none mt-1">
                  {step === "form" ? "Almost there." : "You're set."}
                </h3>
              </div>
              <button
                onClick={close}
                data-testid="checkout-close-btn"
                className="w-10 h-10 rounded-full bg-bone flex items-center justify-center hover:bg-charcoal hover:text-ivory transition-colors"
                aria-label="Close checkout"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {step === "form" && (
                <form onSubmit={submit} className="p-6 md:p-10 max-w-3xl mx-auto space-y-8">
                  <div>
                    <p className="text-charcoal/45 text-[10px] uppercase tracking-[0.32em] font-body mb-4">
                      Contact
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Input
                        label="Full name"
                        value={form.customer_name}
                        onChange={(v) => setForm({ ...form, customer_name: v })}
                        testid="checkout-name-input"
                      />
                      <Input
                        label="Phone"
                        type="tel"
                        value={form.customer_phone}
                        onChange={(v) => setForm({ ...form, customer_phone: v })}
                        testid="checkout-phone-input"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-charcoal/45 text-[10px] uppercase tracking-[0.32em] font-body mb-4">
                      Pickup time
                    </p>
                    <div className="flex gap-2 mb-4">
                      {[
                        { v: "asap", l: "ASAP (10-15 min)" },
                        { v: "later", l: "Schedule for later" },
                      ].map((o) => (
                        <button
                          type="button"
                          key={o.v}
                          onClick={() => setForm({ ...form, pickup_time: o.v })}
                          data-testid={`checkout-pickup-${o.v}`}
                          className={`rounded-full px-5 py-2.5 text-sm font-body transition-all border ${
                            form.pickup_time === o.v
                              ? "bg-charcoal text-ivory border-charcoal"
                              : "bg-bone text-charcoal/80 border-charcoal/10 hover:border-charcoal/30"
                          }`}
                        >
                          {o.l}
                        </button>
                      ))}
                    </div>
                    {form.pickup_time === "later" && (
                      <Input
                        label="When"
                        type="datetime-local"
                        value={form.pickup_when}
                        onChange={(v) => setForm({ ...form, pickup_when: v })}
                        testid="checkout-pickup-when-input"
                      />
                    )}
                  </div>

                  <div>
                    <p className="text-charcoal/45 text-[10px] uppercase tracking-[0.32em] font-body mb-4">
                      Notes (optional)
                    </p>
                    <Input
                      label="Anything else"
                      value={form.notes}
                      onChange={(v) => setForm({ ...form, notes: v })}
                      textarea
                      testid="checkout-notes-input"
                    />
                  </div>

                  <div>
                    <p className="text-charcoal/45 text-[10px] uppercase tracking-[0.32em] font-body mb-4">
                      Payment
                    </p>
                    <div className="space-y-2">
                      <RadioCard
                        active={form.payment_method === "toast_handoff"}
                        onClick={() => setForm({ ...form, payment_method: "toast_handoff" })}
                        title="Pay on Toast"
                        desc="We'll save your order, then hand you off to Toast for secure card payment."
                        testid="checkout-pay-toast"
                      />
                      <RadioCard
                        active={form.payment_method === "cash_on_pickup"}
                        onClick={() => setForm({ ...form, payment_method: "cash_on_pickup" })}
                        title="Pay at pickup"
                        desc="Cash or card in store. No 3% card surcharge applies for cash."
                        testid="checkout-pay-cash"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-bone p-5 text-sm space-y-1.5 font-body">
                    <Row k="Subtotal" v={totals.subtotal} />
                    <Row k="Tax (8.875%)" v={totals.tax} muted />
                    <Row k="Card surcharge (3%)" v={totals.surcharge} muted />
                    <div className="pt-3 mt-3 border-t border-charcoal/10 flex justify-between items-baseline">
                      <span className="font-display text-2xl">Total</span>
                      <span className="font-mono-spaced text-xl" data-testid="checkout-total">
                        ${totals.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    data-testid="checkout-submit-btn"
                    className="w-full rounded-full bg-charcoal text-ivory py-4 font-body text-sm font-medium magnetic hover:bg-munchy hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {submitting ? "Placing order..." : "Place order"}
                  </button>
                  <p className="text-center text-xs text-charcoal/45">
                    Card payments incur a 3.00% surcharge to offset processing fees.
                  </p>
                </form>
              )}

              {step === "success" && order && (
                <div className="p-6 md:p-12 max-w-2xl mx-auto text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="mx-auto w-20 h-20 rounded-full bg-charcoal text-ivory flex items-center justify-center mb-8"
                  >
                    <Check size={32} strokeWidth={2} />
                  </motion.div>
                  <h4 className="font-display text-5xl md:text-6xl tracking-[-0.02em] leading-[0.95] text-balance mb-4">
                    Thanks, {order.customer_name.split(" ")[0]}.
                  </h4>
                  <p className="text-charcoal/70 max-w-md mx-auto font-body">
                    Your order is in. Confirmation #
                    <span className="font-mono-spaced">{order.id.slice(0, 8).toUpperCase()}</span>
                  </p>

                  <div className="mt-10 rounded-2xl bg-bone p-6 text-left text-sm space-y-2 font-body">
                    <Row k="Pickup" v={order.pickup_time === "asap" ? "ASAP (10-15 min)" : order.pickup_time} raw />
                    <Row k="Phone" v={order.customer_phone} raw />
                    <Row k="Items" v={order.items.reduce((s, i) => s + i.quantity, 0)} raw />
                    <Row k="Total" v={order.total} />
                  </div>

                  {order.payment_method === "toast_handoff" && (
                    <a
                      href={RESTAURANT.toastUrl}
                      target="_blank"
                      rel="noreferrer"
                      data-testid="checkout-toast-handoff-link"
                      className="mt-8 inline-flex items-center gap-2 rounded-full bg-charcoal text-ivory px-7 py-3.5 font-body text-sm font-medium magnetic hover:bg-munchy"
                    >
                      Continue to Toast for payment
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button
                    onClick={close}
                    data-testid="checkout-success-close-btn"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-bone text-charcoal px-7 py-3.5 font-body text-sm font-medium hover:bg-charcoal/10"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Input({ label, value, onChange, type = "text", textarea = false, testid }) {
  return (
    <label className="block">
      <span className="text-charcoal/45 text-[10px] uppercase tracking-[0.28em] font-body block mb-2">
        {label}
      </span>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-testid={testid}
          className="w-full bg-bone border border-charcoal/10 rounded-2xl px-4 py-3 text-sm font-body outline-none focus:border-charcoal/40 transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-testid={testid}
          className="w-full bg-bone border border-charcoal/10 rounded-full px-5 py-3 text-sm font-body outline-none focus:border-charcoal/40 transition-colors"
        />
      )}
    </label>
  );
}

function RadioCard({ active, onClick, title, desc, testid }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testid}
      className={`w-full text-left rounded-2xl border p-5 transition-all ${
        active ? "bg-charcoal text-ivory border-charcoal" : "bg-bone border-charcoal/10 hover:border-charcoal/30"
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`mt-1 w-4 h-4 rounded-full border ${
            active ? "border-ivory bg-ivory" : "border-charcoal/30"
          } flex items-center justify-center`}
        >
          {active && <span className="w-1.5 h-1.5 rounded-full bg-charcoal" />}
        </span>
        <div>
          <p className="font-display text-xl leading-tight">{title}</p>
          <p className={`mt-1 text-xs ${active ? "text-ivory/65" : "text-charcoal/55"} font-body`}>
            {desc}
          </p>
        </div>
      </div>
    </button>
  );
}

function Row({ k, v, muted, raw }) {
  return (
    <div className={`flex justify-between ${muted ? "text-charcoal/55" : ""}`}>
      <span>{k}</span>
      <span className="font-mono-spaced">{raw ? v : `$${v.toFixed(2)}`}</span>
    </div>
  );
}
