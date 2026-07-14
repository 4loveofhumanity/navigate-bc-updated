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

## Safety

- Emergency actions require an explicit choice before opening the device dialer.
- Demo alerts, reports, and service health are labeled and are not official records.
- Password storage from the legacy app is intentionally excluded.
- Physical-phone API access is opt-in by setting `BC_GATEWAY_HOST=0.0.0.0`; the default gateway remains loopback-only.
