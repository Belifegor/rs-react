type FieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  error?: string;
};

import { FieldError } from './FieldError';

export function Field({ label, htmlFor, children, error }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-[13px] text-neutral-300">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      <FieldError msg={error} />
    </div>
  );
}
