import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "munchys-cart-v1";

const optionsKey = (options = []) =>
  options
    .map((o) => `${o.group}:${o.value}`)
    .sort()
    .join("|");

const buildLineId = (item) => `${item.id}__${optionsKey(item.options)}__${item.instructions || ""}`;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [flyTrigger, setFlyTrigger] = useState(null); // {from: {x,y}, image}
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (_e) {
      // ignore
    }
  }, []);

  // Save
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (_e) {
      // ignore
    }
  }, [items]);

  const addItem = useCallback((item, opts = {}) => {
    const lineId = buildLineId(item);
    setItems((prev) => {
      const existing = prev.find((i) => i.lineId === lineId);
      if (existing) {
        return prev.map((i) =>
          i.lineId === lineId ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      }
      return [...prev, { ...item, lineId, quantity: item.quantity || 1 }];
    });
    if (opts.fly) setFlyTrigger({ from: opts.fly, image: item.image, ts: Date.now() });
  }, []);

  const updateQuantity = useCallback((lineId, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.lineId !== lineId)
        : prev.map((i) => (i.lineId === lineId ? { ...i, quantity: qty } : i))
    );
  }, []);

  const removeItem = useCallback((lineId) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = subtotal * 0.08875; // NY combined approx
    const surcharge = subtotal * 0.03; // 3% card surcharge (matches Toast disclosure)
    const total = subtotal + tax + surcharge;
    return {
      subtotal: +subtotal.toFixed(2),
      tax: +tax.toFixed(2),
      surcharge: +surcharge.toFixed(2),
      total: +total.toFixed(2),
      count: items.reduce((s, i) => s + i.quantity, 0),
    };
  }, [items]);

  const value = {
    items,
    open,
    setOpen,
    checkoutOpen,
    setCheckoutOpen,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    totals,
    flyTrigger,
    setFlyTrigger,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
