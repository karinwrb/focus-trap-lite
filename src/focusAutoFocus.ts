/**
 * focusAutoFocus.ts
 * Provides auto-focus management: finds and focuses the best candidate
 * element within a container when a trap or dialog is activated.
 */

import { getFirstTabbable, getLastTabbable } from './focusFilter';

export type AutoFocusStrategy = 'first' | 'last' | 'data-autofocus' | 'none';

export interface FocusAutoFocusOptions {
  strategy?: AutoFocusStrategy;
  fallback?: HTMLElement | null;
}

export interface FocusAutoFocus {
  focus(container: HTMLElement): HTMLElement | null;
  getStrategy(): AutoFocusStrategy;
  setStrategy(strategy: AutoFocusStrategy): void;
}

function findDataAutoFocus(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>('[data-autofocus]');
}

export function createFocusAutoFocus(
  options: FocusAutoFocusOptions = {}
): FocusAutoFocus {
  let strategy: AutoFocusStrategy = options.strategy ?? 'first';
  const fallback = options.fallback ?? null;

  function focus(container: HTMLElement): HTMLElement | null {
    let target: HTMLElement | null = null;

    if (strategy === 'data-autofocus') {
      target = findDataAutoFocus(container);
    } else if (strategy === 'first') {
      target = getFirstTabbable(container);
    } else if (strategy === 'last') {
      target = getLastTabbable(container);
    }

    if (!target) {
      target = fallback;
    }

    if (target) {
      target.focus();
    }

    return target;
  }

  function getStrategy(): AutoFocusStrategy {
    return strategy;
  }

  function setStrategy(next: AutoFocusStrategy): void {
    strategy = next;
  }

  return { focus, getStrategy, setStrategy };
}
