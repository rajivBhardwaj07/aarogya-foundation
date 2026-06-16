/** Public read-only content routes. */
import { Router } from 'express';
import {
  getImpact,
  listEvents,
  getEvent,
  listPosts,
  getPost,
  getTransparency,
} from '../controllers/public.controller.js';

export const publicRouter = Router();

publicRouter.get('/impact', getImpact);
publicRouter.get('/transparency', getTransparency);
publicRouter.get('/events', listEvents);
publicRouter.get('/events/:slug', getEvent);
publicRouter.get('/posts', listPosts);
publicRouter.get('/posts/:slug', getPost);
