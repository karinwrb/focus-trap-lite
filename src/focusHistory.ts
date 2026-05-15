/**
 * focusHistory.ts
 * Manages a stack of previously focused elements for focus restoration.
 */

export interface FocusHistoryEntry {
  element: Element;
  timestamp: number;
}

const historyStack: FocusHistoryEntry[] = [];

/**
 * Push an element onto the focus history stack.
 */
export function pushFocusHistory(element: Element): void {
  historyStack.push({ element, timestamp: Date.now() });
}

/**
 * Pop the most recent entry from the focus history stack.
 */
export function popFocusHistory(): FocusHistoryEntry | undefined {
  return historyStack.pop();
}

/**
 * Peek at the most recent entry without removing it.
 */
export function peekFocusHistory(): FocusHistoryEntry | undefined {
  return historyStack[historyStack.length - 1];
}

/**
 * Returns the current depth of the focus history stack.
 */
export function getFocusHistoryDepth(): number {
  return historyStack.length;
}

/**
 * Clear all entries from the focus history stack.
 */
export function clearFocusHistory(): void {
  historyStack.length = 0;
}
