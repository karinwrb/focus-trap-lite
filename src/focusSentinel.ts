/**
 * focusSentinel.ts
 * Watches for focus leaving a trap container and redirects it back.
 * Acts as a safety net complementing focus guards.
 */

export interface FocusSentinel {
  attach: (container: HTMLElement) => void;
  detach: () => void;
  isActive: () => boolean;
}

function isDescendant(parent: HTMLElement, node: Node | null): boolean {
  if (!node) return false;
  return parent === node || parent.contains(node);
}

export function createFocusSentinel(
  onEscape: (escaped: Element | null) => void
): FocusSentinel {
  let container: HTMLElement | null = null;
  let active = false;

  function handleFocusOut(event: FocusEvent): void {
    if (!container || !active) return;

    const relatedTarget = event.relatedTarget as Element | null;

    // relatedTarget is null when focus leaves the document entirely
    if (relatedTarget === null || !isDescendant(container, relatedTarget)) {
      onEscape(relatedTarget);
    }
  }

  function attach(el: HTMLElement): void {
    if (active) detach();
    container = el;
    container.addEventListener('focusout', handleFocusOut);
    active = true;
  }

  function detach(): void {
    if (container) {
      container.removeEventListener('focusout', handleFocusOut);
      container = null;
    }
    active = false;
  }

  function isActive(): boolean {
    return active;
  }

  return { attach, detach, isActive };
}
