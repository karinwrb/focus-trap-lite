import { describe, it, expect, beforeEach } from 'vitest';
import { createFocusAlly, auditContainer, getAriaRole } from './focusAlly';

function makeEl(attrs: Record<string, string> = {}): HTMLElement {
  const el = document.createElement('div');
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

describe('getAriaRole', () => {
  it('returns the role when recognised', () => {
    const el = makeEl({ role: 'dialog' });
    expect(getAriaRole(el)).toBe('dialog');
  });

  it('returns null for an unknown role', () => {
    const el = makeEl({ role: 'banana' });
    expect(getAriaRole(el)).toBeNull();
  });

  it('returns null when no role attribute', () => {
    expect(getAriaRole(makeEl())).toBeNull();
  });
});

describe('auditContainer', () => {
  it('warns when container has no role', () => {
    const el = makeEl({ tabindex: '-1' });
    const report = auditContainer(el);
    expect(report.valid).toBe(false);
    expect(report.warnings.some((w) => w.includes('no recognised ARIA role'))).toBe(true);
  });

  it('warns when dialog lacks accessible name', () => {
    const el = makeEl({ role: 'dialog', tabindex: '-1' });
    const report = auditContainer(el);
    expect(report.valid).toBe(false);
    expect(report.warnings.some((w) => w.includes('aria-label'))).toBe(true);
  });

  it('passes when dialog has aria-labelledby', () => {
    const el = makeEl({ role: 'dialog', 'aria-labelledby': 'title', tabindex: '-1' });
    const report = auditContainer(el);
    expect(report.valid).toBe(true);
    expect(report.warnings).toHaveLength(0);
  });

  it('warns when tabindex is missing', () => {
    const el = makeEl({ role: 'tooltip' });
    const report = auditContainer(el);
    expect(report.warnings.some((w) => w.includes('tabindex'))).toBe(true);
  });
});

describe('createFocusAlly', () => {
  it('audit delegates to auditContainer', () => {
    const el = makeEl({ role: 'alertdialog', 'aria-label': 'Alert', tabindex: '-1' });
    const ally = createFocusAlly(el);
    expect(ally.audit().valid).toBe(true);
  });

  it('getRole returns the element role', () => {
    const el = makeEl({ role: 'menu' });
    const ally = createFocusAlly(el);
    expect(ally.getRole()).toBe('menu');
  });

  it('getRole returns null when no role', () => {
    const ally = createFocusAlly(makeEl());
    expect(ally.getRole()).toBeNull();
  });
});
