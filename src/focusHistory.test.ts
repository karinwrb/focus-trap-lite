/**
 * focusHistory.test.ts
 */

import {
  pushFocusHistory,
  popFocusHistory,
  peekFocusHistory,
  getFocusHistoryDepth,
  clearFocusHistory,
} from "./focusHistory";

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

describe("pushFocusHistory / popFocusHistory", () => {
  it("pushes and pops a single element", () => {
    const btn = createFocusableButton();
    pushFocusHistory(btn);
    expect(getFocusHistoryDepth()).toBe(1);
    const entry = popFocusHistory();
    expect(entry?.element).toBe(btn);
    expect(getFocusHistoryDepth()).toBe(0);
  });

  it("returns undefined when popping an empty stack", () => {
    expect(popFocusHistory()).toBeUndefined();
  });

  it("maintains LIFO order", () => {
    const btn1 = createFocusableButton("a");
    const btn2 = createFocusableButton("b");
    pushFocusHistory(btn1);
    pushFocusHistory(btn2);
    expect(popFocusHistory()?.element).toBe(btn2);
    expect(popFocusHistory()?.element).toBe(btn1);
  });
});

describe("peekFocusHistory", () => {
  it("returns the top entry without removing it", () => {
    const btn = createFocusableButton();
    pushFocusHistory(btn);
    expect(peekFocusHistory()?.element).toBe(btn);
    expect(getFocusHistoryDepth()).toBe(1);
  });

  it("returns undefined on empty stack", () => {
    expect(peekFocusHistory()).toBeUndefined();
  });
});

describe("getFocusHistoryDepth", () => {
  it("reflects the number of entries pushed", () => {
    const btn = createFocusableButton();
    expect(getFocusHistoryDepth()).toBe(0);
    pushFocusHistory(btn);
    pushFocusHistory(btn);
    expect(getFocusHistoryDepth()).toBe(2);
  });
});

describe("clearFocusHistory", () => {
  it("empties the stack", () => {
    const btn = createFocusableButton();
    pushFocusHistory(btn);
    pushFocusHistory(btn);
    clearFocusHistory();
    expect(getFocusHistoryDepth()).toBe(0);
    expect(peekFocusHistory()).toBeUndefined();
  });
});

describe("entry timestamp", () => {
  it("records a numeric timestamp on push", () => {
    const btn = createFocusableButton();
    const before = Date.now();
    pushFocusHistory(btn);
    const after = Date.now();
    const entry = peekFocusHistory();
    expect(entry?.timestamp).toBeGreaterThanOrEqual(before);
    expect(entry?.timestamp).toBeLessThanOrEqual(after);
  });
});
