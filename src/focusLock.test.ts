import { createFocusLock } from './focusLock';

function createContainer(): HTMLElement {
  const div = document.createElement('div');
  div.setAttribute('tabindex', '-1');

  const btn1 = document.createElement('button');
  btn1.textContent = 'First';

  const btn2 = document.createElement('button');
  btn2.textContent = 'Second';

  div.appendChild(btn1);
  div.appendChild(btn2);
  document.body.appendChild(div);
  return div;
}

function dispatchFocusIn(target: HTMLElement): void {
  const event = new FocusEvent('focusin', { bubbles: true, target });
  Object.defineProperty(event, 'target', { value: target });
  document.dispatchEvent(event);
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusLock', () => {
  it('starts unlocked', () => {
    const lock = createFocusLock();
    expect(lock.isLocked()).toBe(false);
  });

  it('becomes locked after attach', () => {
    const lock = createFocusLock();
    const container = createContainer();
    lock.attach(container);
    expect(lock.isLocked()).toBe(true);
    lock.detach();
  });

  it('becomes unlocked after detach', () => {
    const lock = createFocusLock();
    const container = createContainer();
    lock.attach(container);
    lock.detach();
    expect(lock.isLocked()).toBe(false);
  });

  it('redirects focus to first focusable when outside element focused', () => {
    const lock = createFocusLock();
    const container = createContainer();
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    lock.attach(container);

    const focusSpy = jest.spyOn(container.querySelector('button')!, 'focus');
    dispatchFocusIn(outside);

    expect(focusSpy).toHaveBeenCalled();
    lock.detach();
  });

  it('does not redirect focus when target is inside container', () => {
    const lock = createFocusLock();
    const container = createContainer();
    const inner = container.querySelector('button')!;

    lock.attach(container);

    const focusSpy = jest.spyOn(inner, 'focus');
    dispatchFocusIn(inner);

    expect(focusSpy).not.toHaveBeenCalled();
    lock.detach();
  });

  it('does not redirect focus when detached', () => {
    const lock = createFocusLock();
    const container = createContainer();
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    lock.attach(container);
    lock.detach();

    const focusSpy = jest.spyOn(container.querySelector('button')!, 'focus');
    dispatchFocusIn(outside);

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('re-attaches cleanly when called twice', () => {
    const lock = createFocusLock();
    const c1 = createContainer();
    const c2 = createContainer();

    lock.attach(c1);
    lock.attach(c2);

    expect(lock.isLocked()).toBe(true);
    lock.detach();
  });
});
