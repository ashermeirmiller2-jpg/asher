import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { API } from "@/lib/api";

const STATUS_OPTIONS = ["pending", "preparing", "ready", "completed", "cancelled"];

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/orders`);
      setOrders(data);
    } catch (_e) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const t = setInterval(fetchOrders, 15000);
    return () => clearInterval(t);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/orders/${id}`, { status });
      toast.success(`Updated to ${status}`);
      fetchOrders();
    } catch (_e) {
      toast.error("Update failed");
    }
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <main className="min-h-screen bg-ivory text-charcoal" data-testid="admin-page">
      <header className="sticky top-0 z-40 glass border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-charcoal/50 text-[10px] uppercase tracking-[0.32em] font-body">
              Munchy's Grill / Admin
            </p>
            <h1 className="font-display text-3xl md:text-4xl tracking-tight leading-none mt-1">
              Orders
            </h1>
          </div>
          <Link
            to="/"
            className="rounded-full bg-charcoal text-ivory px-5 py-2 text-sm font-medium hover:bg-munchy transition-colors"
            data-testid="admin-back-link"
          >
            Back to site
          </Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          {["all", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              data-testid={`admin-filter-${s}`}
              className={`rounded-full px-4 py-2 text-sm font-body transition-all border capitalize ${
                filter === s
                  ? "bg-charcoal text-ivory border-charcoal"
                  : "bg-bone text-charcoal/80 border-charcoal/10 hover:border-charcoal/30"
              }`}
            >
              {s} {s !== "all" && (
                <span className="ml-1 text-xs opacity-60">
                  {orders.filter((o) => o.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-charcoal/50">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-charcoal/50">No orders.</p>
        ) : (
          <ul className="space-y-4" data-testid="admin-orders-list">
            {filtered.map((o) => (
              <li
                key={o.id}
                className="rounded-2xl bg-bone p-6 grid grid-cols-1 lg:grid-cols-12 gap-4"
                data-testid={`admin-order-${o.id}`}
              >
                <div className="lg:col-span-3">
                  <p className="text-charcoal/45 text-[10px] uppercase tracking-[0.28em]">
                    #{o.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="font-display text-2xl leading-tight mt-1">{o.customer_name}</p>
                  <p className="text-sm text-charcoal/65 font-mono-spaced">{o.customer_phone}</p>
                  <p className="text-xs text-charcoal/50 mt-2">
                    {new Date(o.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="lg:col-span-5">
                  <p className="text-charcoal/45 text-[10px] uppercase tracking-[0.28em] mb-2">
                    Items
                  </p>
                  <ul className="space-y-1 text-sm">
                    {o.items.map((it, idx) => (
                      <li key={idx}>
                        <span className="font-mono-spaced text-charcoal/70">{it.quantity}×</span>{" "}
                        {it.name}
                        {it.options && it.options.length > 0 && (
                          <span className="text-charcoal/50 text-xs">
                            {" — "}
                            {it.options.map((op) => op.value).join(", ")}
                          </span>
                        )}
                        {it.instructions && (
                          <span className="text-charcoal/50 italic text-xs"> "{it.instructions}"</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {o.notes && (
                    <p className="text-sm text-charcoal/60 italic mt-2">Note: {o.notes}</p>
                  )}
                </div>
                <div className="lg:col-span-2 text-sm">
                  <p className="text-charcoal/45 text-[10px] uppercase tracking-[0.28em] mb-2">
                    Pickup
                  </p>
                  <p>{o.pickup_time === "asap" ? "ASAP" : o.pickup_time}</p>
                  <p className="mt-3 text-charcoal/45 text-[10px] uppercase tracking-[0.28em]">
                    Total
                  </p>
                  <p className="font-mono-spaced text-base">${o.total.toFixed(2)}</p>
                </div>
                <div className="lg:col-span-2">
                  <p className="text-charcoal/45 text-[10px] uppercase tracking-[0.28em] mb-2">
                    Status
                  </p>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    data-testid={`admin-status-select-${o.id}`}
                    className="w-full bg-ivory rounded-full px-4 py-2 border border-charcoal/15 text-sm font-body capitalize focus:border-charcoal/40 outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
