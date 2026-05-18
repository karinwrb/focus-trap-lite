/**
 * focusSequence — manages an ordered sequence of focusable elements,
 * allowing step-by-step navigation forward and backward.
 */

export interface FocusSequence {
  add(el: HTMLElement): void;
  remove(el: HTMLElement): void;
  next(): HTMLElement | null;
  prev(): HTMLElement | null;
  current(): HTMLElement | null;
  reset(): void;
  getAll(): HTMLElement[];
  getIndex(): number;
  setIndex(index: number): boolean;
}

export function createFocusSequence(initial: HTMLElement[] = []): FocusSequence {
  let elements: HTMLElement[] = [...initial];
  let currentIndex = -1;

  function add(el: HTMLElement): void {
    if (!elements.includes(el)) {
      elements.push(el);
    }
  }

  function remove(el: HTMLElement): void {
    const idx = elements.indexOf(el);
    if (idx === -1) return;
    elements.splice(idx, 1);
    if (currentIndex >= elements.length) {
      currentIndex = elements.length - 1;
    }
  }

  function next(): HTMLElement | null {
    if (elements.length === 0) return null;
    currentIndex = (currentIndex + 1) % elements.length;
    const el = elements[currentIndex];
    el.focus();
    return el;
  }

  function prev(): HTMLElement | null {
    if (elements.length === 0) return null;
    currentIndex = (currentIndex - 1 + elements.length) % elements.length;
    const el = elements[currentIndex];
    el.focus();
    return el;
  }

  function current(): HTMLElement | null {
    if (currentIndex < 0 || currentIndex >= elements.length) return null;
    return elements[currentIndex];
  }

  function reset(): void {
    currentIndex = -1;
  }

  function getAll(): HTMLElement[] {
    return [...elements];
  }

  function getIndex(): number {
    return currentIndex;
  }

  function setIndex(index: number): boolean {
    if (index < 0 || index >= elements.length) return false;
    currentIndex = index;
    elements[currentIndex].focus();
    return true;
  }

  return { add, remove, next, prev, current, reset, getAll, getIndex, setIndex };
}
