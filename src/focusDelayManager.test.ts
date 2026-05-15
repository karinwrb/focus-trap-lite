import { createFocusDelayManager } from './focusDelayManager';

describe('createFocusDelayManager', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('schedules a callback after the given delay', () => {
    const mgr = createFocusDelayManager();
    const cb = jest.fn();
    mgr.schedule('a', cb, 100);
    expect(cb).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('reports isScheduled correctly', () => {
    const mgr = createFocusDelayManager();
    mgr.schedule('a', jest.fn(), 200);
    expect(mgr.isScheduled('a')).toBe(true);
    expect(mgr.isScheduled('b')).toBe(false);
    jest.advanceTimersByTime(200);
    expect(mgr.isScheduled('a')).toBe(false);
  });

  it('cancels a scheduled callback', () => {
    const mgr = createFocusDelayManager();
    const cb = jest.fn();
    mgr.schedule('a', cb, 100);
    mgr.cancel('a');
    jest.advanceTimersByTime(200);
    expect(cb).not.toHaveBeenCalled();
    expect(mgr.isScheduled('a')).toBe(false);
  });

  it('re-schedules when same id is used again', () => {
    const mgr = createFocusDelayManager();
    const cb1 = jest.fn();
    const cb2 = jest.fn();
    mgr.schedule('a', cb1, 100);
    mgr.schedule('a', cb2, 100);
    jest.advanceTimersByTime(100);
    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).toHaveBeenCalledTimes(1);
  });

  it('cancelAll stops all pending callbacks', () => {
    const mgr = createFocusDelayManager();
    const cb1 = jest.fn();
    const cb2 = jest.fn();
    mgr.schedule('a', cb1, 50);
    mgr.schedule('b', cb2, 50);
    mgr.cancelAll();
    jest.advanceTimersByTime(100);
    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).not.toHaveBeenCalled();
    expect(mgr.getPendingIds()).toHaveLength(0);
  });

  it('flush executes callback immediately', () => {
    const mgr = createFocusDelayManager();
    const cb = jest.fn();
    mgr.schedule('a', cb, 500);
    mgr.flush('a');
    expect(cb).toHaveBeenCalledTimes(1);
    expect(mgr.isScheduled('a')).toBe(false);
    jest.advanceTimersByTime(500);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('flushAll executes all pending callbacks immediately', () => {
    const mgr = createFocusDelayManager();
    const cb1 = jest.fn();
    const cb2 = jest.fn();
    mgr.schedule('a', cb1, 300);
    mgr.schedule('b', cb2, 300);
    mgr.flushAll();
    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledTimes(1);
    expect(mgr.getPendingIds()).toHaveLength(0);
  });

  it('getPendingIds returns all scheduled ids', () => {
    const mgr = createFocusDelayManager();
    mgr.schedule('x', jest.fn(), 100);
    mgr.schedule('y', jest.fn(), 100);
    expect(mgr.getPendingIds().sort()).toEqual(['x', 'y']);
  });

  it('destroy clears all pending timers', () => {
    const mgr = createFocusDelayManager();
    const cb = jest.fn();
    mgr.schedule('a', cb, 100);
    mgr.destroy();
    jest.advanceTimersByTime(200);
    expect(cb).not.toHaveBeenCalled();
  });
});
