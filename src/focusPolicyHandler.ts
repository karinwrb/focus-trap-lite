/**
 * focusPolicyHandler.ts
 * Applies the active focus policy when Tab is pressed inside a focus trap.
 * Integrates with FocusPolicyManager to decide wrap, clamp, or escape behavior.
 */

import { getFocusableElements } from "./focusTrap";
import { FocusPolicyManager } from "./focusPolicy";

export interface FocusPolicyHandler {
  handleKeyDown(event: KeyboardEvent): void;
  attach(container: HTMLElement): void;
  detach(): void;
}

export function createFocusPolicyHandler(
  policyManager: FocusPolicyManager
): FocusPolicyHandler {
  let _container: HTMLElement | null = null;

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== "Tab" || !_container) return;

    const focusable = getFocusableElements(_container);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    const policy = policyManager.getPolicy();

    if (policy.type === "escape") {
      if (policy.onEscape) policy.onEscape();
      return;
    }

    if (policy.type === "clamp") {
      if (event.shiftKey && active === first) {
        event.preventDefault();
        (first as HTMLElement).focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        (last as HTMLElement).focus();
      }
      return;
    }

    // wrap (default)
    if (event.shiftKey && active === first) {
      event.preventDefault();
      (last as HTMLElement).focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      (first as HTMLElement).focus();
    }
  }

  function attach(container: HTMLElement): void {
    _container = container;
    container.addEventListener("keydown", handleKeyDown);
  }

  function detach(): void {
    if (_container) {
      _container.removeEventListener("keydown", handleKeyDown);
      _container = null;
    }
  }

  return { handleKeyDown, attach, detach };
}
