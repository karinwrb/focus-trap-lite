import { createFocusEventBus, FocusEvent, FocusEventType } from './focusEventBus';

describe('focusEventBus', () => {
  it('calls listener when event is emitted', () => {
    const bus = createFocusEventBus();
    const fn = jest.fn();
    bus.on('trap:activate', fn);
    bus.emit({ type: 'trap:activate' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({ type: 'trap:activate' });
  });

  it('does not call listener for different event type', () => {
    const bus = createFocusEventBus();
    const fn = jest.fn();
    bus.on('trap:activate', fn);
    bus.emit({ type: 'trap:deactivate' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('returns unsubscribe function from on()', () => {
    const bus = createFocusEventBus();
    const fn = jest.fn();
    const unsub = bus.on('focus:captured', fn);
    unsub();
    bus.emit({ type: 'focus:captured' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('off() removes a specific listener', () => {
    const bus = createFocusEventBus();
    const fn = jest.fn();
    bus.on('scope:enter', fn);
    bus.off('scope:enter', fn);
    bus.emit({ type: 'scope:enter' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('supports multiple listeners for the same event', () => {
    const bus = createFocusEventBus();
    const a = jest.fn();
    const b = jest.fn();
    bus.on('scope:leave', a);
    bus.on('scope:leave', b);
    bus.emit({ type: 'scope:leave' });
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('passes event data to listener', () => {
    const bus = createFocusEventBus();
    const fn = jest.fn();
    const el = document.createElement('button');
    bus.on('focus:released', fn);
    bus.emit({ type: 'focus:released', target: el, data: { reason: 'escape' } });
    expect(fn).toHaveBeenCalledWith({ type: 'focus:released', target: el, data: { reason: 'escape' } });
  });

  it('clear(type) removes listeners for that type only', () => {
    const bus = createFocusEventBus();
    const a = jest.fn();
    const b = jest.fn();
    bus.on('trap:activate', a);
    bus.on('trap:deactivate', b);
    bus.clear('trap:activate');
    bus.emit({ type: 'trap:activate' });
    bus.emit({ type: 'trap:deactivate' });
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('clear() with no argument removes all listeners', () => {
    const bus = createFocusEventBus();
    const fn = jest.fn();
    bus.on('trap:activate', fn);
    bus.on('scope:enter', fn);
    bus.clear();
    bus.emit({ type: 'trap:activate' });
    bus.emit({ type: 'scope:enter' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('listenerCount returns correct count', () => {
    const bus = createFocusEventBus();
    expect(bus.listenerCount('trap:activate')).toBe(0);
    const unsub = bus.on('trap:activate', jest.fn());
    bus.on('trap:activate', jest.fn());
    expect(bus.listenerCount('trap:activate')).toBe(2);
    unsub();
    expect(bus.listenerCount('trap:activate')).toBe(1);
  });
});
