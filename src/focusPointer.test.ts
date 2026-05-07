import { createFocusPointer, FocusPointerHandler } from './focusPointer';

const DATA_ATTR = 'data-focus-pointer';

function fireEvent(type: string): void {
  document.dispatchEvent(new Event(type, { bubbles: true }));
}

function fireKeyDown(key = 'Tab'): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

describe('createFocusPointer', () => {
  let handler: FocusPointerHandler;

  beforeEach(() => {
    handler = createFocusPointer(document);
    handler.attach();
  });

  afterEach(() => {
    handler.detach();
    document.documentElement.removeAttribute(DATA_ATTR);
  });

  it('starts with pointer inactive', () => {
    expect(handler.isPointerActive()).toBe(false);
  });

  it('sets pointerActive on mousedown', () => {
    fireEvent('mousedown');
    expect(handler.isPointerActive()).toBe(true);
  });

  it('sets pointerActive on pointerdown', () => {
    fireEvent('pointerdown');
    expect(handler.isPointerActive()).toBe(true);
  });

  it('sets pointerActive on touchstart', () => {
    fireEvent('touchstart');
    expect(handler.isPointerActive()).toBe(true);
  });

  it('sets data attribute on pointer event', () => {
    fireEvent('mousedown');
    expect(document.documentElement.getAttribute(DATA_ATTR)).toBe('true');
  });

  it('clears pointerActive on keydown', () => {
    fireEvent('mousedown');
    expect(handler.isPointerActive()).toBe(true);
    fireKeyDown();
    expect(handler.isPointerActive()).toBe(false);
  });

  it('removes data attribute on keydown', () => {
    fireEvent('mousedown');
    fireKeyDown();
    expect(document.documentElement.hasAttribute(DATA_ATTR)).toBe(false);
  });

  it('detach removes listeners and clears state', () => {
    fireEvent('mousedown');
    handler.detach();
    expect(handler.isPointerActive()).toBe(false);
    expect(document.documentElement.hasAttribute(DATA_ATTR)).toBe(false);
    // After detach, pointer events should not update state
    fireEvent('mousedown');
    expect(handler.isPointerActive()).toBe(false);
  });

  it('detach then attach re-enables tracking', () => {
    handler.detach();
    handler.attach();
    fireEvent('pointerdown');
    expect(handler.isPointerActive()).toBe(true);
  });
});
