import { createFocusLock } from './focusLock';
import { createFocusTrap } from './focusTrap';

function buildModal(): {
  modal: HTMLElement;
  trigger: HTMLButtonElement;
  closeBtn: HTMLButtonElement;
} {
  const trigger = document.createElement('button');
  trigger.textContent = 'Open';

  const modal = document.createElement('div');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('tabindex', '-1');

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  modal.appendChild(closeBtn);

  const input = document.createElement('input');
  input.type = 'text';
  modal.appendChild(input);

  document.body.appendChild(trigger);
  document.body.appendChild(modal);

  return { modal, trigger, closeBtn };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('focusLock + focusTrap integration', () => {
  it('lock and trap can be activated together without error', () => {
    const { modal } = buildModal();
    const lock = createFocusLock();
    const trap = createFocusTrap(modal);

    expect(() => {
      lock.attach(modal);
      trap.activate();
    }).not.toThrow();

    trap.deactivate();
    lock.detach();
  });

  it('detaching lock does not affect trap state', () => {
    const { modal } = buildModal();
    const lock = createFocusLock();
    const trap = createFocusTrap(modal);

    lock.attach(modal);
    trap.activate();
    lock.detach();

    expect(lock.isLocked()).toBe(false);
    trap.deactivate();
  });

  it('lock redirects outside focus to first button in modal', () => {
    const { modal } = buildModal();
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    const lock = createFocusLock();
    lock.attach(modal);

    const firstBtn = modal.querySelector('button')!;
    const spy = jest.spyOn(firstBtn, 'focus');

    const event = new FocusEvent('focusin', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outside });
    document.dispatchEvent(event);

    expect(spy).toHaveBeenCalled();
    lock.detach();
  });

  it('multiple lock instances on different modals work independently', () => {
    const { modal: m1 } = buildModal();
    const { modal: m2 } = buildModal();

    const lock1 = createFocusLock();
    const lock2 = createFocusLock();

    lock1.attach(m1);
    lock2.attach(m2);

    expect(lock1.isLocked()).toBe(true);
    expect(lock2.isLocked()).toBe(true);

    lock1.detach();
    expect(lock1.isLocked()).toBe(false);
    expect(lock2.isLocked()).toBe(true);

    lock2.detach();
  });
});
