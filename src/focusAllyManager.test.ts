import { describe, it, expect } from 'vitest';
import { createFocusAllyManager } from './focusAllyManager';

function makeDialog(label = 'My Dialog'): HTMLElement {
  const el = document.createElement('div');
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', label);
  el.setAttribute('tabindex', '-1');
  return el;
}

describe('createFocusAllyManager', () => {
  it('creates and stores a new FocusAlly', () => {
    const mgr = createFocusAllyManager();
    const el = makeDialog();
    const ally = mgr.getOrCreate(el);
    expect(ally).toBeDefined();
    expect(mgr.getSize()).toBe(1);
  });

  it('returns the same instance on repeated calls', () => {
    const mgr = createFocusAllyManager();
    const el = makeDialog();
    expect(mgr.getOrCreate(el)).toBe(mgr.getOrCreate(el));
  });

  it('get returns undefined for unknown element', () => {
    const mgr = createFocusAllyManager();
    expect(mgr.get(document.createElement('div'))).toBeUndefined();
  });

  it('drop removes the entry', () => {
    const mgr = createFocusAllyManager();
    const el = makeDialog();
    mgr.getOrCreate(el);
    mgr.drop(el);
    expect(mgr.getSize()).toBe(0);
    expect(mgr.get(el)).toBeUndefined();
  });

  it('auditAll returns a report for every registered container', () => {
    const mgr = createFocusAllyManager();
    const a = makeDialog('A');
    const b = makeDialog('B');
    mgr.getOrCreate(a);
    mgr.getOrCreate(b);
    const results = mgr.auditAll();
    expect(results.size).toBe(2);
    expect(results.get(a)?.valid).toBe(true);
    expect(results.get(b)?.valid).toBe(true);
  });

  it('auditAll flags invalid containers', () => {
    const mgr = createFocusAllyManager();
    const bad = document.createElement('div'); // no role, no tabindex
    mgr.getOrCreate(bad);
    const results = mgr.auditAll();
    expect(results.get(bad)?.valid).toBe(false);
  });
});
