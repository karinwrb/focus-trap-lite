/**
 * focusKeyMap.ts
 * Manages custom key bindings for focus trap interactions.
 */

export type KeyHandler = (event: KeyboardEvent) => void;

export interface KeyMap {
  [key: string]: KeyHandler;
}

export interface FocusKeyMap {
  register: (key: string, handler: KeyHandler) => void;
  unregister: (key: string) => void;
  handle: (event: KeyboardEvent) => boolean;
  getKeys: () => string[];
  clear: () => void;
}

export function createFocusKeyMap(initial?: KeyMap): FocusKeyMap {
  const map: KeyMap = { ...(initial ?? {}) };

  function register(key: string, handler: KeyHandler): void {
    map[key] = handler;
  }

  function unregister(key: string): void {
    delete map[key];
  }

  function handle(event: KeyboardEvent): boolean {
    const handler = map[event.key];
    if (handler) {
      handler(event);
      return true;
    }
    return false;
  }

  function getKeys(): string[] {
    return Object.keys(map);
  }

  function clear(): void {
    for (const key of Object.keys(map)) {
      delete map[key];
    }
  }

  return { register, unregister, handle, getKeys, clear };
}

export function buildDefaultKeyMap(
  onEscape?: KeyHandler,
  onTab?: KeyHandler
): KeyMap {
  const keyMap: KeyMap = {};
  if (onEscape) keyMap["Escape"] = onEscape;
  if (onTab) keyMap["Tab"] = onTab;
  return keyMap;
}
