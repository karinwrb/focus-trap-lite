/**
 * focusKeyMapIntegration.test.ts
 * Integration: FocusKeyHandler wired into a modal-like container
 * with dynamic key registration and cleanup.
 */

import { createFocusKeyHandler } from "./focusKeyHandler";

function buildModal(): { modal: HTMLDivElement; button: HTMLButtonElement } {
  const modal = document.createElement("div");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  const button = document.createElement("button");
  button.textContent = "Close";
  modal.appendChild(button);
  document.body.appendChild(modal);
  return { modal, button };
}

describe("FocusKeyMap integration with modal", () => {
  let modal: HTMLDivElement;
  let button: HTMLButtonElement;

  beforeEach(() => {
    ({ modal, button } = buildModal());
  });

  afterEach(() => {
    document.body.removeChild(modal);
  });

  it("Escape triggers close callback on modal container", () => {
    const close = jest.fn();
    const handler = createFocusKeyHandler({ onEscape: close, container: modal });
    handler.attach();
    modal.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(close).toHaveBeenCalledTimes(1);
    handler.detach();
  });

  it("dynamically added key works after attach", () => {
    const onF6 = jest.fn();
    const handler = createFocusKeyHandler({ container: modal });
    handler.attach();
    handler.keyMap.register("F6", onF6);
    modal.dispatchEvent(new KeyboardEvent("keydown", { key: "F6", bubbles: true }));
    expect(onF6).toHaveBeenCalledTimes(1);
    handler.detach();
  });

  it("clearing keyMap prevents all handlers from firing", () => {
    const onEscape = jest.fn();
    const handler = createFocusKeyHandler({ onEscape, container: modal });
    handler.attach();
    handler.keyMap.clear();
    modal.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(onEscape).not.toHaveBeenCalled();
    handler.detach();
  });

  it("unregistering a single key leaves others intact", () => {
    const onEscape = jest.fn();
    const onTab = jest.fn();
    const handler = createFocusKeyHandler({ onEscape, onTab, container: modal });
    handler.attach();
    handler.keyMap.unregister("Escape");
    modal.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    modal.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    expect(onEscape).not.toHaveBeenCalled();
    expect(onTab).toHaveBeenCalledTimes(1);
    handler.detach();
  });
});
