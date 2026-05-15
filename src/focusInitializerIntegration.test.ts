/**
 * Integration test: FocusInitializerManager used across multiple modal containers.
 */
import { createFocusInitializerManager } from './focusInitializerManager';

function buildModal(): { container: HTMLElement; buttons: HTMLButtonElement[] } {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const buttons = ['Cancel', 'Confirm'].map((label) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    container.appendChild(btn);
    return btn;
  });
  return { container, buttons };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FocusInitializerManager integration', () => {
  it('initializes focus for multiple containers independently', () => {
    const manager = createFocusInitializerManager();
    const modal1 = buildModal();
    const modal2 = buildModal();

    modal2.buttons[1].setAttribute('data-focus-initial', '');

    manager.getOrCreate(modal1.container, { strategy: 'first' });
    manager.getOrCreate(modal2.container, { strategy: 'auto' });

    expect(manager.size()).toBe(2);

    const r1 = manager.get(modal1.container)!.initialize();
    const r2 = manager.get(modal2.container)!.initialize();

    expect(r1).toBe(modal1.buttons[0]);
    expect(r2).toBe(modal2.buttons[1]);
  });

  it('initializeAll triggers all registered initializers', () => {
    const manager = createFocusInitializerManager();
    const modal = buildModal();
    const focused: Element[] = [];
    modal.buttons[0].addEventListener('focus', () => focused.push(modal.buttons[0]));

    manager.getOrCreate(modal.container, { strategy: 'first' });
    manager.initializeAll();

    expect(focused.length).toBeGreaterThan(0);
  });

  it('drop removes a container from the manager', () => {
    const manager = createFocusInitializerManager();
    const { container } = buildModal();
    manager.getOrCreate(container);
    expect(manager.size()).toBe(1);
    manager.drop(container);
    expect(manager.size()).toBe(0);
    expect(manager.get(container)).toBeUndefined();
  });

  it('setGlobalStrategy applies to newly created initializers', () => {
    const manager = createFocusInitializerManager();
    manager.setGlobalStrategy('none');
    const { container } = buildModal();
    const init = manager.getOrCreate(container);
    expect(init.getStrategy()).toBe('none');
    expect(init.initialize()).toBeNull();
  });

  it('getOrCreate returns the same instance for the same container', () => {
    const manager = createFocusInitializerManager();
    const { container } = buildModal();
    const a = manager.getOrCreate(container);
    const b = manager.getOrCreate(container);
    expect(a).toBe(b);
  });
});
