/**
 * Post — news article or blog entry (mini-CMS). Managed from the admin.
 * `slug` is unique and used in public URLs (/events uses Event; posts at /news).
 * readingTime is derived from the body on save. See /docs/data-model.md.
 */
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['NEWS', 'BLOG'], default: 'BLOG', index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    coverImage: { type: String },
    category: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date },
    readingTimeMin: { type: Number, default: 1 },
  },
  { timestamps: true }
);

postSchema.pre('save', function deriveReadingTime(next) {
  if (this.isModified('body')) {
    const words = (this.body || '').trim().split(/\s+/).length;
    this.readingTimeMin = Math.max(1, Math.round(words / 200));
  }
  if (this.published && !this.publishedAt) this.publishedAt = new Date();
  next();
});

export const Post = mongoose.model('Post', postSchema);
