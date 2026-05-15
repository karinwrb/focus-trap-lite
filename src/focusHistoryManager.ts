/**
 * focusHistoryManager.ts
 * Higher-level manager that ties focus events to history tracking,
 * allowing automatic save/restore across nested trap activations.
 */

import {
  pushFocusHistory,
  popFocusHistory,
  peekFocusHistory,
  getFocusHistoryDepth,
  clearFocusHistory,
  FocusHistoryEntry,
} from "./focusHistory";

export interface FocusHistoryManager {
  /** Record the currently focused element. */
  record(): void;
  /** Restore focus to the most recently recorded element. */
  restoreLast(): boolean;
  /** Peek at the top of the history stack. */
  peek(): FocusHistoryEntry | undefined;
  /** Return the current stack depth. */
  depth(): number;
  /** Wipe the entire history. */
  reset(): void;
}

/**
 * Creates a FocusHistoryManager instance.
 */
export function createFocusHistoryManager(): FocusHistoryManager {
  function record(): void {
    const active = document.activeElement;
    if (active && active !== document.body) {
      pushFocusHistory(active);
    }
  }

  function restoreLast(): boolean {
    const entry = popFocusHistory();
    if (!entry) return false;
    const el = entry.element as HTMLElement;
    if (typeof el.focus === "function") {
      el.focus();
      return true;
    }
    return false;
  }

  function peek(): FocusHistoryEntry | undefined {
    return peekFocusHistory();
  }

  function depth(): number {
    return getFocusHistoryDepth();
  }

  function reset(): void {
    clearFocusHistory();
  }

  return { record, restoreLast, peek, depth, reset };
}
