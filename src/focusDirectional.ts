/**
 * focusDirectional.ts
 * Provides directional (arrow-key) focus movement within a container,
 * supporting horizontal, vertical, and grid layouts.
 */

export type FocusDirectionalLayout = 'horizontal' | 'vertical' | 'grid';

export interface FocusDirectionalOptions {
  layout?: FocusDirectionalLayout;
  columns?: number;
  wrap?: boolean;
}

export interface FocusDirectional {
  handleKeyDown(e: KeyboardEvent): void;
  attach(container: HTMLElement): void;
  detach(): void;
  getLayout(): FocusDirectionalLayout;
  setLayout(layout: FocusDirectionalLayout): void;
}

function getFocusableChildren(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => !el.hasAttribute('data-focus-guard'));
}

export function createFocusDirectional(options: FocusDirectionalOptions = {}): FocusDirectional {
  let layout: FocusDirectionalLayout = options.layout ?? 'vertical';
  const wrap = options.wrap ?? true;
  const columns = options.columns ?? 1;
  let container: HTMLElement | null = null;
  let boundHandler: (e: KeyboardEvent) => void;

  function handleKeyDown(e: KeyboardEvent): void {
    if (!container) return;
    const items = getFocusableChildren(container);
    if (items.length === 0) return;
    const current = document.activeElement as HTMLElement;
    const index = items.indexOf(current);
    if (index === -1) return;

    let next = -1;
    const { key } = e;

    if (layout === 'horizontal') {
      if (key === 'ArrowRight') next = index + 1;
      else if (key === 'ArrowLeft') next = index - 1;
    } else if (layout === 'vertical') {
      if (key === 'ArrowDown') next = index + 1;
      else if (key === 'ArrowUp') next = index - 1;
    } else if (layout === 'grid') {
      if (key === 'ArrowRight') next = index + 1;
      else if (key === 'ArrowLeft') next = index - 1;
      else if (key === 'ArrowDown') next = index + columns;
      else if (key === 'ArrowUp') next = index - columns;
    }

    if (next === -1) return;

    if (wrap) {
      next = ((next % items.length) + items.length) % items.length;
    } else {
      if (next < 0 || next >= items.length) return;
    }

    e.preventDefault();
    items[next].focus();
  }

  function attach(el: HTMLElement): void {
    detach();
    container = el;
    boundHandler = (e: KeyboardEvent) => handleKeyDown(e);
    container.addEventListener('keydown', boundHandler);
  }

  function detach(): void {
    if (container && boundHandler) {
      container.removeEventListener('keydown', boundHandler);
    }
    container = null;
  }

  function getLayout(): FocusDirectionalLayout {
    return layout;
  }

  function setLayout(l: FocusDirectionalLayout): void {
    layout = l;
  }

  return { handleKeyDown, attach, detach, getLayout, setLayout };
}
