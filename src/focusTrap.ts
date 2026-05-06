const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary',
  'audio[controls]',
  'video[controls]',
].join(', ');

export interface FocusTrapOptions {
  onEscape?: () => void;
  initialFocus?: HTMLElement | null;
}

export interface FocusTrap {
  activate: () => void;
  deactivate: () => void;
}

export function createFocusTrap(
  container: HTMLElement,
  options: FocusTrapOptions = {}
): FocusTrap {
  let previouslyFocusedElement: Element | null = null;

  function getFocusableElements(): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
      (el) => !el.closest('[inert]') && el.offsetParent !== null
    );
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      options.onEscape?.();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = getFocusableElements();
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === firstEl || !container.contains(active)) {
        event.preventDefault();
        lastEl.focus();
      }
    } else {
      if (active === lastEl || !container.contains(active)) {
        event.preventDefault();
        firstEl.focus();
      }
    }
  }

  function activate(): void {
    previouslyFocusedElement = document.activeElement;
    document.addEventListener('keydown', handleKeyDown);

    const target = options.initialFocus ?? getFocusableElements()[0];
    target?.focus();
  }

  function deactivate(): void {
    document.removeEventListener('keydown', handleKeyDown);
    if (previouslyFocusedElement instanceof HTMLElement) {
      previouslyFocusedElement.focus();
    }
    previouslyFocusedElement = null;
  }

  return { activate, deactivate };
}
