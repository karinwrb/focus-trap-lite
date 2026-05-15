import { createFocusDirectional } from './focusDirectional';

function createContainer(): HTMLElement {
  const div = document.createElement('div');
  ['A', 'B', 'C'].forEach(label => {
    const btn = document.createElement('button');
    btn.textContent = label;
    div.appendChild(btn);
  });
  document.body.appendChild(div);
  return div;
}

function fireArrow(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusDirectional', () => {
  it('moves focus down with ArrowDown in vertical layout', () => {
    const container = createContainer();
    const dir = createFocusDirectional({ layout: 'vertical' });
    dir.attach(container);
    const buttons = container.querySelectorAll('button');
    buttons[0].focus();
    fireArrow(container, 'ArrowDown');
    expect(document.activeElement).toBe(buttons[1]);
    dir.detach();
  });

  it('moves focus up with ArrowUp in vertical layout', () => {
    const container = createContainer();
    const dir = createFocusDirectional({ layout: 'vertical' });
    dir.attach(container);
    const buttons = container.querySelectorAll('button');
    buttons[2].focus();
    fireArrow(container, 'ArrowUp');
    expect(document.activeElement).toBe(buttons[1]);
    dir.detach();
  });

  it('wraps around when wrap is true', () => {
    const container = createContainer();
    const dir = createFocusDirectional({ layout: 'vertical', wrap: true });
    dir.attach(container);
    const buttons = container.querySelectorAll('button');
    buttons[2].focus();
    fireArrow(container, 'ArrowDown');
    expect(document.activeElement).toBe(buttons[0]);
    dir.detach();
  });

  it('does not wrap when wrap is false', () => {
    const container = createContainer();
    const dir = createFocusDirectional({ layout: 'vertical', wrap: false });
    dir.attach(container);
    const buttons = container.querySelectorAll('button');
    buttons[2].focus();
    fireArrow(container, 'ArrowDown');
    expect(document.activeElement).toBe(buttons[2]);
    dir.detach();
  });

  it('moves horizontally in horizontal layout', () => {
    const container = createContainer();
    const dir = createFocusDirectional({ layout: 'horizontal' });
    dir.attach(container);
    const buttons = container.querySelectorAll('button');
    buttons[0].focus();
    fireArrow(container, 'ArrowRight');
    expect(document.activeElement).toBe(buttons[1]);
    dir.detach();
  });

  it('getLayout and setLayout work', () => {
    const dir = createFocusDirectional({ layout: 'vertical' });
    expect(dir.getLayout()).toBe('vertical');
    dir.setLayout('horizontal');
    expect(dir.getLayout()).toBe('horizontal');
  });

  it('detach removes listener', () => {
    const container = createContainer();
    const dir = createFocusDirectional({ layout: 'vertical' });
    dir.attach(container);
    const buttons = container.querySelectorAll('button');
    buttons[0].focus();
    dir.detach();
    fireArrow(container, 'ArrowDown');
    expect(document.activeElement).toBe(buttons[0]);
  });
});
