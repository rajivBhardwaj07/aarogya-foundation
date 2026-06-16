/** Admin overview: headline metrics + recent donations. */
import { useQuery } from '@tanstack/react-query';
import { adminOverview } from '../../lib/api.js';
import { paiseToINR, formatDateTime } from '../../lib/format.js';
import { Loading, ErrorState } from '../../components/ui.jsx';

function Metric({ label, value, tone = 'ink' }) {
  return (
    <div className="card p-6">
      <p className="text-sm text-slate">{label}</p>
      <p className={`mt-2 font-display text-3xl ${tone === 'healing' ? 'text-healing' : 'text-ink'}`}>{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: adminOverview,
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Overview</h1>
      <p className="mt-1 text-slate">A quick pulse on giving, volunteers and messages.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Total raised (paid)" value={paiseToINR(data.totalRaisedInPaise)} tone="healing" />
        <Metric label="Paid donations" value={data.paidDonations} />
        <Metric label="Unique donors" value={data.donorCount} />
        <Metric label="New volunteers" value={data.pendingVolunteers} />
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl text-ink">Recent donations</h2>
        <div className="card mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-deep/50 text-slate">
              <tr>
                <th className="px-4 py-3">Receipt</th>
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {data.recentDonations.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate">
                    No paid donations yet.
                  </td>
                </tr>
              )}
              {data.recentDonations.map((d) => (
                <tr key={d._id}>
                  <td className="px-4 py-3 data text-ink">{d.receiptNo}</td>
                  <td className="px-4 py-3">{d.donorName}</td>
                  <td className="px-4 py-3 data">{paiseToINR(d.amountInPaise)}</td>
                  <td className="px-4 py-3 text-slate">{formatDateTime(d.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
