import { createFocusPlaceholderManager } from './focusPlaceholderManager';

function createContainer(): HTMLElement {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusPlaceholderManager', () => {
  it('getOrCreate returns a new placeholder for an unknown id', () => {
    const mgr = createFocusPlaceholderManager();
    const p = mgr.getOrCreate('modal-a');
    expect(p).toBeDefined();
    expect(p.element).toBeInstanceOf(HTMLElement);
  });

  it('getOrCreate returns the same instance for the same id', () => {
    const mgr = createFocusPlaceholderManager();
    const p1 = mgr.getOrCreate('modal-a');
    const p2 = mgr.getOrCreate('modal-a');
    expect(p1).toBe(p2);
  });

  it('get returns undefined for unknown id', () => {
    const mgr = createFocusPlaceholderManager();
    expect(mgr.get('unknown')).toBeUndefined();
  });

  it('get returns the placeholder after creation', () => {
    const mgr = createFocusPlaceholderManager();
    const p = mgr.getOrCreate('modal-b');
    expect(mgr.get('modal-b')).toBe(p);
  });

  it('drop removes the placeholder and detaches it', () => {
    const container = createContainer();
    const mgr = createFocusPlaceholderManager();
    const p = mgr.getOrCreate('modal-c');
    p.attach(container);
    mgr.drop('modal-c');
    expect(mgr.get('modal-c')).toBeUndefined();
    expect(container.contains(p.element)).toBe(false);
  });

  it('getIds returns all registered ids', () => {
    const mgr = createFocusPlaceholderManager();
    mgr.getOrCreate('a');
    mgr.getOrCreate('b');
    mgr.getOrCreate('c');
    expect(mgr.getIds().sort()).toEqual(['a', 'b', 'c']);
  });

  it('clear removes all placeholders and detaches them', () => {
    const container = createContainer();
    const mgr = createFocusPlaceholderManager();
    const p1 = mgr.getOrCreate('x');
    const p2 = mgr.getOrCreate('y');
    p1.attach(container);
    p2.attach(container);
    mgr.clear();
    expect(mgr.getIds()).toEqual([]);
    expect(container.children.length).toBe(0);
  });

  it('getOrCreate passes label to the placeholder aria-label', () => {
    const mgr = createFocusPlaceholderManager();
    const p = mgr.getOrCreate('dialog', 'Dialog placeholder');
    expect(p.element.getAttribute('aria-label')).toBe('Dialog placeholder');
  });
});
