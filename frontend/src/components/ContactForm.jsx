import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success("Message sent. We'll be in touch.");
      setForm({ name: "", email: "", message: "" });
    } catch (_e) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[28px] bg-charcoal text-ivory overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-5 p-8 md:p-12 border-b md:border-b-0 md:border-r border-ivory/10">
          <p className="text-ivory/50 text-[11px] uppercase tracking-[0.32em] mb-5 font-body">
            Drop us a line
          </p>
          <h3 className="font-display text-4xl md:text-5xl leading-[0.95] tracking-[-0.02em] text-balance">
            Catering, events, or
            <br />
            <span className="italic">a question we can answer.</span>
          </h3>
          <p className="mt-6 text-ivory/65 text-sm leading-relaxed">
            We read every message. Replies usually within 24 hours.
          </p>
        </div>
        <form onSubmit={submit} className="md:col-span-7 p-8 md:p-12 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field
              label="Name"
              testid="contact-name-input"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />
            <Field
              label="Email"
              type="email"
              testid="contact-email-input"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />
          </div>
          <Field
            label="Message"
            textarea
            testid="contact-message-input"
            value={form.message}
            onChange={(v) => setForm({ ...form, message: v })}
          />
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            data-testid="contact-submit-btn"
            className="inline-flex items-center gap-2 rounded-full bg-ivory text-charcoal px-7 py-3.5 font-body text-sm font-medium magnetic hover:-translate-y-0.5 disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Send message"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", textarea = false, testid }) {
  return (
    <label className="block">
      <span className="text-ivory/50 text-[10px] uppercase tracking-[0.28em] font-body block mb-2">
        {label}
      </span>
      {textarea ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-testid={testid}
          className="w-full bg-transparent border-b border-ivory/25 focus:border-ivory pb-2 text-ivory placeholder:text-ivory/30 outline-none transition-colors font-body resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-testid={testid}
          className="w-full bg-transparent border-b border-ivory/25 focus:border-ivory pb-2 text-ivory placeholder:text-ivory/30 outline-none transition-colors font-body"
        />
      )}
    </label>
  );
}
