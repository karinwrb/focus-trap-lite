import { createFocusCapture } from './focusCapture';

function createContainer(): { container: HTMLElement; btn1: HTMLButtonElement; btn2: HTMLButtonElement } {
  const container = document.createElement('div');
  container.setAttribute('tabindex', '-1');
  const btn1 = document.createElement('button');
  btn1.textContent = 'First';
  const btn2 = document.createElement('button');
  btn2.textContent = 'Second';
  container.appendChild(btn1);
  container.appendChild(btn2);
  document.body.appendChild(container);
  return { container, btn1, btn2 };
}

function fireFocusOut(target: HTMLElement, relatedTarget: HTMLElement | null = null): void {
  const event = new FocusEvent('focusout', { bubbles: true, relatedTarget });
  target.dispatchEvent(event);
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusCapture', () => {
  it('starts as not capturing', () => {
    const capture = createFocusCapture();
    expect(capture.isCapturing()).toBe(false);
  });

  it('reports capturing after attach', () => {
    const { container } = createContainer();
    const capture = createFocusCapture();
    capture.attach(container);
    expect(capture.isCapturing()).toBe(true);
  });

  it('stops capturing after detach', () => {
    const { container } = createContainer();
    const capture = createFocusCapture();
    capture.attach(container);
    capture.detach();
    expect(capture.isCapturing()).toBe(false);
  });

  it('calls onCapture when focus escapes', () => {
    const { container, btn1 } = createContainer();
    const onCapture = jest.fn();
    const capture = createFocusCapture({ onCapture });
    capture.attach(container);

    const outside = document.createElement('button');
    document.body.appendChild(outside);
    fireFocusOut(btn1, outside);

    expect(onCapture).toHaveBeenCalledTimes(1);
  });

  it('does not call onCapture when focus stays inside', () => {
    const { container, btn1, btn2 } = createContainer();
    const onCapture = jest.fn();
    const capture = createFocusCapture({ onCapture });
    capture.attach(container);

    fireFocusOut(btn1, btn2);
    expect(onCapture).not.toHaveBeenCalled();
  });

  it('calls onRelease and stops capturing on release()', () => {
    const { container } = createContainer();
    const onRelease = jest.fn();
    const capture = createFocusCapture({ onRelease });
    capture.attach(container);
    capture.release();

    expect(onRelease).toHaveBeenCalledTimes(1);
    expect(capture.isCapturing()).toBe(false);
  });

  it('re-attaches cleanly when attach is called twice', () => {
    const { container } = createContainer();
    const other = document.createElement('div');
    other.setAttribute('tabindex', '-1');
    document.body.appendChild(other);

    const capture = createFocusCapture();
    capture.attach(container);
    capture.attach(other);
    expect(capture.isCapturing()).toBe(true);
  });
});
