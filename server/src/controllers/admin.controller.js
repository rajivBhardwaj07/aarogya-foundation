/**
 * Admin dashboard API: overview metrics, content CRUD (posts/events/stats/
 * transparency), read-only lists of donations/volunteers/contacts, and CSV
 * export. All routes are behind requireAuth; deletes are ADMIN-only.
 * See /docs/architecture.md.
 */
import { asyncHandler, ApiError } from '../lib/ApiError.js';
import { Donation } from '../models/Donation.js';
import { Volunteer } from '../models/Volunteer.js';
import { Contact } from '../models/Contact.js';
import { Post } from '../models/Post.js';
import { Event } from '../models/Event.js';
import { ImpactStat } from '../models/ImpactStat.js';
import { Transparency } from '../models/Transparency.js';

// ── Overview ─────────────────────────────────────────────────
export const overview = asyncHandler(async (_req, res) => {
  const [agg, donorCount, pendingVolunteers, unhandledContacts, recentDonations] = await Promise.all([
    Donation.aggregate([
      { $match: { status: 'PAID' } },
      { $group: { _id: null, total: { $sum: '$amountInPaise' }, count: { $sum: 1 } } },
    ]),
    Donation.distinct('email', { status: 'PAID' }),
    Volunteer.countDocuments({ status: 'NEW' }),
    Contact.countDocuments({ handled: false }),
    Donation.find({ status: 'PAID' }).sort({ updatedAt: -1 }).limit(5).lean(),
  ]);

  res.json({
    totalRaisedInPaise: agg[0]?.total || 0,
    paidDonations: agg[0]?.count || 0,
    donorCount: donorCount.length,
    pendingVolunteers,
    unhandledContacts,
    recentDonations,
  });
});

// ── Generic CRUD factory ─────────────────────────────────────
function crud(Model, { searchFields = [] } = {}) {
  return {
    list: asyncHandler(async (req, res) => {
      const { q } = req.query;
      const filter = {};
      if (q && searchFields.length) {
        filter.$or = searchFields.map((f) => ({ [f]: { $regex: q, $options: 'i' } }));
      }
      const items = await Model.find(filter).sort({ createdAt: -1 }).lean();
      res.json({ items });
    }),
    get: asyncHandler(async (req, res) => {
      const item = await Model.findById(req.params.id).lean();
      if (!item) throw ApiError.notFound();
      res.json({ item });
    }),
    create: asyncHandler(async (req, res) => {
      const item = await Model.create(req.body);
      res.status(201).json({ item });
    }),
    update: asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!item) throw ApiError.notFound();
      res.json({ item });
    }),
    remove: asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) throw ApiError.notFound();
      res.json({ ok: true });
    }),
  };
}

export const posts = crud(Post, { searchFields: ['title', 'category', 'author'] });
export const events = crud(Event, { searchFields: ['title', 'location'] });
export const stats = crud(ImpactStat, { searchFields: ['label', 'key'] });
export const transparency = crud(Transparency, {});

// ── Read-only submission lists ───────────────────────────────
export const listDonations = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const items = await Donation.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ items });
});

export const listVolunteers = asyncHandler(async (_req, res) => {
  const items = await Volunteer.find().sort({ createdAt: -1 }).lean();
  res.json({ items });
});

export const updateVolunteerStatus = asyncHandler(async (req, res) => {
  const item = await Volunteer.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!item) throw ApiError.notFound();
  res.json({ item });
});

export const listContacts = asyncHandler(async (_req, res) => {
  const items = await Contact.find().sort({ createdAt: -1 }).lean();
  res.json({ items });
});

export const toggleContactHandled = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) throw ApiError.notFound();
  contact.handled = !contact.handled;
  await contact.save();
  res.json({ item: contact });
});

// ── CSV export ───────────────────────────────────────────────
const CSV_CONFIG = {
  donations: {
    model: Donation,
    columns: ['receiptNo', 'donorName', 'email', 'pan', 'amountInPaise', 'frequency', 'status', 'razorpayPaymentId', 'createdAt'],
  },
  volunteers: {
    model: Volunteer,
    columns: ['name', 'email', 'phone', 'city', 'skills', 'availability', 'status', 'createdAt'],
  },
  contacts: {
    model: Contact,
    columns: ['name', 'email', 'subject', 'body', 'handled', 'createdAt'],
  },
};

export const exportCsv = asyncHandler(async (req, res) => {
  const cfg = CSV_CONFIG[req.params.resource];
  if (!cfg) throw ApiError.notFound('Unknown export.');
  const rows = await cfg.model.find().sort({ createdAt: -1 }).lean();
  const csv = toCsv(rows, cfg.columns);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.resource}.csv"`);
  res.send(csv);
});

function toCsv(rows, columns) {
  const esc = (v) => {
    if (v === undefined || v === null) return '';
    const s = Array.isArray(v) ? v.join('; ') : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.join(',');
  const lines = rows.map((r) => columns.map((c) => esc(r[c])).join(','));
  return [header, ...lines].join('\n');
}
