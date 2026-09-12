// Metro resolves `./transport` to transport.native.ts on iOS/Android and
// transport.web.ts on web, so native modules never reach the web bundle.
import { createTransport } from './transport';
import type { PairingMethod, PairingTransport } from './types';

export * from './types';

export function getPairingTransport(method: PairingMethod): PairingTransport {
  return createTransport(method);
}
