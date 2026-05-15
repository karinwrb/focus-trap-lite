import { createFocusRelay } from './focusRelay';

function createContainer() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
}

function createButton(parent: HTMLElement, label = 'btn') {
  const btn = document.createElement('button');
  btn.textContent = label;
  parent.appendChild(btn);
  return btn;
}

function fireFocusOut(target: HTMLElement, relatedTarget: HTMLElement | null = null) {
  const event = new FocusEvent('focusout', { bubbles: true, relatedTarget });
  target.dispatchEvent(event);
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusRelay', () => {
  it('relays focus to the set target', () => {
    const container = createContainer();
    const btn = createButton(container);
    const relay = createFocusRelay();
    relay.setTarget(btn);
    const result = relay.relay();
    expect(result).toBe(btn);
    expect(document.activeElement).toBe(btn);
  });

  it('falls back when target is null', () => {
    const container = createContainer();
    const fallback = createButton(container, 'fallback');
    const relay = createFocusRelay({ fallback });
    const result = relay.relay();
    expect(result).toBe(fallback);
  });

  it('returns null when no target or fallback is available', () => {
    const relay = createFocusRelay();
    expect(relay.relay()).toBeNull();
  });

  it('calls onRelay with previous and next element', () => {
    const container = createContainer();
    const btn = createButton(container);
    const onRelay = jest.fn();
    const relay = createFocusRelay({ onRelay });
    relay.setTarget(btn);
    relay.relay();
    expect(onRelay).toHaveBeenCalledWith(expect.anything(), btn);
  });

  it('attach / detach controls isAttached', () => {
    const container = createContainer();
    const relay = createFocusRelay();
    expect(relay.isAttached()).toBe(false);
    relay.attach(container);
    expect(relay.isAttached()).toBe(true);
    relay.detach();
    expect(relay.isAttached()).toBe(false);
  });

  it('relays on focusout leaving the container', () => {
    const container = createContainer();
    const btn = createButton(container, 'inside');
    const outside = createButton(document.body, 'outside');
    const relay = createFocusRelay();
    relay.setTarget(btn);
    relay.attach(container);
    // focusout with relatedTarget outside container triggers relay
    fireFocusOut(btn, outside);
    expect(document.activeElement).toBe(btn);
    relay.detach();
  });

  it('getTarget returns the set target', () => {
    const container = createContainer();
    const btn = createButton(container);
    const relay = createFocusRelay();
    relay.setTarget(btn);
    expect(relay.getTarget()).toBe(btn);
  });
});
