import { createFocusGroup, getGlobalFocusGroup } from './focusGroup';

function createElement(id: string): HTMLElement {
  const el = document.createElement('div');
  el.id = id;
  return el;
}

describe('createFocusGroup', () => {
  it('starts empty', () => {
    const group = createFocusGroup();
    expect(group.size()).toBe(0);
    expect(group.getActive()).toBeNull();
    expect(group.getAll()).toEqual([]);
  });

  it('adds and retrieves entries', () => {
    const group = createFocusGroup();
    const el = createElement('a');
    group.add('a', el);
    expect(group.size()).toBe(1);
    expect(group.has('a')).toBe(true);
  });

  it('returns the highest priority entry as active', () => {
    const group = createFocusGroup();
    const low = createElement('low');
    const high = createElement('high');
    group.add('low', low, 1);
    group.add('high', high, 10);
    const active = group.getActive();
    expect(active?.id).toBe('high');
  });

  it('defaults priority to 0', () => {
    const group = createFocusGroup();
    const el = createElement('x');
    group.add('x', el);
    expect(group.getActive()?.priority).toBe(0);
  });

  it('removes an entry', () => {
    const group = createFocusGroup();
    const el = createElement('r');
    group.add('r', el);
    group.remove('r');
    expect(group.has('r')).toBe(false);
    expect(group.size()).toBe(0);
  });

  it('getAll returns entries sorted by priority descending', () => {
    const group = createFocusGroup();
    group.add('a', createElement('a'), 5);
    group.add('b', createElement('b'), 15);
    group.add('c', createElement('c'), 1);
    const all = group.getAll();
    expect(all.map(e => e.id)).toEqual(['b', 'a', 'c']);
  });

  it('clear removes all entries', () => {
    const group = createFocusGroup();
    group.add('a', createElement('a'));
    group.add('b', createElement('b'));
    group.clear();
    expect(group.size()).toBe(0);
  });

  it('getActive returns null after removing only entry', () => {
    const group = createFocusGroup();
    const el = createElement('only');
    group.add('only', el);
    group.remove('only');
    expect(group.getActive()).toBeNull();
  });
});

describe('getGlobalFocusGroup', () => {
  afterEach(() => {
    getGlobalFocusGroup().clear();
  });

  it('returns the same instance across calls', () => {
    expect(getGlobalFocusGroup()).toBe(getGlobalFocusGroup());
  });

  it('global group is shared', () => {
    const g = getGlobalFocusGroup();
    g.add('shared', createElement('shared'), 3);
    expect(getGlobalFocusGroup().has('shared')).toBe(true);
  });
});
