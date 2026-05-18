/**
 * Integration: FocusMatrix + FocusMatrixManager inside a modal-like container.
 */
import { createFocusMatrixManager } from './focusMatrixManager';

function buildModal(): { modal: HTMLElement; cells: HTMLElement[] } {
  const modal = document.createElement('div');
  modal.setAttribute('role', 'dialog');

  const grid = document.createElement('div');
  grid.setAttribute('role', 'grid');

  const cells: HTMLElement[] = [];
  for (let r = 0; r < 2; r++) {
    const row = document.createElement('div');
    row.setAttribute('role', 'row');
    for (let c = 0; c < 3; c++) {
      const cell = document.createElement('div');
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('tabindex', '0');
      row.appendChild(cell);
      cells.push(cell);
    }
    grid.appendChild(row);
  }

  modal.appendChild(grid);
  document.body.appendChild(modal);
  return { modal, cells };
}

function fire(el: HTMLElement, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FocusMatrixManager integration', () => {
  it('creates and retrieves a matrix for a container', () => {
    const manager = createFocusMatrixManager();
    const { modal } = buildModal();
    const grid = modal.querySelector<HTMLElement>('[role="grid"]')!;
    const m1 = manager.getOrCreate(grid);
    const m2 = manager.getOrCreate(grid);
    expect(m1).toBe(m2);
    expect(manager.getSize()).toBe(1);
    manager.dropAll();
  });

  it('navigates cells across two separate grids independently', () => {
    const manager = createFocusMatrixManager();
    const { modal: modal1, cells: cells1 } = buildModal();
    const { modal: modal2, cells: cells2 } = buildModal();
    const grid1 = modal1.querySelector<HTMLElement>('[role="grid"]')!;
    const grid2 = modal2.querySelector<HTMLElement>('[role="grid"]')!;

    manager.getOrCreate(grid1);
    manager.getOrCreate(grid2);

    cells1[0].focus();
    fire(grid1, 'ArrowRight');
    expect(document.activeElement).toBe(cells1[1]);

    cells2[3].focus();
    fire(grid2, 'ArrowRight');
    expect(document.activeElement).toBe(cells2[4]);

    manager.dropAll();
  });

  it('drop detaches a single matrix without affecting others', () => {
    const manager = createFocusMatrixManager();
    const { modal: modal1, cells: cells1 } = buildModal();
    const { modal: modal2, cells: cells2 } = buildModal();
    const grid1 = modal1.querySelector<HTMLElement>('[role="grid"]')!;
    const grid2 = modal2.querySelector<HTMLElement>('[role="grid"]')!;

    manager.getOrCreate(grid1);
    manager.getOrCreate(grid2);
    manager.drop(grid1);

    expect(manager.getSize()).toBe(1);
    expect(manager.get(grid1)).toBeUndefined();

    // grid2 still works
    cells2[0].focus();
    fire(grid2, 'ArrowDown');
    expect(document.activeElement).toBe(cells2[3]);

    manager.dropAll();
  });

  it('dropAll removes all matrices', () => {
    const manager = createFocusMatrixManager();
    const { modal } = buildModal();
    const grid = modal.querySelector<HTMLElement>('[role="grid"]')!;
    manager.getOrCreate(grid);
    manager.dropAll();
    expect(manager.getSize()).toBe(0);
  });
});
