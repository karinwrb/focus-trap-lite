/**
 * focusInertManager.ts
 * Coordinates multiple inert layers for nested focus traps,
 * stacking and unstacking inert state as traps are pushed/popped.
 */

import { createFocusInert, FocusInertManager } from './focusInert';

export interface FocusInertStack {
  push: (trapRoot: HTMLElement) => void;
  pop: () => void;
  getCurrent: () => HTMLElement | null;
  getDepth: () => number;
  releaseAll: () => void;
}

interface InertEntry {
  root: HTMLElement;
  manager: FocusInertManager;
}

export function createFocusInertManager(): FocusInertStack {
  const stack: InertEntry[] = [];

  function push(trapRoot: HTMLElement): void {
    const manager = createFocusInert();
    manager.apply(trapRoot);
    stack.push({ root: trapRoot, manager });
  }

  function pop(): void {
    const entry = stack.pop();
    if (!entry) return;
    entry.manager.release();

    // Re-apply the previous layer if it exists
    const previous = stack[stack.length - 1];
    if (previous) {
      previous.manager.apply(previous.root);
    }
  }

  function getCurrent(): HTMLElement | null {
    return stack.length > 0 ? stack[stack.length - 1].root : null;
  }

  function getDepth(): number {
    return stack.length;
  }

  function releaseAll(): void {
    while (stack.length > 0) {
      const entry = stack.pop()!;
      entry.manager.release();
    }
  }

  return { push, pop, getCurrent, getDepth, releaseAll };
}
