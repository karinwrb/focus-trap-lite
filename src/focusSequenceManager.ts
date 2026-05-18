/**
 * focusSequenceManager — registry for named FocusSequence instances.
 */

import { createFocusSequence, FocusSequence } from './focusSequence';

export interface FocusSequenceManager {
  getOrCreate(id: string, initial?: HTMLElement[]): FocusSequence;
  get(id: string): FocusSequence | undefined;
  drop(id: string): void;
  dropAll(): void;
  getIds(): string[];
}

export function createFocusSequenceManager(): FocusSequenceManager {
  const map = new Map<string, FocusSequence>();

  function getOrCreate(id: string, initial: HTMLElement[] = []): FocusSequence {
    if (!map.has(id)) {
      map.set(id, createFocusSequence(initial));
    }
    return map.get(id)!;
  }

  function get(id: string): FocusSequence | undefined {
    return map.get(id);
  }

  function drop(id: string): void {
    map.delete(id);
  }

  function dropAll(): void {
    map.clear();
  }

  function getIds(): string[] {
    return Array.from(map.keys());
  }

  return { getOrCreate, get, drop, dropAll, getIds };
}
