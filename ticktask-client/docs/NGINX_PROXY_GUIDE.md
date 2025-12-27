# Nginx Reverse Proxy Guide

This document explains how the TickTask frontend uses nginx as a reverse proxy to communicate with the backend API, and how this configuration works across different deployment environments.

---

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [The Solution: Reverse Proxy](#the-solution-reverse-proxy)
- [How It Works](#how-it-works)
- [Configuration Files](#configuration-files)
- [Environment-Specific Setup](#environment-specific-setup)
- [Request Flow Diagrams](#request-flow-diagrams)
- [Troubleshooting](#troubleshooting)

---

## Overview

The TickTask frontend is a React Single Page Application (SPA) that needs to communicate with a Spring Boot backend API. Instead of hardcoding the backend URL into the React app, we use **nginx as a reverse proxy** to route API requests.

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **No CORS Issues** | API calls are same-origin (from the browser's perspective) |
| **Runtime Configuration** | Backend URL is set at container startup, not build time |
| **Environment Agnostic** | Same Docker image works in Docker Compose and Kubernetes |
| **Security** | Backend is not directly exposed to the internet |

---

## The Problem

### Why Not Use VITE_API_URL?

Vite environment variables (`VITE_*`) are **baked in at build time**. This creates several challenges:

```
Build Time                    Runtime
    │                            │
    ▼                            ▼
┌─────────────┐            ┌─────────────┐
│ npm run     │            │ Container   │
│ build       │ ────────── │ starts      │
│             │            │             │
│ VITE_API_URL│            │ Backend IP  │
│ = ???       │            │ = 10.0.0.15 │
└─────────────┘            └─────────────┘
       │                          │
       └──── We don't know ───────┘
             the IP yet!
```

**Problems:**
1. Container IPs are ephemeral (change on restart)
2. Service names differ between Docker Compose (`app`) and Kubernetes (`ticktask-api-service`)
3. Would need to rebuild the image for each environment

---

## The Solution: Reverse Proxy

Instead of the React app calling the backend directly, we:

1. React app uses **relative URLs** (`/api/tasks` instead of `http://backend:8080/api/tasks`)
2. Nginx intercepts requests to `/api/*`
3. Nginx forwards them to the backend service
4. The backend URL is **configured at runtime** via environment variable

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Container                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                     Browser                           │   │
│  │                                                       │   │
│  │   fetch('/api/tasks')  ◄── Relative URL (no host)    │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                      Nginx                            │   │
│  │                                                       │   │
│  │   location /api/ {                                    │   │
│  │       proxy_pass ${API_BACKEND_URL}/api/;             │   │
│  │   }                                                   │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            │ HTTP request to http://app:8080/api/tasks
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                   Backend Container (app)                      │
│                                                                │
│   Spring Boot API listening on :8080                           │
└────────────────────────────────────────────────────────────────┘
```

---

## How It Works

### 1. Container Startup

When the client container starts, the `docker-entrypoint.sh` script runs:

```bash
#!/bin/sh
# Get the backend URL from environment variable (with default)
API_BACKEND_URL=${API_BACKEND_URL:-http://app:8080}

# Replace ${API_BACKEND_URL} in the nginx config template
envsubst '${API_BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template \
                              > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
```

### 2. Template Processing

**Before (nginx.conf.template):**
```nginx
location /api/ {
    proxy_pass ${API_BACKEND_URL}/api/;
}
```

**After processing (default.conf):**
```nginx
location /api/ {
    proxy_pass http://app:8080/api/;
}
```

### 3. Request Routing

| Request From Browser | Nginx Action | Backend Receives |
|---------------------|--------------|------------------|
| `GET /api/tasks` | Proxy to `http://app:8080/api/tasks` | `GET /api/tasks` |
| `POST /api/tasks` | Proxy to `http://app:8080/api/tasks` | `POST /api/tasks` |
| `GET /` | Serve `index.html` | - |
| `GET /settings` | Serve `index.html` (SPA) | - |

---

## Configuration Files

### nginx.conf.template

The template file with environment variable placeholder:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # API Proxy - ${API_BACKEND_URL} replaced at runtime
    location /api/ {
        proxy_pass ${API_BACKEND_URL}/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### docker-entrypoint.sh

Processes the template and starts nginx:

```bash
#!/bin/sh
API_BACKEND_URL=${API_BACKEND_URL:-http://app:8080}
envsubst '${API_BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template \
                              > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
```

### Dockerfile

```dockerfile
FROM nginx:alpine
RUN apk add --no-cache gettext  # For envsubst
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
```

---

## Environment-Specific Setup

### Docker Compose

In `docker-compose.yml`, the service name is `app`:

```yaml
services:
  app:  # ◄── This is the backend service name
    build: ./ticktask-server
    ports:
      - "8080:8080"

  client:
    build: ./ticktask-client
    environment:
      API_BACKEND_URL: "http://app:8080"  # ◄── Use service name
    depends_on:
      - app
```

Docker Compose creates an internal DNS that resolves `app` to the backend container's IP.

### Kubernetes

In Kubernetes, you use the **Service name** instead:

```yaml
# Deployment for frontend
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ticktask-client
spec:
  template:
    spec:
      containers:
      - name: client
        image: ghcr.io/yourorg/ticktask-client:latest
        env:
        - name: API_BACKEND_URL
          value: "http://ticktask-api-service:8080"  # ◄── K8s Service name
```

Kubernetes DNS resolves `ticktask-api-service` to the backend pod's ClusterIP.

### Comparison

| Environment | API_BACKEND_URL | DNS Resolution |
|-------------|-----------------|----------------|
| Docker Compose | `http://app:8080` | Docker internal DNS |
| Kubernetes | `http://ticktask-api-service:8080` | Kubernetes CoreDNS |
| Local Dev | N/A (Vite proxy) | localhost |

---

## Request Flow Diagrams

### Docker Compose Flow

```
┌─────────────┐     ┌─────────────────────────────────────────┐
│   Browser   │     │         Docker Network                   │
│             │     │  ┌─────────┐        ┌─────────────────┐ │
│ localhost:  │────▶│  │ client  │──DNS──▶│ app:8080        │ │
│ 3000        │     │  │ (nginx) │        │ (Spring Boot)   │ │
│             │     │  │         │        │                 │ │
│             │◀────│  │ :80     │◀───────│                 │ │
└─────────────┘     │  └─────────┘        └─────────────────┘ │
                    └─────────────────────────────────────────┘

1. Browser: GET http://localhost:3000/api/tasks
2. Port mapping: localhost:3000 → client:80
3. Nginx: proxy_pass http://app:8080/api/tasks
4. Docker DNS: app → 172.18.0.3 (container IP)
5. Request: GET http://172.18.0.3:8080/api/tasks
6. Response flows back through nginx
```

### Kubernetes Flow

```
┌─────────────┐     ┌─────────────────────────────────────────────────┐
│   Browser   │     │              Kubernetes Cluster                  │
│             │     │                                                  │
│             │     │  ┌──────────┐  ┌─────────┐  ┌─────────────────┐ │
│ ingress.    │────▶│  │ Ingress  │─▶│ client  │─▶│ ticktask-api-   │ │
│ example.com │     │  │          │  │ Service │  │ service:8080    │ │
│             │     │  └──────────┘  └─────────┘  └────────┬────────┘ │
│             │◀────│                                      │          │
└─────────────┘     │                              ┌───────▼───────┐  │
                    │                              │ API Pod       │  │
                    │                              │ (Spring Boot) │  │
                    │                              └───────────────┘  │
                    └─────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Check Nginx Configuration

```bash
# Enter the container
docker exec -it ticktask-client sh

# View the processed config
cat /etc/nginx/conf.d/default.conf

# Test nginx configuration
nginx -t
```

### Check DNS Resolution

```bash
# From inside the client container
docker exec -it ticktask-client sh

# Test DNS resolution
nslookup app
# Should return the backend container's IP
```

### Check Backend Connectivity

```bash
# From inside the client container
docker exec -it ticktask-client sh

# Test connection to backend
wget -qO- http://app:8080/api/tasks
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `502 Bad Gateway` | Backend not running or DNS not resolving | Check backend container is healthy |
| `404 on /api/*` | Nginx config not processed | Check `docker-entrypoint.sh` ran |
| `Connection refused` | Wrong port or service name | Verify `API_BACKEND_URL` value |
| `/api/*` returns HTML | `location /api/` not matching | Check nginx config syntax |

---

## Summary

The nginx reverse proxy approach provides:

1. **Flexibility** - Same image works in Docker Compose and Kubernetes
2. **Simplicity** - Frontend uses simple relative URLs (`/api/tasks`)
3. **Security** - No CORS needed, backend not directly exposed
4. **Runtime Config** - Backend URL set via environment variable at startup

The key insight is that the backend URL is **configured when the container starts** (via `envsubst`), not when the image is built. This makes the same Docker image deployable to any environment.
