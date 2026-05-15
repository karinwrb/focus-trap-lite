/**
 * focusBoundaryManager – manages a stack of FocusBoundary instances,
 * ensuring only the topmost boundary is actively listening at any time.
 */

import { createFocusBoundary, FocusBoundary, FocusBoundaryListener } from "./focusBoundary";

export interface FocusBoundaryManager {
  push: (container: HTMLElement) => FocusBoundary;
  pop: () => FocusBoundary | undefined;
  getCurrent: () => FocusBoundary | undefined;
  getDepth: () => number;
  clear: () => void;
}

export function createFocusBoundaryManager(): FocusBoundaryManager {
  const stack: Array<{ boundary: FocusBoundary; container: HTMLElement }> = [];

  function activateTop(): void {
    if (stack.length === 0) return;
    stack[stack.length - 1].boundary.attach();
  }

  function deactivateTop(): void {
    if (stack.length === 0) return;
    stack[stack.length - 1].boundary.detach();
  }

  function push(container: HTMLElement): FocusBoundary {
    deactivateTop();
    const boundary = createFocusBoundary(container);
    stack.push({ boundary, container });
    boundary.attach();
    return boundary;
  }

  function pop(): FocusBoundary | undefined {
    if (stack.length === 0) return undefined;
    const entry = stack.pop()!;
    entry.boundary.detach();
    activateTop();
    return entry.boundary;
  }

  function getCurrent(): FocusBoundary | undefined {
    if (stack.length === 0) return undefined;
    return stack[stack.length - 1].boundary;
  }

  function getDepth(): number {
    return stack.length;
  }

  function clear(): void {
    while (stack.length > 0) {
      pop();
    }
  }

  return { push, pop, getCurrent, getDepth, clear };
}
