/**
 * Integration test: focusCapture + focusTrap working together to ensure
 * focus cannot escape the active modal even via pointer-driven focusout.
 */
import { createFocusCapture } from './focusCapture';
import { createFocusTrap } from './focusTrap';

function buildModal(): {
  modal: HTMLElement;
  btn1: HTMLButtonElement;
  btn2: HTMLButtonElement;
  outside: HTMLButtonElement;
} {
  const modal = document.createElement('div');
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('role', 'dialog');

  const btn1 = document.createElement('button');
  btn1.textContent = 'OK';
  const btn2 = document.createElement('button');
  btn2.textContent = 'Cancel';
  modal.appendChild(btn1);
  modal.appendChild(btn2);

  const outside = document.createElement('button');
  outside.textContent = 'Outside';

  document.body.appendChild(modal);
  document.body.appendChild(outside);
  return { modal, btn1, btn2, outside };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('focusCapture + focusTrap integration', () => {
  it('capture intercepts focusout escaping the trap container', () => {
    const { modal, btn1, outside } = buildModal();
    const onCapture = jest.fn();
    const capture = createFocusCapture({ onCapture });
    capture.attach(modal);

    const event = new FocusEvent('focusout', { bubbles: true, relatedTarget: outside });
    btn1.dispatchEvent(event);

    expect(onCapture).toHaveBeenCalledTimes(1);
  });

  it('capture does not interfere after release', () => {
    const { modal, btn1, outside } = buildModal();
    const onCapture = jest.fn();
    const capture = createFocusCapture({ onCapture });
    capture.attach(modal);
    capture.release();

    const event = new FocusEvent('focusout', { bubbles: true, relatedTarget: outside });
    btn1.dispatchEvent(event);

    expect(onCapture).not.toHaveBeenCalled();
  });

  it('focusTrap activates and capture guards simultaneously', () => {
    const { modal } = buildModal();
    const trap = createFocusTrap(modal);
    const capture = createFocusCapture();

    trap.activate();
    capture.attach(modal);

    expect(capture.isCapturing()).toBe(true);

    capture.release();
    trap.deactivate();

    expect(capture.isCapturing()).toBe(false);
  });
});
