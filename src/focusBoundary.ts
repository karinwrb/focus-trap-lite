/**
 * focusBoundary – defines a navigable boundary that constrains focus movement
 * to a specific container element, emitting events when focus attempts to
 * leave the boundary.
 */

export type FocusBoundaryEvent = "escape-top" | "escape-bottom";
export type FocusBoundaryListener = (event: FocusBoundaryEvent) => void;

export interface FocusBoundary {
  attach: () => void;
  detach: () => void;
  isAttached: () => boolean;
  onEscape: (listener: FocusBoundaryListener) => () => void;
}

export function createFocusBoundary(container: HTMLElement): FocusBoundary {
  let attached = false;
  const listeners = new Set<FocusBoundaryListener>();

  function emit(event: FocusBoundaryEvent): void {
    listeners.forEach((fn) => fn(event));
  }

  function getFocusable(): HTMLElement[] {
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("inert"));
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key !== "Tab") return;
    const focusable = getFocusable();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement;

    if (e.shiftKey && active === first) {
      emit("escape-top");
      e.preventDefault();
    } else if (!e.shiftKey && active === last) {
      emit("escape-bottom");
      e.preventDefault();
    }
  }

  function attach(): void {
    if (attached) return;
    container.addEventListener("keydown", handleKeyDown);
    attached = true;
  }

  function detach(): void {
    if (!attached) return;
    container.removeEventListener("keydown", handleKeyDown);
    attached = false;
  }

  function isAttached(): boolean {
    return attached;
  }

  function onEscape(listener: FocusBoundaryListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { attach, detach, isAttached, onEscape };
}
