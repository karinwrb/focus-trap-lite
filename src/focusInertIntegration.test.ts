import { createFocusInertManager } from './focusInertManager';

function buildModal() {
  const backdrop = document.createElement('div');
  backdrop.id = 'backdrop';

  const nav = document.createElement('nav');
  nav.id = 'nav';

  const modal = document.createElement('div');
  modal.setAttribute('role', 'dialog');
  modal.id = 'modal';

  const nestedModal = document.createElement('div');
  nestedModal.setAttribute('role', 'dialog');
  nestedModal.id = 'nested-modal';

  document.body.append(backdrop, nav, modal, nestedModal);
  return { backdrop, nav, modal, nestedModal };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('focusInertManager integration', () => {
  it('stacks inert layers for nested modals', () => {
    const { backdrop, nav, modal, nestedModal } = buildModal();
    const stack = createFocusInertManager();

    stack.push(modal);
    expect(backdrop.hasAttribute('inert')).toBe(true);
    expect(nav.hasAttribute('inert')).toBe(true);
    expect(modal.hasAttribute('inert')).toBe(false);

    stack.push(nestedModal);
    expect(modal.hasAttribute('inert')).toBe(true);
    expect(nestedModal.hasAttribute('inert')).toBe(false);
  });

  it('restores previous layer when nested modal is popped', () => {
    const { backdrop, nav, modal, nestedModal } = buildModal();
    const stack = createFocusInertManager();

    stack.push(modal);
    stack.push(nestedModal);
    stack.pop();

    expect(modal.hasAttribute('inert')).toBe(false);
    expect(backdrop.hasAttribute('inert')).toBe(true);
    expect(nav.hasAttribute('inert')).toBe(true);
  });

  it('releases all inert on releaseAll', () => {
    const { backdrop, nav, modal, nestedModal } = buildModal();
    const stack = createFocusInertManager();

    stack.push(modal);
    stack.push(nestedModal);
    stack.releaseAll();

    expect(backdrop.hasAttribute('inert')).toBe(false);
    expect(nav.hasAttribute('inert')).toBe(false);
    expect(modal.hasAttribute('inert')).toBe(false);
    expect(nestedModal.hasAttribute('inert')).toBe(false);
    expect(stack.getDepth()).toBe(0);
  });

  it('getCurrent returns the topmost trap root', () => {
    const { modal, nestedModal } = buildModal();
    const stack = createFocusInertManager();

    stack.push(modal);
    expect(stack.getCurrent()).toBe(modal);

    stack.push(nestedModal);
    expect(stack.getCurrent()).toBe(nestedModal);

    stack.pop();
    expect(stack.getCurrent()).toBe(modal);
  });
});
