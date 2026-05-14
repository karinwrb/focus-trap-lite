import { createFocusZoneManager } from './focusZoneManager';

function makeEl(): HTMLElement {
  const container = document.createElement('div');
  const btn = document.createElement('button');
  btn.setAttribute('tabindex', '0');
  container.appendChild(btn);
  document.body.appendChild(container);
  return container;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusZoneManager', () => {
  it('registers a zone and returns it', () => {
    const manager = createFocusZoneManager();
    const container = makeEl();
    const zone = manager.register('main', container);
    expect(zone).toBeDefined();
    expect(manager.get('main')).toBe(zone);
  });

  it('getRegisteredIds returns all ids', () => {
    const manager = createFocusZoneManager();
    manager.register('a', makeEl());
    manager.register('b', makeEl());
    expect(manager.getRegisteredIds()).toEqual(expect.arrayContaining(['a', 'b']));
  });

  it('activateAll attaches all zones', () => {
    const manager = createFocusZoneManager();
    const z1 = manager.register('x', makeEl());
    const z2 = manager.register('y', makeEl());
    expect(z1.isAttached()).toBe(false);
    manager.activateAll();
    expect(z1.isAttached()).toBe(true);
    expect(z2.isAttached()).toBe(true);
  });

  it('deactivateAll detaches all zones', () => {
    const manager = createFocusZoneManager();
    const z1 = manager.register('x', makeEl());
    manager.activateAll();
    manager.deactivateAll();
    expect(z1.isAttached()).toBe(false);
  });

  it('unregister removes and detaches zone', () => {
    const manager = createFocusZoneManager();
    const zone = manager.register('main', makeEl());
    zone.attach();
    manager.unregister('main');
    expect(manager.get('main')).toBeUndefined();
    expect(zone.isAttached()).toBe(false);
  });

  it('re-registering same id replaces old zone', () => {
    const manager = createFocusZoneManager();
    const old = manager.register('main', makeEl());
    old.attach();
    const fresh = manager.register('main', makeEl());
    expect(manager.get('main')).toBe(fresh);
    expect(old.isAttached()).toBe(false);
  });
});
