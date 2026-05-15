import { createFocusBoundary, FocusBoundaryEvent } from "./focusBoundary";

function createContainer(): HTMLElement {
  const div = document.createElement("div");
  const btn1 = document.createElement("button");
  btn1.textContent = "First";
  const btn2 = document.createElement("button");
  btn2.textContent = "Last";
  div.appendChild(btn1);
  div.appendChild(btn2);
  document.body.appendChild(div);
  return div;
}

function dispatchTab(target: HTMLElement, shift = false): void {
  const e = new KeyboardEvent("keydown", {
    key: "Tab",
    shiftKey: shift,
    bubbles: true,
    cancelable: true,
  });
  target.dispatchEvent(e);
}

aftereEach(() => {
  document.body.innerHTML = "";
});

describe("createFocusBoundary", () => {
  it("starts detached", () => {
    const container = createContainer();
    const boundary = createFocusBoundary(container);
    expect(boundary.isAttached()).toBe(false);
  });

  it("attaches and detaches cleanly", () => {
    const container = createContainer();
    const boundary = createFocusBoundary(container);
    boundary.attach();
    expect(boundary.isAttached()).toBe(true);
    boundary.detach();
    expect(boundary.isAttached()).toBe(false);
  });

  it("attach is idempotent", () => {
    const container = createContainer();
    const boundary = createFocusBoundary(container);
    boundary.attach();
    boundary.attach();
    expect(boundary.isAttached()).toBe(true);
  });

  it("emits escape-bottom when Tab pressed on last element", () => {
    const container = createContainer();
    const boundary = createFocusBoundary(container);
    boundary.attach();
    const events: FocusBoundaryEvent[] = [];
    boundary.onEscape((e) => events.push(e));
    const last = container.querySelectorAll("button")[1] as HTMLElement;
    last.focus();
    dispatchTab(last, false);
    expect(events).toEqual(["escape-bottom"]);
  });

  it("emits escape-top when Shift+Tab pressed on first element", () => {
    const container = createContainer();
    const boundary = createFocusBoundary(container);
    boundary.attach();
    const events: FocusBoundaryEvent[] = [];
    boundary.onEscape((e) => events.push(e));
    const first = container.querySelectorAll("button")[0] as HTMLElement;
    first.focus();
    dispatchTab(first, true);
    expect(events).toEqual(["escape-top"]);
  });

  it("does not emit when focus is in the middle", () => {
    const container = createContainer();
    const mid = document.createElement("button");
    mid.textContent = "Middle";
    container.insertBefore(mid, container.querySelectorAll("button")[1]);
    const boundary = createFocusBoundary(container);
    boundary.attach();
    const events: FocusBoundaryEvent[] = [];
    boundary.onEscape((e) => events.push(e));
    mid.focus();
    dispatchTab(mid, false);
    expect(events).toHaveLength(0);
  });

  it("onEscape returns an unsubscribe function", () => {
    const container = createContainer();
    const boundary = createFocusBoundary(container);
    boundary.attach();
    const events: FocusBoundaryEvent[] = [];
    const off = boundary.onEscape((e) => events.push(e));
    off();
    const last = container.querySelectorAll("button")[1] as HTMLElement;
    last.focus();
    dispatchTab(last, false);
    expect(events).toHaveLength(0);
  });
});
