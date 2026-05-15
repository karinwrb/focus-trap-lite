import { createFocusScope } from './focusScope';

function buildRoot(): HTMLElement {
  const div = document.createElement('div');
  const btn = document.createElement('button');
  btn.textContent = 'Inside';
  div.appendChild(btn);
  document.body.appendChild(div);
  return div;
}

function fireFocusIn(target: EventTarget, related: EventTarget | null = null) {
  const event = new FocusEvent('focusin', { bubbles: true, relatedTarget: related });
  Object.defineProperty(event, 'target', { value: target });
  (target as HTMLElement).dispatchEvent(event);
}

function fireFocusOut(target: EventTarget, related: EventTarget | null = null) {
  const event = new FocusEvent('focusout', { bubbles: true, relatedTarget: related });
  Object.defineProperty(event, 'target', { value: target });
  (target as HTMLElement).dispatchEvent(event);
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusScope', () => {
  it('returns the correct name and root', () => {
    const root = buildRoot();
    const scope = createFocusScope({ name: 'modal', root });
    expect(scope.getName()).toBe('modal');
    expect(scope.getRoot()).toBe(root);
    scope.destroy();
  });

  it('calls onEnter when enter() is invoked', () => {
    const root = buildRoot();
    const onEnter = jest.fn();
    const scope = createFocusScope({ name: 'dialog', root, onEnter });
    scope.enter();
    expect(onEnter).toHaveBeenCalledTimes(1);
    scope.destroy();
  });

  it('does not call onEnter twice if already active', () => {
    const root = buildRoot();
    const onEnter = jest.fn();
    const scope = createFocusScope({ name: 'dialog', root, onEnter });
    scope.enter();
    scope.enter();
    expect(onEnter).toHaveBeenCalledTimes(1);
    scope.destroy();
  });

  it('calls onLeave when leave() is invoked after enter', () => {
    const root = buildRoot();
    const onLeave = jest.fn();
    const scope = createFocusScope({ name: 'dialog', root, onLeave });
    scope.enter();
    scope.leave();
    expect(onLeave).toHaveBeenCalledTimes(1);
    scope.destroy();
  });

  it('containsFocus returns true when activeElement is inside root', () => {
    const root = buildRoot();
    const btn = root.querySelector('button') as HTMLButtonElement;
    const scope = createFocusScope({ name: 's', root });
    btn.focus();
    expect(scope.containsFocus()).toBe(true);
    scope.destroy();
  });

  it('destroy removes event listeners without throwing', () => {
    const root = buildRoot();
    const scope = createFocusScope({ name: 's', root });
    expect(() => scope.destroy()).not.toThrow();
  });
});
