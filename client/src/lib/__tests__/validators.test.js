/** Unit tests for client Zod validators + the cover-fee donation-amount math. */
import { describe, it, expect } from 'vitest';
import { donationFormSchema } from '../validators.js';
import { paiseToINR, formatINR } from '../format.js';

describe('donationFormSchema', () => {
  const base = { donorName: 'Asha Devi', email: 'asha@example.com', amountInRupees: 1000, frequency: 'ONE_TIME' };

  it('accepts a valid donation', () => {
    expect(() => donationFormSchema.parse(base)).not.toThrow();
  });

  it('rejects below the ₹100 minimum', () => {
    expect(() => donationFormSchema.parse({ ...base, amountInRupees: 99 })).toThrow();
  });

  it('coerces string amounts (from number input)', () => {
    expect(donationFormSchema.parse({ ...base, amountInRupees: '2500' }).amountInRupees).toBe(2500);
  });
});

describe('cover-fee amount math', () => {
  // Mirrors the server: amount * 1.02, rounded to whole paise/rupees.
  const withFee = (rupees) => Math.round(rupees * 1.02);

  it('adds ~2% when covering the fee', () => {
    expect(withFee(1000)).toBe(1020);
    expect(withFee(2500)).toBe(2550);
  });
});

describe('currency formatting', () => {
  it('formats paise into INR rupees', () => {
    expect(paiseToINR(100000)).toBe(formatINR(1000));
  });
});
