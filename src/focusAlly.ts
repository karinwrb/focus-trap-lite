/**
 * focusAlly — maps ARIA roles to expected keyboard interaction patterns
 * and validates that a focus trap container meets accessibility requirements.
 */

export type AriaRole =
  | 'dialog'
  | 'alertdialog'
  | 'menu'
  | 'listbox'
  | 'tree'
  | 'grid'
  | 'tooltip';

export interface AllyReport {
  valid: boolean;
  role: AriaRole | null;
  warnings: string[];
}

const REQUIRED_ATTRS: Partial<Record<AriaRole, string[]>> = {
  dialog: ['aria-label', 'aria-labelledby'],
  alertdialog: ['aria-label', 'aria-labelledby'],
  menu: ['aria-label', 'aria-labelledby'],
  listbox: ['aria-label', 'aria-labelledby'],
};

export function getAriaRole(el: HTMLElement): AriaRole | null {
  const role = el.getAttribute('role') as AriaRole | null;
  if (!role) return null;
  const known: AriaRole[] = ['dialog', 'alertdialog', 'menu', 'listbox', 'tree', 'grid', 'tooltip'];
  return known.includes(role) ? role : null;
}

export function auditContainer(container: HTMLElement): AllyReport {
  const warnings: string[] = [];
  const role = getAriaRole(container);

  if (!role) {
    warnings.push('Container has no recognised ARIA role.');
  } else {
    const required = REQUIRED_ATTRS[role];
    if (required) {
      const hasOne = required.some((attr) => container.hasAttribute(attr));
      if (!hasOne) {
        warnings.push(
          `Role "${role}" requires one of: ${required.join(', ')}.`
        );
      }
    }
  }

  if (!container.hasAttribute('tabindex')) {
    warnings.push('Container should have tabindex="-1" to receive programmatic focus.');
  }

  return { valid: warnings.length === 0, role, warnings };
}

export interface FocusAlly {
  audit(): AllyReport;
  getRole(): AriaRole | null;
}

export function createFocusAlly(container: HTMLElement): FocusAlly {
  function audit(): AllyReport {
    return auditContainer(container);
  }

  function getRole(): AriaRole | null {
    return getAriaRole(container);
  }

  return { audit, getRole };
}
