/**
 * Integration: focusDelayManager used to debounce focus restoration
 * when a modal closes during an animated transition.
 */
import { createFocusDelayManager } from './focusDelayManager';
import { createFocusRestorer } from './focusRestorer';

function buildModal() {
  const trigger = document.createElement('button');
  trigger.id = 'trigger';
  const modal = document.createElement('div');
  modal.setAttribute('role', 'dialog');
  const inner = document.createElement('button');
  inner.id = 'inner';
  modal.appendChild(inner);
  document.body.appendChild(trigger);
  document.body.appendChild(modal);
  return { trigger, modal, inner, cleanup: () => { trigger.remove(); modal.remove(); } };
}

describe('focusDelayManager + focusRestorer integration', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => { jest.useRealTimers(); document.body.innerHTML = ''; });

  it('restores focus after transition delay on modal close', () => {
    const { trigger, inner, cleanup } = buildModal();
    const restorer = createFocusRestorer();
    const delayMgr = createFocusDelayManager();

    trigger.focus();
    restorer.save();
    inner.focus();
    expect(document.activeElement).toBe(inner);

    // Simulate close with 200ms animation delay
    delayMgr.schedule('modal-restore', () => restorer.restore(), 200);
    expect(document.activeElement).toBe(inner);

    jest.advanceTimersByTime(200);
    expect(document.activeElement).toBe(trigger);

    cleanup();
  });

  it('cancels previous restore if modal reopens before delay fires', () => {
    const { trigger, inner, cleanup } = buildModal();
    const restorer = createFocusRestorer();
    const delayMgr = createFocusDelayManager();
    const restoreSpy = jest.fn();

    trigger.focus();
    restorer.save();
    inner.focus();

    delayMgr.schedule('modal-restore', restoreSpy, 200);
    // Modal reopens — cancel the pending restore
    delayMgr.cancel('modal-restore');

    jest.advanceTimersByTime(300);
    expect(restoreSpy).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(inner);

    cleanup();
  });

  it('flushes restore immediately when skipAnimation is requested', () => {
    const { trigger, inner, cleanup } = buildModal();
    const restorer = createFocusRestorer();
    const delayMgr = createFocusDelayManager();

    trigger.focus();
    restorer.save();
    inner.focus();

    delayMgr.schedule('modal-restore', () => restorer.restore(), 500);
    delayMgr.flush('modal-restore');

    expect(document.activeElement).toBe(trigger);
    expect(delayMgr.isScheduled('modal-restore')).toBe(false);

    cleanup();
  });
});
