import {
  pushTrap,
  removeTrap,
  getActiveTrap,
  hasTrap,
  getTrapStackDepth,
  clearTrapStack,
  FocusTrapEntry,
} from "./focusStack";

function createEntry(id: string): FocusTrapEntry {
  const container = document.createElement("div");
  document.body.appendChild(container);
  return { id, container };
}

beforeEach(() => {
  clearTrapStack();
  document.body.innerHTML = "";
});

describe("focusStack", () => {
  it("starts empty", () => {
    expect(getTrapStackDepth()).toBe(0);
    expect(getActiveTrap()).toBeUndefined();
  });

  it("pushes entries and reports correct depth", () => {
    pushTrap(createEntry("a"));
    pushTrap(createEntry("b"));
    expect(getTrapStackDepth()).toBe(2);
  });

  it("getActiveTrap returns the most recently pushed entry", () => {
    pushTrap(createEntry("first"));
    pushTrap(createEntry("second"));
    expect(getActiveTrap()?.id).toBe("second");
  });

  it("hasTrap returns true for existing ids", () => {
    pushTrap(createEntry("modal-1"));
    expect(hasTrap("modal-1")).toBe(true);
    expect(hasTrap("modal-2")).toBe(false);
  });

  it("removeTrap removes the correct entry and returns it", () => {
    pushTrap(createEntry("x"));
    pushTrap(createEntry("y"));
    const removed = removeTrap("x");
    expect(removed?.id).toBe("x");
    expect(getTrapStackDepth()).toBe(1);
    expect(hasTrap("x")).toBe(false);
  });

  it("removeTrap returns undefined for unknown id", () => {
    pushTrap(createEntry("z"));
    expect(removeTrap("unknown")).toBeUndefined();
    expect(getTrapStackDepth()).toBe(1);
  });

  it("removing top entry exposes previous entry as active", () => {
    pushTrap(createEntry("base"));
    pushTrap(createEntry("nested"));
    removeTrap("nested");
    expect(getActiveTrap()?.id).toBe("base");
  });

  it("clearTrapStack empties the stack", () => {
    pushTrap(createEntry("a"));
    pushTrap(createEntry("b"));
    clearTrapStack();
    expect(getTrapStackDepth()).toBe(0);
    expect(getActiveTrap()).toBeUndefined();
  });
});
