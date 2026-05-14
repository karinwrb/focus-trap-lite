/**
 * focusGroup.ts
 * Manages named groups of focus traps, allowing coordinated activation/deactivation.
 */

export interface FocusGroupEntry {
  id: string;
  element: HTMLElement;
  priority: number;
}

export interface FocusGroup {
  add: (id: string, element: HTMLElement, priority?: number) => void;
  remove: (id: string) => void;
  getActive: () => FocusGroupEntry | null;
  getAll: () => FocusGroupEntry[];
  has: (id: string) => boolean;
  clear: () => void;
  size: () => number;
}

export function createFocusGroup(): FocusGroup {
  const entries: Map<string, FocusGroupEntry> = new Map();

  function add(id: string, element: HTMLElement, priority: number = 0): void {
    entries.set(id, { id, element, priority });
  }

  function remove(id: string): void {
    entries.delete(id);
  }

  function getActive(): FocusGroupEntry | null {
    if (entries.size === 0) return null;
    let highest: FocusGroupEntry | null = null;
    for (const entry of entries.values()) {
      if (highest === null || entry.priority > highest.priority) {
        highest = entry;
      }
    }
    return highest;
  }

  function getAll(): FocusGroupEntry[] {
    return Array.from(entries.values()).sort((a, b) => b.priority - a.priority);
  }

  function has(id: string): boolean {
    return entries.has(id);
  }

  function clear(): void {
    entries.clear();
  }

  function size(): number {
    return entries.size;
  }

  return { add, remove, getActive, getAll, has, clear, size };
}

const globalGroup: FocusGroup = createFocusGroup();

export function getGlobalFocusGroup(): FocusGroup {
  return globalGroup;
}
