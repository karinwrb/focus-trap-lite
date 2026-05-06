/**
 * Focus history module — tracks and restores focus state
 * when a focus trap is activated/deactivated.
 */

export interface FocusHistoryEntry {
  element: Element | null;
  timestamp: number;
}

const historyStack: FocusHistoryEntry[] = [];

/**
 * Saves the currently focused element onto the history stack.
 */
export function pushFocusHistory(): void {
  historyStack.push({
    element: document.activeElement,
    timestamp: Date.now(),
  });
}

/**
 * Pops the most recent history entry and restores focus to that element.
 * Returns the element focus was restored to, or null if stack was empty.
 */
export function popFocusHistory(): Element | null {
  const entry = historyStack.pop();
  if (!entry || !entry.element) return null;

  const el = entry.element as HTMLElement;
  if (typeof el.focus === "function") {
    el.focus();
  }
  return entry.element;
}

/**
 * Returns the current depth of the focus history stack.
 */
export function getFocusHistoryDepth(): number {
  return historyStack.length;
}

/**
 * Clears all history entries without restoring focus.
 */
export function clearFocusHistory(): void {
  historyStack.length = 0;
}

/**
 * Peeks at the top entry without removing it.
 */
export function peekFocusHistory(): FocusHistoryEntry | null {
  return historyStack.length > 0
    ? historyStack[historyStack.length - 1]
    : null;
}
