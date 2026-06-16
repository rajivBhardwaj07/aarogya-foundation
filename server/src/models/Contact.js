/**
 * Contact — a general contact-form message. `handled` flips when an admin
 * has actioned it. See /docs/data-model.md.
 */
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    subject: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    handled: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const Contact = mongoose.model('Contact', contactSchema);
