import { createFocusTabOrder } from './focusTabOrder';

function buildContainer(): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = `
    <button id="a">A</button>
    <input id="b" type="text" />
    <button id="c" disabled>C</button>
    <a id="d" href="#">D</a>
    <span id="e" tabindex="-1">E</span>
    <button id="f">F</button>
  `;
  document.body.appendChild(div);
  return div;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusTabOrder', () => {
  it('returns tabbable elements excluding disabled and tabindex=-1', () => {
    const container = buildContainer();
    const order = createFocusTabOrder(container);
    const ids = order.getElements().map((el) => el.id);
    expect(ids).toEqual(['a', 'b', 'd', 'f']);
  });

  it('indexOf returns correct index', () => {
    const container = buildContainer();
    const order = createFocusTabOrder(container);
    const els = order.getElements();
    expect(order.indexOf(els[0])).toBe(0);
    expect(order.indexOf(els[2])).toBe(2);
  });

  it('indexOf returns -1 for unknown element', () => {
    const container = buildContainer();
    const order = createFocusTabOrder(container);
    const unknown = document.createElement('button');
    expect(order.indexOf(unknown)).toBe(-1);
  });

  it('getNext returns the next element', () => {
    const container = buildContainer();
    const order = createFocusTabOrder(container);
    const els = order.getElements();
    expect(order.getNext(els[0])).toBe(els[1]);
  });

  it('getNext returns null for last element', () => {
    const container = buildContainer();
    const order = createFocusTabOrder(container);
    const els = order.getElements();
    expect(order.getNext(els[els.length - 1])).toBeNull();
  });

  it('getPrev returns the previous element', () => {
    const container = buildContainer();
    const order = createFocusTabOrder(container);
    const els = order.getElements();
    expect(order.getPrev(els[2])).toBe(els[1]);
  });

  it('getPrev returns null for first element', () => {
    const container = buildContainer();
    const order = createFocusTabOrder(container);
    const els = order.getElements();
    expect(order.getPrev(els[0])).toBeNull();
  });

  it('getFirst and getLast return boundary elements', () => {
    const container = buildContainer();
    const order = createFocusTabOrder(container);
    const els = order.getElements();
    expect(order.getFirst()).toBe(els[0]);
    expect(order.getLast()).toBe(els[els.length - 1]);
  });

  it('refresh picks up newly added elements', () => {
    const container = buildContainer();
    const order = createFocusTabOrder(container);
    const before = order.getElements().length;
    const btn = document.createElement('button');
    btn.id = 'g';
    container.appendChild(btn);
    order.refresh();
    expect(order.getElements().length).toBe(before + 1);
  });
});
