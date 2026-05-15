/**
 * focusPolicy.ts
 * Defines and manages focus policies that control focus behavior rules
 * across the trap (e.g., wrap, clamp, or escape on Tab).
 */

export type FocusPolicyType = "wrap" | "clamp" | "escape";

export interface FocusPolicy {
  type: FocusPolicyType;
  onEscape?: () => void;
}

export interface FocusPolicyManager {
  setPolicy(policy: FocusPolicy): void;
  getPolicy(): FocusPolicy;
  isWrap(): boolean;
  isClamp(): boolean;
  isEscape(): boolean;
  reset(): void;
}

const DEFAULT_POLICY: FocusPolicy = { type: "wrap" };

export function createFocusPolicyManager(
  initial?: FocusPolicy
): FocusPolicyManager {
  let current: FocusPolicy = initial ?? { ...DEFAULT_POLICY };

  function setPolicy(policy: FocusPolicy): void {
    current = { ...policy };
  }

  function getPolicy(): FocusPolicy {
    return current;
  }

  function isWrap(): boolean {
    return current.type === "wrap";
  }

  function isClamp(): boolean {
    return current.type === "clamp";
  }

  function isEscape(): boolean {
    return current.type === "escape";
  }

  function reset(): void {
    current = { ...DEFAULT_POLICY };
  }

  return { setPolicy, getPolicy, isWrap, isClamp, isEscape, reset };
}
