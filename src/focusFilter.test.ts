import { isVisible, isFocusable, isTabbable, filterTabbable, getFirstTabbable, getLastTabbable } from './focusFilter';

function createElement(tag: string, attrs: Record<string, string> = {}): HTMLElement {
  const el = document.createElement(tag) as HTMLElement;
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function buildContainer(): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = `
    <button id="btn1">First</button>
    <input id="inp1" type="text" />
    <a id="link1" href="#">Link</a>
    <button id="btn2" disabled>Disabled</button>
    <span id="span1" tabindex="-1">Not tabbable</span>
    <textarea id="ta1"></textarea>
  `;
  document.body.appendChild(div);
  return div;
}

describe('isVisible', () => {
  it('returns true for a normal element', () => {
    const el = createElement('button');
    document.body.appendChild(el);
    expect(isVisible(el)).toBe(true);
    document.body.removeChild(el);
  });

  it('returns false for element with hidden attribute', () => {
    const el = createElement('button', { hidden: '' });
    document.body.appendChild(el);
    expect(isVisible(el)).toBe(false);
    document.body.removeChild(el);
  });
});

describe('isFocusable', () => {
  it('returns true for a button', () => {
    const el = createElement('button');
    document.body.appendChild(el);
    expect(isFocusable(el)).toBe(true);
    document.body.removeChild(el);
  });

  it('returns false for a disabled button', () => {
    const el = createElement('button', { disabled: '' });
    document.body.appendChild(el);
    expect(isFocusable(el)).toBe(false);
    document.body.removeChild(el);
  });

  it('returns false for a plain div', () => {
    const el = createElement('div');
    document.body.appendChild(el);
    expect(isFocusable(el)).toBe(false);
    document.body.removeChild(el);
  });
});

describe('isTabbable', () => {
  it('returns false for tabindex=-1 element', () => {
    const el = createElement('span', { tabindex: '-1' });
    document.body.appendChild(el);
    expect(isTabbable(el)).toBe(false);
    document.body.removeChild(el);
  });

  it('returns true for tabindex=0 element', () => {
    const el = createElement('span', { tabindex: '0' });
    document.body.appendChild(el);
    expect(isTabbable(el)).toBe(true);
    document.body.removeChild(el);
  });
});

describe('getFirstTabbable / getLastTabbable', () => {
  it('returns the first and last tabbable elements', () => {
    const container = buildContainer();
    const first = getFirstTabbable(container);
    const last = getLastTabbable(container);
    expect(first?.id).toBe('btn1');
    expect(last?.id).toBe('ta1');
    document.body.removeChild(container);
  });

  it('returns null for empty container', () => {
    const container = document.createElement('div');
    expect(getFirstTabbable(container)).toBeNull();
    expect(getLastTabbable(container)).toBeNull();
  });
});

describe('filterTabbable', () => {
  it('excludes disabled and tabindex=-1 elements', () => {
    const container = buildContainer();
    const all = Array.from(container.querySelectorAll<HTMLElement>('*'));
    const tabbable = filterTabbable(all);
    const ids = tabbable.map(el => el.id);
    expect(ids).not.toContain('btn2');
    expect(ids).not.toContain('span1');
    expect(ids).toContain('btn1');
    document.body.removeChild(container);
  });
});
