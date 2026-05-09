/**
 * Integration test: focusSentinel + focusTrap working together.
 * Verifies that escaping focus via mouse click outside is caught and
 * redirected back into the trap container.
 */
import { createFocusSentinel } from './focusSentinel';
import { createFocusTrap } from './focusTrap';

function buildModal(): {
  modal: HTMLElement;
  buttons: HTMLButtonElement[];
  teardown: () => void;
} {
  const modal = document.createElement('div');
  modal.setAttribute('role', 'dialog');

  const buttons = ['First', 'Second', 'Close'].map((label) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    modal.appendChild(btn);
    return btn;
  });

  document.body.appendChild(modal);

  return {
    modal,
    buttons,
    teardown: () => document.body.removeChild(modal),
  };
}

describe('focusSentinel + focusTrap integration', () => {
  it('redirects escaped focus back to first focusable element in trap', () => {
    const { modal, buttons, teardown } = buildModal();
    const trap = createFocusTrap(modal);
    trap.activate();

    let redirectTarget: Element | null = null;

    const sentinel = createFocusSentinel((escaped) => {
      // Simulate redirect: focus first button when focus escapes
      redirectTarget = escaped;
      buttons[0].focus();
    });

    sentinel.attach(modal);

    // Simulate focus escaping to an element outside the modal
    const outsideBtn = document.createElement('button');
    document.body.appendChild(outsideBtn);

    const focusOutEvent = new FocusEvent('focusout', {
      bubbles: true,
      relatedTarget: outsideBtn,
    });
    buttons[2].dispatchEvent(focusOutEvent);

    expect(redirectTarget).toBe(outsideBtn);
    expect(document.activeElement).toBe(buttons[0]);

    sentinel.detach();
    trap.deactivate();
    document.body.removeChild(outsideBtn);
    teardown();
  });

  it('sentinel is inactive after trap deactivation cleanup', () => {
    const { modal, teardown } = buildModal();
    const trap = createFocusTrap(modal);
    trap.activate();

    const sentinel = createFocusSentinel(jest.fn());
    sentinel.attach(modal);

    trap.deactivate();
    sentinel.detach();

    expect(sentinel.isActive()).toBe(false);
    teardown();
  });
});
