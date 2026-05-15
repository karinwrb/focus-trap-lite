/**
 * focusInitializerManager.ts
 * Manages multiple FocusInitializer instances keyed by container element.
 */

import {
  createFocusInitializer,
  FocusInitializer,
  FocusInitializerOptions,
  InitialFocusStrategy,
} from './focusInitializer';

export interface FocusInitializerManager {
  getOrCreate(container: HTMLElement, opts?: Partial<Omit<FocusInitializerOptions, 'container'>>): FocusInitializer;
  get(container: HTMLElement): FocusInitializer | undefined;
  drop(container: HTMLElement): void;
  initializeAll(): void;
  setGlobalStrategy(strategy: InitialFocusStrategy): void;
  size(): number;
}

export function createFocusInitializerManager(): FocusInitializerManager {
  const registry = new Map<HTMLElement, FocusInitializer>();
  let globalStrategy: InitialFocusStrategy = 'auto';

  function getOrCreate(
    container: HTMLElement,
    opts: Partial<Omit<FocusInitializerOptions, 'container'>> = {}
  ): FocusInitializer {
    if (registry.has(container)) return registry.get(container)!;
    const initializer = createFocusInitializer({
      container,
      strategy: opts.strategy ?? globalStrategy,
      dataAttr: opts.dataAttr,
      fallbackSelector: opts.fallbackSelector,
    });
    registry.set(container, initializer);
    return initializer;
  }

  function get(container: HTMLElement): FocusInitializer | undefined {
    return registry.get(container);
  }

  function drop(container: HTMLElement): void {
    registry.delete(container);
  }

  function initializeAll(): void {
    registry.forEach((initializer) => initializer.initialize());
  }

  function setGlobalStrategy(strategy: InitialFocusStrategy): void {
    globalStrategy = strategy;
  }

  function size(): number {
    return registry.size;
  }

  return { getOrCreate, get, drop, initializeAll, setGlobalStrategy, size };
}
