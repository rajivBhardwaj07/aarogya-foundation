/**
 * Transparency — per-year "where your money goes" breakdown + annual report.
 * Percentages should total 100; validated in the admin validator.
 * See /docs/data-model.md.
 */
import mongoose from 'mongoose';

const transparencySchema = new mongoose.Schema(
  {
    year: { type: Number, required: true, unique: true, index: true },
    programPct: { type: Number, required: true, min: 0, max: 100 },
    adminPct: { type: Number, required: true, min: 0, max: 100 },
    fundraisingPct: { type: Number, required: true, min: 0, max: 100 },
    totalRaisedInPaise: { type: Number, default: 0 },
    reportUrl: { type: String },
  },
  { timestamps: true }
);

export const Transparency = mongoose.model('Transparency', transparencySchema);
