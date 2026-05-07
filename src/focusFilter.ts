/**
 * focusFilter.ts
 * Utilities for filtering and checking focusability of DOM elements.
 */

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

/**
 * Returns true if the element is visible (not hidden via CSS or HTML attribute).
 */
export function isVisible(element: HTMLElement): boolean {
  if (element.hasAttribute('hidden')) return false;
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

/**
 * Returns true if the element matches focusable criteria and is visible.
 */
export function isFocusable(element: HTMLElement): boolean {
  if (!element.matches(FOCUSABLE_SELECTORS)) return false;
  return isVisible(element);
}

/**
 * Returns true if the element is tabbable (focusable and not tabindex=-1).
 */
export function isTabbable(element: HTMLElement): boolean {
  if (!isFocusable(element)) return false;
  const tabIndex = element.getAttribute('tabindex');
  return tabIndex === null || parseInt(tabIndex, 10) >= 0;
}

/**
 * Filters an array of elements to only those that are tabbable.
 */
export function filterTabbable(elements: HTMLElement[]): HTMLElement[] {
  return elements.filter(isTabbable);
}

/**
 * Returns the first tabbable element within a container, or null.
 */
export function getFirstTabbable(container: HTMLElement): HTMLElement | null {
  const all = Array.from(container.querySelectorAll<HTMLElement>('*'));
  return filterTabbable(all)[0] ?? null;
}

/**
 * Returns the last tabbable element within a container, or null.
 */
export function getLastTabbable(container: HTMLElement): HTMLElement | null {
  const all = Array.from(container.querySelectorAll<HTMLElement>('*'));
  const tabbable = filterTabbable(all);
  return tabbable[tabbable.length - 1] ?? null;
}
