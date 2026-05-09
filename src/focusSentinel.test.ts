import { createFocusSentinel, FocusSentinel } from './focusSentinel';

function createContainer(): HTMLElement {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
}

function createButton(container: HTMLElement, label = 'btn'): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.textContent = label;
  container.appendChild(btn);
  return btn;
}

function fireFocusOut(target: HTMLElement, relatedTarget: Element | null): void {
  const event = new FocusEvent('focusout', {
    bubbles: true,
    relatedTarget,
  });
  target.dispatchEvent(event);
}

describe('createFocusSentinel', () => {
  let container: HTMLElement;
  let onEscape: jest.Mock;
  let sentinel: FocusSentinel;

  beforeEach(() => {
    container = createContainer();
    onEscape = jest.fn();
    sentinel = createFocusSentinel(onEscape);
  });

  afterEach(() => {
    sentinel.detach();
    document.body.removeChild(container);
  });

  it('is inactive before attach', () => {
    expect(sentinel.isActive()).toBe(false);
  });

  it('becomes active after attach', () => {
    sentinel.attach(container);
    expect(sentinel.isActive()).toBe(true);
  });

  it('becomes inactive after detach', () => {
    sentinel.attach(container);
    sentinel.detach();
    expect(sentinel.isActive()).toBe(false);
  });

  it('calls onEscape when focus moves outside the container', () => {
    const btn = createButton(container);
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    sentinel.attach(container);
    fireFocusOut(btn, outside);

    expect(onEscape).toHaveBeenCalledWith(outside);
    document.body.removeChild(outside);
  });

  it('does not call onEscape when focus stays inside the container', () => {
    const btn1 = createButton(container, 'a');
    const btn2 = createButton(container, 'b');

    sentinel.attach(container);
    fireFocusOut(btn1, btn2);

    expect(onEscape).not.toHaveBeenCalled();
  });

  it('calls onEscape with null when focus leaves the document', () => {
    const btn = createButton(container);

    sentinel.attach(container);
    fireFocusOut(btn, null);

    expect(onEscape).toHaveBeenCalledWith(null);
  });

  it('does not fire after detach', () => {
    const btn = createButton(container);
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    sentinel.attach(container);
    sentinel.detach();
    fireFocusOut(btn, outside);

    expect(onEscape).not.toHaveBeenCalled();
    document.body.removeChild(outside);
  });

  it('re-attaches cleanly when called twice', () => {
    const container2 = createContainer();
    const btn = createButton(container2);
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    sentinel.attach(container);
    sentinel.attach(container2);

    fireFocusOut(btn, outside);
    expect(onEscape).toHaveBeenCalledTimes(1);

    document.body.removeChild(outside);
    document.body.removeChild(container2);
  });
});
