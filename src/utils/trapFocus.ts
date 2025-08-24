export function trapFocusKeydown(
  e: React.KeyboardEvent,
  container: HTMLElement | null
) {
  if (e.key !== 'Tab' || !container) return;

  const selector =
    'a[href],button,textarea,input,select,[tabindex]:not([tabindex="-1"])';

  const focusables = Array.from(
    container.querySelectorAll<HTMLElement>(selector)
  ).filter(
    (el) =>
      !el.hasAttribute('disabled') &&
      el.getAttribute('aria-hidden') !== 'true' &&
      el.tabIndex !== -1
  );

  if (focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement as HTMLElement | null;

  const goingForward = !e.shiftKey;

  if (goingForward && active === last) {
    e.preventDefault();
    first.focus();
  } else if (!goingForward && active === first) {
    e.preventDefault();
    last.focus();
  }
}
