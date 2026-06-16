/**
 * Admin routes — all require a valid session. Mutations that create/update
 * content are open to EDITOR + ADMIN; destructive deletes are ADMIN-only.
 */
import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  overview,
  posts,
  events,
  stats,
  transparency,
  listDonations,
  listVolunteers,
  updateVolunteerStatus,
  listContacts,
  toggleContactHandled,
  exportCsv,
} from '../controllers/admin.controller.js';
import {
  postSchema,
  eventSchema,
  impactStatSchema,
  transparencySchema,
} from '../validators/index.js';

export const adminRouter = Router();

adminRouter.use(requireAuth);

adminRouter.get('/overview', overview);

// Content CRUD — register a resource with its validator in one helper.
function resource(path, ctrl, schema) {
  adminRouter.get(`/${path}`, ctrl.list);
  adminRouter.get(`/${path}/:id`, ctrl.get);
  adminRouter.post(`/${path}`, validate(schema), ctrl.create);
  adminRouter.put(`/${path}/:id`, validate(schema), ctrl.update);
  adminRouter.delete(`/${path}/:id`, requireRole('ADMIN'), ctrl.remove);
}

resource('posts', posts, postSchema);
resource('events', events, eventSchema);
resource('stats', stats, impactStatSchema);
resource('transparency', transparency, transparencySchema);

// Submissions (read + light status updates)
adminRouter.get('/donations', listDonations);
adminRouter.get('/volunteers', listVolunteers);
adminRouter.patch('/volunteers/:id/status', updateVolunteerStatus);
adminRouter.get('/contacts', listContacts);
adminRouter.patch('/contacts/:id/handled', toggleContactHandled);

// CSV export: /api/admin/export/donations | volunteers | contacts
adminRouter.get('/export/:resource', exportCsv);
