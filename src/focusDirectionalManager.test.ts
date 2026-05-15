import { createFocusDirectionalManager } from './focusDirectionalManager';

function makeEl(): HTMLElement {
  const div = document.createElement('div');
  ['X', 'Y'].forEach(label => {
    const btn = document.createElement('button');
    btn.textContent = label;
    div.appendChild(btn);
  });
  document.body.appendChild(div);
  return div;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusDirectionalManager', () => {
  it('creates and returns a directional instance', () => {
    const manager = createFocusDirectionalManager();
    const el = makeEl();
    const instance = manager.getOrCreate(el, { layout: 'vertical' });
    expect(instance).toBeDefined();
    expect(instance.getLayout()).toBe('vertical');
    manager.dropAll();
  });

  it('returns same instance for same container', () => {
    const manager = createFocusDirectionalManager();
    const el = makeEl();
    const a = manager.getOrCreate(el);
    const b = manager.getOrCreate(el);
    expect(a).toBe(b);
    manager.dropAll();
  });

  it('get returns undefined for unknown container', () => {
    const manager = createFocusDirectionalManager();
    const el = makeEl();
    expect(manager.get(el)).toBeUndefined();
  });

  it('drop removes the instance', () => {
    const manager = createFocusDirectionalManager();
    const el = makeEl();
    manager.getOrCreate(el);
    expect(manager.getCount()).toBe(1);
    manager.drop(el);
    expect(manager.getCount()).toBe(0);
    expect(manager.get(el)).toBeUndefined();
  });

  it('dropAll clears all instances', () => {
    const manager = createFocusDirectionalManager();
    const el1 = makeEl();
    const el2 = makeEl();
    manager.getOrCreate(el1);
    manager.getOrCreate(el2);
    expect(manager.getCount()).toBe(2);
    manager.dropAll();
    expect(manager.getCount()).toBe(0);
  });
});
