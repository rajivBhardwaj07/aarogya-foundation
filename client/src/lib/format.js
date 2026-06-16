/** Formatting helpers (currency in INR, dates, numbers). */

export const formatINR = (rupees, opts = {}) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    ...opts,
  }).format(rupees);

export const paiseToINR = (paise, opts) => formatINR((paise || 0) / 100, opts);

export const formatNumber = (n) => new Intl.NumberFormat('en-IN').format(n || 0);

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatDateTime = (d) =>
  new Date(d).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
