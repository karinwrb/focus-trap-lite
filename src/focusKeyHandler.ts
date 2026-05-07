/**
 * focusKeyHandler.ts
 * Attaches and detaches a FocusKeyMap-based keyboard listener to a container.
 */

import { createFocusKeyMap, buildDefaultKeyMap, FocusKeyMap, KeyHandler } from "./focusKeyMap";

export interface FocusKeyHandlerOptions {
  onEscape?: KeyHandler;
  onTab?: KeyHandler;
  container?: HTMLElement | Document;
}

export interface FocusKeyHandler {
  attach: () => void;
  detach: () => void;
  keyMap: FocusKeyMap;
}

export function createFocusKeyHandler(
  options: FocusKeyHandlerOptions = {}
): FocusKeyHandler {
  const { onEscape, onTab, container = document } = options;

  const keyMap = createFocusKeyMap(buildDefaultKeyMap(onEscape, onTab));

  function listener(event: Event): void {
    keyMap.handle(event as KeyboardEvent);
  }

  function attach(): void {
    container.addEventListener("keydown", listener);
  }

  function detach(): void {
    container.removeEventListener("keydown", listener);
  }

  return { attach, detach, keyMap };
}
