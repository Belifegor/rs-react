import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { trapFocusKeydown } from '../../utils/trapFocus';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  initialFocusRef?: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}

const modalRoot = (() => {
  const el = document.getElementById('modal-root');
  if (!el) throw new Error("Missing <div id='modal-root'></div> in index.html");
  return el;
})();

export default function Modal({
  isOpen,
  onClose,
  title,
  initialFocusRef,
  children,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement;

    const focusTarget =
      initialFocusRef?.current ||
      overlayRef.current?.querySelector<HTMLElement>('[data-autofocus]') ||
      overlayRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    focusTarget?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, initialFocusRef]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && previouslyFocused.current) previouslyFocused.current.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className="w-full max-w-lg rounded-2xl bg-neutral-900 p-6 shadow-2xl outline-none max-h-[85vh] overflow-y-auto"
        onKeyDown={(e) => trapFocusKeydown(e, dialogRef.current)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 id="modal-title" className="mb-4 text-xl font-semibold">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>,
    modalRoot
  );
}
