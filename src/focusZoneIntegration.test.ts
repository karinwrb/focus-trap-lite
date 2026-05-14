/**
 * Integration test: FocusZone inside a modal-like structure,
 * combined with FocusZoneManager lifecycle.
 */

import { createFocusZone } from './focusZone';
import { createFocusZoneManager } from './focusZoneManager';

function buildModal(): { modal: HTMLElement; buttons: HTMLElement[] } {
  const modal = document.createElement('div');
  modal.setAttribute('role', 'dialog');
  const labels = ['Cancel', 'Confirm', 'Help'];
  const buttons: HTMLElement[] = labels.map((label) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.setAttribute('tabindex', '0');
    modal.appendChild(btn);
    return btn;
  });
  document.body.appendChild(modal);
  return { modal, buttons };
}

function fire(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FocusZone integration', () => {
  it('navigates through modal buttons with arrow keys', () => {
    const { modal, buttons } = buildModal();
    const zone = createFocusZone(modal, { direction: 'vertical', wrap: true });
    zone.attach();

    buttons[0].focus();
    fire(buttons[0], 'ArrowDown');
    expect(document.activeElement).toBe(buttons[1]);

    fire(buttons[1], 'ArrowDown');
    expect(document.activeElement).toBe(buttons[2]);

    fire(buttons[2], 'ArrowDown');
    expect(document.activeElement).toBe(buttons[0]);

    zone.detach();
  });

  it('escape callback is invoked to close modal', () => {
    const { modal, buttons } = buildModal();
    const onEscape = jest.fn();
    const zone = createFocusZone(modal, { onEscape });
    zone.attach();

    buttons[0].focus();
    fire(buttons[0], 'Escape');
    expect(onEscape).toHaveBeenCalledTimes(1);
    zone.detach();
  });

  it('manager can activate/deactivate modal zone lifecycle', () => {
    const { modal, buttons } = buildModal();
    const manager = createFocusZoneManager();
    manager.register('dialog', modal, { direction: 'vertical', wrap: false });
    manager.activateAll();

    buttons[2].focus();
    fire(buttons[2], 'ArrowDown');
    expect(document.activeElement).toBe(buttons[2]);

    manager.deactivateAll();
    buttons[0].focus();
    fire(buttons[0], 'ArrowDown');
    expect(document.activeElement).toBe(buttons[0]);
  });
});
