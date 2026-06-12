# Deploying DriveEasy to Render (free)

This guide puts the whole app online for free using **Render**: a PostgreSQL
database, the Spring Boot backend, and the React frontend — all from this GitHub
repo. No credit card required for the free tier.

The repo is already set up for it (`render.yaml`, `backend/Dockerfile`, a `prod`
database profile). You just click through the Render dashboard once.

> ⏱️ First deploy takes ~10–15 min (mostly the backend Docker build).

---

## Step 1 — Create a Render account

1. Go to **https://render.com** and click **Get Started**.
2. Sign up with your **GitHub** account (`chakri-bv-2`) — this lets Render see the repo.

## Step 2 — Deploy everything with the Blueprint

1. In the Render dashboard click **New +** → **Blueprint**.
2. Choose the repo **`chakri-bv-2/alpha-rentals`** and click **Connect**.
3. Render reads `render.yaml` and shows 3 resources to create:
   - `driveeasy-db` (PostgreSQL)
   - `driveeasy-backend` (web service)
   - `driveeasy-frontend` (static site)
4. Click **Apply**. Render starts building. The database and backend come up first;
   the frontend may fail its first build — that's expected, we fix it in Step 4.

## Step 3 — Get the backend URL

1. Open the **`driveeasy-backend`** service. When it finishes, it shows a URL like:
   `https://driveeasy-backend.onrender.com`
2. Verify it works: open `https://driveeasy-backend.onrender.com/swagger-ui.html`
   in your browser — you should see the API docs.

## Step 4 — Connect the frontend and backend

Two URLs need to be wired together (one-time):

**A. Tell the frontend where the API is**
1. Open the **`driveeasy-frontend`** static site → **Environment**.
2. Add / edit the variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://driveeasy-backend.onrender.com/api`
     *(your backend URL from Step 3, with `/api` on the end)*
3. Click **Save**, then **Manual Deploy → Deploy latest commit**.
4. When it finishes, open the frontend URL (e.g. `https://driveeasy-frontend.onrender.com`).

**B. Allow the frontend through the backend's CORS**
1. Copy your frontend URL (e.g. `https://driveeasy-frontend.onrender.com`).
2. Open **`driveeasy-backend`** → **Environment**.
3. Add / edit:
   - **Key:** `APP_CORS_ORIGINS`
   - **Value:** `https://driveeasy-frontend.onrender.com`  *(no trailing slash)*
4. **Save** — the backend redeploys automatically.

## Step 5 — Done 🎉

Open your frontend URL. Log in with a seeded account:

| Role  | Email                   | Password   |
|-------|-------------------------|------------|
| Admin | `admin@alpharentals.in` | `admin123` |
| User  | `user@alpharentals.in`  | `user123`  |
| Owner | `owner@alpharentals.in` | `owner123` |

---

## Good to know about the free tier

- **The backend sleeps after ~15 min of no traffic.** The next visit takes
  ~30–60 seconds to wake it up (the page may look stuck — just wait). This is
  normal for Render's free plan; a paid plan ($7/mo) keeps it always on.
- **Free PostgreSQL expires after 30 days** on Render and is then deleted. For a
  long-lived project, upgrade the database or back it up. Your seeded demo data
  re-creates automatically on a fresh empty database.
- **Updating the app:** just `git push` to `main` — Render auto-redeploys.

## Troubleshooting

- **Frontend loads but login/search fails** → re-check Step 4: `VITE_API_URL`
  must end in `/api`, and `APP_CORS_ORIGINS` must exactly match the frontend URL.
- **Backend build fails** → open the backend service's **Logs** tab and read the
  last error; most issues are a wrong env var.
- **"Application failed to respond"** → the service is asleep; refresh and wait a minute.
