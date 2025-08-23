type Props = { msg?: string };
export function FieldError({ msg }: Props) {
  return (
    <p
      aria-live="polite"
      className={`mt-1 h-4 text-xs transition-opacity ${
        msg ? 'text-rose-400 opacity-100' : 'opacity-0'
      }`}
    >
      {msg || 'placeholder'}
    </p>
  );
}
