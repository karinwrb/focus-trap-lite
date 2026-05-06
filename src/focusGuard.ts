/**
 * Focus Guard — sentinel elements that prevent focus from escaping the trap
 * by inserting invisible, focusable divs at the boundaries of the container.
 */

const GUARD_ATTR = 'data-focus-guard';

export function createFocusGuard(): HTMLDivElement {
  const guard = document.createElement('div');
  guard.setAttribute(GUARD_ATTR, 'true');
  guard.setAttribute('tabindex', '0');
  guard.setAttribute('aria-hidden', 'true');
  guard.style.cssText =
    'position:fixed;top:0;left:0;width:1px;height:0;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
  return guard;
}

export function attachFocusGuards(container: HTMLElement): {
  before: HTMLDivElement;
  after: HTMLDivElement;
} {
  const before = createFocusGuard();
  const after = createFocusGuard();

  container.insertBefore(before, container.firstChild);
  container.appendChild(after);

  return { before, after };
}

export function detachFocusGuards(container: HTMLElement): void {
  const guards = container.querySelectorAll<HTMLDivElement>(
    `[${GUARD_ATTR}="true"]`
  );
  guards.forEach((guard) => container.removeChild(guard));
}

export function isFocusGuard(element: Element | null): boolean {
  if (!element) return false;
  return element.getAttribute(GUARD_ATTR) === 'true';
}
