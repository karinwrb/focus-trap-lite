import { createFocusTrap, getFocusableElements } from "./focusTrap";

function createContainer(): HTMLElement {
  const div = document.createElement("div");
  div.innerHTML = `
    <button id="btn1">Button 1</button>
    <input id="input1" type="text" />
    <button id="btn2">Button 2</button>
  `;
  document.body.appendChild(div);
  return div;
}

function dispatchTab(shiftKey = false): void {
  document.activeElement?.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Tab", shiftKey, bubbles: true })
  );
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("getFocusableElements", () => {
  it("returns all focusable children", () => {
    const container = createContainer();
    const els = getFocusableElements(container);
    expect(els).toHaveLength(3);
  });

  it("excludes disabled inputs", () => {
    const container = document.createElement("div");
    container.innerHTML = `<button disabled>no</button><button>yes</button>`;
    document.body.appendChild(container);
    const els = getFocusableElements(container);
    expect(els).toHaveLength(1);
  });
});

describe("createFocusTrap", () => {
  it("focuses the first element on activate", () => {
    const container = createContainer();
    const trap = createFocusTrap(container);
    trap.activate();
    expect(document.activeElement?.id).toBe("btn1");
    trap.deactivate();
  });

  it("wraps focus from last to first on Tab", () => {
    const container = createContainer();
    const trap = createFocusTrap(container);
    trap.activate();
    const focusable = getFocusableElements(container);
    focusable[focusable.length - 1].focus();
    dispatchTab(false);
    expect(document.activeElement).toBe(focusable[0]);
    trap.deactivate();
  });

  it("wraps focus from first to last on Shift+Tab", () => {
    const container = createContainer();
    const trap = createFocusTrap(container);
    trap.activate();
    const focusable = getFocusableElements(container);
    focusable[0].focus();
    dispatchTab(true);
    expect(document.activeElement).toBe(focusable[focusable.length - 1]);
    trap.deactivate();
  });

  it("calls onDeactivate when Escape is pressed", () => {
    const container = createContainer();
    const onDeactivate = jest.fn();
    const trap = createFocusTrap(container, { onDeactivate });
    trap.activate();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    );
    expect(onDeactivate).toHaveBeenCalledTimes(1);
  });

  it("does not deactivate on Escape when escapeDeactivates is false", () => {
    const container = createContainer();
    const onDeactivate = jest.fn();
    const trap = createFocusTrap(container, {
      onDeactivate,
      escapeDeactivates: false,
    });
    trap.activate();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    );
    expect(onDeactivate).not.toHaveBeenCalled();
    trap.deactivate();
  });
});
