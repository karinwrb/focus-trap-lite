/**
 * focusMatrix — 2-D spatial focus navigation for grid/table-like layouts.
 * Tracks focusable elements in a row×col matrix and moves focus
 * with arrow keys respecting grid boundaries.
 */

export interface FocusMatrixOptions {
  rowSelector?: string;
  cellSelector?: string;
  wrap?: boolean;
}

export interface FocusMatrix {
  attach: () => void;
  detach: () => void;
  refresh: () => void;
  getCell: (row: number, col: number) => HTMLElement | null;
  getPosition: (el: HTMLElement) => { row: number; col: number } | null;
}

const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export function createFocusMatrix(
  container: HTMLElement,
  options: FocusMatrixOptions = {}
): FocusMatrix {
  const {
    rowSelector = '[role="row"]',
    cellSelector = '[role="gridcell"],[role="columnheader"],[role="rowheader"]',
    wrap = false,
  } = options;

  let grid: HTMLElement[][] = [];

  function refresh(): void {
    const rows = Array.from(container.querySelectorAll<HTMLElement>(rowSelector));
    grid = rows.map((row) =>
      Array.from(row.querySelectorAll<HTMLElement>(cellSelector))
    );
  }

  function getCell(row: number, col: number): HTMLElement | null {
    return grid[row]?.[col] ?? null;
  }

  function getPosition(el: HTMLElement): { row: number; col: number } | null {
    for (let r = 0; r < grid.length; r++) {
      const c = grid[r].indexOf(el);
      if (c !== -1) return { row: r, col: c };
    }
    return null;
  }

  function clamp(value: number, max: number): number {
    if (wrap) return (value + max) % max;
    return Math.max(0, Math.min(max - 1, value));
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (!ARROW_KEYS.includes(event.key)) return;
    const active = document.activeElement as HTMLElement;
    const pos = getPosition(active);
    if (!pos) return;

    event.preventDefault();
    let { row, col } = pos;

    if (event.key === 'ArrowUp') row = clamp(row - 1, grid.length);
    else if (event.key === 'ArrowDown') row = clamp(row + 1, grid.length);
    else if (event.key === 'ArrowLeft') col = clamp(col - 1, grid[row].length);
    else if (event.key === 'ArrowRight') col = clamp(col + 1, grid[row].length);

    getCell(row, col)?.focus();
  }

  function attach(): void {
    refresh();
    container.addEventListener('keydown', handleKeyDown);
  }

  function detach(): void {
    container.removeEventListener('keydown', handleKeyDown);
  }

  return { attach, detach, refresh, getCell, getPosition };
}
