import React, { useState } from "react";
import GlassNav from "@/components/GlassNav";
import HeroPinned from "@/components/HeroPinned";
import FeaturedRail from "@/components/FeaturedRail";
import StorySection from "@/components/StorySection";
import MenuBento from "@/components/MenuBento";
import VisitSection from "@/components/VisitSection";
import Footer from "@/components/Footer";
import ItemModal from "@/components/ItemModal";
import CartSheet from "@/components/CartSheet";
import CheckoutForm from "@/components/CheckoutForm";
import FlyToCart from "@/components/FlyToCart";
import FloatingCartPill from "@/components/FloatingCartPill";

export default function Home() {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <main className="relative min-h-screen bg-ivory text-charcoal" data-testid="home-page">
      <GlassNav />
      <HeroPinned />
      <FeaturedRail onItemClick={(it) => setActiveItem(it)} />
      <StorySection />
      <MenuBento onItemClick={(it) => setActiveItem(it)} />
      <VisitSection />
      <Footer />

      {activeItem && <ItemModal item={activeItem} onClose={() => setActiveItem(null)} />}
      <CartSheet />
      <CheckoutForm />
      <FlyToCart />
      <FloatingCartPill />
    </main>
  );
}
