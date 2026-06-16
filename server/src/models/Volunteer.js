/**
 * Volunteer — a volunteer sign-up submission. Reviewed in the admin dashboard.
 * status workflow: NEW → CONTACTED → ONBOARDED | DECLINED. See /docs/data-model.md.
 */
import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    skills: { type: [String], default: [] },
    availability: { type: String, required: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'ONBOARDED', 'DECLINED'],
      default: 'NEW',
      index: true,
    },
  },
  { timestamps: true }
);

export const Volunteer = mongoose.model('Volunteer', volunteerSchema);
