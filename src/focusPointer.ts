/**
 * focusPointer.ts
 * Tracks pointer (mouse/touch) interactions to suppress focus-ring styles
 * when navigating via pointer, and restore them on keyboard use.
 */

export interface FocusPointerHandler {
  attach: () => void;
  detach: () => void;
  isPointerActive: () => boolean;
}

const POINTER_EVENTS = ['mousedown', 'pointerdown', 'touchstart'] as const;
const KEYBOARD_EVENTS = ['keydown'] as const;
const DATA_ATTR = 'data-focus-pointer';

export function createFocusPointer(
  target: HTMLElement | Document = document
): FocusPointerHandler {
  let pointerActive = false;

  function onPointerDown(): void {
    pointerActive = true;
    document.documentElement.setAttribute(DATA_ATTR, 'true');
  }

  function onKeyDown(): void {
    pointerActive = false;
    document.documentElement.removeAttribute(DATA_ATTR);
  }

  function attach(): void {
    POINTER_EVENTS.forEach((event) =>
      target.addEventListener(event, onPointerDown as EventListener, { capture: true })
    );
    KEYBOARD_EVENTS.forEach((event) =>
      target.addEventListener(event, onKeyDown as EventListener, { capture: true })
    );
  }

  function detach(): void {
    POINTER_EVENTS.forEach((event) =>
      target.removeEventListener(event, onPointerDown as EventListener, { capture: true })
    );
    KEYBOARD_EVENTS.forEach((event) =>
      target.removeEventListener(event, onKeyDown as EventListener, { capture: true })
    );
    document.documentElement.removeAttribute(DATA_ATTR);
    pointerActive = false;
  }

  function isPointerActive(): boolean {
    return pointerActive;
  }

  return { attach, detach, isPointerActive };
}
