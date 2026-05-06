import { pushFocusHistory, popFocusHistory } from "./focusHistory";

export interface FocusTrapOptions {
  /** Called when the trap is deactivated (e.g. Escape key). */
  onDeactivate?: () => void;
  /** If true, pressing Escape will deactivate the trap. Default: true. */
  escapeDeactivates?: boolean;
  /** Element to focus on activation. Defaults to first focusable element. */
  initialFocus?: HTMLElement | null;
}

export interface FocusTrap {
  activate: () => void;
  deactivate: () => void;
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");
  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

export function handleKeyDown(
  event: KeyboardEvent,
  container: HTMLElement,
  deactivate: () => void,
  escapeDeactivates: boolean
): void {
  if (event.key === "Escape" && escapeDeactivates) {
    event.preventDefault();
    deactivate();
    return;
  }

  if (event.key !== "Tab") return;

  const focusable = getFocusableElements(container);
  if (focusable.length === 0) {
    event.preventDefault();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

export function createFocusTrap(
  container: HTMLElement,
  options: FocusTrapOptions = {}
): FocusTrap {
  const { onDeactivate, escapeDeactivates = true, initialFocus } = options;
  let active = false;

  const keyDownHandler = (event: KeyboardEvent) =>
    handleKeyDown(event, container, deactivate, escapeDeactivates);

  function activate(): void {
    if (active) return;
    active = true;
    pushFocusHistory();
    document.addEventListener("keydown", keyDownHandler);
    const target = initialFocus ?? getFocusableElements(container)[0];
    target?.focus();
  }

  function deactivate(): void {
    if (!active) return;
    active = false;
    document.removeEventListener("keydown", keyDownHandler);
    popFocusHistory();
    onDeactivate?.();
  }

  return { activate, deactivate };
}
