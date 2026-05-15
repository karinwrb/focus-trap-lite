/**
 * focusPlaceholder — manages a temporary placeholder element that receives
 * focus when the real target is unavailable (e.g. hidden or removed).
 */

export interface FocusPlaceholder {
  readonly element: HTMLElement;
  attach(container: HTMLElement): void;
  detach(): void;
  isAttached(): boolean;
  takeFocus(): void;
}

export function createFocusPlaceholder(label = 'Focus placeholder'): FocusPlaceholder {
  const element = document.createElement('span');
  element.setAttribute('tabindex', '-1');
  element.setAttribute('aria-label', label);
  element.setAttribute('data-focus-placeholder', 'true');
  element.style.cssText =
    'position:fixed;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;outline:0;';

  let _container: HTMLElement | null = null;

  function attach(container: HTMLElement): void {
    if (_container === container) return;
    detach();
    _container = container;
    container.appendChild(element);
  }

  function detach(): void {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
    _container = null;
  }

  function isAttached(): boolean {
    return _container !== null && element.parentNode === _container;
  }

  function takeFocus(): void {
    element.focus({ preventScroll: true });
  }

  return { element, attach, detach, isAttached, takeFocus };
}

export function isFocusPlaceholder(el: Element): boolean {
  return el.getAttribute('data-focus-placeholder') === 'true';
}
