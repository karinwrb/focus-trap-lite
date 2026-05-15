/**
 * focusDirectionalManager.ts
 * Manages multiple FocusDirectional instances keyed by container element.
 */

import {
  createFocusDirectional,
  FocusDirectional,
  FocusDirectionalOptions,
} from './focusDirectional';

export interface FocusDirectionalManager {
  getOrCreate(container: HTMLElement, options?: FocusDirectionalOptions): FocusDirectional;
  get(container: HTMLElement): FocusDirectional | undefined;
  drop(container: HTMLElement): void;
  dropAll(): void;
  getCount(): number;
}

export function createFocusDirectionalManager(): FocusDirectionalManager {
  const map = new Map<HTMLElement, FocusDirectional>();

  function getOrCreate(
    container: HTMLElement,
    options?: FocusDirectionalOptions
  ): FocusDirectional {
    if (map.has(container)) return map.get(container)!;
    const instance = createFocusDirectional(options);
    instance.attach(container);
    map.set(container, instance);
    return instance;
  }

  function get(container: HTMLElement): FocusDirectional | undefined {
    return map.get(container);
  }

  function drop(container: HTMLElement): void {
    const instance = map.get(container);
    if (instance) {
      instance.detach();
      map.delete(container);
    }
  }

  function dropAll(): void {
    map.forEach(instance => instance.detach());
    map.clear();
  }

  function getCount(): number {
    return map.size;
  }

  return { getOrCreate, get, drop, dropAll, getCount };
}
