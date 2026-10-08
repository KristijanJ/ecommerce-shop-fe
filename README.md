# ecommerce-shop-fe

Next.js frontend for the ecommerce shop. Part of a multi-repo project:

| Repo                                                                         | Purpose                                                             |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [ecommerce-shop-fe](https://github.com/KristijanJ/ecommerce-shop-fe)         | This repo. Next.js frontend                                         |
| [ecommerce-shop-be](https://github.com/KristijanJ/ecommerce-shop-be)         | NestJS REST API                                                     |
| [ecommerce-shop-gitops](https://github.com/KristijanJ/ecommerce-shop-gitops) | Kubernetes manifests, ArgoCD, platform tooling                      |
| [ecommerce-infra](https://github.com/KristijanJ/ecommerce-infra)             | Terraform for AWS, Docker Compose and Ansible for Proxmox and local |

---

## Stack

| Technology     | Role             | Notes                                         |
| -------------- | ---------------- | --------------------------------------------- |
| Next.js 16     | Framework        | App Router, Server Components, Server Actions |
| React 19       | UI               |                                               |
| Tailwind CSS 4 | Styling          |                                               |
| TypeScript     | Language         |                                               |
| jose           | JWT verification | Decodes the session on the server             |
| ioredis        | Redis client     | Stores carts                                  |
| pino           | Logging          | JSON on stdout                                |
| OpenTelemetry  | Traces, metrics  | Server side only, exported over OTLP          |

---

## Features

- Product browsing with category and search filters
- Product detail pages
- Shopping cart stored per user in Redis
- Checkout and payment
- Order confirmation and purchase history
- Seller dashboard to list, create, edit and delete own products
- Register and log in, with the JWT in an `httpOnly` cookie

---

## Architecture

### Server Actions for mutations

Login, register, cart updates, checkout and product management use Server Actions. The calls to the backend happen on the server, so the browser never sees the backend URL.

### Cart in Redis

The backend does not need cart state until `POST /purchases`. The Server Actions read and write the cart in Redis (`cart:{userId}` holds JSON). On checkout, the action reads the cart and sends it to the backend in one call.

```text
Browser
  │ Server Action
  ▼
Next.js ◄──► Redis   (cart:{userId} → JSON)
  │ POST /purchases { items }
  ▼
NestJS ──► PostgreSQL
```

### Session

The backend issues a JWT on login. Next.js stores it in an `httpOnly` cookie and verifies it with `jose` on each request, so a request does not call the backend to check the session.

---

## Local development

Start PostgreSQL, Redis and the LGTM stack from the infra repo:

```bash
# in ecommerce-infra
make start-local
```

Start the backend:

```bash
# in ecommerce-shop-be
npm run start:dev
```

Then start the frontend:

```bash
cp .env.example .env.local    # set API_URL, API_PORT, JWT_SECRET, REDIS_HOST, REDIS_PORT
npm install
npm run dev                   # http://localhost:3000
```

If the backend already uses port 3000, set `PORT` for one of the two apps.

### Scripts

```bash
npm run build    # production build
npm start        # run the production build
npm run lint     # eslint
```

There are no tests yet. `npm run lint` is the only check in CI.

---

## Logging

The app logs JSON with [pino](https://getpino.io) to stdout. All logging runs on the server (Server Actions, API routes, lib functions). `LOG_LEVEL` sets the level (default `info`).

In the clusters, logs reach Loki through the OpenTelemetry Collector. Query them in Grafana under Explore with the Loki datasource:

```logql
{service_name="ecommerce-fe"} | json | level="error"
{service_name="ecommerce-fe"} | json | msg=~".*cart.*"
```

---

## Observability

Next.js runs `instrumentation.ts` when the server starts. It loads `instrumentation.node.ts`, which starts the OpenTelemetry SDK with Node auto-instrumentation for server-side fetch and Redis. Next.js adds its own spans for page renders. The frontend passes the trace context to the backend, so one trace covers the frontend, the API and Postgres. Only the server is instrumented. The browser sends nothing.

- Locally, the LGTM stack from `ecommerce-infra` receives traces and metrics on `localhost:4318`. Open Grafana at <http://localhost:3300> (`admin` / `admin`) and look for the service `ecommerce-fe` in Tempo.
- In the clusters, the Deployment points `OTEL_EXPORTER_OTLP_ENDPOINT` at the collector in the `monitoring` namespace (`opentelemetry-collector.monitoring:4318`).

Next.js produces no `http_server_*` metrics. For the frontend's request rate and latency, use the span metrics that the collector generates from the traces, such as `traces_span_metrics_calls_total`. Filter them with `service_name="ecommerce-fe"`. See the gitops repo for the pipeline.

---

## Docker

```bash
docker build -t ecommerce-shop-fe:local .
docker run -p 3000:3000 --env-file .env.local ecommerce-shop-fe:local
```

CI publishes the image to Docker Hub as `kristijan92/ecommerce-shop-fe`, and ArgoCD pulls it from there. For a local kind cluster, `make load-frontend-image` in the gitops repo loads a local image instead.

---

## CI/CD

A push to `main` runs `.github/workflows/release.yaml`:

1. `test` runs `npm ci` and `npm run lint`.
2. `build` builds the image and pushes it to Docker Hub as `kristijan92/ecommerce-shop-fe:<first 7 characters of the commit SHA>`.
3. `bump-gitops` sets `newTag` in `apps/frontend/envs/homelab/kustomization.yaml` in the gitops repo with `yq`, commits to `main` and pushes. ArgoCD on the homelab then deploys the new image.

The workflow needs these in the repo settings:

| Name                   | Kind     | Use                                                        |
| ---------------------- | -------- | ---------------------------------------------------------- |
| `DOCKERHUB_USERNAME`   | variable | Docker Hub login                                           |
| `DOCKERHUB_TOKEN`      | secret   | Docker Hub access token                                    |
| `GITOPS_APP_CLIENT_ID` | variable | Client ID of the GitHub App that writes to the gitops repo |
| `GITOPS_APP_KEY`       | secret   | Private key of that App                                    |

The workflow updates only the homelab overlay. The aws-prod overlay keeps its pinned tag until it is changed in the gitops repo. Lint prints warnings about `<img>` instead of `next/image`. They do not fail the build. Dependabot checks the GitHub Actions versions weekly.

---

## Environment variables

| Variable                      | Description                                                 |
| ----------------------------- | ----------------------------------------------------------- |
| `API_URL`                     | Backend base URL, without port (default `http://localhost`) |
| `API_PORT`                    | Backend port (default `3000`)                               |
| `JWT_SECRET`                  | Secret for verifying JWTs                                   |
| `REDIS_HOST`                  | Redis host                                                  |
| `REDIS_PORT`                  | Redis port (default `6379`)                                 |
| `REDIS_PASSWORD`              | Redis password, optional                                    |
| `LOG_LEVEL`                   | pino log level (default `info`)                             |
| `OTEL_SERVICE_NAME`           | Service name in Grafana (`ecommerce-fe`)                    |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP endpoint (locally `http://localhost:4318`)             |
| `OTEL_SDK_DISABLED`           | Standard OpenTelemetry flag, `true` turns telemetry off     |
