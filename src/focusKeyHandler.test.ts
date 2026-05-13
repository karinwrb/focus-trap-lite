import { createFocusKeyHandler } from "./focusKeyHandler";

function dispatchKeyDown(target: EventTarget, key: string): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}

describe("createFocusKeyHandler", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("calls onEscape when Escape is pressed after attach", () => {
    const onEscape = jest.fn();
    const handler = createFocusKeyHandler({ onEscape, container });
    handler.attach();
    dispatchKeyDown(container, "Escape");
    expect(onEscape).toHaveBeenCalledTimes(1);
    handler.detach();
  });

  it("calls onTab when Tab is pressed after attach", () => {
    const onTab = jest.fn();
    const handler = createFocusKeyHandler({ onTab, container });
    handler.attach();
    dispatchKeyDown(container, "Tab");
    expect(onTab).toHaveBeenCalledTimes(1);
    handler.detach();
  });

  it("does not call handlers before attach", () => {
    const onEscape = jest.fn();
    const handler = createFocusKeyHandler({ onEscape, container });
    dispatchKeyDown(container, "Escape");
    expect(onEscape).not.toHaveBeenCalled();
  });

  it("stops calling handlers after detach", () => {
    const onEscape = jest.fn();
    const handler = createFocusKeyHandler({ onEscape, container });
    handler.attach();
    handler.detach();
    dispatchKeyDown(container, "Escape");
    expect(onEscape).not.toHaveBeenCalled();
  });

  it("exposes keyMap for dynamic registration", () => {
    const handler = createFocusKeyHandler({ container });
    const onArrow = jest.fn();
    handler.keyMap.register("ArrowUp", onArrow);
    handler.attach();
    dispatchKeyDown(container, "ArrowUp");
    expect(onArrow).toHaveBeenCalledTimes(1);
    handler.detach();
  });

  it("handles multiple keys independently", () => {
    const onEscape = jest.fn();
    const onTab = jest.fn();
    const handler = createFocusKeyHandler({ onEscape, onTab, container });
    handler.attach();
    dispatchKeyDown(container, "Escape");
    dispatchKeyDown(container, "Tab");
    dispatchKeyDown(container, "Enter");
    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(onTab).toHaveBeenCalledTimes(1);
    handler.detach();
  });

  it("passes the keyboard event to the handler callback", () => {
    const onEscape = jest.fn();
    const handler = createFocusKeyHandler({ onEscape, container });
    handler.attach();
    dispatchKeyDown(container, "Escape");
    expect(onEscape).toHaveBeenCalledWith(expect.objectContaining({ key: "Escape" }));
    handler.detach();
  });
});
