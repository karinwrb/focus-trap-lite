import { createFocusTimeout } from "./focusTimeout";

function createFocusableButton(label = "btn"): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.textContent = label;
  document.body.appendChild(btn);
  return btn;
}

describe("createFocusTimeout", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = "";
  });

  it("focuses an element after the given delay", () => {
    const timeout = createFocusTimeout();
    const btn = createFocusableButton();
    const spy = jest.spyOn(btn, "focus");

    timeout.schedule(btn, 100);
    expect(spy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("calls a callback function when target is a function", () => {
    const timeout = createFocusTimeout();
    const cb = jest.fn();

    timeout.schedule(cb, 50);
    jest.advanceTimersByTime(50);

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("cancel() prevents focus from being applied", () => {
    const timeout = createFocusTimeout();
    const btn = createFocusableButton();
    const spy = jest.spyOn(btn, "focus");

    const handle = timeout.schedule(btn, 200);
    handle.cancel();
    jest.advanceTimersByTime(200);

    expect(spy).not.toHaveBeenCalled();
  });

  it("isPending() reflects current state correctly", () => {
    const timeout = createFocusTimeout();
    const btn = createFocusableButton();

    const handle = timeout.schedule(btn, 100);
    expect(handle.isPending()).toBe(true);

    jest.advanceTimersByTime(100);
    expect(handle.isPending()).toBe(false);
  });

  it("getPendingCount() tracks active handles", () => {
    const timeout = createFocusTimeout();
    const btn = createFocusableButton();

    timeout.schedule(btn, 100);
    timeout.schedule(btn, 200);
    expect(timeout.getPendingCount()).toBe(2);

    jest.advanceTimersByTime(100);
    expect(timeout.getPendingCount()).toBe(1);

    jest.advanceTimersByTime(100);
    expect(timeout.getPendingCount()).toBe(0);
  });

  it("cancelAll() clears all pending handles", () => {
    const timeout = createFocusTimeout();
    const cb1 = jest.fn();
    const cb2 = jest.fn();

    timeout.schedule(cb1, 50);
    timeout.schedule(cb2, 150);
    expect(timeout.getPendingCount()).toBe(2);

    timeout.cancelAll();
    jest.runAllTimers();

    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).not.toHaveBeenCalled();
    expect(timeout.getPendingCount()).toBe(0);
  });

  it("cancel() is idempotent", () => {
    const timeout = createFocusTimeout();
    const btn = createFocusableButton();
    const spy = jest.spyOn(btn, "focus");

    const handle = timeout.schedule(btn, 100);
    handle.cancel();
    handle.cancel();
    jest.advanceTimersByTime(100);

    expect(spy).not.toHaveBeenCalled();
    expect(timeout.getPendingCount()).toBe(0);
  });
});
