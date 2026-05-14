/**
 * focusMemento.ts
 * Captures and restores complete focus state snapshots (memento pattern).
 * Useful for nested dialogs or complex UI transitions.
 */

export interface FocusMemento {
  readonly element: Element | null;
  readonly selectionStart: number | null;
  readonly selectionEnd: number | null;
  readonly timestamp: number;
}

export interface FocusMementoManager {
  capture: () => FocusMemento;
  restore: (memento: FocusMemento) => boolean;
  getLatest: () => FocusMemento | null;
  getAll: () => ReadonlyArray<FocusMemento>;
  clear: () => void;
}

function captureSelection(el: Element): { start: number | null; end: number | null } {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return { start: el.selectionStart, end: el.selectionEnd };
  }
  return { start: null, end: null };
}

export function createFocusMementoManager(): FocusMementoManager {
  const history: FocusMemento[] = [];

  function capture(): FocusMemento {
    const el = document.activeElement;
    const sel = el ? captureSelection(el) : { start: null, end: null };
    const memento: FocusMemento = {
      element: el,
      selectionStart: sel.start,
      selectionEnd: sel.end,
      timestamp: Date.now(),
    };
    history.push(memento);
    return memento;
  }

  function restore(memento: FocusMemento): boolean {
    const { element, selectionStart, selectionEnd } = memento;
    if (!element || !(element instanceof HTMLElement)) return false;
    try {
      element.focus();
      if (
        (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) &&
        selectionStart !== null &&
        selectionEnd !== null
      ) {
        element.setSelectionRange(selectionStart, selectionEnd);
      }
      return document.activeElement === element;
    } catch {
      return false;
    }
  }

  function getLatest(): FocusMemento | null {
    return history.length > 0 ? history[history.length - 1] : null;
  }

  function getAll(): ReadonlyArray<FocusMemento> {
    return [...history];
  }

  function clear(): void {
    history.length = 0;
  }

  return { capture, restore, getLatest, getAll, clear };
}
