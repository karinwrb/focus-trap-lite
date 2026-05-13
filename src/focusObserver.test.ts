import { createFocusObserver } from './focusObserver';

function createSetup() {
  const container = document.createElement('div');
  const btn1 = document.createElement('button');
  btn1.id = 'btn-inside-1';
  const btn2 = document.createElement('button');
  btn2.id = 'btn-inside-2';
  container.appendChild(btn1);
  container.appendChild(btn2);
  document.body.appendChild(container);

  const outside = document.createElement('button');
  outside.id = 'btn-outside';
  document.body.appendChild(outside);

  return { container, btn1, btn2, outside };
}

function dispatchFocusIn(target: Element) {
  const event = new FocusEvent('focusin', { bubbles: true });
  Object.defineProperty(event, 'target', { value: target });
  document.dispatchEvent(event);
}

afterEach(() => {
  document.body.innerHTML = '';
  jest.restoreAllMocks();
});

describe('createFocusObserver', () => {
  it('calls onFocusEscape when focus moves outside the container', () => {
    const { container, outside } = createSetup();
    const onFocusEscape = jest.fn();
    const observer = createFocusObserver({ container, onFocusEscape });

    observer.start();
    dispatchFocusIn(outside);

    expect(onFocusEscape).toHaveBeenCalledWith(outside);
    observer.stop();
  });

  it('does not call onFocusEscape when focus stays inside the container', () => {
    const { container, btn1 } = createSetup();
    const onFocusEscape = jest.fn();
    const observer = createFocusObserver({ container, onFocusEscape });

    observer.start();
    dispatchFocusIn(btn1);

    expect(onFocusEscape).not.toHaveBeenCalled();
    observer.stop();
  });

  it('does not fire after stop() is called', () => {
    const { container, outside } = createSetup();
    const onFocusEscape = jest.fn();
    const observer = createFocusObserver({ container, onFocusEscape });

    observer.start();
    observer.stop();
    dispatchFocusIn(outside);

    expect(onFocusEscape).not.toHaveBeenCalled();
  });

  it('calling start() twice does not double-register the listener', () => {
    const { container, outside } = createSetup();
    const onFocusEscape = jest.fn();
    const observer = createFocusObserver({ container, onFocusEscape });

    observer.start();
    observer.start();
    dispatchFocusIn(outside);

    expect(onFocusEscape).toHaveBeenCalledTimes(1);
    observer.stop();
  });
});
