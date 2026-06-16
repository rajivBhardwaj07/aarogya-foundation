/**
 * ImpactStat — a single headline metric powering the animated counters.
 * Editing `value` in the admin updates the public site (no JSX redeploy).
 * `order` controls display sequence. See /docs/data-model.md.
 */
import mongoose from 'mongoose';

const impactStatSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true, index: true },
    label: { type: String, required: true, trim: true },
    value: { type: Number, required: true, min: 0 },
    suffix: { type: String, default: '' }, // e.g. "+", "K", "%"
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ImpactStat = mongoose.model('ImpactStat', impactStatSchema);
