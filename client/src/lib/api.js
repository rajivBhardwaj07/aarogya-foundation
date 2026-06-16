/**
 * Axios instance + typed-ish API helpers.
 * `withCredentials` so the httpOnly auth cookie rides along on admin calls.
 * In dev, VITE_API_URL is unset and Vite proxies /api → Express (same origin).
 */
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Normalise server error envelopes into a thrown Error with .details
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const data = error.response?.data?.error;
    const err = new Error(data?.message || error.message || 'Request failed');
    err.status = error.response?.status;
    err.details = data?.details;
    return Promise.reject(err);
  }
);

// ── Public ───────────────────────────────────────────────────
export const getImpact = () => api.get('/impact').then((r) => r.data.stats);
export const getTransparency = () => api.get('/transparency').then((r) => r.data.transparency);
export const getEvents = (type) =>
  api.get('/events', { params: type ? { type } : {} }).then((r) => r.data.events);
export const getEvent = (slug) => api.get(`/events/${slug}`).then((r) => r.data.event);
export const getPosts = (params) => api.get('/posts', { params }).then((r) => r.data.posts);
export const getPost = (slug) => api.get(`/posts/${slug}`).then((r) => r.data.post);

// ── Forms ────────────────────────────────────────────────────
export const submitVolunteer = (payload) => api.post('/volunteers', payload).then((r) => r.data);
export const submitContact = (payload) => api.post('/contact', payload).then((r) => r.data);

// ── Donations ────────────────────────────────────────────────
export const createDonationOrder = (payload) =>
  api.post('/donations/order', payload).then((r) => r.data);
export const verifyDonation = (payload) =>
  api.post('/donations/verify', payload).then((r) => r.data);

// ── Auth ─────────────────────────────────────────────────────
export const login = (payload) => api.post('/auth/login', payload).then((r) => r.data.user);
export const logout = () => api.post('/auth/logout').then((r) => r.data);
export const fetchMe = () => api.get('/auth/me').then((r) => r.data.user);

// ── Admin ────────────────────────────────────────────────────
export const adminOverview = () => api.get('/admin/overview').then((r) => r.data);
export const adminList = (resource, params) =>
  api.get(`/admin/${resource}`, { params }).then((r) => r.data.items);
export const adminCreate = (resource, payload) =>
  api.post(`/admin/${resource}`, payload).then((r) => r.data.item);
export const adminUpdate = (resource, id, payload) =>
  api.put(`/admin/${resource}/${id}`, payload).then((r) => r.data.item);
export const adminDelete = (resource, id) =>
  api.delete(`/admin/${resource}/${id}`).then((r) => r.data);
export const adminPatch = (path, payload) =>
  api.patch(`/admin/${path}`, payload).then((r) => r.data.item);
export const adminExportUrl = (resource) =>
  `${api.defaults.baseURL}/admin/export/${resource}`;
