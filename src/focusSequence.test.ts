import { createFocusSequence } from './focusSequence';
import { createFocusSequenceManager } from './focusSequenceManager';

function makeButton(label: string): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.focus = jest.fn();
  document.body.appendChild(btn);
  return btn;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusSequence', () => {
  it('starts with no current element', () => {
    const seq = createFocusSequence();
    expect(seq.current()).toBeNull();
    expect(seq.getIndex()).toBe(-1);
  });

  it('adds elements and navigates forward', () => {
    const a = makeButton('A');
    const b = makeButton('B');
    const seq = createFocusSequence([a, b]);
    const first = seq.next();
    expect(first).toBe(a);
    expect(a.focus).toHaveBeenCalled();
    const second = seq.next();
    expect(second).toBe(b);
  });

  it('wraps around on next', () => {
    const a = makeButton('A');
    const b = makeButton('B');
    const seq = createFocusSequence([a, b]);
    seq.next(); // a
    seq.next(); // b
    const wrapped = seq.next(); // back to a
    expect(wrapped).toBe(a);
  });

  it('navigates backward', () => {
    const a = makeButton('A');
    const b = makeButton('B');
    const seq = createFocusSequence([a, b]);
    seq.next(); // a (index 0)
    const result = seq.prev(); // wraps to b (index 1)
    expect(result).toBe(b);
  });

  it('removes an element and adjusts index', () => {
    const a = makeButton('A');
    const b = makeButton('B');
    const c = makeButton('C');
    const seq = createFocusSequence([a, b, c]);
    seq.next(); // a
    seq.next(); // b
    seq.remove(c);
    expect(seq.getAll()).toEqual([a, b]);
  });

  it('reset sets index to -1', () => {
    const a = makeButton('A');
    const seq = createFocusSequence([a]);
    seq.next();
    seq.reset();
    expect(seq.getIndex()).toBe(-1);
    expect(seq.current()).toBeNull();
  });

  it('setIndex focuses the element at given index', () => {
    const a = makeButton('A');
    const b = makeButton('B');
    const seq = createFocusSequence([a, b]);
    const ok = seq.setIndex(1);
    expect(ok).toBe(true);
    expect(b.focus).toHaveBeenCalled();
    expect(seq.current()).toBe(b);
  });

  it('setIndex returns false for out-of-range index', () => {
    const seq = createFocusSequence();
    expect(seq.setIndex(0)).toBe(false);
  });
});

describe('createFocusSequenceManager', () => {
  it('creates and retrieves sequences by id', () => {
    const mgr = createFocusSequenceManager();
    const seq = mgr.getOrCreate('modal');
    expect(mgr.get('modal')).toBe(seq);
  });

  it('returns the same instance on repeated getOrCreate', () => {
    const mgr = createFocusSequenceManager();
    const s1 = mgr.getOrCreate('a');
    const s2 = mgr.getOrCreate('a');
    expect(s1).toBe(s2);
  });

  it('drops a sequence by id', () => {
    const mgr = createFocusSequenceManager();
    mgr.getOrCreate('x');
    mgr.drop('x');
    expect(mgr.get('x')).toBeUndefined();
  });

  it('dropAll removes all sequences', () => {
    const mgr = createFocusSequenceManager();
    mgr.getOrCreate('a');
    mgr.getOrCreate('b');
    mgr.dropAll();
    expect(mgr.getIds()).toEqual([]);
  });

  it('getIds returns all registered ids', () => {
    const mgr = createFocusSequenceManager();
    mgr.getOrCreate('foo');
    mgr.getOrCreate('bar');
    expect(mgr.getIds().sort()).toEqual(['bar', 'foo']);
  });
});
