/**
 * focusZoneManager — Manages multiple named FocusZone instances.
 */

import { createFocusZone, FocusZone, FocusZoneOptions } from './focusZone';

export interface FocusZoneManager {
  register: (id: string, container: HTMLElement, options?: FocusZoneOptions) => FocusZone;
  unregister: (id: string) => void;
  get: (id: string) => FocusZone | undefined;
  activateAll: () => void;
  deactivateAll: () => void;
  getRegisteredIds: () => string[];
}

export function createFocusZoneManager(): FocusZoneManager {
  const zones = new Map<string, FocusZone>();

  return {
    register(id, container, options = {}) {
      if (zones.has(id)) {
        zones.get(id)!.detach();
      }
      const zone = createFocusZone(container, options);
      zones.set(id, zone);
      return zone;
    },

    unregister(id) {
      const zone = zones.get(id);
      if (zone) {
        zone.detach();
        zones.delete(id);
      }
    },

    get(id) {
      return zones.get(id);
    },

    activateAll() {
      zones.forEach((zone) => zone.attach());
    },

    deactivateAll() {
      zones.forEach((zone) => zone.detach());
    },

    getRegisteredIds() {
      return Array.from(zones.keys());
    },
  };
}
