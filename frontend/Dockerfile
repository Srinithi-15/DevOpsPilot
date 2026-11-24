# ==============================================================================
# DevOpsPilot Frontend Multi-Stage Dockerfile
# Stage 1: Build React static assets with Node.js
# Stage 2: Serve via unprivileged Nginx Alpine (₹0 footprint, production-grade)
# ==============================================================================

# --- Stage 1: Build ---
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Stage 2: Runtime ---
FROM nginxinc/nginx-unprivileged:alpine

USER root
RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*
USER 101

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
