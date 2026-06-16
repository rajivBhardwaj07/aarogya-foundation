/**
 * Config-driven CRUD for content collections (posts/events/stats/transparency).
 * One component, four resources — each described by RESOURCES below.
 * Create/edit open an inline form; delete is ADMIN-only (hidden for EDITORs,
 * and re-checked on the server).
 */
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminList, adminCreate, adminUpdate, adminDelete } from '../../lib/api.js';
import { Loading, ErrorState, Badge } from '../../components/ui.jsx';
import { formatDate } from '../../lib/format.js';

const RESOURCES = {
  posts: {
    title: 'News & Blog',
    singular: 'post',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'type', label: 'Type' },
      { key: 'category', label: 'Category' },
      { key: 'published', label: 'Live', render: (v) => (v ? <Badge tone="healing">Published</Badge> : <Badge tone="ink">Draft</Badge>) },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text', hint: 'lowercase-with-hyphens' },
      { name: 'type', label: 'Type', type: 'select', options: ['BLOG', 'NEWS'] },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'author', label: 'Author', type: 'text' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'body', label: 'Body', type: 'textarea', rows: 8 },
      { name: 'coverImage', label: 'Cover image URL', type: 'text' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
    defaults: { type: 'BLOG', published: false },
  },
  events: {
    title: 'Events',
    singular: 'event',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'location', label: 'Location' },
      { key: 'startsAt', label: 'Date', render: (v) => formatDate(v) },
      { key: 'type', label: 'When', render: (v) => <Badge tone={v === 'UPCOMING' ? 'healing' : 'ink'}>{v}</Badge> },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 6 },
      { name: 'startsAt', label: 'Starts at', type: 'datetime-local' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'type', label: 'Type', type: 'select', options: ['UPCOMING', 'PAST'] },
      { name: 'coverImage', label: 'Cover image URL', type: 'text' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
    defaults: { type: 'UPCOMING', published: true },
  },
  stats: {
    title: 'Impact stats',
    singular: 'stat',
    columns: [
      { key: 'label', label: 'Label' },
      { key: 'value', label: 'Value' },
      { key: 'suffix', label: 'Suffix' },
      { key: 'order', label: 'Order' },
    ],
    fields: [
      { name: 'key', label: 'Key', type: 'text', hint: 'unique-slug' },
      { name: 'label', label: 'Label', type: 'text' },
      { name: 'value', label: 'Value', type: 'number' },
      { name: 'suffix', label: 'Suffix', type: 'text', hint: 'e.g. +' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
    defaults: { order: 0, suffix: '' },
  },
  transparency: {
    title: 'Transparency',
    singular: 'year',
    columns: [
      { key: 'year', label: 'Year' },
      { key: 'programPct', label: 'Programme %' },
      { key: 'adminPct', label: 'Admin %' },
      { key: 'fundraisingPct', label: 'Fundraising %' },
    ],
    fields: [
      { name: 'year', label: 'Year', type: 'number' },
      { name: 'programPct', label: 'Programme %', type: 'number' },
      { name: 'adminPct', label: 'Admin %', type: 'number' },
      { name: 'fundraisingPct', label: 'Fundraising %', type: 'number' },
      { name: 'totalRaisedInPaise', label: 'Total raised (paise)', type: 'number' },
      { name: 'reportUrl', label: 'Report URL', type: 'text' },
    ],
    defaults: {},
  },
};

function toFormValue(item, fields) {
  const v = {};
  for (const f of fields) {
    let val = item?.[f.name];
    if (f.type === 'datetime-local' && val) val = new Date(val).toISOString().slice(0, 16);
    if (f.type === 'checkbox') val = !!val;
    v[f.name] = val ?? (f.type === 'checkbox' ? false : '');
  }
  return v;
}

function ResourceForm({ cfg, resource, editing, onClose }) {
  const qc = useQueryClient();
  const [values, setValues] = useState(
    editing ? toFormValue(editing, cfg.fields) : toFormValue(cfg.defaults, cfg.fields)
  );
  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationFn: (payload) =>
      editing ? adminUpdate(resource, editing._id, payload) : adminCreate(resource, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', resource] });
      onClose();
    },
    onError: (err) => setError(err),
  });

  const submit = (e) => {
    e.preventDefault();
    setError(null);
    const payload = { ...values };
    // Coerce numbers
    cfg.fields.forEach((f) => {
      if (f.type === 'number' && payload[f.name] !== '') payload[f.name] = Number(payload[f.name]);
    });
    mutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40" onClick={onClose}>
      <div
        className="h-full w-full max-w-lg overflow-y-auto bg-paper p-6 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-ink">
            {editing ? `Edit ${cfg.singular}` : `New ${cfg.singular}`}
          </h2>
          <button onClick={onClose} className="text-slate hover:text-ink" aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
          {cfg.fields.map((f) => (
            <div key={f.name}>
              {f.type === 'checkbox' ? (
                <label className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={!!values[f.name]}
                    onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.checked }))}
                  />
                  {f.label}
                </label>
              ) : (
                <>
                  <label htmlFor={f.name} className="field-label">
                    {f.label}
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea
                      id={f.name}
                      rows={f.rows || 4}
                      className="field-input"
                      value={values[f.name]}
                      onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    />
                  ) : f.type === 'select' ? (
                    <select
                      id={f.name}
                      className="field-input"
                      value={values[f.name]}
                      onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    >
                      {f.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={f.name}
                      type={f.type}
                      className="field-input"
                      value={values[f.name]}
                      onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    />
                  )}
                  {f.hint && <p className="mt-1 text-xs text-slate">{f.hint}</p>}
                </>
              )}
            </div>
          ))}

          {error && (
            <div className="rounded-xl bg-rose/10 px-4 py-3 text-sm text-rose" role="alert">
              <p>{error.message}</p>
              {error.details?.map((d, i) => (
                <p key={i} className="text-xs">
                  {d.path}: {d.message}
                </p>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminContent({ resource }) {
  const cfg = RESOURCES[resource];
  const qc = useQueryClient();
  const { user } = useOutletContext();
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const { data: items, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', resource],
    queryFn: () => adminList(resource),
  });

  const del = useMutation({
    mutationFn: (id) => adminDelete(resource, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', resource] }),
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={refetch} />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">{cfg.title}</h1>
        <button onClick={() => setCreating(true)} className="btn-primary">
          + New {cfg.singular}
        </button>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-deep/50 text-slate">
            <tr>
              {cfg.columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-semibold">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {items.length === 0 && (
              <tr>
                <td colSpan={cfg.columns.length + 1} className="px-4 py-8 text-center text-slate">
                  Nothing here yet. Create your first {cfg.singular}.
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item._id}>
                {cfg.columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-ink">
                    {c.render ? c.render(item[c.key]) : String(item[c.key] ?? '')}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(item)} className="font-semibold text-healing hover:underline">
                    Edit
                  </button>
                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete this ${cfg.singular}? This cannot be undone.`)) del.mutate(item._id);
                      }}
                      className="ml-4 font-semibold text-rose hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <ResourceForm
          cfg={cfg}
          resource={resource}
          editing={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
