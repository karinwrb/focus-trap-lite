/**
 * focusLock — Prevents focus from leaving a container by redirecting
 * any focus attempts back inside the trap boundary.
 */

export interface FocusLock {
  attach: (container: HTMLElement) => void;
  detach: () => void;
  isLocked: () => boolean;
}

function getFirstFocusable(container: HTMLElement): HTMLElement | null {
  const candidates = Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )
  );
  return candidates[0] ?? null;
}

export function createFocusLock(): FocusLock {
  let _container: HTMLElement | null = null;
  let _locked = false;

  function handleFocusIn(event: FocusEvent): void {
    if (!_container || !_locked) return;
    const target = event.target as Node | null;
    if (target && !_container.contains(target)) {
      event.stopImmediatePropagation();
      const first = getFirstFocusable(_container);
      if (first) {
        first.focus();
      } else {
        _container.focus();
      }
    }
  }

  function attach(container: HTMLElement): void {
    if (_locked) detach();
    _container = container;
    _locked = true;
    document.addEventListener('focusin', handleFocusIn, true);
  }

  function detach(): void {
    document.removeEventListener('focusin', handleFocusIn, true);
    _container = null;
    _locked = false;
  }

  function isLocked(): boolean {
    return _locked;
  }

  return { attach, detach, isLocked };
}
