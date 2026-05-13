import { createFocusTimeout } from "./focusTimeout";
import { createFocusTrap } from "./focusTrap";

function buildModal(): {
  container: HTMLElement;
  firstBtn: HTMLButtonElement;
  lastBtn: HTMLButtonElement;
  trigger: HTMLButtonElement;
} {
  const trigger = document.createElement("button");
  trigger.textContent = "Open";
  document.body.appendChild(trigger);

  const container = document.createElement("div");
  const firstBtn = document.createElement("button");
  firstBtn.textContent = "First";
  const lastBtn = document.createElement("button");
  lastBtn.textContent = "Last";
  container.appendChild(firstBtn);
  container.appendChild(lastBtn);
  document.body.appendChild(container);

  return { container, firstBtn, lastBtn, trigger };
}

describe("focusTimeout + focusTrap integration", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = "";
  });

  it("defers initial focus into trap until animation delay elapses", () => {
    const { container, firstBtn } = buildModal();
    const trap = createFocusTrap(container);
    const timeout = createFocusTimeout();
    const spy = jest.spyOn(firstBtn, "focus");

    trap.activate();
    timeout.schedule(firstBtn, 150);

    expect(spy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(150);
    expect(spy).toHaveBeenCalledTimes(1);

    trap.deactivate();
  });

  it("cancels deferred focus when trap is deactivated before delay", () => {
    const { container, firstBtn } = buildModal();
    const trap = createFocusTrap(container);
    const timeout = createFocusTimeout();
    const spy = jest.spyOn(firstBtn, "focus");

    trap.activate();
    const handle = timeout.schedule(firstBtn, 300);

    trap.deactivate();
    handle.cancel();

    jest.advanceTimersByTime(300);
    expect(spy).not.toHaveBeenCalled();
  });

  it("schedules focus restore via callback after trap deactivation", () => {
    const { container, trigger } = buildModal();
    const trap = createFocusTrap(container);
    const timeout = createFocusTimeout();
    const spy = jest.spyOn(trigger, "focus");

    trap.activate();
    trap.deactivate();

    timeout.schedule(() => trigger.focus(), 100);
    jest.advanceTimersByTime(100);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
