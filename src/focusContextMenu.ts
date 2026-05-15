/**
 * focusContextMenu — tracks whether focus was triggered via context menu
 * and exposes helpers to suppress/restore focus ring accordingly.
 */

export interface FocusContextMenu {
  isContextMenuActive: () => boolean;
  attach: () => void;
  detach: () => void;
  destroy: () => void;
}

export function createFocusContextMenu(
  target: EventTarget = document
): FocusContextMenu {
  let contextMenuActive = false;

  function onContextMenu(): void {
    contextMenuActive = true;
  }

  function onPointerDown(): void {
    contextMenuActive = false;
  }

  function onKeyDown(): void {
    contextMenuActive = false;
  }

  function onBlur(): void {
    contextMenuActive = false;
  }

  function attach(): void {
    target.addEventListener('contextmenu', onContextMenu);
    target.addEventListener('pointerdown', onPointerDown);
    target.addEventListener('keydown', onKeyDown);
    target.addEventListener('blur', onBlur, true);
  }

  function detach(): void {
    target.removeEventListener('contextmenu', onContextMenu);
    target.removeEventListener('pointerdown', onPointerDown);
    target.removeEventListener('keydown', onKeyDown);
    target.removeEventListener('blur', onBlur, true);
  }

  function destroy(): void {
    detach();
    contextMenuActive = false;
  }

  function isContextMenuActive(): boolean {
    return contextMenuActive;
  }

  return { isContextMenuActive, attach, detach, destroy };
}
