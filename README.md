# Munchy's Grill

The website for **Munchy's Grill** — a kosher charcoal grill at 12 Irving Place,
Woodmere, NY. Browse the menu, customize dishes, and order for pickup.

## Stack

- **Frontend** (`frontend/`): React 19 + CRACO (Create React App), Tailwind CSS,
  Framer Motion, shadcn/ui. Build output: `frontend/build`.
- **Backend** (`backend/`): FastAPI + MongoDB. Powers the in-app checkout,
  contact form, and `/admin` order dashboard.

## Local development

```bash
# Frontend (http://localhost:3000)
npm install --prefix frontend
npm start

# Backend (http://localhost:8000) — optional, only for order/contact/admin
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```

Copy `frontend/.env.example` to `frontend/.env` and set `REACT_APP_BACKEND_URL`
if you want the order/contact forms to submit to your backend.

## Deploy to Vercel

This repo includes a [`vercel.json`](./vercel.json) that builds the React app
and serves it as a single-page app (deep links like `/admin` work on refresh).

1. Import the repository into Vercel (framework preset: **Other** — `vercel.json`
   already sets the build/install commands and output directory).
2. Vercel will run `npm install` then `CI=false npm run build` and publish
   `frontend/build`.
3. **Optional:** to make the order/contact forms work, host the FastAPI backend
   separately and set `REACT_APP_BACKEND_URL` in
   *Project Settings → Environment Variables*. Without it, menu browsing and the
   cart still work; "Order on Toast" remains available via the live ordering link.

> Note: the FastAPI backend is not deployed by Vercel — host it on a Python-capable
> platform (Railway, Render, Fly.io, etc.) and point `REACT_APP_BACKEND_URL` at it.
