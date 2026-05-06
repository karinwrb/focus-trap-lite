import { createFocusTrap } from './focusTrap';

function createContainer(html: string): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = html;
  document.body.appendChild(div);
  return div;
}

function dispatchTab(shiftKey = false): void {
  document.activeElement?.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true })
  );
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusTrap', () => {
  it('focuses the first focusable element on activate', () => {
    const container = createContainer(
      '<button id="btn1">One</button><button id="btn2">Two</button>'
    );
    const trap = createFocusTrap(container);
    trap.activate();
    expect(document.activeElement?.id).toBe('btn1');
    trap.deactivate();
  });

  it('restores focus to previously focused element on deactivate', () => {
    const outside = document.createElement('button');
    outside.id = 'outside';
    document.body.appendChild(outside);
    outside.focus();

    const container = createContainer('<button id="inner">Inner</button>');
    const trap = createFocusTrap(container);
    trap.activate();
    expect(document.activeElement?.id).toBe('inner');
    trap.deactivate();
    expect(document.activeElement?.id).toBe('outside');
  });

  it('calls onEscape when Escape key is pressed', () => {
    const container = createContainer('<button>Close</button>');
    const onEscape = jest.fn();
    const trap = createFocusTrap(container, { onEscape });
    trap.activate();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(onEscape).toHaveBeenCalledTimes(1);
    trap.deactivate();
  });

  it('uses initialFocus option when provided', () => {
    const container = createContainer(
      '<button id="first">First</button><button id="second">Second</button>'
    );
    const secondBtn = container.querySelector<HTMLElement>('#second')!;
    const trap = createFocusTrap(container, { initialFocus: secondBtn });
    trap.activate();
    expect(document.activeElement?.id).toBe('second');
    trap.deactivate();
  });
});
