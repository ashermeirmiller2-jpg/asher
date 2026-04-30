import React, { useState, useCallback } from "react";
import GlassNav from "@/components/GlassNav";
import HeroPinned from "@/components/HeroPinned";
import FeaturedRail from "@/components/FeaturedRail";
import StorySection from "@/components/StorySection";
import MenuBento from "@/components/MenuBento";
import VisitSection from "@/components/VisitSection";
import BurgerScrollScene from "@/components/BurgerScrollScene";
import Footer from "@/components/Footer";
import ItemModal from "@/components/ItemModal";
import CartSheet from "@/components/CartSheet";
import CheckoutForm from "@/components/CheckoutForm";
import FlyToCart from "@/components/FlyToCart";
import FloatingCartPill from "@/components/FloatingCartPill";

export default function Home() {
  const [activeItem, setActiveItem] = useState(null);

  const scrollToMenu = useCallback(() => {
    const el = document.getElementById("menu");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main className="relative min-h-screen bg-ivory text-charcoal" data-testid="home-page">
      <GlassNav />
      <HeroPinned />
      <MenuBento onItemClick={(it) => setActiveItem(it)} />
      <FeaturedRail onItemClick={(it) => setActiveItem(it)} />
      <StorySection />
      <VisitSection />
      <BurgerScrollScene onOrderClick={scrollToMenu} />
      <Footer />

      {activeItem && <ItemModal item={activeItem} onClose={() => setActiveItem(null)} />}
      <CartSheet />
      <CheckoutForm />
      <FlyToCart />
      <FloatingCartPill />
    </main>
  );
}
