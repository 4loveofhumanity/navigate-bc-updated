import { PROXIMITY_TRIGGER_MM, type PairingMethod, type PairingPeer, type PairingTransport } from './types';

// Stand-in classmates a nearby/NFC pair can discover in the demo.
const POOL: PairingPeer[] = [
  { name: 'Rafi', code: 'BC-6621', accent: '#1F7A8C' },
  { name: 'Meera', code: 'BC-7788', accent: '#A8324A' },
  { name: 'Tanvir', code: 'BC-8123', accent: '#2F8F6B' },
  { name: 'Sadia', code: 'BC-9245', accent: '#6C4BB6' },
  { name: 'Imran', code: 'BC-1377', accent: '#B5761F' },
  { name: 'Nusrat', code: 'BC-2450', accent: '#5E82B7' },
];

let cursor = 0;

// A transport that mimics the pairing phases with timers so the whole flow is
// usable without native hardware.
export function createSimulatedTransport(method: PairingMethod): PairingTransport {
  return {
    method,
    native: false,
    async isAvailable() {
      return true;
    },
    start(_self, onUpdate) {
      let cancelled = false;
      const timers: ReturnType<typeof setTimeout>[] = [];
      // NFC "tap" resolves fast; BLE proximity takes a moment to discover.
      const discoverMs = method === 'nfc' ? 800 : 1500;
      const foundDetail = method === 'nearby' ? `~${PROXIMITY_TRIGGER_MM} mm away` : undefined;

      onUpdate({ phase: 'searching', detail: method === 'nearby' ? `Bring phones within ${PROXIMITY_TRIGGER_MM} mm` : undefined });
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          const peer = POOL[cursor % POOL.length];
          cursor += 1;
          onUpdate({ phase: 'found', peer, detail: foundDetail });
          timers.push(
            setTimeout(() => {
              if (!cancelled) onUpdate({ phase: 'connected', peer });
            }, 550),
          );
        }, discoverMs),
      );

      return {
        cancel() {
          if (cancelled) return;
          cancelled = true;
          timers.forEach(clearTimeout);
          onUpdate({ phase: 'cancelled' });
        },
      };
    },
  };
}
