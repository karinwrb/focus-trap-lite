/**
 * focusDelayManager — manages debounced/delayed focus operations
 * to prevent rapid focus thrashing during animations or transitions.
 */

export interface FocusDelayEntry {
  id: string;
  timerId: ReturnType<typeof setTimeout>;
  callback: () => void;
  delay: number;
}

export interface FocusDelayManager {
  schedule: (id: string, callback: () => void, delay: number) => void;
  cancel: (id: string) => void;
  cancelAll: () => void;
  isScheduled: (id: string) => boolean;
  getPendingIds: () => string[];
  flush: (id: string) => void;
  flushAll: () => void;
  destroy: () => void;
}

export function createFocusDelayManager(): FocusDelayManager {
  const pending = new Map<string, FocusDelayEntry>();

  function schedule(id: string, callback: () => void, delay: number): void {
    if (pending.has(id)) {
      clearTimeout(pending.get(id)!.timerId);
    }
    const timerId = setTimeout(() => {
      pending.delete(id);
      callback();
    }, delay);
    pending.set(id, { id, timerId, callback, delay });
  }

  function cancel(id: string): void {
    const entry = pending.get(id);
    if (entry) {
      clearTimeout(entry.timerId);
      pending.delete(id);
    }
  }

  function cancelAll(): void {
    for (const entry of pending.values()) {
      clearTimeout(entry.timerId);
    }
    pending.clear();
  }

  function isScheduled(id: string): boolean {
    return pending.has(id);
  }

  function getPendingIds(): string[] {
    return Array.from(pending.keys());
  }

  function flush(id: string): void {
    const entry = pending.get(id);
    if (entry) {
      clearTimeout(entry.timerId);
      pending.delete(id);
      entry.callback();
    }
  }

  function flushAll(): void {
    const entries = Array.from(pending.values());
    pending.clear();
    for (const entry of entries) {
      clearTimeout(entry.timerId);
      entry.callback();
    }
  }

  function destroy(): void {
    cancelAll();
  }

  return { schedule, cancel, cancelAll, isScheduled, getPendingIds, flush, flushAll, destroy };
}
