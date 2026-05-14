/**
 * focusCapture — temporarily captures all focus events within a container,
 * preventing focus from leaving until released.
 */

export interface FocusCaptureOptions {
  onCapture?: (event: FocusEvent) => void;
  onRelease?: () => void;
}

export interface FocusCapture {
  attach: (container: HTMLElement) => void;
  detach: () => void;
  isCapturing: () => boolean;
  release: () => void;
}

export function createFocusCapture(options: FocusCaptureOptions = {}): FocusCapture {
  let container: HTMLElement | null = null;
  let capturing = false;

  function handleFocusOut(event: FocusEvent): void {
    if (!container || !capturing) return;
    const related = event.relatedTarget as Node | null;
    if (related && container.contains(related)) return;

    event.stopImmediatePropagation();
    event.preventDefault();

    // Return focus to the container itself or the last focused child
    const active = document.activeElement;
    if (!active || !container.contains(active)) {
      container.focus();
    }

    options.onCapture?.(event);
  }

  function attach(el: HTMLElement): void {
    if (container) detach();
    container = el;
    capturing = true;
    container.addEventListener('focusout', handleFocusOut, true);
  }

  function detach(): void {
    if (!container) return;
    container.removeEventListener('focusout', handleFocusOut, true);
    container = null;
    capturing = false;
  }

  function isCapturing(): boolean {
    return capturing;
  }

  function release(): void {
    if (!capturing) return;
    capturing = false;
    options.onRelease?.();
    detach();
  }

  return { attach, detach, isCapturing, release };
}
