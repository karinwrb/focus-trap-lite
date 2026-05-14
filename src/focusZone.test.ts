import { createFocusZone } from './focusZone';

function createContainer(...tags: string[]): HTMLElement {
  const container = document.createElement('div');
  tags.forEach((tag) => {
    const el = document.createElement(tag);
    el.setAttribute('tabindex', '0');
    container.appendChild(el);
  });
  document.body.appendChild(container);
  return container;
}

function fireArrow(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusZone', () => {
  it('moves focus forward with ArrowDown', () => {
    const container = createContainer('button', 'button', 'button');
    const zone = createFocusZone(container);
    zone.attach();
    const buttons = container.querySelectorAll<HTMLElement>('button');
    buttons[0].focus();
    fireArrow(buttons[0], 'ArrowDown');
    expect(document.activeElement).toBe(buttons[1]);
    zone.detach();
  });

  it('moves focus backward with ArrowUp', () => {
    const container = createContainer('button', 'button', 'button');
    const zone = createFocusZone(container);
    zone.attach();
    const buttons = container.querySelectorAll<HTMLElement>('button');
    buttons[1].focus();
    fireArrow(buttons[1], 'ArrowUp');
    expect(document.activeElement).toBe(buttons[0]);
    zone.detach();
  });

  it('wraps around at the end when wrap=true', () => {
    const container = createContainer('button', 'button');
    const zone = createFocusZone(container, { wrap: true });
    zone.attach();
    const buttons = container.querySelectorAll<HTMLElement>('button');
    buttons[1].focus();
    fireArrow(buttons[1], 'ArrowDown');
    expect(document.activeElement).toBe(buttons[0]);
    zone.detach();
  });

  it('does not wrap when wrap=false', () => {
    const container = createContainer('button', 'button');
    const zone = createFocusZone(container, { wrap: false });
    zone.attach();
    const buttons = container.querySelectorAll<HTMLElement>('button');
    buttons[1].focus();
    fireArrow(buttons[1], 'ArrowDown');
    expect(document.activeElement).toBe(buttons[1]);
    zone.detach();
  });

  it('calls onEscape when Escape is pressed', () => {
    const container = createContainer('button');
    const onEscape = jest.fn();
    const zone = createFocusZone(container, { onEscape });
    zone.attach();
    const btn = container.querySelector<HTMLElement>('button')!;
    btn.focus();
    fireArrow(btn, 'Escape');
    expect(onEscape).toHaveBeenCalledTimes(1);
    zone.detach();
  });

  it('respects horizontal direction', () => {
    const container = createContainer('button', 'button');
    const zone = createFocusZone(container, { direction: 'horizontal' });
    zone.attach();
    const buttons = container.querySelectorAll<HTMLElement>('button');
    buttons[0].focus();
    fireArrow(buttons[0], 'ArrowRight');
    expect(document.activeElement).toBe(buttons[1]);
    zone.detach();
  });

  it('attach/detach toggles isAttached', () => {
    const container = createContainer('button');
    const zone = createFocusZone(container);
    expect(zone.isAttached()).toBe(false);
    zone.attach();
    expect(zone.isAttached()).toBe(true);
    zone.detach();
    expect(zone.isAttached()).toBe(false);
  });
});
