/**
 * Impact counter grid. Values come from the API (ImpactStat collection),
 * NOT hard-coded — editing a stat in the admin updates this. Animated via CountUp.
 */
import { useQuery } from '@tanstack/react-query';
import { getImpact } from '../lib/api.js';
import CountUp from './CountUp.jsx';

export default function ImpactCounters({ limit }) {
  const { data: stats, isLoading } = useQuery({ queryKey: ['impact'], queryFn: getImpact });

  const items = (stats || []).slice(0, limit);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {Array.from({ length: limit || 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-paper-deep" />
        ))}
      </div>
    );
  }

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
      {items.map((s) => (
        <div key={s.key}>
          <dd className="font-display text-4xl font-600 text-ink md:text-5xl">
            <CountUp value={s.value} suffix={s.suffix} />
          </dd>
          <dt className="mt-1 text-sm text-slate">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}
