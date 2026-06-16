/**
 * Read views for donations / volunteers / contacts, with CSV export and light
 * status actions (volunteer status, contact handled). Config-driven like
 * AdminContent.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminList, adminPatch, adminExportUrl } from '../../lib/api.js';
import { Loading, ErrorState, Badge } from '../../components/ui.jsx';
import { paiseToINR, formatDateTime } from '../../lib/format.js';
import { DownloadIcon } from '../../components/icons.jsx';

const STATUS_TONE = { PAID: 'healing', CREATED: 'ink', FAILED: 'rose' };
const VOL_STATUSES = ['NEW', 'CONTACTED', 'ONBOARDED', 'DECLINED'];

const CONFIG = {
  donations: {
    title: 'Donations',
    columns: (item) => [
      item.receiptNo,
      item.donorName,
      item.email,
      paiseToINR(item.amountInPaise),
      item.frequency,
      <Badge key="s" tone={STATUS_TONE[item.status]}>{item.status}</Badge>,
      formatDateTime(item.createdAt),
    ],
    headers: ['Receipt', 'Donor', 'Email', 'Amount', 'Frequency', 'Status', 'When'],
  },
  volunteers: {
    title: 'Volunteers',
    headers: ['Name', 'Contact', 'City', 'Skills', 'Availability', 'Status'],
  },
  contacts: {
    title: 'Messages',
    headers: ['From', 'Subject', 'Message', 'When', 'Handled'],
  },
};

export default function AdminSubmissions({ resource }) {
  const cfg = CONFIG[resource];
  const qc = useQueryClient();
  const { data: items, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', resource],
    queryFn: () => adminList(resource),
  });

  const patch = useMutation({
    mutationFn: ({ path, body }) => adminPatch(path, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', resource] }),
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">{cfg.title}</h1>
        <a href={adminExportUrl(resource)} className="btn-ghost" download>
          <DownloadIcon width={18} height={18} /> Export CSV
        </a>
      </div>
      <p className="mt-1 text-slate">{items.length} record{items.length === 1 ? '' : 's'}</p>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-deep/50 text-slate">
            <tr>
              {cfg.headers.map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {items.length === 0 && (
              <tr>
                <td colSpan={cfg.headers.length} className="px-4 py-8 text-center text-slate">
                  No records yet.
                </td>
              </tr>
            )}

            {resource === 'donations' &&
              items.map((d) => (
                <tr key={d._id}>
                  {cfg.columns(d).map((cell, i) => (
                    <td key={i} className={`px-4 py-3 ${i === 0 || i === 3 ? 'data' : ''} text-ink`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}

            {resource === 'volunteers' &&
              items.map((v) => (
                <tr key={v._id}>
                  <td className="px-4 py-3 text-ink">{v.name}</td>
                  <td className="px-4 py-3 text-slate">
                    {v.email}
                    <br />
                    {v.phone}
                  </td>
                  <td className="px-4 py-3">{v.city}</td>
                  <td className="px-4 py-3 text-slate">{v.skills?.join(', ')}</td>
                  <td className="px-4 py-3">{v.availability}</td>
                  <td className="px-4 py-3">
                    <select
                      value={v.status}
                      onChange={(e) =>
                        patch.mutate({ path: `volunteers/${v._id}/status`, body: { status: e.target.value } })
                      }
                      className="rounded-lg border border-ink/15 bg-white px-2 py-1 text-sm"
                    >
                      {VOL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}

            {resource === 'contacts' &&
              items.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3 text-ink">
                    {c.name}
                    <br />
                    <span className="text-slate">{c.email}</span>
                  </td>
                  <td className="px-4 py-3">{c.subject}</td>
                  <td className="px-4 py-3 max-w-xs text-slate">{c.body}</td>
                  <td className="px-4 py-3 text-slate">{formatDateTime(c.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => patch.mutate({ path: `contacts/${c._id}/handled`, body: {} })}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        c.handled ? 'bg-healing-soft text-healing' : 'bg-paper-deep text-ink'
                      }`}
                    >
                      {c.handled ? 'Handled ✓' : 'Mark handled'}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
