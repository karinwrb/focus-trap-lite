import { warpFocus, createFocusWarp } from "./focusWarp";

function createContainer() {
  const container = document.createElement("div");
  const btn1 = document.createElement("button");
  btn1.textContent = "First";
  const btn2 = document.createElement("button");
  btn2.textContent = "Second";
  const btn3 = document.createElement("button");
  btn3.textContent = "Third";
  container.append(btn1, btn2, btn3);
  document.body.appendChild(container);
  return { container, btn1, btn2, btn3 };
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("warpFocus", () => {
  it("focuses the target element and returns success", () => {
    const { btn1 } = createContainer();
    const result = warpFocus(btn1);
    expect(result.success).toBe(true);
    expect(result.current).toBe(btn1);
  });

  it("returns failure for a non-focusable target", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const result = warpFocus(div as HTMLElement);
    expect(result.success).toBe(false);
  });

  it("records the previous active element", () => {
    const { btn1, btn2 } = createContainer();
    btn1.focus();
    const result = warpFocus(btn2);
    expect(result.previous).toBe(btn1);
    expect(result.current).toBe(btn2);
  });
});

describe("createFocusWarp", () => {
  it("warpToFirst focuses the first tabbable element", () => {
    const { container, btn1 } = createContainer();
    const warp = createFocusWarp(container);
    const result = warp.warpToFirst();
    expect(result.success).toBe(true);
    expect(result.current).toBe(btn1);
  });

  it("warpToLast focuses the last tabbable element", () => {
    const { container, btn3 } = createContainer();
    const warp = createFocusWarp(container);
    const result = warp.warpToLast();
    expect(result.success).toBe(true);
    expect(result.current).toBe(btn3);
  });

  it("warpTo focuses a specific element inside the container", () => {
    const { container, btn2 } = createContainer();
    const warp = createFocusWarp(container);
    const result = warp.warpTo(btn2);
    expect(result.success).toBe(true);
    expect(result.current).toBe(btn2);
  });

  it("warpTo returns failure for an element outside the container", () => {
    const { container } = createContainer();
    const outside = document.createElement("button");
    document.body.appendChild(outside);
    const warp = createFocusWarp(container);
    const result = warp.warpTo(outside);
    expect(result.success).toBe(false);
  });

  it("warpToFirst returns failure when container has no tabbable elements", () => {
    const empty = document.createElement("div");
    document.body.appendChild(empty);
    const warp = createFocusWarp(empty);
    const result = warp.warpToFirst();
    expect(result.success).toBe(false);
  });
});
