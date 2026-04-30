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

## What's Been Implemented (2026-04-30)
- Design system: warm ivory bg + charcoal fg + Munchy's red accent + gold; CSS HSL vars; Instrument Serif (display) + Geist (body); glass utilities; grain texture; magnetic hover
- GlassNav: scroll-reactive shrinking glass pill with brand mark, Menu/Story/Visit, phone, Cart
- HeroPinned: 170vh scroll-pinned hero with Toast CDN banner, parallax image scale, large Apple-style serif headline, scroll indicator
- FeaturedRail: horizontal-scroll signature items rail with snap
- StorySection: asymmetric split with floating "Open till 2:30 AM" glass card and stat row
- MenuBento: 8-category bento grid with sticky scroll-driven category text-mask morph (the wow moment), image-fill cards with gradient + glass price chip
- ItemModal: side-panel on desktop / bottom-sheet on mobile; option groups (single + multi with max enforcement); special instructions; quantity +/-; live total in CTA
- CartSheet: bottom-sheet drawer with line items showing options + instructions, qty controls, remove, totals (subtotal, tax, 3% surcharge, total)
- CheckoutForm: name/phone, ASAP or scheduled pickup, payment method (Toast handoff or cash), success screen with confirmation # and Toast deep-link
- FlyToCart: image-flies-to-cart motion path on add
- VisitSection: Google Maps embed, address/phone/hours cards, working contact form
- Footer: dark charcoal with giant brand mark, surcharge disclosure
- Admin page: status filters, live polling (15s), order detail rendering, status select with PATCH
- Backend: POST/GET /api/orders, GET /api/orders/{id}, PATCH /api/orders/{id}, POST/GET /api/contact

## Test Status
- 100% backend (11/11 pytest cases — orders + contact CRUD, validation, sort, 404s, status enum, no _id leak)
- 100% frontend E2E (hero, nav, menu open, item modal customize, add to cart, cart sheet, checkout submit, success screen, admin status update, contact form)
- Iteration 1 report: `/app/test_reports/iteration_1.json`

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
