/**
 * focusVisible — Tracks whether focus is being driven by keyboard or pointer,
 * exposing a utility to determine if a focus-visible ring should be shown.
 */

export interface FocusVisibleState {
  isKeyboardMode: () => boolean;
  attach: (container?: Document | HTMLElement) => void;
  detach: (container?: Document | HTMLElement) => void;
  destroy: () => void;
}

const KEYBOARD_KEYS = new Set([
  'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'Enter', 'Escape', 'Home', 'End', 'PageUp', 'PageDown', ' ',
]);

export function createFocusVisible(): FocusVisibleState {
  let keyboardMode = false;

  function onKeyDown(e: Event): void {
    if (KEYBOARD_KEYS.has((e as KeyboardEvent).key)) {
      keyboardMode = true;
    }
  }

  function onPointerDown(): void {
    keyboardMode = false;
  }

  function isKeyboardMode(): boolean {
    return keyboardMode;
  }

  function attach(container: Document | HTMLElement = document): void {
    container.addEventListener('keydown', onKeyDown, true);
    container.addEventListener('pointerdown', onPointerDown, true);
    container.addEventListener('mousedown', onPointerDown, true);
  }

  function detach(container: Document | HTMLElement = document): void {
    container.removeEventListener('keydown', onKeyDown, true);
    container.removeEventListener('pointerdown', onPointerDown, true);
    container.removeEventListener('mousedown', onPointerDown, true);
  }

  function destroy(): void {
    detach(document);
    keyboardMode = false;
  }

  return { isKeyboardMode, attach, detach, destroy };
}

let _shared: FocusVisibleState | null = null;

export function getSharedFocusVisible(): FocusVisibleState {
  if (!_shared) {
    _shared = createFocusVisible();
    _shared.attach();
  }
  return _shared;
}

export function isFocusVisible(): boolean {
  return getSharedFocusVisible().isKeyboardMode();
}
