/**
 * focusHistoryIntegration.test.ts
 * Integration tests: FocusHistoryManager used alongside a modal-like container.
 */

import { createFocusHistoryManager } from "./focusHistoryManager";
import { clearFocusHistory } from "./focusHistory";

function buildModal(): {
  trigger: HTMLButtonElement;
  modal: HTMLDivElement;
  closeBtn: HTMLButtonElement;
  cleanup: () => void;
} {
  const trigger = document.createElement("button");
  trigger.textContent = "Open Modal";

  const modal = document.createElement("div");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  modal.appendChild(closeBtn);

  document.body.appendChild(trigger);
  document.body.appendChild(modal);

  return {
    trigger,
    modal,
    closeBtn,
    cleanup: () => {
      document.body.removeChild(trigger);
      document.body.removeChild(modal);
    },
  };
}

beforeEach(() => {
  clearFocusHistory();
  document.body.innerHTML = "";
});

describe("FocusHistoryManager integration", () => {
  it("saves trigger focus before opening modal and restores on close", () => {
    const { trigger, closeBtn, cleanup } = buildModal();
    const manager = createFocusHistoryManager();

    trigger.focus();
    manager.record();

    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);

    manager.restoreLast();
    expect(document.activeElement).toBe(trigger);

    cleanup();
  });

  it("handles nested modals with independent history entries", () => {
    const { trigger, closeBtn, cleanup: c1 } = buildModal();
    const { closeBtn: innerClose, cleanup: c2 } = buildModal();
    const manager = createFocusHistoryManager();

    trigger.focus();
    manager.record(); // depth 1

    closeBtn.focus();
    manager.record(); // depth 2

    innerClose.focus();
    expect(manager.depth()).toBe(2);

    manager.restoreLast();
    expect(document.activeElement).toBe(closeBtn);

    manager.restoreLast();
    expect(document.activeElement).toBe(trigger);

    c1();
    c2();
  });

  it("peek does not mutate the stack", () => {
    const { trigger, cleanup } = buildModal();
    const manager = createFocusHistoryManager();

    trigger.focus();
    manager.record();

    const first = manager.peek();
    const second = manager.peek();
    expect(first).toBe(second);
    expect(manager.depth()).toBe(1);

    cleanup();
  });
});
