import {
  createFocusGuard,
  attachFocusGuards,
  detachFocusGuards,
  isFocusGuard,
} from './focusGuard';

function createContainer(): HTMLDivElement {
  const container = document.createElement('div');
  const btn = document.createElement('button');
  btn.textContent = 'Click me';
  container.appendChild(btn);
  document.body.appendChild(container);
  return container;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusGuard', () => {
  it('creates a div with tabindex 0 and aria-hidden', () => {
    const guard = createFocusGuard();
    expect(guard.tagName).toBe('DIV');
    expect(guard.getAttribute('tabindex')).toBe('0');
    expect(guard.getAttribute('aria-hidden')).toBe('true');
    expect(guard.getAttribute('data-focus-guard')).toBe('true');
  });

  it('applies visually hidden styles', () => {
    const guard = createFocusGuard();
    expect(guard.style.position).toBe('fixed');
    expect(guard.style.width).toBe('1px');
  });
});

describe('attachFocusGuards', () => {
  it('inserts a guard before the first child and after the last child', () => {
    const container = createContainer();
    const { before, after } = attachFocusGuards(container);

    expect(container.firstChild).toBe(before);
    expect(container.lastChild).toBe(after);
  });

  it('returns the created guard elements', () => {
    const container = createContainer();
    const { before, after } = attachFocusGuards(container);
    expect(isFocusGuard(before)).toBe(true);
    expect(isFocusGuard(after)).toBe(true);
  });
});

describe('detachFocusGuards', () => {
  it('removes all guard elements from the container', () => {
    const container = createContainer();
    attachFocusGuards(container);
    detachFocusGuards(container);

    const remaining = container.querySelectorAll('[data-focus-guard]');
    expect(remaining.length).toBe(0);
  });

  it('leaves non-guard children intact', () => {
    const container = createContainer();
    attachFocusGuards(container);
    detachFocusGuards(container);

    expect(container.querySelectorAll('button').length).toBe(1);
  });
});

describe('isFocusGuard', () => {
  it('returns true for a guard element', () => {
    const guard = createFocusGuard();
    expect(isFocusGuard(guard)).toBe(true);
  });

  it('returns false for a regular element', () => {
    const btn = document.createElement('button');
    expect(isFocusGuard(btn)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isFocusGuard(null)).toBe(false);
  });
});
