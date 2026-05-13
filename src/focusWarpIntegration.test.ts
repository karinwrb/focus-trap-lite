import { createFocusTrap } from "./focusTrap";
import { createFocusWarp } from "./focusWarp";

function buildModal() {
  const overlay = document.createElement("div");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");

  const heading = document.createElement("h2");
  heading.textContent = "Modal Title";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Type here";

  const confirmBtn = document.createElement("button");
  confirmBtn.textContent = "Confirm";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";

  overlay.append(heading, input, confirmBtn, cancelBtn);
  document.body.appendChild(overlay);

  return { overlay, input, confirmBtn, cancelBtn };
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("focusWarp + focusTrap integration", () => {
  it("warpToFirst inside an active trap focuses the first element", () => {
    const { overlay, input } = buildModal();
    const trap = createFocusTrap(overlay);
    trap.activate();

    const warp = createFocusWarp(overlay);
    const result = warp.warpToFirst();

    expect(result.success).toBe(true);
    expect(result.current).toBe(input);

    trap.deactivate();
  });

  it("warpToLast inside an active trap focuses the last element", () => {
    const { overlay, cancelBtn } = buildModal();
    const trap = createFocusTrap(overlay);
    trap.activate();

    const warp = createFocusWarp(overlay);
    const result = warp.warpToLast();

    expect(result.success).toBe(true);
    expect(result.current).toBe(cancelBtn);

    trap.deactivate();
  });

  it("warpTo a specific button inside an active trap succeeds", () => {
    const { overlay, confirmBtn } = buildModal();
    const trap = createFocusTrap(overlay);
    trap.activate();

    const warp = createFocusWarp(overlay);
    const result = warp.warpTo(confirmBtn);

    expect(result.success).toBe(true);
    expect(document.activeElement).toBe(confirmBtn);

    trap.deactivate();
  });

  it("warpTo an element outside the trap container returns failure", () => {
    const { overlay } = buildModal();
    const externalBtn = document.createElement("button");
    externalBtn.textContent = "Outside";
    document.body.appendChild(externalBtn);

    const trap = createFocusTrap(overlay);
    trap.activate();

    const warp = createFocusWarp(overlay);
    const result = warp.warpTo(externalBtn);

    expect(result.success).toBe(false);

    trap.deactivate();
  });
});
