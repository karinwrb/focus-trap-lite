import { createFocusKeyMap, buildDefaultKeyMap } from "./focusKeyMap";

function makeKeyboardEvent(key: string): KeyboardEvent {
  return new KeyboardEvent("keydown", { key, bubbles: true });
}

describe("createFocusKeyMap", () => {
  it("handles a registered key and returns true", () => {
    const km = createFocusKeyMap();
    const handler = jest.fn();
    km.register("Escape", handler);
    const event = makeKeyboardEvent("Escape");
    const result = km.handle(event);
    expect(result).toBe(true);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it("returns false for unregistered key", () => {
    const km = createFocusKeyMap();
    const result = km.handle(makeKeyboardEvent("Enter"));
    expect(result).toBe(false);
  });

  it("unregisters a key", () => {
    const km = createFocusKeyMap();
    const handler = jest.fn();
    km.register("Tab", handler);
    km.unregister("Tab");
    const result = km.handle(makeKeyboardEvent("Tab"));
    expect(result).toBe(false);
    expect(handler).not.toHaveBeenCalled();
  });

  it("getKeys returns all registered keys", () => {
    const km = createFocusKeyMap();
    km.register("Escape", jest.fn());
    km.register("Tab", jest.fn());
    expect(km.getKeys().sort()).toEqual(["Escape", "Tab"]);
  });

  it("clear removes all keys", () => {
    const km = createFocusKeyMap();
    km.register("Escape", jest.fn());
    km.register("Tab", jest.fn());
    km.clear();
    expect(km.getKeys()).toHaveLength(0);
  });

  it("accepts initial key map", () => {
    const handler = jest.fn();
    const km = createFocusKeyMap({ ArrowDown: handler });
    const event = makeKeyboardEvent("ArrowDown");
    km.handle(event);
    expect(handler).toHaveBeenCalledWith(event);
  });
});

describe("buildDefaultKeyMap", () => {
  it("includes Escape when provided", () => {
    const onEscape = jest.fn();
    const map = buildDefaultKeyMap(onEscape);
    expect(map["Escape"]).toBe(onEscape);
  });

  it("includes Tab when provided", () => {
    const onTab = jest.fn();
    const map = buildDefaultKeyMap(undefined, onTab);
    expect(map["Tab"]).toBe(onTab);
  });

  it("returns empty map when no handlers provided", () => {
    const map = buildDefaultKeyMap();
    expect(Object.keys(map)).toHaveLength(0);
  });
});
