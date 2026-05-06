/**
 * Integration tests verifying that focus guards and the focus observer
 * work correctly together within a focus trap scenario.
 */

import { attachFocusGuards, detachFocusGuards, isFocusGuard } from './focusGuard';
import { createFocusObserver } from './focusObserver';

function buildModal() {
  const overlay = document.createElement('div');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  const heading = document.createElement('h2');
  heading.textContent = 'Modal Title';

  const confirmBtn = document.createElement('button');
  confirmBtn.id = 'confirm';
  confirmBtn.textContent = 'Confirm';

  const cancelBtn = document.createElement('button');
  cancelBtn.id = 'cancel';
  cancelBtn.textContent = 'Cancel';

  overlay.appendChild(heading);
  overlay.appendChild(confirmBtn);
  overlay.appendChild(cancelBtn);
  document.body.appendChild(overlay);

  const triggerBtn = document.createElement('button');
  triggerBtn.id = 'trigger';
  document.body.appendChild(triggerBtn);

  return { overlay, confirmBtn, cancelBtn, triggerBtn };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Focus guard + observer integration', () => {
  it('guards are present after attach and absent after detach', () => {
    const { overlay } = buildModal();
    attachFocusGuards(overlay);

    expect(isFocusGuard(overlay.firstElementChild)).toBe(true);
    expect(isFocusGuard(overlay.lastElementChild)).toBe(true);

    detachFocusGuards(overlay);

    expect(isFocusGuard(overlay.firstElementChild)).toBe(false);
    expect(isFocusGuard(overlay.lastElementChild)).toBe(false);
  });

  it('observer detects escape to trigger button outside the modal', () => {
    const { overlay, triggerBtn } = buildModal();
    attachFocusGuards(overlay);

    const escapes: Element[] = [];
    const observer = createFocusObserver({
      container: overlay,
      onFocusEscape: (el) => escapes.push(el),
    });

    observer.start();

    const event = new FocusEvent('focusin', { bubbles: true });
    Object.defineProperty(event, 'target', { value: triggerBtn });
    document.dispatchEvent(event);

    expect(escapes).toHaveLength(1);
    expect(escapes[0]).toBe(triggerBtn);

    observer.stop();
    detachFocusGuards(overlay);
  });

  it('observer does not flag guard elements as escapes', () => {
    const { overlay } = buildModal();
    const { before } = attachFocusGuards(overlay);

    const onFocusEscape = jest.fn();
    const observer = createFocusObserver({ container: overlay, onFocusEscape });
    observer.start();

    const event = new FocusEvent('focusin', { bubbles: true });
    Object.defineProperty(event, 'target', { value: before });
    document.dispatchEvent(event);

    expect(onFocusEscape).not.toHaveBeenCalled();

    observer.stop();
    detachFocusGuards(overlay);
  });
});
