/**
 * focusZone — Manages directional keyboard navigation within a container.
 * Supports arrow-key movement between focusable elements.
 */

import { filterTabbable } from './focusFilter';

export type FocusZoneDirection = 'horizontal' | 'vertical' | 'both';

export interface FocusZoneOptions {
  direction?: FocusZoneDirection;
  wrap?: boolean;
  onEscape?: () => void;
}

export interface FocusZone {
  attach: () => void;
  detach: () => void;
  isAttached: () => boolean;
}

export function createFocusZone(
  container: HTMLElement,
  options: FocusZoneOptions = {}
): FocusZone {
  const { direction = 'both', wrap = true, onEscape } = options;
  let attached = false;

  function handleKeyDown(event: KeyboardEvent): void {
    const items = filterTabbable(container);
    if (items.length === 0) return;

    const current = document.activeElement as HTMLElement;
    const index = items.indexOf(current);

    let next = -1;

    const goBack =
      (direction !== 'horizontal' && event.key === 'ArrowUp') ||
      (direction !== 'vertical' && event.key === 'ArrowLeft');

    const goForward =
      (direction !== 'horizontal' && event.key === 'ArrowDown') ||
      (direction !== 'vertical' && event.key === 'ArrowRight');

    if (goForward) {
      next = index + 1 >= items.length ? (wrap ? 0 : index) : index + 1;
    } else if (goBack) {
      next = index - 1 < 0 ? (wrap ? items.length - 1 : 0) : index - 1;
    } else if (event.key === 'Escape' && onEscape) {
      onEscape();
      return;
    } else {
      return;
    }

    event.preventDefault();
    items[next]?.focus();
  }

  return {
    attach() {
      if (attached) return;
      container.addEventListener('keydown', handleKeyDown);
      attached = true;
    },
    detach() {
      if (!attached) return;
      container.removeEventListener('keydown', handleKeyDown);
      attached = false;
    },
    isAttached: () => attached,
  };
}
