import { createFocusRestorer, withFocusRestored } from './focusRestorer';

function createFocusableButton(label: string): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.textContent = label;
  document.body.appendChild(btn);
  return btn;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusRestorer', () => {
  it('returns null from getSaved before save is called', () => {
    const restorer = createFocusRestorer();
    expect(restorer.getSaved()).toBeNull();
  });

  it('saves the currently active element', () => {
    const btn = createFocusableButton('trigger');
    btn.focus();
    const restorer = createFocusRestorer();
    restorer.save();
    expect(restorer.getSaved()).toBe(btn);
  });

  it('restores focus to the saved element', () => {
    const trigger = createFocusableButton('trigger');
    const other = createFocusableButton('other');
    trigger.focus();
    const restorer = createFocusRestorer();
    restorer.save();
    other.focus();
    expect(document.activeElement).toBe(other);
    const result = restorer.restore();
    expect(result).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('returns false when restore is called with no saved element', () => {
    const restorer = createFocusRestorer();
    const result = restorer.restore();
    expect(result).toBe(false);
  });

  it('returns false and clears saved element if element is removed from DOM', () => {
    const btn = createFocusableButton('removed');
    btn.focus();
    const restorer = createFocusRestorer();
    restorer.save();
    document.body.removeChild(btn);
    const result = restorer.restore();
    expect(result).toBe(false);
    expect(restorer.getSaved()).toBeNull();
  });

  it('clears the saved element when clear() is called', () => {
    const btn = createFocusableButton('btn');
    btn.focus();
    const restorer = createFocusRestorer();
    restorer.save();
    expect(restorer.getSaved()).toBe(btn);
    restorer.clear();
    expect(restorer.getSaved()).toBeNull();
  });
});

describe('withFocusRestored', () => {
  it('restores focus after synchronous callback', async () => {
    const trigger = createFocusableButton('trigger');
    const other = createFocusableButton('other');
    trigger.focus();
    await withFocusRestored(() => {
      other.focus();
      expect(document.activeElement).toBe(other);
    });
    expect(document.activeElement).toBe(trigger);
  });

  it('restores focus even if callback throws', async () => {
    const trigger = createFocusableButton('trigger');
    trigger.focus();
    await expect(
      withFocusRestored(() => {
        throw new Error('oops');
      })
    ).rejects.toThrow('oops');
    expect(document.activeElement).toBe(trigger);
  });
});
