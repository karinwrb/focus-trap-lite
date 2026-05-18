/**
 * focusMatrixManager — registry that owns multiple FocusMatrix instances
 * keyed by container element, mirroring the manager pattern used elsewhere.
 */

import { createFocusMatrix, FocusMatrix, FocusMatrixOptions } from './focusMatrix';

export interface FocusMatrixManager {
  getOrCreate: (el: HTMLElement, options?: FocusMatrixOptions) => FocusMatrix;
  get: (el: HTMLElement) => FocusMatrix | undefined;
  drop: (el: HTMLElement) => void;
  dropAll: () => void;
  getSize: () => number;
}

export function createFocusMatrixManager(): FocusMatrixManager {
  const store = new Map<HTMLElement, FocusMatrix>();

  function getOrCreate(el: HTMLElement, options?: FocusMatrixOptions): FocusMatrix {
    if (store.has(el)) return store.get(el)!;
    const matrix = createFocusMatrix(el, options);
    matrix.attach();
    store.set(el, matrix);
    return matrix;
  }

  function get(el: HTMLElement): FocusMatrix | undefined {
    return store.get(el);
  }

  function drop(el: HTMLElement): void {
    const matrix = store.get(el);
    if (matrix) {
      matrix.detach();
      store.delete(el);
    }
  }

  function dropAll(): void {
    store.forEach((matrix) => matrix.detach());
    store.clear();
  }

  function getSize(): number {
    return store.size;
  }

  return { getOrCreate, get, drop, dropAll, getSize };
}
