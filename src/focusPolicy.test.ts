import { createFocusPolicyManager, FocusPolicy } from "./focusPolicy";

describe("createFocusPolicyManager", () => {
  it("defaults to wrap policy", () => {
    const mgr = createFocusPolicyManager();
    expect(mgr.getPolicy().type).toBe("wrap");
    expect(mgr.isWrap()).toBe(true);
    expect(mgr.isClamp()).toBe(false);
    expect(mgr.isEscape()).toBe(false);
  });

  it("accepts an initial policy", () => {
    const mgr = createFocusPolicyManager({ type: "clamp" });
    expect(mgr.isClamp()).toBe(true);
    expect(mgr.isWrap()).toBe(false);
  });

  it("setPolicy changes the current policy", () => {
    const mgr = createFocusPolicyManager();
    mgr.setPolicy({ type: "escape", onEscape: jest.fn() });
    expect(mgr.isEscape()).toBe(true);
    expect(mgr.getPolicy().type).toBe("escape");
  });

  it("setPolicy stores onEscape callback", () => {
    const onEscape = jest.fn();
    const mgr = createFocusPolicyManager();
    mgr.setPolicy({ type: "escape", onEscape });
    expect(mgr.getPolicy().onEscape).toBe(onEscape);
  });

  it("reset restores default wrap policy", () => {
    const mgr = createFocusPolicyManager({ type: "clamp" });
    mgr.reset();
    expect(mgr.isWrap()).toBe(true);
    expect(mgr.getPolicy().type).toBe("wrap");
  });

  it("setPolicy does not mutate the original object", () => {
    const policy: FocusPolicy = { type: "clamp" };
    const mgr = createFocusPolicyManager();
    mgr.setPolicy(policy);
    policy.type = "escape";
    expect(mgr.getPolicy().type).toBe("clamp");
  });

  it("multiple managers are independent", () => {
    const a = createFocusPolicyManager();
    const b = createFocusPolicyManager({ type: "clamp" });
    a.setPolicy({ type: "escape" });
    expect(a.isEscape()).toBe(true);
    expect(b.isClamp()).toBe(true);
  });
});
