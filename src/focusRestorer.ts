/**
 * focusRestorer.ts
 * Saves and restores focus to a previously focused element,
 * useful when closing modals/dialogs to return focus to the trigger.
 */

export interface FocusRestorer {
  save: () => void;
  restore: () => boolean;
  getSaved: () => Element | null;
  clear: () => void;
}

/**
 * Creates a focus restorer that can save the currently focused element
 * and restore focus to it later.
 */
export function createFocusRestorer(): FocusRestorer {
  let savedElement: Element | null = null;

  function save(): void {
    savedElement = document.activeElement;
  }

  function restore(): boolean {
    if (!savedElement) {
      return false;
    }

    if (!(savedElement instanceof HTMLElement) && !(savedElement instanceof SVGElement)) {
      return false;
    }

    if (!document.body.contains(savedElement)) {
      savedElement = null;
      return false;
    }

    savedElement.focus();
    return document.activeElement === savedElement;
  }

  function getSaved(): Element | null {
    return savedElement;
  }

  function clear(): void {
    savedElement = null;
  }

  return { save, restore, getSaved, clear };
}

/**
 * Convenience function: saves current focus, runs callback, then restores focus.
 */
export async function withFocusRestored(
  callback: () => void | Promise<void>
): Promise<void> {
  const restorer = createFocusRestorer();
  restorer.save();
  try {
    await callback();
  } finally {
    restorer.restore();
  }
}
