import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isScrolledIntoView,
  scrollIntoViewIfNeeded,
  createFocusScrollHandler,
} from "./focusScroll";

function mockRect(overrides: Partial<DOMRect>): DOMRect {
  return {
    top: 0,
    left: 0,
    bottom: 100,
    right: 100,
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...overrides,
  } as DOMRect;
}

describe("isScrolledIntoView", () => {
  it("returns true when element is fully within container", () => {
    const el = { getBoundingClientRect: () => mockRect({ top: 10, bottom: 50, left: 10, right: 50 }) } as Element;
    const container = { getBoundingClientRect: () => mockRect({ top: 0, bottom: 100, left: 0, right: 100 }) } as Element;
    expect(isScrolledIntoView(el, container)).toBe(true);
  });

  it("returns false when element overflows bottom of container", () => {
    const el = { getBoundingClientRect: () => mockRect({ top: 80, bottom: 120, left: 0, right: 100 }) } as Element;
    const container = { getBoundingClientRect: () => mockRect({ top: 0, bottom: 100, left: 0, right: 100 }) } as Element;
    expect(isScrolledIntoView(el, container)).toBe(false);
  });

  it("returns false when element overflows top of container", () => {
    const el = { getBoundingClientRect: () => mockRect({ top: -10, bottom: 50, left: 0, right: 100 }) } as Element;
    const container = { getBoundingClientRect: () => mockRect({ top: 0, bottom: 100, left: 0, right: 100 }) } as Element;
    expect(isScrolledIntoView(el, container)).toBe(false);
  });
});

describe("scrollIntoViewIfNeeded", () => {
  it("calls scrollIntoView when element is not visible", () => {
    const scrollIntoView = vi.fn();
    const el = {
      getBoundingClientRect: () => mockRect({ top: 200, bottom: 300 }),
      scrollIntoView,
    } as unknown as Element;
    const container = { getBoundingClientRect: () => mockRect({ top: 0, bottom: 100 }) } as Element;
    scrollIntoViewIfNeeded(el, container);
    expect(scrollIntoView).toHaveBeenCalledOnce();
  });

  it("does not call scrollIntoView when element is already visible", () => {
    const scrollIntoView = vi.fn();
    const el = {
      getBoundingClientRect: () => mockRect({ top: 10, bottom: 50, left: 10, right: 50 }),
      scrollIntoView,
    } as unknown as Element;
    const container = { getBoundingClientRect: () => mockRect({ top: 0, bottom: 100, left: 0, right: 100 }) } as Element;
    scrollIntoViewIfNeeded(el, container);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});

describe("createFocusScrollHandler", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  it("attaches and detaches focusin listener", () => {
    const addSpy = vi.spyOn(container, "addEventListener");
    const removeSpy = vi.spyOn(container, "removeEventListener");
    const handler = createFocusScrollHandler(container);
    handler.attach(container);
    expect(addSpy).toHaveBeenCalledWith("focusin", handler.handleFocus, true);
    handler.detach(container);
    expect(removeSpy).toHaveBeenCalledWith("focusin", handler.handleFocus, true);
  });

  it("scrolls element into view on focusin if needed", () => {
    const button = document.createElement("button");
    const scrollIntoView = vi.fn();
    button.scrollIntoView = scrollIntoView;
    container.appendChild(button);

    vi.spyOn(button, "getBoundingClientRect").mockReturnValue(mockRect({ top: 200, bottom: 300, left: 0, right: 100 }));
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue(mockRect({ top: 0, bottom: 100, left: 0, right: 100 }));

    const handler = createFocusScrollHandler(container);
    const event = new FocusEvent("focusin", { bubbles: true });
    Object.defineProperty(event, "target", { value: button });
    handler.handleFocus(event);
    expect(scrollIntoView).toHaveBeenCalledOnce();
  });
});
