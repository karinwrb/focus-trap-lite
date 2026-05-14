import { createFocusGroupManager } from './focusGroupManager';

function makeEl(id: string): HTMLElement {
  const el = document.createElement('button');
  el.id = id;
  return el;
}

describe('createFocusGroupManager', () => {
  it('creates a new group on first access', () => {
    const mgr = createFocusGroupManager();
    const g = mgr.getOrCreate('modals');
    expect(g).toBeDefined();
    expect(g.size()).toBe(0);
  });

  it('returns the same group on subsequent calls', () => {
    const mgr = createFocusGroupManager();
    const g1 = mgr.getOrCreate('modals');
    const g2 = mgr.getOrCreate('modals');
    expect(g1).toBe(g2);
  });

  it('get returns undefined for unknown group', () => {
    const mgr = createFocusGroupManager();
    expect(mgr.get('unknown')).toBeUndefined();
  });

  it('drop removes a group', () => {
    const mgr = createFocusGroupManager();
    mgr.getOrCreate('tooltips');
    mgr.drop('tooltips');
    expect(mgr.get('tooltips')).toBeUndefined();
    expect(mgr.listGroups()).not.toContain('tooltips');
  });

  it('listGroups returns all group names', () => {
    const mgr = createFocusGroupManager();
    mgr.getOrCreate('a');
    mgr.getOrCreate('b');
    mgr.getOrCreate('c');
    expect(mgr.listGroups().sort()).toEqual(['a', 'b', 'c']);
  });

  it('getActiveAcrossGroups returns null when all groups empty', () => {
    const mgr = createFocusGroupManager();
    mgr.getOrCreate('x');
    expect(mgr.getActiveAcrossGroups()).toBeNull();
  });

  it('getActiveAcrossGroups returns highest priority entry across groups', () => {
    const mgr = createFocusGroupManager();
    const g1 = mgr.getOrCreate('dialogs');
    const g2 = mgr.getOrCreate('drawers');
    g1.add('d1', makeEl('d1'), 5);
    g2.add('dr1', makeEl('dr1'), 20);
    g1.add('d2', makeEl('d2'), 10);
    const active = mgr.getActiveAcrossGroups();
    expect(active?.id).toBe('dr1');
    expect(active?.priority).toBe(20);
  });

  it('destroyAll clears and removes all groups', () => {
    const mgr = createFocusGroupManager();
    const g = mgr.getOrCreate('modals');
    g.add('m1', makeEl('m1'));
    mgr.destroyAll();
    expect(mgr.listGroups()).toEqual([]);
    expect(mgr.get('modals')).toBeUndefined();
  });
});
