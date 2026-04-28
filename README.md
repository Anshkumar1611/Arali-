# Customer Management Dashboard

A full-stack web application for managing customers. Add, view, edit, search, sort, and delete customers through a clean, responsive UI backed by a lightweight Express API.

---

## Features

- **Add / Edit / Delete** customers via a modal form
- **Debounced live search** — filters by name, email, or phone (300 ms debounce)
- **Sortable columns** — click any column header to toggle ascending / descending
- **Pagination** — 10 customers per page with ellipsis-aware page controls
- **Responsive design** — table on desktop, card list on mobile
- **Dark mode** — follows the OS color scheme automatically
- **Toast notifications** — action feedback with auto-dismiss
- **Form validation** — inline field errors before any network request
- **Env-driven config** — no hardcoded ports or origins in source files

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 19, Vite 8, plain CSS       |
| Backend  | Node.js 18+, Express 4            |
| Config   | dotenv (server), Vite env (client)|

---

## Project Structure

```
Arali/
├── client/                  React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomerModal.jsx   Add / edit modal
│   │   │   ├── CustomerTable.jsx   Sortable table + mobile cards
│   │   │   ├── Pagination.jsx      Page controls
│   │   │   ├── SearchBar.jsx       Debounced search input
│   │   │   └── Toast.jsx           Notification banner
│   │   ├── hooks/
│   │   │   ├── useCustomers.js     CRUD state + API calls
│   │   │   ├── useDebounce.js      Generic debounce hook
│   │   │   └── useToast.js         Toast state management
│   │   ├── utils/
│   │   │   ├── api.js              Fetch helpers + base URL
│   │   │   └── validate.js         Form field validation
│   │   ├── App.jsx                 Root component / orchestrator
│   │   ├── App.css                 Component styles
│   │   └── index.css               Global tokens + reset
│   ├── .env                        Local env (not committed)
│   ├── .env.example                Env template
│   └── vite.config.js              Dev proxy config
│
├── server/                  Express API
│   ├── index.js             All routes + in-memory store
│   ├── .env                 Local env (not committed)
│   └── .env.example         Env template
│
├── package.json             Root: concurrently dev script
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd Arali
```

### 2. Install dependencies

```bash
# Root (concurrently)
npm install

# Server
cd server && npm install && cd ..

# Client
cd client && npm install && cd ..
```

### 3. Configure environment variables

```bash
# Server
cp server/.env.example server/.env

# Client
cp client/.env.example client/.env
```

Edit the `.env` files if you need non-default ports or origins (see the Environment Variables section below).

### 4. Start the development servers

```bash
# From the repo root — starts both servers concurrently
npm run dev
```

Or start them separately:

```bash
# Terminal 1 — backend on http://localhost:3001
npm run start:server

# Terminal 2 — frontend on http://localhost:5173
npm run start:client
```

Open **http://localhost:5173** in your browser.

---

## Available Scripts

### Root

| Script              | Description                                     |
|---------------------|-------------------------------------------------|
| `npm run dev`       | Start both server and client concurrently       |
| `npm run start:server` | Start the Express server only               |
| `npm run start:client` | Start the Vite dev server only              |

### `server/`

| Script        | Description                              |
|---------------|------------------------------------------|
| `npm start`   | Start server (production)                |
| `npm run dev` | Start server with `--watch` (auto-reload)|

### `client/`

| Script          | Description                        |
|-----------------|------------------------------------|
| `npm run dev`   | Start Vite dev server              |
| `npm run build` | Production build to `dist/`        |
| `npm run preview` | Preview the production build     |
| `npm run lint`  | Run ESLint                         |

---

## API Reference

Base URL: `http://localhost:3001`

### GET /customers

Returns all customers.

**Response `200`**
```json
[
  { "id": 1, "name": "Jane Doe", "email": "jane@example.com", "phone": "+1 555 000 0001" }
]
```

---

### POST /customers

Creates a new customer.

**Request body**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "phone": "+1 555 000 0001" }
```

**Response `201`** — the created customer object.

---

### PUT /customers/:id

Updates an existing customer. Only the fields present in the body are changed.

**Request body** (all fields optional)
```json
{ "name": "Jane Smith", "email": "jane@example.com", "phone": "+1 555 000 0002" }
```

**Response `200`** — the updated customer object.  
**Response `404`** — customer not found.

---

### DELETE /customers/:id

Deletes a customer by ID.

**Response `204`** — no content.  
**Response `404`** — customer not found.

---

## Environment Variables

### `server/.env`

| Variable      | Default                     | Description                     |
|---------------|-----------------------------|---------------------------------|
| `PORT`        | `3001`                      | TCP port the Express server binds to |
| `CORS_ORIGIN` | `http://localhost:5173`     | Allowed CORS origin             |

### `client/.env`

| Variable        | Default | Description                                                                 |
|-----------------|---------|-----------------------------------------------------------------------------|
| `VITE_API_URL`  | _(empty)_ | Full backend URL. Leave empty in dev to use the Vite proxy (`/api` → `http://localhost:3001`). Set for production deployments. |

---

## Architecture Notes

- **Storage** is in-memory (a JavaScript array). All data is lost on server restart. This is intentional for a simple demo — swap in a database for persistence.
- **Search, sort, and pagination** are all computed client-side from the full list returned by `GET /customers`. The server API is kept minimal.
- The Vite **dev proxy** (`/api` → backend) avoids CORS issues during local development without any browser configuration.

---

## Deploy on Render (free Blueprint)

This repo includes [`render.yaml`](render.yaml) at the **repository root**. Render was failing because that file was missing on `main`.

### What to do next

1. **Commit and push** `render.yaml` to the `main` branch of the GitHub repo you connected in Render (`Anshkumar1611/Arali-` or your fork).
2. In Render: **New → Blueprint**, pick the same repo, branch **main**, blueprint path **`render.yaml`**, then **Apply**.
3. When Render asks for **synced secrets** (first-time Blueprint flow):
   - **`CORS_ORIGIN`** (on service `arali-api`): set to your **frontend** URL, e.g. `https://arali-web.onrender.com` (use the exact URL from the static site’s **Settings** page after it exists; if the subdomain differs, use that URL).
   - **`VITE_API_URL`** (on service `arali-web`): set to your **API** URL, e.g. `https://arali-api.onrender.com` (no trailing slash). This is baked into the static build at build time.
4. If the static site build ran **before** you had the API URL, open the **`arali-web`** service → **Environment** → set `VITE_API_URL` → **Manual Deploy → Clear build cache & deploy** so Vite rebuilds with the correct API base.

### Static site build failed (`arali-web`)

If the API deploys but the static site fails, open **`arali-web` → Logs** and check the build output. A common cause is **`vite: not found`** or missing modules: Render installs with `NODE_ENV=production`, which skips `devDependencies` where Vite lives. The [`render.yaml`](render.yaml) `buildCommand` uses `NPM_CONFIG_PRODUCTION=false npm install` so dev tools are installed before `npm run build`.

**Note:** Free web services **sleep** after idle time; the first request after sleep is slow, and **in-memory data resets** when the instance restarts.

