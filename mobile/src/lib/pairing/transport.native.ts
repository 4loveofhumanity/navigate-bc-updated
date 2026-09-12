import { createSimulatedTransport } from './simulated';
import { PROXIMITY_TRIGGER_MM, type PairingMethod, type PairingPeer, type PairingTransport, type PairingUpdate } from './types';

// Rough BLE distance estimate from RSSI (log-distance path-loss model). Only
// approximate (±meters). For precise ~0.42 m ranging use UWB via the Nearby
// Interaction framework (iPhone 11+); wire it in here as an alternate transport.
function estimateDistanceMm(rssi: number): number {
  const measuredPowerAt1m = -59;
  const pathLossExponent = 2;
  const meters = Math.pow(10, (measuredPowerAt1m - rssi) / (10 * pathLossExponent));
  return meters * 1000;
}

// Resolve a native module without a static import, so the bundle/typecheck don't
// require it to be installed. Returns null when it isn't present (e.g. Expo Go).
function tryRequire(name: string): any {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(name);
  } catch {
    return null;
  }
}

const PREFIX = 'PUGPAIR';

function encodePeer(peer: PairingPeer): string {
  return [PREFIX, peer.code, peer.name, peer.accent].join('|');
}

function decodePeer(raw: string): PairingPeer | null {
  const parts = raw.split('|');
  if (parts[0] !== PREFIX || parts.length < 4) return null;
  return { code: parts[1], name: parts[2], accent: parts[3] };
}

// --- NFC tap (react-native-nfc-manager) -----------------------------------
// Reads an NDEF text record carrying the peer's code. Works phone<->tag and,
// on Android, phone<->HCE presenter. Writing your own record for the other side
// to read is set up with NfcManager.requestTechnology(Ndef) + writeNdefMessage.
function createNfcTransport(): PairingTransport | null {
  const nfc = tryRequire('react-native-nfc-manager');
  if (!nfc) return null;
  const NfcManager = nfc.default ?? nfc;
  const NfcTech = nfc.NfcTech;
  const Ndef = nfc.Ndef;

  return {
    method: 'nfc',
    native: true,
    async isAvailable() {
      try {
        return await NfcManager.isSupported();
      } catch {
        return false;
      }
    },
    start(self, onUpdate) {
      let done = false;
      (async () => {
        try {
          await NfcManager.start();
          onUpdate({ phase: 'searching', detail: 'Hold your phone near the other device or tag' });
          await NfcManager.requestTechnology(NfcTech.Ndef);
          const tag = await NfcManager.getTag();
          const record = tag?.ndefMessage?.[0];
          const text: string | undefined = record ? Ndef.text.decodePayload(record.payload) : undefined;
          const peer = text ? decodePeer(text) : null;
          if (done) return;
          if (!peer) {
            onUpdate({ phase: 'error', detail: 'Tag did not contain a campus code' });
          } else {
            onUpdate({ phase: 'found', peer });
            onUpdate({ phase: 'connected', peer });
          }
        } catch (error) {
          if (!done) onUpdate({ phase: 'error', detail: String((error as Error)?.message ?? error) });
        } finally {
          try {
            await NfcManager.cancelTechnologyRequest();
          } catch {
            // ignore
          }
        }
      })();
      // encodePeer(self) is written to a tag / presented via HCE in the writer flow.
      void encodePeer(self);
      return {
        cancel() {
          done = true;
          try {
            NfcManager.cancelTechnologyRequest();
          } catch {
            // ignore
          }
          onUpdate({ phase: 'cancelled' });
        },
      };
    },
  };
}

// --- Nearby / closeness (react-native-ble-plx) ----------------------------
// Scans for a nearby phone advertising a local name that encodes its peer code.
// The advertising side uses react-native-ble-advertiser (peripheral role).
function createBleTransport(): PairingTransport | null {
  const ble = tryRequire('react-native-ble-plx');
  if (!ble) return null;
  const BleManager = ble.BleManager;
  if (!BleManager) return null;
  const manager = new BleManager();

  return {
    method: 'nearby',
    native: true,
    async isAvailable() {
      try {
        return (await manager.state()) === 'PoweredOn';
      } catch {
        return false;
      }
    },
    start(_self, onUpdate) {
      let done = false;
      onUpdate({ phase: 'searching', detail: 'Looking for nearby classmates…' });
      try {
        manager.startDeviceScan(null, { allowDuplicates: false }, (error: unknown, device: any) => {
          if (done) return;
          if (error) {
            onUpdate({ phase: 'error', detail: String((error as Error)?.message ?? error) });
            return;
          }
          const name: string | undefined = device?.localName ?? device?.name;
          const peer = name ? decodePeer(name) : null;
          const rssi: number | undefined = typeof device?.rssi === 'number' ? device.rssi : undefined;
          const distanceMm = rssi != null ? estimateDistanceMm(rssi) : undefined;
          // Only pair when the classmate is within arm's length (~420 mm).
          const withinRange = distanceMm == null || distanceMm <= PROXIMITY_TRIGGER_MM;
          if (peer && withinRange) {
            done = true;
            manager.stopDeviceScan();
            onUpdate({ phase: 'found', peer });
            onUpdate({ phase: 'connected', peer });
          }
        });
      } catch (error) {
        onUpdate({ phase: 'error', detail: String((error as Error)?.message ?? error) });
      }
      return {
        cancel() {
          done = true;
          try {
            manager.stopDeviceScan();
          } catch {
            // ignore
          }
          onUpdate({ phase: 'cancelled' } satisfies PairingUpdate);
        },
      };
    },
  };
}

export function createTransport(method: PairingMethod): PairingTransport {
  const native = method === 'nfc' ? createNfcTransport() : createBleTransport();
  // Fall back to the simulation when the native module/dev-build isn't present.
  return native ?? createSimulatedTransport(method);
}
