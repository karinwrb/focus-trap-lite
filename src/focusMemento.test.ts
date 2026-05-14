import { createFocusMementoManager, FocusMemento } from './focusMemento';

function createFocusableInput(value = ''): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = value;
  document.body.appendChild(input);
  return input;
}

function createFocusableButton(label = 'btn'): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.textContent = label;
  document.body.appendChild(btn);
  return btn;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusMementoManager', () => {
  it('captures the currently focused element', () => {
    const btn = createFocusableButton();
    btn.focus();
    const mgr = createFocusMementoManager();
    const m = mgr.capture();
    expect(m.element).toBe(btn);
  });

  it('captures null element when nothing is focused', () => {
    const mgr = createFocusMementoManager();
    (document.activeElement as HTMLElement)?.blur?.();
    const m = mgr.capture();
    // body or null
    expect(m.selectionStart).toBeNull();
    expect(m.selectionEnd).toBeNull();
  });

  it('captures selection range for input elements', () => {
    const input = createFocusableInput('hello world');
    input.focus();
    input.setSelectionRange(2, 7);
    const mgr = createFocusMementoManager();
    const m = mgr.capture();
    expect(m.selectionStart).toBe(2);
    expect(m.selectionEnd).toBe(7);
  });

  it('restores focus to captured element', () => {
    const btn = createFocusableButton();
    btn.focus();
    const mgr = createFocusMementoManager();
    const m = mgr.capture();
    createFocusableButton('other').focus();
    expect(document.activeElement).not.toBe(btn);
    const ok = mgr.restore(m);
    expect(ok).toBe(true);
    expect(document.activeElement).toBe(btn);
  });

  it('restores selection range on input', () => {
    const input = createFocusableInput('hello world');
    input.focus();
    input.setSelectionRange(1, 5);
    const mgr = createFocusMementoManager();
    const m = mgr.capture();
    input.setSelectionRange(0, 0);
    mgr.restore(m);
    expect(input.selectionStart).toBe(1);
    expect(input.selectionEnd).toBe(5);
  });

  it('getLatest returns the most recent memento', () => {
    const mgr = createFocusMementoManager();
    expect(mgr.getLatest()).toBeNull();
    createFocusableButton().focus();
    const m1 = mgr.capture();
    createFocusableButton('b2').focus();
    const m2 = mgr.capture();
    expect(mgr.getLatest()).toBe(m2);
    void m1;
  });

  it('getAll returns all captured mementos in order', () => {
    const mgr = createFocusMementoManager();
    createFocusableButton('a').focus();
    mgr.capture();
    createFocusableButton('b').focus();
    mgr.capture();
    expect(mgr.getAll()).toHaveLength(2);
  });

  it('clear removes all mementos', () => {
    const mgr = createFocusMementoManager();
    createFocusableButton().focus();
    mgr.capture();
    mgr.clear();
    expect(mgr.getLatest()).toBeNull();
    expect(mgr.getAll()).toHaveLength(0);
  });

  it('restore returns false for null element', () => {
    const mgr = createFocusMementoManager();
    const fake: FocusMemento = { element: null, selectionStart: null, selectionEnd: null, timestamp: 0 };
    expect(mgr.restore(fake)).toBe(false);
  });

  it('timestamps are monotonically non-decreasing', () => {
    const mgr = createFocusMementoManager();
    createFocusableButton('x').focus();
    const m1 = mgr.capture();
    const m2 = mgr.capture();
    expect(m2.timestamp).toBeGreaterThanOrEqual(m1.timestamp);
  });
});
