import { createFocusAnnouncer, createLiveRegion, getSharedRegion, isFocusAnnouncer } from './focusAnnouncer';

describe('createLiveRegion', () => {
  it('creates a div with correct ARIA attributes', () => {
    const region = createLiveRegion();
    expect(region.tagName).toBe('DIV');
    expect(region.getAttribute('role')).toBe('status');
    expect(region.getAttribute('aria-live')).toBe('polite');
    expect(region.getAttribute('aria-atomic')).toBe('true');
    expect(region.getAttribute('data-focus-announcer')).toBe('true');
  });

  it('applies visually hidden styles', () => {
    const region = createLiveRegion();
    expect(region.style.position).toBe('absolute');
    expect(region.style.overflow).toBe('hidden');
    expect(region.style.width).toBe('1px');
  });
});

describe('getSharedRegion', () => {
  afterEach(() => {
    document.querySelectorAll('[data-focus-announcer]').forEach(el => el.remove());
  });

  it('creates and appends a region to document.body', () => {
    const region = getSharedRegion();
    expect(document.body.contains(region)).toBe(true);
  });

  it('returns the same region on subsequent calls', () => {
    const first = getSharedRegion();
    const second = getSharedRegion();
    expect(first).toBe(second);
  });

  it('recreates region if it was removed from DOM', () => {
    const first = getSharedRegion();
    first.remove();
    const second = getSharedRegion();
    expect(second).not.toBe(first);
    expect(document.body.contains(second)).toBe(true);
  });
});

describe('createFocusAnnouncer', () => {
  afterEach(() => {
    document.querySelectorAll('[data-focus-announcer]').forEach(el => el.remove());
    jest.useRealTimers();
  });

  it('returns an object with announce and destroy methods', () => {
    const announcer = createFocusAnnouncer();
    expect(typeof announcer.announce).toBe('function');
    expect(typeof announcer.destroy).toBe('function');
  });

  it('sets textContent via requestAnimationFrame', async () => {
    const announcer = createFocusAnnouncer();
    const rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => { cb(0); return 0; });
    announcer.announce('Dialog opened');
    const region = document.querySelector('[data-focus-announcer]') as HTMLElement;
    expect(region.textContent).toBe('Dialog opened');
    rafSpy.mockRestore();
  });

  it('clears text before re-announcing the same message', () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => { cb(0); return 0; });
    const announcer = createFocusAnnouncer();
    announcer.announce('Focus trapped');
    announcer.announce('Focus trapped');
    const region = document.querySelector('[data-focus-announcer]') as HTMLElement;
    expect(region.textContent).toBe('Focus trapped');
  });

  it('destroy removes the shared region from the DOM', () => {
    jest.useFakeTimers();
    const announcer = createFocusAnnouncer();
    const region = getSharedRegion();
    expect(document.body.contains(region)).toBe(true);
    announcer.destroy();
    jest.runAllTimers();
    expect(document.body.contains(region)).toBe(false);
  });
});

describe('isFocusAnnouncer', () => {
  it('returns true for elements with data-focus-announcer attribute', () => {
    const el = createLiveRegion();
    expect(isFocusAnnouncer(el)).toBe(true);
  });

  it('returns false for regular elements', () => {
    const el = document.createElement('div');
    expect(isFocusAnnouncer(el)).toBe(false);
  });
});
