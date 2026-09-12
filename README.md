# Pugliese Navigate

Pugliese Navigate now has two clients:

- `mobile/`: the primary Expo SDK 57 / React Native application, structured for iOS, Android, and web.
- `frontend/`: the original browser prototype retained as a visual and service reference.

The supplied Lily Pond photograph and Pugliese College seal are used directly. Private or authenticated campus functions use typed adapters and clearly labeled demo fallbacks until official services are available.

## Architecture

```text
mobile/                        Expo Router native application
frontend/                     legacy single-page browser prototype
services/gateway.py    :8641  frontend host and /api gateway
services/info_service.py      student profile demo adapter
services/catalog_service.py   catalog demo adapter
services/map_service.py       wayfinding demo adapter
services/library_service.py   official library resources adapter
services/nearby_service.py    opt-in synthetic nearby data
services/academic_calendar_service.py verified Registrar calendar adapter
services/student_id_service.py clearly labeled Student ID demo adapter
```

## Run The Native App

```powershell
python services/gateway.py
```

In another terminal:

```powershell
cd mobile
pnpm install
pnpm run web
```

Read [mobile/README.md](./mobile/README.md) for physical iPhone, Mac iOS Simulator, EAS build, environment, and production-integration instructions.

## Run The Legacy Browser Prototype

```powershell
python services/gateway.py
```

Open `http://127.0.0.1:8641/`.

## Deploy To DigitalOcean App Platform

The repo ships a single-container deploy: a multi-stage [`Dockerfile`](./Dockerfile)
builds the Expo web export, and the Python gateway serves that bundle **and**
proxies `/api` to the demo microservices — one origin, no CORS.

- [`Dockerfile`](./Dockerfile) — stage 1 builds `mobile/` (`pnpm run export:web`
  with `EXPO_PUBLIC_API_URL=/api`); stage 2 runs `services/gateway.py`.
- [`.do/app.yaml`](./.do/app.yaml) — App Platform spec (one `web` service).

The gateway is platform-aware: it binds `$PORT` (App Platform sets it), binds
`0.0.0.0` when `BC_GATEWAY_HOST=0.0.0.0`, and serves the export directory named
by `BC_WEB_DIR` with client-route fallback so deep links resolve on reload.

Steps:

1. Push this repo to GitHub, then set `github.repo` / `branch` in
   [`.do/app.yaml`](./.do/app.yaml).
2. Create the app:

   ```bash
   doctl apps create --spec .do/app.yaml
   ```

   (or create it in the DO console from the repo — it auto-detects the
   Dockerfile). Update later with `doctl apps update <app-id> --spec .do/app.yaml`.

To split the web and API into separate components later, deploy the API service
on its own and set the static build's `EXPO_PUBLIC_API_URL` to the API's public
URL plus `/api`, and set `BC_ALLOWED_ORIGINS` to the web origin for CORS.

### Build and run the container locally

```bash
docker build -t pugliese-navigate .
docker run --rm -p 8080:8080 pugliese-navigate
# open http://127.0.0.1:8080/
```

## Safety

- Emergency actions require an explicit choice before opening the device dialer.
- Demo alerts, reports, and service health are labeled and are not official records.
- Password storage from the legacy app is intentionally excluded.
- Physical-phone API access is opt-in by setting `BC_GATEWAY_HOST=0.0.0.0`; the default gateway remains loopback-only.
