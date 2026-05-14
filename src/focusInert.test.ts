import { createFocusInert } from './focusInert';

function buildDOM() {
  const container = document.createElement('div');

  const sidebar = document.createElement('aside');
  sidebar.id = 'sidebar';

  const main = document.createElement('main');
  main.id = 'main';

  const modal = document.createElement('div');
  modal.id = 'modal';

  const alreadyInert = document.createElement('div');
  alreadyInert.id = 'already-inert';
  alreadyInert.setAttribute('inert', '');

  container.append(sidebar, main, modal, alreadyInert);
  document.body.appendChild(container);
  return { container, sidebar, main, modal, alreadyInert };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusInert', () => {
  it('applies inert to siblings of the trap root', () => {
    const { sidebar, main, modal } = buildDOM();
    const manager = createFocusInert();

    manager.apply(modal);

    expect(sidebar.hasAttribute('inert')).toBe(true);
    expect(main.hasAttribute('inert')).toBe(true);
    expect(modal.hasAttribute('inert')).toBe(false);
  });

  it('does not double-apply inert to already-inert elements', () => {
    const { modal, alreadyInert } = buildDOM();
    const manager = createFocusInert();

    manager.apply(modal);
    manager.release();

    expect(alreadyInert.hasAttribute('inert')).toBe(true);
  });

  it('releases inert from managed elements', () => {
    const { sidebar, main, modal } = buildDOM();
    const manager = createFocusInert();

    manager.apply(modal);
    manager.release();

    expect(sidebar.hasAttribute('inert')).toBe(false);
    expect(main.hasAttribute('inert')).toBe(false);
  });

  it('isApplied returns correct state', () => {
    const { modal } = buildDOM();
    const manager = createFocusInert();

    expect(manager.isApplied()).toBe(false);
    manager.apply(modal);
    expect(manager.isApplied()).toBe(true);
    manager.release();
    expect(manager.isApplied()).toBe(false);
  });

  it('re-applying releases previous state first', () => {
    const { sidebar, main, modal } = buildDOM();
    const manager = createFocusInert();

    manager.apply(modal);
    manager.apply(sidebar);

    expect(sidebar.hasAttribute('inert')).toBe(false);
    expect(main.hasAttribute('inert')).toBe(true);
    expect(modal.hasAttribute('inert')).toBe(true);

    manager.release();
    expect(main.hasAttribute('inert')).toBe(false);
    expect(modal.hasAttribute('inert')).toBe(false);
  });
});
