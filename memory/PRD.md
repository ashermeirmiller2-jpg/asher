# Munchy's Grill — Product Requirements

## Original Problem Statement
> "https://order.toasttab.com/online/munchy-s-grill-12-irving-place/item-4-shnitzel-baguette_9087235a-51d5-4c49-9582-662288758852 https://www.munchysgrillny.com/ merge these together in one website and using the design, but make it more flowable and no emojis and make it actually like Apple Squirtle design"

Merge the public Munchy's Grill marketing site and its Toast Tab online ordering experience into one Apple-grade, flowing single-page experience for the kosher Israeli/Mediterranean grill at 12 Irving Place, Woodmere NY.

## User Personas
- **Hungry local** browsing the menu late at night, picks up at the store
- **Returning customer** who wants the schnitzel baguette they always order
- **Catering / event lead** sending an inquiry via the contact form
- **Owner / staff** monitoring incoming orders via `/admin`

## Architecture
- Frontend: React 19 + React Router 7 + Tailwind 3 + shadcn/Radix + framer-motion 12 + sonner toasts
- Backend: FastAPI + Motor (async MongoDB) + Pydantic v2
- DB: MongoDB (`orders`, `contacts` collections)
- Hosting: Emergent k8s (frontend on 3000, backend on 8001, ingress routes `/api/*` to backend)

## Core Requirements (static)
- One flowing page: Hero → Featured → Story → Menu → Visit → Footer
- Real Munchy's Grill menu (~40 items across 8 categories)
- Item customization (toppings/sauces/temp/spice + special instructions)
- Persistent cart with bottom-sheet drawer
- Checkout that captures order to backend, then deep-links to Toast for payment
- Admin page (`/admin`) to monitor orders + change status
- Working contact form
- No emojis. Apple geometry + glassmorphism. Premium typography (Instrument Serif + Geist).

## What's Been Implemented (2026-05-01 — Anti-AI-slop pass)
- **Borders + glass overhaul**: rewrote `.glass` / `.glass-strong` / `.glass-dark` to be properly translucent (Apple-style 30–45% opacity, no thick whitewashed borders, inset 0.5px highlight only). Killed the colored `border-2` price chips on menu cards — replaced with new `.chip-dark` solid-dark glass pill. Reduced `.card-3d:hover` from aggressive `translateZ(40px)` tilt to subtle `translateY(-6px) rotateX(2deg)`.
- **Hero rebuild**: switched from full-bleed pinned interior with floating serif (unreadable) to magazine-grade split layout — bold serif headline + Munchy red italic accent on the LEFT, real Munchy's interior banner on the RIGHT with editorial caption pill. Dropped the AI-poetry "Woodmere · NY · Est. 2018" eyebrow.
- **Real logo in nav**: `GlassNav` now renders `RESTAURANT.logo` image instead of generic "M" circle.
- **Killed gradient buttons**: every yellow→orange→terracotta gradient CTA replaced with solid `bg-munchy` red. Hero, BurgerScrollScene, all primary CTAs.
- **Authentic copy pass**: dropped AI-rhythm taglines. "Every category, every craving" → "Everything we make, made to order"; "Eight things we get asked about most" → "The dishes people keep coming back for"; "Come hungry. Stay late." → "12 Irving Place, Woodmere"; story copy now reads like an actual NY kosher grill instead of a brand workshop.
- **Real interior in StorySection**: swapped generic Unsplash interior for `RESTAURANT.banner` (actual Munchy's). Floating overlay card upgraded to dark chip.
- **Image accuracy fixes**: replaced mismatched stock photos (Jalapeño Poppers showing noodles, Fried Pickles showing skewers) with verified Unsplash food photos.

## What's Been Implemented (2026-04-30)
- Design system: warm ivory bg + charcoal fg + Munchy's red accent + sun yellow + gold + tomato + sage + plum + terracotta + teal accents; CSS HSL vars; Instrument Serif (display) + Geist (body); glass utilities; grain texture; magnetic hover
- GlassNav: scroll-reactive shrinking glass pill with brand mark, Menu/Story/Visit, phone, Cart
- HeroPinned: 170vh scroll-pinned hero with Toast CDN banner, parallax image scale, large Apple-style serif headline, warm-tinted overlay (red/yellow blend), sunrise-gradient "Order Now" CTA, scroll indicator
- MenuBento (FIRST after hero): 8-category bento grid; sticky scroll-spy pill nav with per-category color dots and live search; image-fill cards with Bestseller/Spicy/Veg/Signature tags; per-category accent color tints heading and price chip border
- FeaturedRail: horizontal-scroll signature items rail with snap (still present below menu)
- StorySection: asymmetric split with floating "Open till 2:30 AM" glass card and stat row
- VisitSection: Google Maps embed (4:3 contained), address/phone/hours cards, working contact form
- BurgerScrollScene: Apple iPhone product-page-style scroll animation. 420vh sticky-pinned section. Burger image circular-masked, rotates -30° → 380°, scales 0.7→1.35→1.05, with halo color cross-fade and chapter captions ("Eight ounces.", "Charcoal-grilled.", "Toasted bun.", "Yours, in ten.") that fade in/out. Final "Build your burger" CTA jumps back to menu. Replaces the previous static giant footer wordmark.
- ItemModal: side-panel on desktop / bottom-sheet on mobile; option groups; special instructions; quantity +/-; live total in CTA
- CartSheet: bottom-sheet drawer with line items, qty controls, totals
- CheckoutForm: name/phone, ASAP or scheduled pickup, payment method, success screen with confirmation # and Toast deep-link
- FlyToCart: image-flies-to-cart motion path on add
- FloatingCartPill: bottom-center pill that shows count + total whenever cart has items, charcoal-to-munchy gradient, magnetic hover; replaces having to scroll to top to see cart
- Footer: dark charcoal with smaller wordmark (giant version replaced by BurgerScrollScene), surcharge disclosure
- Admin page: status filters, live polling (15s), order detail rendering, status select with PATCH
- Backend: POST/GET /api/orders, GET /api/orders/{id}, PATCH /api/orders/{id}, POST/GET /api/contact

## Test Status
- Iteration 1 (2026-04-30): 100% backend (11/11 pytest), 100% frontend E2E (hero, item modal, cart, checkout, admin, contact). Report: `/app/test_reports/iteration_1.json`
- Iteration 2 (2026-04-30): 100% frontend regression (reordered Home, sticky pill menu nav with scroll-spy + search, floating cart pill, BurgerScrollScene with all 4 chapters animating, no Web Animations API errors). Report: `/app/test_reports/iteration_2.json`
- Iteration 3 (2026-05-01): 100% backend (11/11 pytest) + 100% frontend (10/10 review scenarios) post anti-AI-slop refactor. Confirmed `.chip-dark` price chips have 0px border + rgba(14,10,9,0.72) bg, no remaining yellow→orange gradient buttons, hero/cart/checkout/contact flows green. Report: `/app/test_reports/iteration_3.json`

## Backlog (P0/P1/P2)
- **P0**: Real Toast Partner API integration when restaurant supplies OAuth credentials (replace handoff with direct submission)
- **P1**: Admin authentication (currently `/admin` is unprotected — fine for early dev but must be locked before prod)
- **P1**: Email/SMS confirmation to customer when order is placed (SendGrid / Twilio)
- **P1**: Allergen / dietary filters on menu (kosher beef vs chicken split)
- **P2**: Saved addresses / order history (requires accounts)
- **P2**: Delivery option with address + delivery fee (currently pickup-only per scope)
- **P2**: Real-time order status push to customer phone (WebSocket / SMS)
- **P2**: Loyalty program (points per order)
- **P2**: Replace Unsplash placeholder food shots with real Munchy's photography

## Notes
- Toast checkout is intentionally a deep-link handoff because Toast's ordering API requires Toast Partner credentials only the merchant can provision.
- Card surcharge of 3.00% is applied in totals to match Toast's disclosed merchant policy. Cash payment also has the surcharge line shown but does not actually charge it (handled at pickup).
- Tax rate hardcoded at 8.875% (NY combined estimate). Will need owner confirmation for production.
