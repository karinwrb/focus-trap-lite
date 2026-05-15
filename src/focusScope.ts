/**
 * focusScope.ts
 * Defines a named focus scope that groups related traps and tracks
 * whether focus is currently inside the scope.
 */

export interface FocusScopeOptions {
  name: string;
  root: HTMLElement;
  onEnter?: () => void;
  onLeave?: () => void;
}

export interface FocusScope {
  getName: () => string;
  getRoot: () => HTMLElement;
  containsFocus: () => boolean;
  enter: () => void;
  leave: () => void;
  destroy: () => void;
}

export function createFocusScope(options: FocusScopeOptions): FocusScope {
  const { name, root, onEnter, onLeave } = options;
  let active = false;

  function containsFocus(): boolean {
    const el = document.activeElement;
    return el !== null && root.contains(el);
  }

  function enter(): void {
    if (active) return;
    active = true;
    onEnter?.();
  }

  function leave(): void {
    if (!active) return;
    active = false;
    onLeave?.();
  }

  function handleFocusIn(event: FocusEvent): void {
    if (root.contains(event.target as Node)) {
      enter();
    }
  }

  function handleFocusOut(event: FocusEvent): void {
    const related = event.relatedTarget as Node | null;
    if (!related || !root.contains(related)) {
      leave();
    }
  }

  root.addEventListener('focusin', handleFocusIn);
  root.addEventListener('focusout', handleFocusOut);

  function destroy(): void {
    root.removeEventListener('focusin', handleFocusIn);
    root.removeEventListener('focusout', handleFocusOut);
    active = false;
  }

  return {
    getName: () => name,
    getRoot: () => root,
    containsFocus,
    enter,
    leave,
    destroy,
  };
}
