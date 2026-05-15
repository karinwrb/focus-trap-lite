/**
 * focusPlaceholderManager — manages a pool of named FocusPlaceholder instances
 * so that different parts of the application can share or look up placeholders.
 */

import { createFocusPlaceholder, FocusPlaceholder } from './focusPlaceholder';

export interface FocusPlaceholderManager {
  getOrCreate(id: string, label?: string): FocusPlaceholder;
  get(id: string): FocusPlaceholder | undefined;
  drop(id: string): void;
  getIds(): string[];
  clear(): void;
}

export function createFocusPlaceholderManager(): FocusPlaceholderManager {
  const registry = new Map<string, FocusPlaceholder>();

  function getOrCreate(id: string, label?: string): FocusPlaceholder {
    if (registry.has(id)) return registry.get(id)!;
    const placeholder = createFocusPlaceholder(label ?? id);
    registry.set(id, placeholder);
    return placeholder;
  }

  function get(id: string): FocusPlaceholder | undefined {
    return registry.get(id);
  }

  function drop(id: string): void {
    const placeholder = registry.get(id);
    if (placeholder) {
      placeholder.detach();
      registry.delete(id);
    }
  }

  function getIds(): string[] {
    return Array.from(registry.keys());
  }

  function clear(): void {
    registry.forEach((p) => p.detach());
    registry.clear();
  }

  return { getOrCreate, get, drop, getIds, clear };
}
