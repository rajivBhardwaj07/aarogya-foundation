/**
 * Read-only public endpoints powering the website: impact counters, events,
 * news/blog posts, and the transparency breakdown. See /docs/architecture.md.
 */
import { asyncHandler, ApiError } from '../lib/ApiError.js';
import { ImpactStat } from '../models/ImpactStat.js';
import { Event } from '../models/Event.js';
import { Post } from '../models/Post.js';
import { Transparency } from '../models/Transparency.js';

export const getImpact = asyncHandler(async (_req, res) => {
  const stats = await ImpactStat.find().sort({ order: 1, label: 1 }).lean();
  res.json({ stats });
});

export const listEvents = asyncHandler(async (req, res) => {
  const { type } = req.query; // UPCOMING | PAST | undefined
  const filter = { published: true };
  if (type === 'UPCOMING' || type === 'PAST') filter.type = type;
  const events = await Event.find(filter).sort({ startsAt: type === 'PAST' ? -1 : 1 }).lean();
  res.json({ events });
});

export const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug, published: true }).lean();
  if (!event) throw ApiError.notFound('We could not find that event.');
  res.json({ event });
});

export const listPosts = asyncHandler(async (req, res) => {
  const { type, category } = req.query;
  const filter = { published: true };
  if (type === 'NEWS' || type === 'BLOG') filter.type = type;
  if (category) filter.category = category;
  const posts = await Post.find(filter)
    .sort({ publishedAt: -1 })
    .select('-body')
    .lean();
  res.json({ posts });
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug, published: true }).lean();
  if (!post) throw ApiError.notFound('We could not find that story.');
  res.json({ post });
});

export const getTransparency = asyncHandler(async (_req, res) => {
  const records = await Transparency.find().sort({ year: -1 }).lean();
  res.json({ transparency: records });
});
