import { createFocusPolicyManager } from "./focusPolicy";
import { createFocusPolicyHandler } from "./focusPolicyHandler";

function createContainer(): HTMLElement {
  const div = document.createElement("div");
  const a = document.createElement("button");
  a.textContent = "First";
  const b = document.createElement("button");
  b.textContent = "Last";
  div.appendChild(a);
  div.appendChild(b);
  document.body.appendChild(div);
  return div;
}

function dispatchTab(target: HTMLElement, shift = false): KeyboardEvent {
  const event = new KeyboardEvent("keydown", {
    key: "Tab",
    bubbles: true,
    cancelable: true,
    shiftKey: shift,
  });
  target.dispatchEvent(event);
  return event;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("createFocusPolicyHandler", () => {
  it("wraps focus from last to first on Tab", () => {
    const mgr = createFocusPolicyManager({ type: "wrap" });
    const handler = createFocusPolicyHandler(mgr);
    const container = createContainer();
    handler.attach(container);
    const buttons = container.querySelectorAll("button");
    (buttons[1] as HTMLElement).focus();
    const evt = dispatchTab(container);
    expect(evt.defaultPrevented).toBe(true);
    handler.detach();
  });

  it("wraps focus from first to last on Shift+Tab", () => {
    const mgr = createFocusPolicyManager({ type: "wrap" });
    const handler = createFocusPolicyHandler(mgr);
    const container = createContainer();
    handler.attach(container);
    const buttons = container.querySelectorAll("button");
    (buttons[0] as HTMLElement).focus();
    const evt = dispatchTab(container, true);
    expect(evt.defaultPrevented).toBe(true);
    handler.detach();
  });

  it("clamp policy prevents moving past last element", () => {
    const mgr = createFocusPolicyManager({ type: "clamp" });
    const handler = createFocusPolicyHandler(mgr);
    const container = createContainer();
    handler.attach(container);
    const buttons = container.querySelectorAll("button");
    (buttons[1] as HTMLElement).focus();
    const evt = dispatchTab(container);
    expect(evt.defaultPrevented).toBe(true);
    handler.detach();
  });

  it("escape policy calls onEscape callback", () => {
    const onEscape = jest.fn();
    const mgr = createFocusPolicyManager({ type: "escape", onEscape });
    const handler = createFocusPolicyHandler(mgr);
    const container = createContainer();
    handler.attach(container);
    dispatchTab(container);
    expect(onEscape).toHaveBeenCalledTimes(1);
    handler.detach();
  });

  it("detach removes the keydown listener", () => {
    const onEscape = jest.fn();
    const mgr = createFocusPolicyManager({ type: "escape", onEscape });
    const handler = createFocusPolicyHandler(mgr);
    const container = createContainer();
    handler.attach(container);
    handler.detach();
    dispatchTab(container);
    expect(onEscape).not.toHaveBeenCalled();
  });
});
