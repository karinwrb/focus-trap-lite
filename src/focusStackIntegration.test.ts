/**
 * Integration test: nested focus traps using focusStack + createFocusTrap.
 * Verifies that activating a second trap pauses the first and that
 * deactivating it restores the previous trap as active.
 */
import { clearTrapStack, getActiveTrap, getTrapStackDepth } from "./focusStack";
import { createFocusTrap } from "./focusTrap";

function buildModal(id: string): HTMLElement {
  const modal = document.createElement("div");
  modal.id = id;
  const btn1 = document.createElement("button");
  btn1.textContent = "First";
  const btn2 = document.createElement("button");
  btn2.textContent = "Second";
  modal.appendChild(btn1);
  modal.appendChild(btn2);
  document.body.appendChild(modal);
  return modal;
}

beforeEach(() => {
  clearTrapStack();
  document.body.innerHTML = "";
});

describe("nested focus trap integration", () => {
  it("activating two traps results in stack depth of 2", () => {
    const modal1 = buildModal("modal-1");
    const modal2 = buildModal("modal-2");

    const trap1 = createFocusTrap(modal1);
    const trap2 = createFocusTrap(modal2);

    trap1.activate();
    trap2.activate();

    expect(getTrapStackDepth()).toBe(2);
  });

  it("deactivating inner trap reduces stack depth to 1", () => {
    const modal1 = buildModal("modal-a");
    const modal2 = buildModal("modal-b");

    const trap1 = createFocusTrap(modal1);
    const trap2 = createFocusTrap(modal2);

    trap1.activate();
    trap2.activate();
    trap2.deactivate();

    expect(getTrapStackDepth()).toBe(1);
  });

  it("active trap after deactivating nested one is the outer trap", () => {
    const modal1 = buildModal("outer");
    const modal2 = buildModal("inner");

    const trap1 = createFocusTrap(modal1);
    const trap2 = createFocusTrap(modal2);

    trap1.activate();
    trap2.activate();
    trap2.deactivate();

    expect(getActiveTrap()?.container).toBe(modal1);
  });

  it("stack is empty after all traps are deactivated", () => {
    const modal = buildModal("solo");
    const trap = createFocusTrap(modal);

    trap.activate();
    trap.deactivate();

    expect(getTrapStackDepth()).toBe(0);
    expect(getActiveTrap()).toBeUndefined();
  });
});
