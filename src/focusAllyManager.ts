/**
 * focusAllyManager — maintains a registry of FocusAlly instances keyed by
 * container element, mirroring the manager pattern used across this library.
 */

import { createFocusAlly, type FocusAlly, type AllyReport } from './focusAlly';

export interface FocusAllyManager {
  getOrCreate(container: HTMLElement): FocusAlly;
  get(container: HTMLElement): FocusAlly | undefined;
  drop(container: HTMLElement): void;
  auditAll(): Map<HTMLElement, AllyReport>;
  getSize(): number;
}

export function createFocusAllyManager(): FocusAllyManager {
  const registry = new Map<HTMLElement, FocusAlly>();

  function getOrCreate(container: HTMLElement): FocusAlly {
    if (!registry.has(container)) {
      registry.set(container, createFocusAlly(container));
    }
    return registry.get(container)!;
  }

  function get(container: HTMLElement): FocusAlly | undefined {
    return registry.get(container);
  }

  function drop(container: HTMLElement): void {
    registry.delete(container);
  }

  function auditAll(): Map<HTMLElement, AllyReport> {
    const results = new Map<HTMLElement, AllyReport>();
    registry.forEach((ally, el) => {
      results.set(el, ally.audit());
    });
    return results;
  }

  function getSize(): number {
    return registry.size;
  }

  return { getOrCreate, get, drop, auditAll, getSize };
}
