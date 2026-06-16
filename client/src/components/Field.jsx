/** Accessible form field wrappers used with react-hook-form. */
import { forwardRef } from 'react';

export const TextField = forwardRef(function TextField(
  { label, error, hint, id, type = 'text', ...rest },
  ref
) {
  const errId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        type={type}
        className="field-input"
        aria-invalid={!!error}
        aria-describedby={errId}
        {...rest}
      />
      {hint && !error && <p className="mt-1 text-xs text-slate">{hint}</p>}
      {error && (
        <p id={errId} className="field-error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
});

export const TextArea = forwardRef(function TextArea({ label, error, id, rows = 4, ...rest }, ref) {
  const errId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <textarea
        id={id}
        ref={ref}
        rows={rows}
        className="field-input"
        aria-invalid={!!error}
        aria-describedby={errId}
        {...rest}
      />
      {error && (
        <p id={errId} className="field-error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
});

export const SelectField = forwardRef(function SelectField(
  { label, error, id, children, ...rest },
  ref
) {
  const errId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <select id={id} ref={ref} className="field-input" aria-invalid={!!error} aria-describedby={errId} {...rest}>
        {children}
      </select>
      {error && (
        <p id={errId} className="field-error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
});

/** Honeypot — visually hidden, off the tab order. Bots fill it; we reject. */
export const Honeypot = forwardRef(function Honeypot(props, ref) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      <label htmlFor="website">Leave this field empty</label>
      <input id="website" ref={ref} type="text" tabIndex={-1} autoComplete="off" {...props} />
    </div>
  );
});
