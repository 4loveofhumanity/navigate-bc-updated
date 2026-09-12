# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1 — build the Expo web export (static single-page bundle).
# ---------------------------------------------------------------------------
FROM node:22-bookworm-slim AS web
WORKDIR /build/mobile
RUN corepack enable

# Install dependencies against the committed lockfile first for better caching.
COPY mobile/package.json mobile/pnpm-lock.yaml mobile/pnpm-workspace.yaml ./
RUN corepack pnpm install --frozen-lockfile

# Build-time API base. Same-origin "/api" works because the gateway (stage 2)
# serves this bundle and proxies /api on the same host. Override with a full
# URL if the API is deployed separately.
ARG EXPO_PUBLIC_API_URL=/api
ENV EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL}

COPY mobile/ ./
RUN corepack pnpm run export:web

# ---------------------------------------------------------------------------
# Stage 2 — Python gateway that serves the web bundle and proxies /api.
# ---------------------------------------------------------------------------
FROM python:3.12-slim AS runtime
WORKDIR /app

# Pure standard-library services — no pip install required.
COPY services/ ./services/
COPY --from=web /build/mobile/dist ./web/

ENV BC_GATEWAY_HOST=0.0.0.0 \
    BC_WEB_DIR=/app/web \
    PORT=8080 \
    PYTHONUNBUFFERED=1

EXPOSE 8080
CMD ["python", "services/gateway.py"]
