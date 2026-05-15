import { createFocusAutoFocus } from './focusAutoFocus';

function buildContainer(): HTMLElement {
  const div = document.createElement('div');
  const btn1 = document.createElement('button');
  btn1.textContent = 'First';
  const btn2 = document.createElement('button');
  btn2.textContent = 'Second';
  btn2.setAttribute('data-autofocus', '');
  const btn3 = document.createElement('button');
  btn3.textContent = 'Third';
  div.append(btn1, btn2, btn3);
  document.body.appendChild(div);
  return div;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('createFocusAutoFocus', () => {
  it('defaults to first strategy', () => {
    const af = createFocusAutoFocus();
    expect(af.getStrategy()).toBe('first');
  });

  it('focuses the first tabbable element with "first" strategy', () => {
    const container = buildContainer();
    const af = createFocusAutoFocus({ strategy: 'first' });
    const focused = af.focus(container);
    expect(focused).toBe(container.querySelectorAll('button')[0]);
    expect(document.activeElement).toBe(container.querySelectorAll('button')[0]);
  });

  it('focuses the last tabbable element with "last" strategy', () => {
    const container = buildContainer();
    const af = createFocusAutoFocus({ strategy: 'last' });
    const focused = af.focus(container);
    const buttons = container.querySelectorAll('button');
    expect(focused).toBe(buttons[buttons.length - 1]);
  });

  it('focuses the data-autofocus element with "data-autofocus" strategy', () => {
    const container = buildContainer();
    const af = createFocusAutoFocus({ strategy: 'data-autofocus' });
    const focused = af.focus(container);
    expect(focused).toBe(container.querySelector('[data-autofocus]'));
  });

  it('returns null and does not throw with "none" strategy', () => {
    const container = buildContainer();
    const af = createFocusAutoFocus({ strategy: 'none' });
    const focused = af.focus(container);
    expect(focused).toBeNull();
  });

  it('falls back to provided fallback element when no candidate found', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const fallback = document.createElement('button');
    fallback.textContent = 'Fallback';
    document.body.appendChild(fallback);
    const af = createFocusAutoFocus({ strategy: 'first', fallback });
    const focused = af.focus(container);
    expect(focused).toBe(fallback);
    expect(document.activeElement).toBe(fallback);
  });

  it('allows changing strategy via setStrategy', () => {
    const container = buildContainer();
    const af = createFocusAutoFocus({ strategy: 'first' });
    af.setStrategy('last');
    expect(af.getStrategy()).toBe('last');
    const buttons = container.querySelectorAll('button');
    const focused = af.focus(container);
    expect(focused).toBe(buttons[buttons.length - 1]);
  });
});
