/**
 * focusRelayManager — manages a stack of FocusRelay instances so that
 * nested dialogs each have their own relay while the outermost relay
 * remains available as a fallback.
 */

import { createFocusRelay, FocusRelay, FocusRelayOptions } from './focusRelay';

export interface FocusRelayManager {
  /** Push a new relay onto the stack and return it. */
  push(container: HTMLElement, options?: FocusRelayOptions): FocusRelay;
  /** Pop the topmost relay, detaching it from its container. */
  pop(): FocusRelay | undefined;
  /** Return the topmost relay without removing it. */
  getCurrent(): FocusRelay | undefined;
  /** Number of active relays on the stack. */
  getDepth(): number;
  /** Remove all relays, detaching each one. */
  clear(): void;
}

export function createFocusRelayManager(): FocusRelayManager {
  const stack: Array<{ relay: FocusRelay; container: HTMLElement }> = [];

  return {
    push(container, options = {}) {
      const relay = createFocusRelay(options);
      relay.attach(container);
      stack.push({ relay, container });
      return relay;
    },

    pop() {
      const entry = stack.pop();
      if (!entry) return undefined;
      entry.relay.detach();
      return entry.relay;
    },

    getCurrent() {
      return stack[stack.length - 1]?.relay;
    },

    getDepth() {
      return stack.length;
    },

    clear() {
      while (stack.length) {
        const entry = stack.pop()!;
        entry.relay.detach();
      }
    },
  };
}
