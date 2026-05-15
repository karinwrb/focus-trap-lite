import { createFocusContextMenu } from './focusContextMenu';

function fire(target: EventTarget, type: string): void {
  target.dispatchEvent(new Event(type, { bubbles: true }));
}

function firePointerDown(target: EventTarget): void {
  target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
}

function fireKeyDown(target: EventTarget): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
}

describe('createFocusContextMenu', () => {
  it('returns false before any events', () => {
    const cm = createFocusContextMenu(document);
    expect(cm.isContextMenuActive()).toBe(false);
  });

  it('returns true after contextmenu event when attached', () => {
    const cm = createFocusContextMenu(document);
    cm.attach();
    fire(document, 'contextmenu');
    expect(cm.isContextMenuActive()).toBe(true);
    cm.destroy();
  });

  it('resets to false after pointerdown', () => {
    const cm = createFocusContextMenu(document);
    cm.attach();
    fire(document, 'contextmenu');
    expect(cm.isContextMenuActive()).toBe(true);
    firePointerDown(document);
    expect(cm.isContextMenuActive()).toBe(false);
    cm.destroy();
  });

  it('resets to false after keydown', () => {
    const cm = createFocusContextMenu(document);
    cm.attach();
    fire(document, 'contextmenu');
    expect(cm.isContextMenuActive()).toBe(true);
    fireKeyDown(document);
    expect(cm.isContextMenuActive()).toBe(false);
    cm.destroy();
  });

  it('resets to false after blur', () => {
    const cm = createFocusContextMenu(document);
    cm.attach();
    fire(document, 'contextmenu');
    expect(cm.isContextMenuActive()).toBe(true);
    fire(document, 'blur');
    expect(cm.isContextMenuActive()).toBe(false);
    cm.destroy();
  });

  it('does not respond to events when detached', () => {
    const cm = createFocusContextMenu(document);
    cm.attach();
    cm.detach();
    fire(document, 'contextmenu');
    expect(cm.isContextMenuActive()).toBe(false);
  });

  it('destroy clears state and removes listeners', () => {
    const cm = createFocusContextMenu(document);
    cm.attach();
    fire(document, 'contextmenu');
    cm.destroy();
    expect(cm.isContextMenuActive()).toBe(false);
    fire(document, 'contextmenu');
    expect(cm.isContextMenuActive()).toBe(false);
  });

  it('accepts a custom event target', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    const cm = createFocusContextMenu(div);
    cm.attach();
    div.dispatchEvent(new Event('contextmenu'));
    expect(cm.isContextMenuActive()).toBe(true);
    cm.destroy();
    document.body.removeChild(div);
  });
});
