import { createSimulatedTransport } from './simulated';
import type { PairingMethod, PairingTransport } from './types';

// Web has no NFC/BLE peer pairing — always simulate.
export function createTransport(method: PairingMethod): PairingTransport {
  return createSimulatedTransport(method);
}
