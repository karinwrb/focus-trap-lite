/**
 * focusInert.ts
 * Manages the `inert` attribute on elements outside the active focus trap,
 * preventing interaction with background content.
 */

export interface FocusInertManager {
  apply: (trapRoot: HTMLElement) => void;
  release: () => void;
  isApplied: () => boolean;
}

const INERT_ATTR = 'data-focus-inert-managed';

function getTopLevelSiblings(trapRoot: HTMLElement): HTMLElement[] {
  const parent = trapRoot.parentElement ?? document.body;
  return Array.from(parent.children).filter(
    (el): el is HTMLElement => el instanceof HTMLElement && el !== trapRoot
  );
}

export function createFocusInert(): FocusInertManager {
  let managedElements: HTMLElement[] = [];
  let applied = false;

  function apply(trapRoot: HTMLElement): void {
    if (applied) release();

    const siblings = getTopLevelSiblings(trapRoot);
    managedElements = siblings.filter((el) => !el.hasAttribute('inert'));

    for (const el of managedElements) {
      el.setAttribute('inert', '');
      el.setAttribute(INERT_ATTR, 'true');
    }

    applied = true;
  }

  function release(): void {
    for (const el of managedElements) {
      if (el.getAttribute(INERT_ATTR) === 'true') {
        el.removeAttribute('inert');
        el.removeAttribute(INERT_ATTR);
      }
    }
    managedElements = [];
    applied = false;
  }

  function isApplied(): boolean {
    return applied;
  }

  return { apply, release, isApplied };
}
