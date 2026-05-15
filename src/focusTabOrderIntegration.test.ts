/**
 * Integration: createFocusTabOrder used alongside createFocusTrap to verify
 * that the computed tab order matches what the trap navigates.
 */
import { createFocusTabOrder } from './focusTabOrder';
import { createFocusTrap } from './focusTrap';

function buildModal(): { modal: HTMLElement; buttons: HTMLButtonElement[] } {
  const modal = document.createElement('div');
  modal.setAttribute('role', 'dialog');
  const buttons: HTMLButtonElement[] = ['Close', 'Confirm', 'Cancel'].map((label) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    modal.appendChild(btn);
    return btn;
  });
  document.body.appendChild(modal);
  return { modal, buttons };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('focusTabOrder + focusTrap integration', () => {
  it('tab order length matches trap focusable elements', () => {
    const { modal } = buildModal();
    const order = createFocusTabOrder(modal);
    const trap = createFocusTrap(modal);
    trap.activate();
    expect(order.getElements().length).toBe(3);
    trap.deactivate();
  });

  it('getFirst matches the first element trap would focus', () => {
    const { modal, buttons } = buildModal();
    const order = createFocusTabOrder(modal);
    expect(order.getFirst()).toBe(buttons[0]);
  });

  it('getLast matches the last element in the modal', () => {
    const { modal, buttons } = buildModal();
    const order = createFocusTabOrder(modal);
    expect(order.getLast()).toBe(buttons[buttons.length - 1]);
  });

  it('getNext traverses forward through all buttons', () => {
    const { modal, buttons } = buildModal();
    const order = createFocusTabOrder(modal);
    expect(order.getNext(buttons[0])).toBe(buttons[1]);
    expect(order.getNext(buttons[1])).toBe(buttons[2]);
    expect(order.getNext(buttons[2])).toBeNull();
  });

  it('getPrev traverses backward through all buttons', () => {
    const { modal, buttons } = buildModal();
    const order = createFocusTabOrder(modal);
    expect(order.getPrev(buttons[2])).toBe(buttons[1]);
    expect(order.getPrev(buttons[1])).toBe(buttons[0]);
    expect(order.getPrev(buttons[0])).toBeNull();
  });

  it('refresh updates order after a button is removed', () => {
    const { modal, buttons } = buildModal();
    const order = createFocusTabOrder(modal);
    modal.removeChild(buttons[1]);
    order.refresh();
    expect(order.getElements().length).toBe(2);
    expect(order.getNext(buttons[0])).toBe(buttons[2]);
  });
});
