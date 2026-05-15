import { createFocusBoundaryManager } from "./focusBoundaryManager";

function makeEl(): HTMLElement {
  const div = document.createElement("div");
  const btn = document.createElement("button");
  btn.textContent = "btn";
  div.appendChild(btn);
  document.body.appendChild(div);
  return div;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("createFocusBoundaryManager", () => {
  it("starts with depth 0 and no current boundary", () => {
    const mgr = createFocusBoundaryManager();
    expect(mgr.getDepth()).toBe(0);
    expect(mgr.getCurrent()).toBeUndefined();
  });

  it("push increases depth and attaches boundary", () => {
    const mgr = createFocusBoundaryManager();
    const el = makeEl();
    const boundary = mgr.push(el);
    expect(mgr.getDepth()).toBe(1);
    expect(boundary.isAttached()).toBe(true);
  });

  it("getCurrent returns the most recently pushed boundary", () => {
    const mgr = createFocusBoundaryManager();
    const el1 = makeEl();
    const el2 = makeEl();
    mgr.push(el1);
    const b2 = mgr.push(el2);
    expect(mgr.getCurrent()).toBe(b2);
  });

  it("only the topmost boundary is attached when multiple are pushed", () => {
    const mgr = createFocusBoundaryManager();
    const el1 = makeEl();
    const el2 = makeEl();
    const b1 = mgr.push(el1);
    const b2 = mgr.push(el2);
    expect(b1.isAttached()).toBe(false);
    expect(b2.isAttached()).toBe(true);
  });

  it("pop removes top boundary and reactivates previous one", () => {
    const mgr = createFocusBoundaryManager();
    const el1 = makeEl();
    const el2 = makeEl();
    const b1 = mgr.push(el1);
    mgr.push(el2);
    mgr.pop();
    expect(mgr.getDepth()).toBe(1);
    expect(b1.isAttached()).toBe(true);
  });

  it("pop on empty stack returns undefined", () => {
    const mgr = createFocusBoundaryManager();
    expect(mgr.pop()).toBeUndefined();
  });

  it("clear removes all boundaries", () => {
    const mgr = createFocusBoundaryManager();
    mgr.push(makeEl());
    mgr.push(makeEl());
    mgr.push(makeEl());
    mgr.clear();
    expect(mgr.getDepth()).toBe(0);
    expect(mgr.getCurrent()).toBeUndefined();
  });
});
