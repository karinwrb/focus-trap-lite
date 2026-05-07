/**
 * focusStack.ts
 * Manages a stack of active focus traps to support nested trap scenarios.
 * The most recently activated trap is always considered the "active" one.
 */

export interface FocusTrapEntry {
  id: string;
  container: HTMLElement;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

const stack: FocusTrapEntry[] = [];

/**
 * Push a new trap entry onto the stack.
 */
export function pushTrap(entry: FocusTrapEntry): void {
  stack.push(entry);
}

/**
 * Remove a trap entry by its id.
 * Returns the removed entry or undefined if not found.
 */
export function removeTrap(id: string): FocusTrapEntry | undefined {
  const index = stack.findIndex((e) => e.id === id);
  if (index === -1) return undefined;
  const [removed] = stack.splice(index, 1);
  return removed;
}

/**
 * Peek at the currently active (top) trap without removing it.
 */
export function getActiveTrap(): FocusTrapEntry | undefined {
  return stack.length > 0 ? stack[stack.length - 1] : undefined;
}

/**
 * Check whether a given id is currently in the stack.
 */
export function hasTrap(id: string): boolean {
  return stack.some((e) => e.id === id);
}

/**
 * Return the current depth of the trap stack.
 */
export function getTrapStackDepth(): number {
  return stack.length;
}

/**
 * Clear all entries from the stack (useful for cleanup/testing).
 */
export function clearTrapStack(): void {
  stack.length = 0;
}
