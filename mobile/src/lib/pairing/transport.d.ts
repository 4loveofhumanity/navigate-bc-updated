// Types for the platform-resolved transport (transport.web.ts / transport.native.ts).
import type { PairingMethod, PairingTransport } from './types';

export function createTransport(method: PairingMethod): PairingTransport;
