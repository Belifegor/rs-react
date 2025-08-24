import { createRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

function ensureModalRoot(): HTMLElement {
  let root = document.getElementById('modal-root');
  if (!root) {
    root = document.createElement('div');
    root.setAttribute('id', 'modal-root');
    document.body.appendChild(root);
  }
  return root;
}

const trapSpy = vi.fn();
vi.mock('../../utils/trapFocus', () => ({
  __esModule: true,
  trapFocusKeydown: (e: KeyboardEvent, el: HTMLElement | null) =>
    trapSpy(e.type, e.key, Boolean(el)),
}));

async function importModal() {
  ensureModalRoot();
  const mod = await import('./Modal');
  return mod.default as typeof import('./Modal').default;
}

beforeEach(() => {
  trapSpy.mockReset();
  document.body.style.overflow = '';
});

describe('Modal', () => {
  it('открывается: ставит фокус, ARIA корректны, блокирует скролл; ESC закрывает и возвращает фокус', async () => {
    const Modal = await importModal();

    const beforeBtn = document.createElement('button');
    beforeBtn.textContent = 'Before';
    document.body.appendChild(beforeBtn);
    beforeBtn.focus();

    const onClose = vi.fn();
    const focusRef = createRef<HTMLButtonElement>();

    const { rerender, unmount } = render(
      <Modal isOpen onClose={onClose} title="Заголовок">
        <button ref={focusRef}>Первичная кнопка</button>
        <button>Другая</button>
      </Modal>
    );

    const dialog = await screen.findByRole('dialog', { name: 'Заголовок' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(focusRef.current).not.toBeNull();
    expect(document.activeElement).toBe(focusRef.current);

    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(trapSpy).toHaveBeenCalledWith('keydown', 'Tab', true);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <Modal isOpen={false} onClose={onClose} title="Заголовок">
        <button ref={focusRef}>Первичная кнопка</button>
      </Modal>
    );

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(beforeBtn);
    expect(document.body.style.overflow).toBe('');

    unmount();
    beforeBtn.remove();
  });

  it('клик по оверлею закрывает, клик внутри нет', async () => {
    const Modal = await importModal();
    const onClose = vi.fn();

    const { rerender } = render(
      <Modal isOpen onClose={onClose} title="Тест">
        <button>Внутри</button>
      </Modal>
    );

    const dialog = await screen.findByRole('dialog', { name: 'Тест' });

    const overlay = dialog.parentElement;
    if (!overlay) throw new Error('Overlay not found');
    fireEvent.mouseDown(overlay);

    rerender(
      <Modal isOpen onClose={onClose} title="Тест">
        <button>Внутри</button>
      </Modal>
    );

    const dialog2 = await screen.findByRole('dialog', { name: 'Тест' });
    fireEvent.mouseDown(dialog2);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('если initialFocusRef не задан: приоритет data-autofocus, иначе первый фокусируемый', async () => {
    const Modal = await importModal();
    const onClose = vi.fn();

    const { unmount } = render(
      <Modal isOpen onClose={onClose} title="AF">
        <button>Первый</button>
        <button data-autofocus>Автофокус</button>
        <a href="#">Ссылка</a>
      </Modal>
    );

    const autoBtn = await screen.findByRole('button', { name: 'Автофокус' });
    expect(document.activeElement).toBe(autoBtn);

    unmount();

    render(
      <Modal isOpen onClose={onClose} title="NoAF">
        <button>Первый</button>
        <button>Второй</button>
        <a href="#">Ссылка</a>
      </Modal>
    );

    const first = await screen.findByRole('button', { name: 'Первый' });
    expect(document.activeElement).toBe(first);
  });
});
