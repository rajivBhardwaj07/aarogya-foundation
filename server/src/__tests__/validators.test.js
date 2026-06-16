/** Unit tests for the shared Zod validators (donation amounts, honeypot, PAN). */
import { describe, it, expect } from 'vitest';
import { donationOrderSchema, volunteerSchema } from '../validators/index.js';

describe('donationOrderSchema', () => {
  const base = { donorName: 'Asha Devi', email: 'asha@example.com', amountInRupees: 1000 };

  it('accepts a valid one-time donation and defaults frequency', () => {
    const parsed = donationOrderSchema.parse(base);
    expect(parsed.amountInRupees).toBe(1000);
    expect(parsed.frequency).toBe('ONE_TIME');
    expect(parsed.coverFee).toBe(false);
  });

  it('coerces a numeric string amount', () => {
    const parsed = donationOrderSchema.parse({ ...base, amountInRupees: '2500' });
    expect(parsed.amountInRupees).toBe(2500);
  });

  it('rejects amounts below ₹100', () => {
    expect(() => donationOrderSchema.parse({ ...base, amountInRupees: 50 })).toThrow();
  });

  it('rejects a malformed email', () => {
    expect(() => donationOrderSchema.parse({ ...base, email: 'not-an-email' })).toThrow();
  });

  it('strips an empty PAN to undefined but validates a real one', () => {
    expect(donationOrderSchema.parse({ ...base, pan: '' }).pan).toBeUndefined();
    expect(donationOrderSchema.parse({ ...base, pan: 'ABCPN1234Z' }).pan).toBe('ABCPN1234Z');
    expect(() => donationOrderSchema.parse({ ...base, pan: 'BAD' })).toThrow();
  });
});

describe('volunteerSchema honeypot', () => {
  const base = {
    name: 'Ravi Kumar',
    email: 'ravi@example.com',
    phone: '+91 9000000000',
    city: 'Patna',
    skills: ['Pharmacy'],
    availability: 'Weekends',
  };

  it('accepts a clean submission', () => {
    expect(() => volunteerSchema.parse(base)).not.toThrow();
  });

  it('requires at least one skill', () => {
    expect(() => volunteerSchema.parse({ ...base, skills: [] })).toThrow();
  });

  it('rejects when the honeypot field is filled (bot)', () => {
    expect(() => volunteerSchema.parse({ ...base, website: 'http://spam.example' })).toThrow();
  });
});
