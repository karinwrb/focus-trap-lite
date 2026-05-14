/**
 * Integration test: focusVisible + focusTrap work together so that
 * keyboard navigation inside a modal is correctly detected as keyboard mode.
 */
import { createFocusVisible } from './focusVisible';
import { createFocusTrap } from './focusTrap';

function buildModal(): {
  modal: HTMLDivElement;
  btn1: HTMLButtonElement;
  btn2: HTMLButtonElement;
  trigger: HTMLButtonElement;
} {
  const trigger = document.createElement('button');
  trigger.textContent = 'Open';
  document.body.appendChild(trigger);

  const modal = document.createElement('div');
  modal.setAttribute('role', 'dialog');

  const btn1 = document.createElement('button');
  btn1.textContent = 'First';
  const btn2 = document.createElement('button');
  btn2.textContent = 'Second';

  modal.appendChild(btn1);
  modal.appendChild(btn2);
  document.body.appendChild(modal);

  return { modal, btn1, btn2, trigger };
}

describe('focusVisible + focusTrap integration', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('detects keyboard mode when Tab is pressed inside a trapped modal', () => {
    const { modal, btn1, trigger } = buildModal();
    const fv = createFocusVisible();
    fv.attach(modal);

    const trap = createFocusTrap(modal);
    trap.activate();
    btn1.focus();

    modal.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(fv.isKeyboardMode()).toBe(true);

    trap.deactivate();
    fv.detach(modal);
    trigger.focus();
  });

  it('resets to pointer mode when user clicks inside trapped modal', () => {
    const { modal, btn1, trigger } = buildModal();
    const fv = createFocusVisible();
    fv.attach(modal);

    const trap = createFocusTrap(modal);
    trap.activate();
    btn1.focus();

    modal.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(fv.isKeyboardMode()).toBe(true);

    modal.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(fv.isKeyboardMode()).toBe(false);

    trap.deactivate();
    fv.detach(modal);
    trigger.focus();
  });

  it('is independent per-modal when using separate instances', () => {
    const m1 = document.createElement('div');
    const m2 = document.createElement('div');
    document.body.appendChild(m1);
    document.body.appendChild(m2);

    const fv1 = createFocusVisible();
    const fv2 = createFocusVisible();
    fv1.attach(m1);
    fv2.attach(m2);

    m1.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(fv1.isKeyboardMode()).toBe(true);
    expect(fv2.isKeyboardMode()).toBe(false);

    fv1.destroy();
    fv2.destroy();
  });
});
