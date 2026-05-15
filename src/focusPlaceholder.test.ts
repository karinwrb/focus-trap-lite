import { createFocusPlaceholder, isFocusPlaceholder } from './focusPlaceholder';

function createContainer(): HTMLElement {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusPlaceholder', () => {
  it('creates an element with tabindex -1', () => {
    const p = createFocusPlaceholder();
    expect(p.element.getAttribute('tabindex')).toBe('-1');
  });

  it('uses the provided label as aria-label', () => {
    const p = createFocusPlaceholder('My label');
    expect(p.element.getAttribute('aria-label')).toBe('My label');
  });

  it('attach appends element to container', () => {
    const container = createContainer();
    const p = createFocusPlaceholder();
    p.attach(container);
    expect(container.contains(p.element)).toBe(true);
    expect(p.isAttached()).toBe(true);
  });

  it('detach removes element from container', () => {
    const container = createContainer();
    const p = createFocusPlaceholder();
    p.attach(container);
    p.detach();
    expect(container.contains(p.element)).toBe(false);
    expect(p.isAttached()).toBe(false);
  });

  it('attaching to a new container detaches from old one', () => {
    const c1 = createContainer();
    const c2 = createContainer();
    const p = createFocusPlaceholder();
    p.attach(c1);
    p.attach(c2);
    expect(c1.contains(p.element)).toBe(false);
    expect(c2.contains(p.element)).toBe(true);
  });

  it('isAttached returns false before any attach', () => {
    const p = createFocusPlaceholder();
    expect(p.isAttached()).toBe(false);
  });

  it('takeFocus calls focus on the element', () => {
    const container = createContainer();
    const p = createFocusPlaceholder();
    p.attach(container);
    const spy = jest.spyOn(p.element, 'focus');
    p.takeFocus();
    expect(spy).toHaveBeenCalledWith({ preventScroll: true });
  });
});

describe('isFocusPlaceholder', () => {
  it('returns true for placeholder elements', () => {
    const p = createFocusPlaceholder();
    expect(isFocusPlaceholder(p.element)).toBe(true);
  });

  it('returns false for ordinary elements', () => {
    const el = document.createElement('button');
    expect(isFocusPlaceholder(el)).toBe(false);
  });
});
