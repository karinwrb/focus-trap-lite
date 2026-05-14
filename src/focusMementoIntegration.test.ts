/**
 * Integration test: FocusMementoManager working alongside focusStack and focusRestorer
 * to correctly save/restore focus across nested modal-like scenarios.
 */
import { createFocusMementoManager } from './focusMemento';
import { createFocusRestorer } from './focusRestorer';
import { pushTrap, removeTrap, getActiveTrap } from './focusStack';

function buildModal(id: string): { container: HTMLDivElement; trigger: HTMLButtonElement; inner: HTMLButtonElement } {
  const trigger = document.createElement('button');
  trigger.id = `trigger-${id}`;
  document.body.appendChild(trigger);

  const container = document.createElement('div');
  container.id = `modal-${id}`;
  const inner = document.createElement('button');
  inner.id = `inner-${id}`;
  container.appendChild(inner);
  document.body.appendChild(container);

  return { container, trigger, inner };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FocusMemento + FocusStack + FocusRestorer integration', () => {
  it('captures focus before opening modal and restores after closing', () => {
    const { trigger, inner } = buildModal('a');
    trigger.focus();

    const memento = createFocusMementoManager();
    const restorer = createFocusRestorer();

    // open modal
    restorer.save();
    const snap = memento.capture();
    pushTrap('modal-a', inner);
    inner.focus();

    expect(document.activeElement).toBe(inner);
    expect(getActiveTrap()?.id).toBe('modal-a');

    // close modal
    removeTrap('modal-a');
    const ok = memento.restore(snap);
    expect(ok).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('handles nested modals with stacked mementos', () => {
    const first = buildModal('first');
    const second = buildModal('second');

    first.trigger.focus();
    const memento = createFocusMementoManager();

    // open first modal
    const snap1 = memento.capture();
    pushTrap('modal-first', first.inner);
    first.inner.focus();

    // open second modal on top
    const snap2 = memento.capture();
    pushTrap('modal-second', second.inner);
    second.inner.focus();

    expect(getActiveTrap()?.id).toBe('modal-second');

    // close second
    removeTrap('modal-second');
    memento.restore(snap2);
    expect(document.activeElement).toBe(first.inner);

    // close first
    removeTrap('modal-first');
    memento.restore(snap1);
    expect(document.activeElement).toBe(first.trigger);
  });

  it('getAll reflects full open/close history', () => {
    const { trigger, inner } = buildModal('hist');
    trigger.focus();
    const memento = createFocusMementoManager();
    memento.capture();
    inner.focus();
    memento.capture();
    expect(memento.getAll()).toHaveLength(2);
    memento.clear();
    expect(memento.getAll()).toHaveLength(0);
  });
});
