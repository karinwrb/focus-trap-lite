/**
 * focusPolicyIntegration.test.ts
 * Integration tests: FocusPolicyManager + FocusPolicyHandler working
 * together inside a modal-like container, verifying end-to-end behavior.
 */

import { createFocusPolicyManager } from "./focusPolicy";
import { createFocusPolicyHandler } from "./focusPolicyHandler";

function buildModal(): {
  modal: HTMLElement;
  buttons: HTMLButtonElement[];
  cleanup: () => void;
} {
  const modal = document.createElement("div");
  modal.setAttribute("role", "dialog");
  const b1 = document.createElement("button");
  b1.textContent = "Cancel";
  const b2 = document.createElement("button");
  b2.textContent = "Confirm";
  modal.appendChild(b1);
  modal.appendChild(b2);
  document.body.appendChild(modal);
  return {
    modal,
    buttons: [b1, b2],
    cleanup: () => document.body.removeChild(modal),
  };
}

function pressTab(el: HTMLElement, shift = false): KeyboardEvent {
  const evt = new KeyboardEvent("keydown", {
    key: "Tab",
    bubbles: true,
    cancelable: true,
    shiftKey: shift,
  });
  el.dispatchEvent(evt);
  return evt;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("FocusPolicy integration", () => {
  it("wrap: Tab on last element prevents default and keeps focus trapped", () => {
    const { modal, buttons, cleanup } = buildModal();
    const mgr = createFocusPolicyManager({ type: "wrap" });
    const handler = createFocusPolicyHandler(mgr);
    handler.attach(modal);
    buttons[1].focus();
    const evt = pressTab(modal);
    expect(evt.defaultPrevented).toBe(true);
    handler.detach();
    cleanup();
  });

  it("switching policy mid-session from wrap to escape fires callback", () => {
    const { modal, buttons, cleanup } = buildModal();
    const mgr = createFocusPolicyManager({ type: "wrap" });
    const handler = createFocusPolicyHandler(mgr);
    handler.attach(modal);
    buttons[1].focus();
    let escaped = false;
    mgr.setPolicy({ type: "escape", onEscape: () => { escaped = true; } });
    pressTab(modal);
    expect(escaped).toBe(true);
    handler.detach();
    cleanup();
  });

  it("clamp: Shift+Tab on first element stays on first", () => {
    const { modal, buttons, cleanup } = buildModal();
    const mgr = createFocusPolicyManager({ type: "clamp" });
    const handler = createFocusPolicyHandler(mgr);
    handler.attach(modal);
    buttons[0].focus();
    const evt = pressTab(modal, true);
    expect(evt.defaultPrevented).toBe(true);
    handler.detach();
    cleanup();
  });

  it("reset restores wrap and re-traps focus", () => {
    const { modal, buttons, cleanup } = buildModal();
    const mgr = createFocusPolicyManager({ type: "clamp" });
    const handler = createFocusPolicyHandler(mgr);
    handler.attach(modal);
    mgr.reset();
    expect(mgr.isWrap()).toBe(true);
    buttons[1].focus();
    const evt = pressTab(modal);
    expect(evt.defaultPrevented).toBe(true);
    handler.detach();
    cleanup();
  });
});
