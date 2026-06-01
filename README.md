# Munchy's Grill

React storefront for Munchy's Grill with a menu, cart, checkout flow, contact form, and admin order dashboard.

## Local development

```bash
npm install --legacy-peer-deps
npm start
```

The frontend runs from the `frontend` workspace.

## Deploying the website to Vercel from GitHub

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the GitHub repository.
3. Keep the project root as the repository root. The included `vercel.json` handles the install command, build command, output directory, and React Router fallback.
4. Optional: add `REACT_APP_BACKEND_URL` in Vercel project settings if the order/contact API is hosted separately. Leave it unset to make frontend API calls to the same origin at `/api`.
5. Deploy.

Vercel will run:

```bash
npm install --legacy-peer-deps
CI=false npm run build
```

and publish `frontend/build`.
