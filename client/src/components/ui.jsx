/** Small shared presentational helpers: Section, States, Eyebrow, Stat. */
import { Link } from 'react-router-dom';

export function Section({ children, className = '', ...rest }) {
  return (
    <section className={`container-px py-16 md:py-20 ${className}`} {...rest}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, className = '' }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-slate" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-healing border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="card mx-auto max-w-md p-8 text-center">
      <p className="font-display text-xl text-ink">We hit a snag</p>
      <p className="mt-2 text-slate">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-ghost mt-5">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, body, cta }) {
  return (
    <div className="card mx-auto max-w-lg p-10 text-center">
      <p className="font-display text-2xl text-ink">{title}</p>
      {body && <p className="mt-2 text-slate">{body}</p>}
      {cta && (
        <Link to={cta.to} className="btn-primary mt-6">
          {cta.label}
        </Link>
      )}
    </div>
  );
}

export function Badge({ children, tone = 'healing' }) {
  const tones = {
    healing: 'bg-healing-soft text-healing',
    marigold: 'bg-marigold/15 text-marigold',
    rose: 'bg-rose/15 text-rose',
    ink: 'bg-ink/10 text-ink',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
