# Pugliese Navigate Native

Expo SDK 57 / React Native production foundation for Pugliese Navigate. The native app carries forward the useful behavior of the legacy app without reproducing its dated Android UI.

## Implemented

- Native Expo Router stack and persistent Home / Emergency / Alerts / Help / Settings rail.
- Exact supplied Lily Pond photograph and Pugliese College seal.
- Searchable Directory with department and employee modes.
- Course term, search, and online-only filters with typed API validation.
- Date-based Events navigation and empty states.
- Official Pugliese College Academic Calendar dates with source and freshness metadata.
- IT status board, Alerts, searchable Help, and persisted Settings.
- My Pugliese Info adapter, privacy masking, a clearly labeled demo Student ID, official Library resources, map handoff, Career plan, and validated Fix-it intake.
- Explicit demo labeling wherever an authenticated or official data source is not connected.

See [FEATURE_PARITY.md](./FEATURE_PARITY.md) for the integration status of every carried-forward legacy function.

## Local Setup

Requirements:

- Node.js 22+
- pnpm 10+
- Python 3.11+ for the current local API gateway

```powershell
cd mobile
Copy-Item .env.example .env.local
pnpm install
pnpm run assets
pnpm run web
```

In a second terminal from the repository root:

```powershell
python services/gateway.py
```

The app uses `EXPO_PUBLIC_API_URL`. Web and iOS Simulator can use `http://127.0.0.1:8641/api` when the gateway runs on the same computer.

## Physical iPhone From Windows

Apple's iOS Simulator is part of Xcode and only runs on macOS. On Windows, use an EAS development build on a registered iPhone:

1. Set `.env.local` to the development computer's LAN address, for example `EXPO_PUBLIC_API_URL=http://192.168.1.20:8641/api`.
2. Start the gateway on the LAN:

```powershell
$env:BC_GATEWAY_HOST='0.0.0.0'
python services/gateway.py
```

3. Build and start a development client:

```powershell
pnpm dlx eas-cli login
pnpm dlx eas-cli build --profile development --platform ios
pnpm exec expo start --dev-client
```

An Apple Developer account and device registration are required for an installable development build.

## iOS Simulator On A Mac

Install Xcode and an iOS Simulator runtime, then run:

```bash
cd mobile
cp .env.example .env.local
pnpm install
pnpm ios
```

The `simulator` profile in `eas.json` can also create an internal simulator build:

```bash
pnpm dlx eas-cli build --profile simulator --platform ios
```

Expo reference: [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/) and [development builds](https://docs.expo.dev/develop/development-builds/introduction/).

## Quality Commands

```powershell
pnpm run typecheck
pnpm run lint
pnpm run export:web
```

## Configuration

- Bundle identifier: `com.nahid.pugliesenavigate`
- URL scheme: `pugliesenavigate://`
- App icon and splash assets are generated deterministically from `assets/brand/pugliese-college-seal.svg` by `pnpm run assets`.
- Replace the bundle identifier and complete institutional approval before an official Pugliese College release.

## Production Boundaries

The app is release-structured, not institutionally integrated. Production still requires:

- CUNY/Pugliese College SSO and a reviewed authorization model.
- Signed, revocable Student ID issuance and a separately audited verifier application.
- Official Directory, Catalog, Events, IT status, CUNY Alert, and ticketing APIs.
- Push notification credentials and user consent flows.
- Content-owner review and ongoing link monitoring for Library resources and hours.
- Refresh and review of the Academic Calendar snapshot whenever the Registrar publishes changes.
- Official campus geometry and accessible indoor route data.
- Privacy review, accessibility audit, analytics policy, support ownership, App Store assets, and institutional approval.

No password is stored by this implementation. The legacy “Save Password to Device” behavior was intentionally not carried forward.
