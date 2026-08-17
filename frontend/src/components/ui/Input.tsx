import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({ label, error, hint, className = '', id, ...props }: InputProps) {
  const inputId = id || props.name;
  let inputClass = 'input';
  if (error) {
    inputClass = 'input input-error';
  }
  if (className) {
    inputClass = `${inputClass} ${className}`;
  }

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
          {props.required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <input id={inputId} className={inputClass} {...props} />
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
