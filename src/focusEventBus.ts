export type FocusEventType =
  | 'trap:activate'
  | 'trap:deactivate'
  | 'focus:captured'
  | 'focus:released'
  | 'scope:enter'
  | 'scope:leave';

export interface FocusEvent {
  type: FocusEventType;
  target?: Element | null;
  data?: Record<string, unknown>;
}

export type FocusEventListener = (event: FocusEvent) => void;

export interface FocusEventBus {
  on(type: FocusEventType, listener: FocusEventListener): () => void;
  off(type: FocusEventType, listener: FocusEventListener): void;
  emit(event: FocusEvent): void;
  clear(type?: FocusEventType): void;
  listenerCount(type: FocusEventType): number;
}

export function createFocusEventBus(): FocusEventBus {
  const listeners = new Map<FocusEventType, Set<FocusEventListener>>();

  function getSet(type: FocusEventType): Set<FocusEventListener> {
    if (!listeners.has(type)) {
      listeners.set(type, new Set());
    }
    return listeners.get(type)!;
  }

  function on(type: FocusEventType, listener: FocusEventListener): () => void {
    getSet(type).add(listener);
    return () => off(type, listener);
  }

  function off(type: FocusEventType, listener: FocusEventListener): void {
    listeners.get(type)?.delete(listener);
  }

  function emit(event: FocusEvent): void {
    const set = listeners.get(event.type);
    if (!set) return;
    for (const listener of set) {
      listener(event);
    }
  }

  function clear(type?: FocusEventType): void {
    if (type) {
      listeners.delete(type);
    } else {
      listeners.clear();
    }
  }

  function listenerCount(type: FocusEventType): number {
    return listeners.get(type)?.size ?? 0;
  }

  return { on, off, emit, clear, listenerCount };
}

export const globalFocusEventBus: FocusEventBus = createFocusEventBus();
