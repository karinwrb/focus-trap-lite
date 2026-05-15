/**
 * focusScopeManager.ts
 * Manages multiple named focus scopes, allowing lookup and
 * querying of the currently active scope.
 */

import { FocusScope, FocusScopeOptions, createFocusScope } from './focusScope';

export interface FocusScopeManager {
  getOrCreate: (options: FocusScopeOptions) => FocusScope;
  get: (name: string) => FocusScope | undefined;
  drop: (name: string) => void;
  getActive: () => FocusScope | undefined;
  getAll: () => FocusScope[];
  getCount: () => number;
  clear: () => void;
}

export function createFocusScopeManager(): FocusScopeManager {
  const scopes = new Map<string, FocusScope>();

  function getOrCreate(options: FocusScopeOptions): FocusScope {
    const existing = scopes.get(options.name);
    if (existing) return existing;
    const scope = createFocusScope(options);
    scopes.set(options.name, scope);
    return scope;
  }

  function get(name: string): FocusScope | undefined {
    return scopes.get(name);
  }

  function drop(name: string): void {
    const scope = scopes.get(name);
    if (scope) {
      scope.destroy();
      scopes.delete(name);
    }
  }

  function getActive(): FocusScope | undefined {
    for (const scope of scopes.values()) {
      if (scope.containsFocus()) return scope;
    }
    return undefined;
  }

  function getAll(): FocusScope[] {
    return Array.from(scopes.values());
  }

  function getCount(): number {
    return scopes.size;
  }

  function clear(): void {
    for (const scope of scopes.values()) {
      scope.destroy();
    }
    scopes.clear();
  }

  return { getOrCreate, get, drop, getActive, getAll, getCount, clear };
}
