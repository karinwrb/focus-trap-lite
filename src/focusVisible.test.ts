import { createFocusVisible, getSharedFocusVisible, isFocusVisible } from './focusVisible';

function fireKeyDown(target: EventTarget, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

function firePointerDown(target: EventTarget): void {
  target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
}

describe('createFocusVisible', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('starts in pointer mode (non-keyboard)', () => {
    const fv = createFocusVisible();
    fv.attach(document);
    expect(fv.isKeyboardMode()).toBe(false);
    fv.destroy();
  });

  it('switches to keyboard mode on Tab key', () => {
    const fv = createFocusVisible();
    fv.attach(document);
    fireKeyDown(document, 'Tab');
    expect(fv.isKeyboardMode()).toBe(true);
    fv.destroy();
  });

  it('switches to keyboard mode on Arrow keys', () => {
    const fv = createFocusVisible();
    fv.attach(document);
    fireKeyDown(document, 'ArrowDown');
    expect(fv.isKeyboardMode()).toBe(true);
    fv.destroy();
  });

  it('resets to pointer mode on pointerdown', () => {
    const fv = createFocusVisible();
    fv.attach(document);
    fireKeyDown(document, 'Tab');
    expect(fv.isKeyboardMode()).toBe(true);
    firePointerDown(document);
    expect(fv.isKeyboardMode()).toBe(false);
    fv.destroy();
  });

  it('does not switch mode for non-navigation keys', () => {
    const fv = createFocusVisible();
    fv.attach(document);
    fireKeyDown(document, 'a');
    expect(fv.isKeyboardMode()).toBe(false);
    fv.destroy();
  });

  it('stops responding after detach', () => {
    const fv = createFocusVisible();
    fv.attach(document);
    fv.detach(document);
    fireKeyDown(document, 'Tab');
    expect(fv.isKeyboardMode()).toBe(false);
  });

  it('resets state on destroy', () => {
    const fv = createFocusVisible();
    fv.attach(document);
    fireKeyDown(document, 'Tab');
    fv.destroy();
    expect(fv.isKeyboardMode()).toBe(false);
  });
});

describe('getSharedFocusVisible / isFocusVisible', () => {
  it('returns the same instance across calls', () => {
    const a = getSharedFocusVisible();
    const b = getSharedFocusVisible();
    expect(a).toBe(b);
  });

  it('isFocusVisible reflects shared state after Tab', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(isFocusVisible()).toBe(true);
  });

  it('isFocusVisible resets after pointerdown', () => {
    document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(isFocusVisible()).toBe(false);
  });
});
