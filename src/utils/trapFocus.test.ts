import { describe, it, expect, beforeEach, vi } from 'vitest';
import { trapFocusKeydown } from './trapFocus';

function makeContainer() {
  const container = document.createElement('div');

  const first = document.createElement('button');
  first.textContent = 'first';

  const mid = document.createElement('input');

  const last = document.createElement('button');
  last.textContent = 'last';

  container.append(first, mid, last);
  document.body.appendChild(container);
  return { container, first, mid, last };
}

function makeKeyEvent(tab = true, shift = false) {
  return {
    key: tab ? 'Tab' : 'Enter',
    shiftKey: shift,
    preventDefault: vi.fn(),
  } as unknown as React.KeyboardEvent;
}

describe('trapFocusKeydown', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('циклически переводит фокус с последнего на первый при Tab', () => {
    const { container, first, last } = makeContainer();

    last.focus();
    expect(document.activeElement).toBe(last);

    const ev = makeKeyEvent(true, false);
    trapFocusKeydown(ev, container);

    expect(document.activeElement).toBe(first);
    expect(ev.preventDefault).toHaveBeenCalledOnce();
  });

  it('циклически переводит фокус с первого на последний при Shift+Tab', () => {
    const { container, first, last } = makeContainer();

    first.focus();
    expect(document.activeElement).toBe(first);

    const ev = makeKeyEvent(true, true);
    trapFocusKeydown(ev, container);

    expect(document.activeElement).toBe(last);
    expect(ev.preventDefault).toHaveBeenCalledOnce();
  });

  it('ничего не делает, если не Tab', () => {
    const { container, first } = makeContainer();

    first.focus();
    const ev = makeKeyEvent(false, false);
    trapFocusKeydown(ev, container);

    expect(document.activeElement).toBe(first);
    expect(ev.preventDefault).not.toHaveBeenCalled();
  });

  it('тихо выходит, если нет focusables', () => {
    const empty = document.createElement('div');
    document.body.appendChild(empty);
    const ev = makeKeyEvent(true, false);

    expect(() => trapFocusKeydown(ev, empty)).not.toThrow();
  });

  it('тихо выходит, если container == null', () => {
    const ev = makeKeyEvent(true, false);
    expect(() => trapFocusKeydown(ev, null)).not.toThrow();
  });
});
