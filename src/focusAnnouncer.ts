/**
 * focusAnnouncer.ts
 * Provides an ARIA live region announcer for focus trap events,
 * improving screen reader accessibility during trap activation/deactivation.
 */

export interface FocusAnnouncer {
  announce: (message: string) => void;
  destroy: () => void;
}

let sharedRegion: HTMLElement | null = null;
let cleanupTimeout: ReturnType<typeof setTimeout> | null = null;

export function createLiveRegion(): HTMLElement {
  const region = document.createElement('div');
  region.setAttribute('role', 'status');
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-atomic', 'true');
  region.setAttribute('data-focus-announcer', 'true');
  Object.assign(region.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    padding: '0',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    border: '0',
  });
  return region;
}

export function getSharedRegion(): HTMLElement {
  if (!sharedRegion || !document.body.contains(sharedRegion)) {
    sharedRegion = createLiveRegion();
    document.body.appendChild(sharedRegion);
  }
  return sharedRegion;
}

export function createFocusAnnouncer(): FocusAnnouncer {
  const region = getSharedRegion();

  function announce(message: string): void {
    // Clear and re-set to force re-announcement for repeated messages
    region.textContent = '';
    requestAnimationFrame(() => {
      region.textContent = message;
    });
  }

  function destroy(): void {
    if (cleanupTimeout !== null) {
      clearTimeout(cleanupTimeout);
    }
    cleanupTimeout = setTimeout(() => {
      if (sharedRegion && document.body.contains(sharedRegion)) {
        document.body.removeChild(sharedRegion);
        sharedRegion = null;
      }
    }, 0);
  }

  return { announce, destroy };
}

export function isFocusAnnouncer(el: Element): boolean {
  return el.getAttribute('data-focus-announcer') === 'true';
}
