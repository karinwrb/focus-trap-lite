import { createFocusInitializer } from './focusInitializer';

function buildContainer(): HTMLElement {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
}

function addButton(container: HTMLElement, attrs: Record<string, string> = {}): HTMLButtonElement {
  const btn = document.createElement('button');
  Object.entries(attrs).forEach(([k, v]) => btn.setAttribute(k, v));
  btn.textContent = 'btn';
  container.appendChild(btn);
  return btn;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusInitializer', () => {
  it('focuses the data-attr element when strategy is data-attr', () => {
    const container = buildContainer();
    addButton(container);
    const target = addButton(container, { 'data-focus-initial': '' });
    const init = createFocusInitializer({ container, strategy: 'data-attr' });
    const result = init.initialize();
    expect(result).toBe(target);
  });

  it('focuses the first tabbable element when strategy is first', () => {
    const container = buildContainer();
    const first = addButton(container);
    addButton(container);
    const init = createFocusInitializer({ container, strategy: 'first' });
    const result = init.initialize();
    expect(result).toBe(first);
  });

  it('returns null when strategy is none', () => {
    const container = buildContainer();
    addButton(container);
    const init = createFocusInitializer({ container, strategy: 'none' });
    expect(init.initialize()).toBeNull();
  });

  it('auto strategy prefers data-attr over first', () => {
    const container = buildContainer();
    addButton(container);
    const marked = addButton(container, { 'data-focus-initial': '' });
    const init = createFocusInitializer({ container, strategy: 'auto' });
    expect(init.initialize()).toBe(marked);
  });

  it('auto falls back to first when no data-attr found', () => {
    const container = buildContainer();
    const first = addButton(container);
    const init = createFocusInitializer({ container, strategy: 'auto' });
    expect(init.initialize()).toBe(first);
  });

  it('returns null when container is empty and strategy is first', () => {
    const container = buildContainer();
    const init = createFocusInitializer({ container, strategy: 'first' });
    expect(init.initialize()).toBeNull();
  });

  it('getStrategy and setStrategy work', () => {
    const container = buildContainer();
    const init = createFocusInitializer({ container });
    expect(init.getStrategy()).toBe('auto');
    init.setStrategy('none');
    expect(init.getStrategy()).toBe('none');
  });

  it('respects custom dataAttr option', () => {
    const container = buildContainer();
    const target = addButton(container, { 'data-my-focus': '' });
    addButton(container);
    const init = createFocusInitializer({ container, strategy: 'data-attr', dataAttr: 'data-my-focus' });
    expect(init.initialize()).toBe(target);
  });
});
