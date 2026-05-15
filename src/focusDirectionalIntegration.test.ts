/**
 * Integration test: FocusDirectional inside a modal-like container,
 * verifying grid layout and interaction with focus trap.
 */
import { createFocusDirectional } from './focusDirectional';
import { createFocusTrap } from './focusTrap';

function buildModal(): { modal: HTMLElement; buttons: HTMLButtonElement[] } {
  const modal = document.createElement('div');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  const buttons: HTMLButtonElement[] = [];
  for (let i = 0; i < 6; i++) {
    const btn = document.createElement('button');
    btn.textContent = `Item ${i + 1}`;
    modal.appendChild(btn);
    buttons.push(btn);
  }
  document.body.appendChild(modal);
  return { modal, buttons };
}

function fireArrow(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FocusDirectional integration', () => {
  it('navigates a 3-column grid with ArrowRight and ArrowDown', () => {
    const { modal, buttons } = buildModal();
    const dir = createFocusDirectional({ layout: 'grid', columns: 3, wrap: false });
    dir.attach(modal);

    buttons[0].focus();
    fireArrow(modal, 'ArrowRight');
    expect(document.activeElement).toBe(buttons[1]);

    fireArrow(modal, 'ArrowDown');
    expect(document.activeElement).toBe(buttons[4]);

    dir.detach();
  });

  it('does not move focus beyond bounds without wrap in grid', () => {
    const { modal, buttons } = buildModal();
    const dir = createFocusDirectional({ layout: 'grid', columns: 3, wrap: false });
    dir.attach(modal);

    buttons[5].focus();
    fireArrow(modal, 'ArrowRight');
    expect(document.activeElement).toBe(buttons[5]);

    fireArrow(modal, 'ArrowDown');
    expect(document.activeElement).toBe(buttons[5]);

    dir.detach();
  });

  it('works alongside a focus trap without interfering', () => {
    const { modal, buttons } = buildModal();
    const dir = createFocusDirectional({ layout: 'vertical', wrap: true });
    dir.attach(modal);
    const trap = createFocusTrap(modal);
    trap.activate();

    buttons[0].focus();
    fireArrow(modal, 'ArrowDown');
    expect(document.activeElement).toBe(buttons[1]);

    trap.deactivate();
    dir.detach();
  });

  it('switching layout mid-use works correctly', () => {
    const { modal, buttons } = buildModal();
    const dir = createFocusDirectional({ layout: 'horizontal', wrap: false });
    dir.attach(modal);

    buttons[0].focus();
    fireArrow(modal, 'ArrowRight');
    expect(document.activeElement).toBe(buttons[1]);

    dir.setLayout('vertical');
    fireArrow(modal, 'ArrowDown');
    expect(document.activeElement).toBe(buttons[2]);

    dir.detach();
  });
});
