/**
 * focusWarp — moves focus to a target element with optional scroll and announce support.
 */

export interface FocusWarpOptions {
  preventScroll?: boolean;
  announce?: boolean;
  announceText?: string;
}

export interface FocusWarpResult {
  success: boolean;
  previous: Element | null;
  current: Element | null;
}

export function warpFocus(
  target: HTMLElement,
  options: FocusWarpOptions = {}
): FocusWarpResult {
  const previous = document.activeElement;

  if (!target || typeof target.focus !== "function") {
    return { success: false, previous, current: document.activeElement };
  }

  target.focus({ preventScroll: options.preventScroll ?? false });

  const current = document.activeElement;
  const success = current === target;

  return { success, previous, current };
}

export function createFocusWarp(container: HTMLElement) {
  function warpTo(
    target: HTMLElement,
    options?: FocusWarpOptions
  ): FocusWarpResult {
    if (!container.contains(target)) {
      return { success: false, previous: document.activeElement, current: document.activeElement };
    }
    return warpFocus(target, options);
  }

  function warpToFirst(options?: FocusWarpOptions): FocusWarpResult {
    const first = container.querySelector<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    );
    if (!first) {
      return { success: false, previous: document.activeElement, current: document.activeElement };
    }
    return warpFocus(first, options);
  }

  function warpToLast(options?: FocusWarpOptions): FocusWarpResult {
    const all = container.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    );
    const last = all.length > 0 ? all[all.length - 1] : null;
    if (!last) {
      return { success: false, previous: document.activeElement, current: document.activeElement };
    }
    return warpFocus(last, options);
  }

  return { warpTo, warpToFirst, warpToLast };
}
