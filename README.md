# Munchy's Grill

React storefront for Munchy's Grill with a menu, cart, checkout flow, contact form, and admin order dashboard.

## Local development

Install frontend dependencies:

```bash
npm install --legacy-peer-deps
```

Run the frontend:

```bash
npm start
```

Run the FastAPI backend separately when developing order/contact/admin flows:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
MONGO_URL="your-mongodb-url" DB_NAME="munchys_grill" uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

For local frontend-to-backend calls, set `REACT_APP_BACKEND_URL=http://localhost:8001` in `frontend/.env`.

## Deploying to Vercel from GitHub

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the GitHub repository.
3. Keep the project root as the repository root.
4. Add these Vercel environment variables:
   - `MONGO_URL`: your MongoDB connection string.
   - `DB_NAME`: the MongoDB database name, for example `munchys_grill`.
   - `CORS_ORIGINS`: optional; use `*` unless you need to restrict origins.
   - `REACT_APP_BACKEND_URL`: optional; leave unset/blank to use this same Vercel deployment's `/api` function.
5. Deploy.

The included `vercel.json` makes Vercel:

```bash
npm install --legacy-peer-deps && python -m pip install -r requirements.txt
CI=false npm run build
```

Then it publishes `frontend/build`, routes `/api/*` to the FastAPI Vercel Function, and falls back all non-API routes to `index.html` for React Router.
