/**
 * Event — a camp, drive, or gathering. `type` (UPCOMING/PAST) is what the
 * public filter uses; it can also be derived from startsAt at read time.
 * See /docs/data-model.md.
 */
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true },
    startsAt: { type: Date, required: true, index: true },
    location: { type: String, required: true, trim: true },
    type: { type: String, enum: ['UPCOMING', 'PAST'], default: 'UPCOMING', index: true },
    coverImage: { type: String },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);
