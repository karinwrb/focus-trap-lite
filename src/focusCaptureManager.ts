/**
 * focusCaptureManager — manages a stack of FocusCapture instances,
 * allowing nested modals each to own their capture layer.
 */
import { createFocusCapture, FocusCapture, FocusCaptureOptions } from './focusCapture';

export interface FocusCaptureManager {
  push: (container: HTMLElement, options?: FocusCaptureOptions) => FocusCapture;
  pop: () => void;
  getCurrent: () => FocusCapture | null;
  getDepth: () => number;
  releaseAll: () => void;
}

export function createFocusCaptureManager(): FocusCaptureManager {
  const stack: Array<{ capture: FocusCapture; container: HTMLElement }> = [];

  function push(container: HTMLElement, options: FocusCaptureOptions = {}): FocusCapture {
    const capture = createFocusCapture(options);
    capture.attach(container);
    stack.push({ capture, container });
    return capture;
  }

  function pop(): void {
    const entry = stack.pop();
    if (!entry) return;
    entry.capture.release();

    // Re-attach the previous capture if one exists
    const previous = stack[stack.length - 1];
    if (previous && !previous.capture.isCapturing()) {
      previous.capture.attach(previous.container);
    }
  }

  function getCurrent(): FocusCapture | null {
    return stack.length > 0 ? stack[stack.length - 1].capture : null;
  }

  function getDepth(): number {
    return stack.length;
  }

  function releaseAll(): void {
    while (stack.length > 0) {
      pop();
    }
  }

  return { push, pop, getCurrent, getDepth, releaseAll };
}
