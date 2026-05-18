import { createFocusMatrix } from './focusMatrix';

function buildGrid(rows: number, cols: number): HTMLElement {
  const container = document.createElement('div');
  container.setAttribute('role', 'grid');
  for (let r = 0; r < rows; r++) {
    const row = document.createElement('div');
    row.setAttribute('role', 'row');
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('tabindex', '0');
      cell.dataset.pos = `${r},${c}`;
      row.appendChild(cell);
    }
    container.appendChild(row);
  }
  document.body.appendChild(container);
  return container;
}

function fireArrow(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusMatrix', () => {
  it('getCell returns correct element', () => {
    const container = buildGrid(3, 3);
    const matrix = createFocusMatrix(container);
    matrix.attach();
    const cell = matrix.getCell(1, 2);
    expect(cell?.dataset.pos).toBe('1,2');
    matrix.detach();
  });

  it('getPosition returns row and col for element', () => {
    const container = buildGrid(2, 2);
    const matrix = createFocusMatrix(container);
    matrix.attach();
    const cell = matrix.getCell(0, 1)!;
    expect(matrix.getPosition(cell)).toEqual({ row: 0, col: 1 });
    matrix.detach();
  });

  it('ArrowRight moves focus to next cell', () => {
    const container = buildGrid(2, 3);
    const matrix = createFocusMatrix(container);
    matrix.attach();
    const start = matrix.getCell(0, 0)!;
    start.focus();
    fireArrow(container, 'ArrowRight');
    expect(document.activeElement).toBe(matrix.getCell(0, 1));
    matrix.detach();
  });

  it('ArrowDown moves focus to next row', () => {
    const container = buildGrid(3, 2);
    const matrix = createFocusMatrix(container);
    matrix.attach();
    matrix.getCell(0, 0)!.focus();
    fireArrow(container, 'ArrowDown');
    expect(document.activeElement).toBe(matrix.getCell(1, 0));
    matrix.detach();
  });

  it('clamps at boundary when wrap is false', () => {
    const container = buildGrid(2, 2);
    const matrix = createFocusMatrix(container, { wrap: false });
    matrix.attach();
    matrix.getCell(0, 0)!.focus();
    fireArrow(container, 'ArrowUp');
    expect(document.activeElement).toBe(matrix.getCell(0, 0));
    matrix.detach();
  });

  it('wraps around when wrap is true', () => {
    const container = buildGrid(3, 2);
    const matrix = createFocusMatrix(container, { wrap: true });
    matrix.attach();
    matrix.getCell(2, 0)!.focus();
    fireArrow(container, 'ArrowDown');
    expect(document.activeElement).toBe(matrix.getCell(0, 0));
    matrix.detach();
  });

  it('refresh picks up newly added cells', () => {
    const container = buildGrid(1, 1);
    const matrix = createFocusMatrix(container);
    matrix.attach();
    const row = container.querySelector('[role="row"]')!;
    const newCell = document.createElement('div');
    newCell.setAttribute('role', 'gridcell');
    newCell.setAttribute('tabindex', '0');
    row.appendChild(newCell);
    matrix.refresh();
    expect(matrix.getCell(0, 1)).toBe(newCell);
    matrix.detach();
  });
});
