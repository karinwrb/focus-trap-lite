import {
  pushFocusHistory,
  popFocusHistory,
  getFocusHistoryDepth,
  clearFocusHistory,
  peekFocusHistory,
} from "./focusHistory";

function createFocusableButton(label: string): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.textContent = label;
  document.body.appendChild(btn);
  return btn;
}

afterEach(() => {
  clearFocusHistory();
  document.body.innerHTML = "";
});

describe("focusHistory", () => {
  it("starts with an empty stack", () => {
    expect(getFocusHistoryDepth()).toBe(0);
  });

  it("pushes the active element onto the stack", () => {
    const btn = createFocusableButton("trigger");
    btn.focus();

    pushFocusHistory();

    expect(getFocusHistoryDepth()).toBe(1);
    expect(peekFocusHistory()?.element).toBe(btn);
  });

  it("restores focus on pop", () => {
    const btn = createFocusableButton("trigger");
    btn.focus();
    pushFocusHistory();

    // Move focus away
    const other = createFocusableButton("other");
    other.focus();
    expect(document.activeElement).toBe(other);

    const restored = popFocusHistory();

    expect(restored).toBe(btn);
    expect(document.activeElement).toBe(btn);
    expect(getFocusHistoryDepth()).toBe(0);
  });

  it("supports nested traps via stacked history", () => {
    const first = createFocusableButton("first");
    const second = createFocusableButton("second");

    first.focus();
    pushFocusHistory();

    second.focus();
    pushFocusHistory();

    expect(getFocusHistoryDepth()).toBe(2);

    popFocusHistory();
    expect(document.activeElement).toBe(second);

    popFocusHistory();
    expect(document.activeElement).toBe(first);
  });

  it("returns null and does nothing when stack is empty", () => {
    const result = popFocusHistory();
    expect(result).toBeNull();
  });

  it("clearFocusHistory empties the stack", () => {
    const btn = createFocusableButton("x");
    btn.focus();
    pushFocusHistory();
    pushFocusHistory();
    clearFocusHistory();
    expect(getFocusHistoryDepth()).toBe(0);
  });
});
