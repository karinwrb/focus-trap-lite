import { createFocusScopeManager } from './focusScopeManager';

function makeRoot(id = 'root'): HTMLElement {
  const div = document.createElement('div');
  div.id = id;
  const btn = document.createElement('button');
  div.appendChild(btn);
  document.body.appendChild(div);
  return div;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusScopeManager', () => {
  it('creates and retrieves a scope by name', () => {
    const manager = createFocusScopeManager();
    const root = makeRoot();
    const scope = manager.getOrCreate({ name: 'a', root });
    expect(scope.getName()).toBe('a');
    expect(manager.get('a')).toBe(scope);
    manager.clear();
  });

  it('returns the same scope on repeated getOrCreate calls', () => {
    const manager = createFocusScopeManager();
    const root = makeRoot();
    const s1 = manager.getOrCreate({ name: 'x', root });
    const s2 = manager.getOrCreate({ name: 'x', root });
    expect(s1).toBe(s2);
    manager.clear();
  });

  it('drop removes and destroys the scope', () => {
    const manager = createFocusScopeManager();
    const root = makeRoot();
    manager.getOrCreate({ name: 'b', root });
    manager.drop('b');
    expect(manager.get('b')).toBeUndefined();
    expect(manager.getCount()).toBe(0);
  });

  it('getAll returns all registered scopes', () => {
    const manager = createFocusScopeManager();
    manager.getOrCreate({ name: 'p', root: makeRoot('p') });
    manager.getOrCreate({ name: 'q', root: makeRoot('q') });
    expect(manager.getAll()).toHaveLength(2);
    manager.clear();
  });

  it('getActive returns the scope that contains focus', () => {
    const manager = createFocusScopeManager();
    const root = makeRoot();
    const btn = root.querySelector('button') as HTMLButtonElement;
    manager.getOrCreate({ name: 'focused', root });
    btn.focus();
    const active = manager.getActive();
    expect(active?.getName()).toBe('focused');
    manager.clear();
  });

  it('clear destroys all scopes and resets count', () => {
    const manager = createFocusScopeManager();
    manager.getOrCreate({ name: 'r', root: makeRoot('r') });
    manager.getOrCreate({ name: 's', root: makeRoot('s') });
    manager.clear();
    expect(manager.getCount()).toBe(0);
    expect(manager.getAll()).toHaveLength(0);
  });
});
