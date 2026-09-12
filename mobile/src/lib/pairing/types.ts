// Pairing abstraction for connecting two students in person.
//
// Two transports are supported:
//   - 'nearby' : BLE advertise + scan (proximity, like AirDrop/AirTag). Primary
//                for iPhone <-> iPhone and cross-platform.
//   - 'nfc'    : NFC tap. Reads/writes an NDEF record carrying a peer code.
//                Works phone <-> tag, or phone <-> Android HCE presenter.
//                (Modern iOS/Android have no phone-to-phone NFC.)
//
// The real transports need native modules and a custom dev build; on web / Expo
// Go we fall back to a simulated transport so the flow is fully usable in the demo.

// Proximity trigger for the 'nearby' method: two phones pair when within ~0.42 m
// (arm's length). UWB (Nearby Interaction) measures this precisely; BLE RSSI can
// only estimate it (±meters); NFC is out of range (it needs a ~40 mm touch).
export const PROXIMITY_TRIGGER_MM = 420;

export type PairingMethod = 'nfc' | 'nearby';

export type PairingPeer = { name: string; code: string; accent: string };

export type PairingPhase = 'searching' | 'found' | 'connected' | 'unavailable' | 'cancelled' | 'error';

export type PairingUpdate = { phase: PairingPhase; peer?: PairingPeer; detail?: string };

export type PairingHandle = { cancel: () => void };

export interface PairingTransport {
  readonly method: PairingMethod;
  /** True when this transport can run on the current device/build. */
  isAvailable(): Promise<boolean>;
  /** Whether this transport is the real native one (false = simulated fallback). */
  readonly native: boolean;
  /** Begin pairing; drives onUpdate through the phases; returns a cancel handle. */
  start(self: PairingPeer, onUpdate: (update: PairingUpdate) => void): PairingHandle;
}
