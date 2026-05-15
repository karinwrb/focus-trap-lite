import { createFocusMementoStack } from './focusMementoStack';

function makeButton(label = 'btn'): HTMLButtonElement {
  const b = document.createElement('button');
  b.textContent = label;
  document.body.appendChild(b);
  return b;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusMementoStack', () => {
  it('starts with depth 0', () => {
    const stack = createFocusMementoStack();
    expect(stack.getDepth()).toBe(0);
  });

  it('push increments depth and captures active element', () => {
    const btn = makeButton('a');
    btn.focus();
    const stack = createFocusMementoStack();
    const m = stack.push();
    expect(stack.getDepth()).toBe(1);
    expect(m.element).toBe(btn);
  });

  it('pop decrements depth and restores focus', () => {
    const a = makeButton('a');
    const b = makeButton('b');
    a.focus();
    const stack = createFocusMementoStack();
    stack.push();
    b.focus();
    expect(document.activeElement).toBe(b);
    const ok = stack.pop();
    expect(ok).toBe(true);
    expect(document.activeElement).toBe(a);
    expect(stack.getDepth()).toBe(0);
  });

  it('pop returns false when stack is empty', () => {
    const stack = createFocusMementoStack();
    expect(stack.pop()).toBe(false);
  });

  it('peek returns top memento without modifying stack', () => {
    const btn = makeButton();
    btn.focus();
    const stack = createFocusMementoStack();
    expect(stack.peek()).toBeNull();
    stack.push();
    const top = stack.peek();
    expect(top).not.toBeNull();
    expect(top!.element).toBe(btn);
    expect(stack.getDepth()).toBe(1);
  });

  it('supports multiple levels of nesting', () => {
    const a = makeButton('a');
    const b = makeButton('b');
    const c = makeButton('c');
    const stack = createFocusMementoStack();

    a.focus();
    stack.push();
    b.focus();
    stack.push();
    c.focus();

    expect(stack.getDepth()).toBe(2);

    stack.pop();
    expect(document.activeElement).toBe(b);

    stack.pop();
    expect(document.activeElement).toBe(a);

    expect(stack.getDepth()).toBe(0);
  });

  it('clear resets depth to 0', () => {
    const btn = makeButton();
    btn.focus();
    const stack = createFocusMementoStack();
    stack.push();
    stack.push();
    stack.clear();
    expect(stack.getDepth()).toBe(0);
    expect(stack.peek()).toBeNull();
  });

  it('pop does not restore focus when captured element has been removed from DOM', () => {
    const a = makeButton('a');
    a.focus();
    const stack = createFocusMementoStack();
    stack.push();
    // Remove the originally focused element from the DOM
    a.remove();
    const ok = stack.pop();
    expect(ok).toBe(true);
    // Focus should not land on the detached element
    expect(document.activeElement).not.toBe(a);
    expect(stack.getDepth()).toBe(0);
  });
});
