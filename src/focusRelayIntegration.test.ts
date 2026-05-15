/**
 * Integration tests: FocusRelayManager with nested modal containers.
 */
import { createFocusRelayManager } from './focusRelayManager';

function buildModal() {
  const overlay = document.createElement('div');
  const modal = document.createElement('div');
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  return { overlay, modal, closeBtn };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FocusRelayManager integration', () => {
  it('push creates an attached relay', () => {
    const manager = createFocusRelayManager();
    const { modal } = buildModal();
    const relay = manager.push(modal);
    expect(relay.isAttached()).toBe(true);
    expect(manager.getDepth()).toBe(1);
    manager.clear();
  });

  it('pop detaches the relay and reduces depth', () => {
    const manager = createFocusRelayManager();
    const { modal } = buildModal();
    manager.push(modal);
    const popped = manager.pop();
    expect(popped?.isAttached()).toBe(false);
    expect(manager.getDepth()).toBe(0);
  });

  it('getCurrent returns the topmost relay', () => {
    const manager = createFocusRelayManager();
    const { modal: m1 } = buildModal();
    const { modal: m2 } = buildModal();
    const r1 = manager.push(m1);
    const r2 = manager.push(m2);
    expect(manager.getCurrent()).toBe(r2);
    manager.pop();
    expect(manager.getCurrent()).toBe(r1);
    manager.clear();
  });

  it('clear removes all relays', () => {
    const manager = createFocusRelayManager();
    const { modal: m1 } = buildModal();
    const { modal: m2 } = buildModal();
    manager.push(m1);
    manager.push(m2);
    manager.clear();
    expect(manager.getDepth()).toBe(0);
  });

  it('relay targets the correct button after push', () => {
    const manager = createFocusRelayManager();
    const { modal, closeBtn } = buildModal();
    const relay = manager.push(modal);
    relay.setTarget(closeBtn);
    const result = relay.relay();
    expect(result).toBe(closeBtn);
    expect(document.activeElement).toBe(closeBtn);
    manager.clear();
  });

  it('nested modals each relay independently', () => {
    const manager = createFocusRelayManager();
    const { modal: m1, closeBtn: c1 } = buildModal();
    const { modal: m2, closeBtn: c2 } = buildModal();
    const r1 = manager.push(m1);
    const r2 = manager.push(m2);
    r1.setTarget(c1);
    r2.setTarget(c2);
    expect(r2.relay()).toBe(c2);
    manager.pop();
    expect(r1.relay()).toBe(c1);
    manager.clear();
  });
});
