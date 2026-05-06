/**
 * Focus Observer — watches for focus changes outside the active trap
 * and redirects focus back into the container when a breach is detected.
 */

import { isFocusGuard } from './focusGuard';

export interface FocusObserverOptions {
  container: HTMLElement;
  onFocusEscape?: (escapedTo: Element) => void;
}

export interface FocusObserver {
  start: () => void;
  stop: () => void;
}

export function createFocusObserver({
  container,
  onFocusEscape,
}: FocusObserverOptions): FocusObserver {
  let active = false;

  function handleFocusIn(event: FocusEvent): void {
    if (!active) return;

    const target = event.target as Element | null;
    if (!target) return;

    if (isFocusGuard(target)) return;

    if (!container.contains(target)) {
      onFocusEscape?.(target);

      // Redirect focus to the first focusable element inside the container
      const firstFocusable = container.querySelector<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }

  function start(): void {
    if (active) return;
    active = true;
    document.addEventListener('focusin', handleFocusIn, true);
  }

  function stop(): void {
    if (!active) return;
    active = false;
    document.removeEventListener('focusin', handleFocusIn, true);
  }

  return { start, stop };
}
