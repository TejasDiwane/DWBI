# 📊 DWBI Project — Node.js + Prometheus + Grafana Monitoring Stack

![](../Users/ASUS/github/DWBI/week-26-prom/image-1.png)

![](../Users/ASUS/github/DWBI/week-26-prom/image-2.png)

![](../Users/ASUS/github/DWBI/week-26-prom/image-3.png)

![](../Users/ASUS/github/DWBI/week-26-prom/image.png)

A production-ready **Express.js** application instrumented with **Prometheus** metrics and visualized via **Grafana** — all containerized with Docker.

---

## 📁 Project Structure

```
DWBI-PROJECT/
├── src/
│   ├── index.ts              # Express app entry point + routes
│   ├── middleware.ts          # Request logging middleware
│   └── metrics/
│       ├── index.ts           # Metrics middleware (attaches to all requests)
│       ├── requestCount.ts    # Counter: total HTTP requests
│       ├── requestTime.ts     # Histogram: request duration in ms
│       └── activeRequests.ts  # Gauge: currently active requests
├── Dockerfile                 # Docker image for the Node.js app
├── docker-compose.yml         # Orchestrates Node app + Prometheus + Grafana
├── prometheus.yml             # Prometheus scrape configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧰 Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18+ | https://nodejs.org |
| **Docker** | Latest | https://www.docker.com/get-started |
| **Docker Compose** | v2+ (bundled with Docker Desktop) | ↑ same |

> **Tip:** Run `node -v`, `docker -v`, and `docker compose version` to verify.

---

## 🚀 Quick Start (Docker — Recommended)

This is the easiest way to run everything with one command.

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd DWBI-PROJECT
```

### 2. Build and start all services

```bash
docker-compose up --build
```

> Add `-d` to run in the background (detached mode):
> ```bash
> docker-compose up --build -d
> ```

### 3. Access the services

| Service | URL | Credentials |
|---------|-----|-------------|
| **Node.js API** | http://localhost:3000 | — |
| **Prometheus** | http://localhost:9090 | — |
| **Grafana** | http://localhost:3001 | `admin` / `admin` |

### 4. Stop all services

```bash
docker-compose down
```

---

## 🛠️ Local Development (Without Docker)

Use this if you want to run the Node.js app directly on your machine.

### 1. Install dependencies

```bash
npm install
```

### 2. Run in development mode

```bash
npm run dev
```

> This uses `ts-node` to run TypeScript directly without compiling.

### 3. Run in production mode

```bash
npm run start
```

> This compiles TypeScript first (`tsc -b`) then runs `node dist/index.js`.

---

## 🌐 API Endpoints

All routes are available at `http://localhost:3000`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/user` | Returns user: DWBI PROJECT |
| `GET` | `/user2` | Returns user: Tejas |
| `GET` | `/user3` | Returns user: Soham |
| `GET` | `/user4` | Returns user: Usha |
| `POST` | `/user` | Accepts JSON body, echoes it back with an `id` |
| `GET` | `/metrics` | Prometheus metrics scrape endpoint |

### Example

```bash
# GET a user
curl http://localhost:3000/user

# POST a user
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "age": 30}'

# View raw Prometheus metrics
curl http://localhost:3000/metrics
```

---

## 📈 Prometheus Metrics

The following custom metrics are exposed at `/metrics`:

| Metric Name | Type | Description |
|-------------|------|-------------|
| `http_requests_total` | Counter | Total HTTP requests (labeled by method, route, status_code) |
| `http_request_duration_ms` | Histogram | Duration of each request in milliseconds |
| `active_requests` | Gauge | Number of requests currently being processed |

Prometheus scrapes these metrics every **15 seconds** from `http://node-app:3000/metrics`.

---

## 📊 Setting Up Grafana

1. Open Grafana at **http://localhost:3001**
2. Log in with `admin` / `admin`
3. Add a **Prometheus data source**:
   - Go to **Connections → Data Sources → Add data source**
   - Select **Prometheus**
   - Set URL to: `http://prometheus:9090`
   - Click **Save & Test**
4. Create a new **Dashboard** and use these example queries:

```promql
# Total requests per route
http_requests_total

# Request rate (per second, over 1 minute)
rate(http_requests_total[1m])

# 95th percentile response time
histogram_quantile(0.95, rate(http_request_duration_ms_bucket[5m]))

# Active requests right now
active_requests
```

---

## 🐳 Docker Services Overview

```yaml
node-app   → Builds from Dockerfile, runs on port 3000
prometheus → Scrapes /metrics every 15s, UI on port 9090
grafana    → Visualization dashboard, UI on port 3001
```

**Startup order:** `node-app` → `prometheus` → `grafana`

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 already in use | Stop other services or change port in `docker-compose.yml` |
| Container keeps restarting | Run `docker logs dwbi-project-node-app-1` to see errors |
| Prometheus shows no targets | Ensure node-app is running; check `http://localhost:9090/targets` |
| Grafana can't connect to Prometheus | Use `http://prometheus:9090` as the data source URL (not localhost) |
| TypeScript compile errors | Run `npm install` locally to ensure all types are installed |

### Useful Docker commands

```bash
# View logs for a specific service
docker logs dwbi-project-node-app-1

# Check running containers
docker ps

# Rebuild only the node app image
docker-compose up --build node-app

# Remove all containers and volumes
docker-compose down -v
```

---

## 📦 Tech Stack

- **[Express.js](https://expressjs.com/)** — Web framework
- **[prom-client](https://github.com/siimon/prom-client)** — Prometheus client for Node.js
- **[Prometheus](https://prometheus.io/)** — Metrics collection & alerting
- **[Grafana](https://grafana.com/)** — Metrics visualization
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe JavaScript
- **[Docker](https://www.docker.com/)** — Containerization