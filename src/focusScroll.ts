/**
 * focusScroll.ts
 * Utilities to scroll a focused element into view within a focus trap container.
 */

export interface ScrollIntoViewOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

const defaultScrollOptions: ScrollIntoViewOptions = {
  behavior: "smooth",
  block: "nearest",
  inline: "nearest",
};

/**
 * Checks whether an element is fully visible within its scroll container.
 */
export function isScrolledIntoView(
  element: Element,
  container: Element
): boolean {
  const elemRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return (
    elemRect.top >= containerRect.top &&
    elemRect.left >= containerRect.left &&
    elemRect.bottom <= containerRect.bottom &&
    elemRect.right <= containerRect.right
  );
}

/**
 * Scrolls the given element into view within a container if needed.
 */
export function scrollIntoViewIfNeeded(
  element: Element,
  container: Element,
  options: ScrollIntoViewOptions = defaultScrollOptions
): void {
  if (!isScrolledIntoView(element, container)) {
    element.scrollIntoView(options);
  }
}

export interface FocusScrollHandler {
  handleFocus: (event: FocusEvent) => void;
  attach: (container: HTMLElement) => void;
  detach: (container: HTMLElement) => void;
}

/**
 * Creates a focus scroll handler that automatically scrolls focused
 * elements into view within the given trap container.
 */
export function createFocusScrollHandler(
  container: HTMLElement,
  options: ScrollIntoViewOptions = defaultScrollOptions
): FocusScrollHandler {
  function handleFocus(event: FocusEvent): void {
    const target = event.target;
    if (target instanceof Element && container.contains(target)) {
      scrollIntoViewIfNeeded(target, container, options);
    }
  }

  function attach(el: HTMLElement): void {
    el.addEventListener("focusin", handleFocus, true);
  }

  function detach(el: HTMLElement): void {
    el.removeEventListener("focusin", handleFocus, true);
  }

  return { handleFocus, attach, detach };
}
