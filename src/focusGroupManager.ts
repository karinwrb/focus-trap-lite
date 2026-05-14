/**
 * focusGroupManager.ts
 * Coordinates multiple FocusGroups by name, enabling scoped group management.
 */

import { createFocusGroup, FocusGroup, FocusGroupEntry } from './focusGroup';

export interface FocusGroupManager {
  getOrCreate: (name: string) => FocusGroup;
  get: (name: string) => FocusGroup | undefined;
  drop: (name: string) => void;
  getActiveAcrossGroups: () => FocusGroupEntry | null;
  listGroups: () => string[];
  destroyAll: () => void;
}

export function createFocusGroupManager(): FocusGroupManager {
  const groups: Map<string, FocusGroup> = new Map();

  function getOrCreate(name: string): FocusGroup {
    if (!groups.has(name)) {
      groups.set(name, createFocusGroup());
    }
    return groups.get(name)!;
  }

  function get(name: string): FocusGroup | undefined {
    return groups.get(name);
  }

  function drop(name: string): void {
    groups.delete(name);
  }

  function getActiveAcrossGroups(): FocusGroupEntry | null {
    let best: FocusGroupEntry | null = null;
    for (const group of groups.values()) {
      const active = group.getActive();
      if (active !== null && (best === null || active.priority > best.priority)) {
        best = active;
      }
    }
    return best;
  }

  function listGroups(): string[] {
    return Array.from(groups.keys());
  }

  function destroyAll(): void {
    for (const group of groups.values()) {
      group.clear();
    }
    groups.clear();
  }

  return { getOrCreate, get, drop, getActiveAcrossGroups, listGroups, destroyAll };
}
