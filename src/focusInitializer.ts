/**
 * focusInitializer.ts
 * Determines and applies the initial focus target when a trap or dialog opens.
 * Supports data attributes, explicit element refs, and fallback strategies.
 */

export type InitialFocusStrategy = "auto" | "first" | "data-attr" | "none";

export interface FocusInitializerOptions {
  container: HTMLElement;
  strategy?: InitialFocusStrategy;
  dataAttr?: string;
  fallbackSelector?: string;
}

export interface FocusInitializer {
  initialize(): HTMLElement | null;
  getStrategy(): InitialFocusStrategy;
  setStrategy(s: InitialFocusStrategy): void;
}

const TABBABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function findByDataAttr(container: HTMLElement, attr: string): HTMLElement | null {
  return container.querySelector<HTMLElement>(`[${attr}]`);
}

function findFirst(container: HTMLElement, fallback?: string): HTMLElement | null {
  const selector = fallback ?? TABBABLE_SELECTORS;
  return container.querySelector<HTMLElement>(selector);
}

export function createFocusInitializer(options: FocusInitializerOptions): FocusInitializer {
  let strategy: InitialFocusStrategy = options.strategy ?? "auto";
  const dataAttr = options.dataAttr ?? "data-focus-initial";

  function initialize(): HTMLElement | null {
    const { container, fallbackSelector } = options;

    if (strategy === "none") return null;

    if (strategy === "data-attr" || strategy === "auto") {
      const byAttr = findByDataAttr(container, dataAttr);
      if (byAttr) {
        byAttr.focus();
        return byAttr;
      }
      if (strategy === "data-attr") return null;
    }

    if (strategy === "first" || strategy === "auto") {
      const first = findFirst(container, fallbackSelector);
      if (first) {
        first.focus();
        return first;
      }
    }

    return null;
  }

  function getStrategy(): InitialFocusStrategy {
    return strategy;
  }

  function setStrategy(s: InitialFocusStrategy): void {
    strategy = s;
  }

  return { initialize, getStrategy, setStrategy };
}
