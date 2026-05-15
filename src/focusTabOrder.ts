/**
 * focusTabOrder.ts
 * Utilities for computing and manipulating the effective tab order
 * of focusable elements within a container.
 */

import { filterTabbable } from './focusFilter';

export interface FocusTabOrder {
  getElements: () => HTMLElement[];
  indexOf: (el: HTMLElement) => number;
  getNext: (el: HTMLElement) => HTMLElement | null;
  getPrev: (el: HTMLElement) => HTMLElement | null;
  getFirst: () => HTMLElement | null;
  getLast: () => HTMLElement | null;
  refresh: () => void;
}

export function createFocusTabOrder(container: HTMLElement): FocusTabOrder {
  let elements: HTMLElement[] = [];

  function refresh(): void {
    elements = filterTabbable(Array.from(container.querySelectorAll<HTMLElement>('*')));
  }

  function getElements(): HTMLElement[] {
    return elements.slice();
  }

  function indexOf(el: HTMLElement): number {
    return elements.indexOf(el);
  }

  function getNext(el: HTMLElement): HTMLElement | null {
    const idx = indexOf(el);
    if (idx === -1) return null;
    return elements[idx + 1] ?? null;
  }

  function getPrev(el: HTMLElement): HTMLElement | null {
    const idx = indexOf(el);
    if (idx === -1) return null;
    return elements[idx - 1] ?? null;
  }

  function getFirst(): HTMLElement | null {
    return elements[0] ?? null;
  }

  function getLast(): HTMLElement | null {
    return elements[elements.length - 1] ?? null;
  }

  refresh();

  return { getElements, indexOf, getNext, getPrev, getFirst, getLast, refresh };
}
