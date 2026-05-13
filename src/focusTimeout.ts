/**
 * focusTimeout.ts
 * Provides deferred focus utilities with cancellation support.
 * Useful for scheduling focus changes after async transitions or animations.
 */

export interface FocusTimeoutHandle {
  cancel: () => void;
  isPending: () => boolean;
}

export interface FocusTimeout {
  schedule: (target: HTMLElement | (() => void), delay?: number) => FocusTimeoutHandle;
  cancelAll: () => void;
  getPendingCount: () => number;
}

export function createFocusTimeout(): FocusTimeout {
  const pending = new Set<number>();

  function schedule(
    target: HTMLElement | (() => void),
    delay = 0
  ): FocusTimeoutHandle {
    let cancelled = false;

    const id = window.setTimeout(() => {
      pending.delete(id);
      if (!cancelled) {
        if (typeof target === "function") {
          target();
        } else {
          target.focus();
        }
      }
    }, delay);

    pending.add(id);

    return {
      cancel() {
        if (!cancelled) {
          cancelled = true;
          clearTimeout(id);
          pending.delete(id);
        }
      },
      isPending() {
        return pending.has(id);
      },
    };
  }

  function cancelAll(): void {
    for (const id of pending) {
      clearTimeout(id);
    }
    pending.clear();
  }

  function getPendingCount(): number {
    return pending.size;
  }

  return { schedule, cancelAll, getPendingCount };
}
