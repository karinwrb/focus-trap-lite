/**
 * focusHistoryManager.test.ts
 */

import { createFocusHistoryManager } from "./focusHistoryManager";
import { clearFocusHistory } from "./focusHistory";

function createFocusableButton(label = "btn"): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.textContent = label;
  document.body.appendChild(btn);
  return btn;
}

beforeEach(() => {
  clearFocusHistory();
  document.body.innerHTML = "";
});

describe("createFocusHistoryManager", () => {
  it("records the currently focused element", () => {
    const manager = createFocusHistoryManager();
    const btn = createFocusableButton();
    btn.focus();
    manager.record();
    expect(manager.depth()).toBe(1);
    expect(manager.peek()?.element).toBe(btn);
  });

  it("does not record when body is focused", () => {
    const manager = createFocusHistoryManager();
    (document.body as HTMLElement).focus();
    manager.record();
    expect(manager.depth()).toBe(0);
  });

  it("restores focus to the last recorded element", () => {
    const manager = createFocusHistoryManager();
    const btn = createFocusableButton();
    btn.focus();
    manager.record();

    const btn2 = createFocusableButton("btn2");
    btn2.focus();

    const restored = manager.restoreLast();
    expect(restored).toBe(true);
    expect(document.activeElement).toBe(btn);
  });

  it("returns false when history is empty on restoreLast", () => {
    const manager = createFocusHistoryManager();
    expect(manager.restoreLast()).toBe(false);
  });

  it("decrements depth after restoreLast", () => {
    const manager = createFocusHistoryManager();
    const btn = createFocusableButton();
    btn.focus();
    manager.record();
    manager.restoreLast();
    expect(manager.depth()).toBe(0);
  });

  it("resets history via reset()", () => {
    const manager = createFocusHistoryManager();
    const btn = createFocusableButton();
    btn.focus();
    manager.record();
    manager.record();
    manager.reset();
    expect(manager.depth()).toBe(0);
    expect(manager.peek()).toBeUndefined();
  });

  it("supports nested record/restore cycles", () => {
    const manager = createFocusHistoryManager();
    const btn1 = createFocusableButton("a");
    const btn2 = createFocusableButton("b");

    btn1.focus();
    manager.record();
    btn2.focus();
    manager.record();

    expect(manager.depth()).toBe(2);
    manager.restoreLast();
    expect(document.activeElement).toBe(btn2);
    manager.restoreLast();
    expect(document.activeElement).toBe(btn1);
    expect(manager.depth()).toBe(0);
  });
});
