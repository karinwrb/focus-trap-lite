/**
 * focusRelay — routes focus to a designated relay target when the
 * original target is not focusable or is removed from the DOM.
 */

export interface FocusRelayOptions {
  /** Fallback element to focus when the primary target is unavailable. */
  fallback?: HTMLElement | null;
  /** Called after a relay occurs. */
  onRelay?: (from: HTMLElement | null, to: HTMLElement) => void;
}

export interface FocusRelay {
  /** Set the primary relay target. */
  setTarget(el: HTMLElement | null): void;
  /** Get the current relay target. */
  getTarget(): HTMLElement | null;
  /** Attempt to relay focus. Returns the element that received focus, or null. */
  relay(): HTMLElement | null;
  /** Attach the relay to a container (listens for focusout). */
  attach(container: HTMLElement): void;
  /** Detach the relay from the container. */
  detach(): void;
  /** Whether the relay is currently attached. */
  isAttached(): boolean;
}

export function createFocusRelay(options: FocusRelayOptions = {}): FocusRelay {
  let target: HTMLElement | null = null;
  let container: HTMLElement | null = null;
  let attached = false;

  function isAvailable(el: HTMLElement | null): el is HTMLElement {
    return (
      el !== null &&
      document.contains(el) &&
      !el.hasAttribute('disabled') &&
      (el as HTMLElement).tabIndex >= 0
    );
  }

  function relay(): HTMLElement | null {
    const destination = isAvailable(target)
      ? target
      : isAvailable(options.fallback ?? null)
      ? (options.fallback as HTMLElement)
      : null;

    if (destination) {
      const previous =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      destination.focus();
      options.onRelay?.(previous, destination);
      return destination;
    }
    return null;
  }

  function handleFocusOut(event: FocusEvent): void {
    const related = event.relatedTarget as HTMLElement | null;
    if (!related || (container && !container.contains(related))) {
      relay();
    }
  }

  return {
    setTarget(el) {
      target = el;
    },
    getTarget() {
      return target;
    },
    relay,
    attach(el) {
      if (attached) return;
      container = el;
      el.addEventListener('focusout', handleFocusOut);
      attached = true;
    },
    detach() {
      if (!attached || !container) return;
      container.removeEventListener('focusout', handleFocusOut);
      container = null;
      attached = false;
    },
    isAttached() {
      return attached;
    },
  };
}
