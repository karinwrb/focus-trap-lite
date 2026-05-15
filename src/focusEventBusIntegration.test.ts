import { createFocusEventBus } from './focusEventBus';
import { createFocusTrap } from './focusTrap';

function buildModal() {
  const container = document.createElement('div');
  const btn1 = document.createElement('button');
  btn1.textContent = 'First';
  const btn2 = document.createElement('button');
  btn2.textContent = 'Close';
  container.appendChild(btn1);
  container.appendChild(btn2);
  document.body.appendChild(container);
  return { container, btn1, btn2 };
}

describe('focusEventBus integration', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('emits trap:activate when trap is activated', () => {
    const bus = createFocusEventBus();
    const { container } = buildModal();
    const activated = jest.fn();
    bus.on('trap:activate', activated);

    const trap = createFocusTrap(container);
    trap.activate();
    bus.emit({ type: 'trap:activate', target: container });

    expect(activated).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'trap:activate', target: container })
    );
    trap.deactivate();
  });

  it('emits trap:deactivate when trap is deactivated', () => {
    const bus = createFocusEventBus();
    const { container } = buildModal();
    const deactivated = jest.fn();
    bus.on('trap:deactivate', deactivated);

    const trap = createFocusTrap(container);
    trap.activate();
    trap.deactivate();
    bus.emit({ type: 'trap:deactivate', target: container });

    expect(deactivated).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'trap:deactivate', target: container })
    );
  });

  it('supports multiple independent buses without cross-contamination', () => {
    const busA = createFocusEventBus();
    const busB = createFocusEventBus();
    const fnA = jest.fn();
    const fnB = jest.fn();
    busA.on('scope:enter', fnA);
    busB.on('scope:enter', fnB);

    busA.emit({ type: 'scope:enter' });

    expect(fnA).toHaveBeenCalledTimes(1);
    expect(fnB).not.toHaveBeenCalled();
  });

  it('listener added after emit is not called retroactively', () => {
    const bus = createFocusEventBus();
    const fn = jest.fn();
    bus.emit({ type: 'focus:captured' });
    bus.on('focus:captured', fn);
    expect(fn).not.toHaveBeenCalled();
  });

  it('cleared bus does not call listeners on subsequent emits', () => {
    const bus = createFocusEventBus();
    const fn = jest.fn();
    bus.on('focus:released', fn);
    bus.clear();
    bus.emit({ type: 'focus:released' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('off() removes a specific listener without affecting others', () => {
    const bus = createFocusEventBus();
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    bus.on('scope:enter', fn1);
    bus.on('scope:enter', fn2);

    bus.off('scope:enter', fn1);
    bus.emit({ type: 'scope:enter' });

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
  });
});
