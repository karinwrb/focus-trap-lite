/**
 * focusMementoStack.ts
 * Convenience wrapper that combines FocusMementoManager with a push/pop
 * stack API — ideal for nested dialogs that need LIFO focus restoration.
 */

import { createFocusMementoManager, FocusMemento } from './focusMemento';

export interface FocusMementoStack {
  push: () => FocusMemento;
  pop: () => boolean;
  peek: () => FocusMemento | null;
  getDepth: () => number;
  clear: () => void;
}

export function createFocusMementoStack(): FocusMementoStack {
  const manager = createFocusMementoManager();
  const stack: FocusMemento[] = [];

  function push(): FocusMemento {
    const memento = manager.capture();
    stack.push(memento);
    return memento;
  }

  function pop(): boolean {
    if (stack.length === 0) return false;
    const memento = stack.pop()!;
    return manager.restore(memento);
  }

  function peek(): FocusMemento | null {
    return stack.length > 0 ? stack[stack.length - 1] : null;
  }

  function getDepth(): number {
    return stack.length;
  }

  function clear(): void {
    stack.length = 0;
    manager.clear();
  }

  return { push, pop, peek, getDepth, clear };
}
