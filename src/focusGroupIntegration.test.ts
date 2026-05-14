/**
 * focusGroupIntegration.test.ts
 * Integration tests verifying FocusGroup and FocusGroupManager work together
 * in a realistic modal/dialog stacking scenario.
 */

import { createFocusGroupManager } from './focusGroupManager';

function buildModal(id: string, priority: number): { id: string; element: HTMLElement; priority: number } {
  const el = document.createElement('div');
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.id = id;
  document.body.appendChild(el);
  return { id, element: el, priority };
}

aftereEach(() => {
  document.body.innerHTML = '';
});

describe('FocusGroup + FocusGroupManager integration', () => {
  it('tracks stacked modals and returns the topmost as active', () => {
    const mgr = createFocusGroupManager();
    const group = mgr.getOrCreate('modals');

    const m1 = buildModal('modal-1', 1);
    const m2 = buildModal('modal-2', 2);
    const m3 = buildModal('modal-3', 3);

    group.add(m1.id, m1.element, m1.priority);
    group.add(m2.id, m2.element, m2.priority);
    group.add(m3.id, m3.element, m3.priority);

    expect(group.getActive()?.id).toBe('modal-3');
  });

  it('after closing top modal, previous becomes active', () => {
    const mgr = createFocusGroupManager();
    const group = mgr.getOrCreate('modals');

    const m1 = buildModal('modal-a', 1);
    const m2 = buildModal('modal-b', 2);

    group.add(m1.id, m1.element, m1.priority);
    group.add(m2.id, m2.element, m2.priority);

    group.remove('modal-b');
    expect(group.getActive()?.id).toBe('modal-a');
  });

  it('getActiveAcrossGroups resolves highest priority across modal and drawer groups', () => {
    const mgr = createFocusGroupManager();
    const modals = mgr.getOrCreate('modals');
    const drawers = mgr.getOrCreate('drawers');

    const m = buildModal('m', 5);
    const d = buildModal('d', 8);

    modals.add(m.id, m.element, m.priority);
    drawers.add(d.id, d.element, d.priority);

    const active = mgr.getActiveAcrossGroups();
    expect(active?.id).toBe('d');
  });

  it('destroyAll leaves no active entries', () => {
    const mgr = createFocusGroupManager();
    const group = mgr.getOrCreate('modals');
    const m = buildModal('sole', 1);
    group.add(m.id, m.element, m.priority);

    mgr.destroyAll();
    expect(mgr.getActiveAcrossGroups()).toBeNull();
  });
});
