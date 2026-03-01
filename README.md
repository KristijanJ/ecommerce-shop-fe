# ecommerce-shop-fe

Next.js frontend for the ecommerce shop. Part of a multi-repo project:

| Repo                                                                         | Purpose                                        |
| ---------------------------------------------------------------------------- | ---------------------------------------------- |
| [ecommerce-shop-fe](https://github.com/KristijanJ/ecommerce-shop-fe)         | **This repo** - Next.js frontend               |
| [ecommerce-shop-be](https://github.com/KristijanJ/ecommerce-shop-be)         | Express.js REST API                            |
| [ecommerce-shop-gitops](https://github.com/KristijanJ/ecommerce-shop-gitops) | Kubernetes manifests, ArgoCD, platform tooling |
| [ecommerce-infra](https://github.com/KristijanJ/ecommerce-infra)             | Local Docker Compose for PostgreSQL and Redis  |

---

## Stack

| Technology         | Role               | Why                                                               |
| ------------------ | ------------------ | ----------------------------------------------------------------- |
| **Next.js 16**     | Framework          | App Router, Server Components, Server Actions                     |
| **React 19**       | UI                 | Latest concurrent features                                        |
| **Tailwind CSS 4** | Styling            | Utility-first, no runtime CSS overhead                            |
| **TypeScript**     | Language           | Type safety across the codebase                                   |
| **jose**           | JWT verification   | Server-side session decoding (no round-trip to backend)           |
| **ioredis**        | Redis client       | Cart persistence                                                  |
| **pino**           | Structured logging | JSON logs to stdout — compatible with Loki log aggregation in k8s |

---

## Features

- Product browsing with category and search filters
- Product detail pages
- Shopping cart with Redis persistence (per-user, survives page refresh)
- Checkout and payment flow
- Order confirmation and purchase history
- Seller dashboard — list, create, edit, delete own products
- Auth — register, login, `httpOnly` cookie-based JWT session

---

## Architecture Decisions

### Server Actions for all mutations

All data mutations (login, register, cart updates, checkout, product management) use Next.js Server Actions. This keeps API call logic server-side and avoids exposing the backend URL to the browser.

### Cart in Redis, not the backend

The cart is a frontend session concern. Express doesn't need cart state until `POST /purchases` is called. Next.js Server Actions read and write cart data directly to Redis (`cart:{userId}` → JSON). On checkout, the Server Action reads the cart and forwards it to the backend in a single call.

```
Browser (no cart state)
  ↓ Server Action
Next.js ←→ Redis  (cart:{userId} → JSON)
  ↓ POST /purchases { items }
Express → Postgres
```

### JWT session without a session server

On login, the backend issues a JWT. Next.js stores it in an `httpOnly` cookie and verifies it server-side using `jose` on every request — no extra round-trip to the backend to validate the session.

---

## Local Development

### Prerequisites

Start PostgreSQL and Redis via the infra repo:

```bash
# in ecommerce-infra
make start-local
```

Start the backend:

```bash
# in ecommerce-shop-be
npm run dev
```

### Setup

```bash
cp .env.example .env.local    # fill in API_URL, JWT_SECRET, REDIS_HOST, REDIS_PORT
npm install
npm run dev                   # dev server at http://localhost:3000
```

### Build

```bash
npm run build    # production build
npm start        # run production build
npm run lint     # lint
```

---

## Logging

Structured JSON logging via [pino](https://getpino.io). All logging runs server-side (Server Actions, API routes, lib functions) and writes JSON to stdout.

Log level is controlled by `LOG_LEVEL` (default: `info`). In Kubernetes, logs are scraped by Promtail and queryable in Grafana via Loki:

```logql
{namespace="local-frontend"} | json | level="error"
{namespace="local-frontend"} | json | msg=~".*cart.*"
```

---

## Docker

```bash
docker build -t ecommerce-shop-fe:local .
docker run -p 3000:3000 --env-file .env.local ecommerce-shop-fe:local
```

The image is published to Docker Hub at `kristijan92/ecommerce-shop-fe` and loaded into the KinD cluster via `make load-frontend-image` in the gitops repo.

---

## Environment Variables

| Variable         | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `API_URL`        | Backend base URL (e.g. `http://ecommerce-be-service`) |
| `API_PORT`       | Backend port (e.g. `80`)                              |
| `JWT_SECRET`     | Secret key for verifying JWTs server-side             |
| `REDIS_HOST`     | Redis hostname                                        |
| `REDIS_PORT`     | Redis port (default: `6379`)                          |
| `REDIS_PASSWORD` | Redis password (optional)                             |
| `LOG_LEVEL`      | Pino log level (default: `info`)                      |
