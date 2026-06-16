/** API tests for the volunteer endpoint: persistence + spam/honeypot rejection. */
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { Volunteer } from '../models/Volunteer.js';

const app = createApp();

const valid = {
  name: 'Ravi Kumar',
  email: 'ravi@example.com',
  phone: '+91 9000000000',
  city: 'Patna',
  skills: ['Pharmacy', 'Logistics & Supplies'],
  availability: 'Weekends',
  message: 'Happy to help on weekends.',
};

describe('POST /api/volunteers', () => {
  it('persists a valid volunteer submission', async () => {
    const res = await request(app).post('/api/volunteers').send(valid);
    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);

    const count = await Volunteer.countDocuments();
    expect(count).toBe(1);
    const doc = await Volunteer.findOne();
    expect(doc.status).toBe('NEW');
    expect(doc.skills).toContain('Pharmacy');
  });

  it('rejects a submission missing required fields', async () => {
    const res = await request(app).post('/api/volunteers').send({ name: 'X' });
    expect(res.status).toBe(400);
    expect(await Volunteer.countDocuments()).toBe(0);
  });

  it('rejects a bot that fills the honeypot field', async () => {
    const res = await request(app)
      .post('/api/volunteers')
      .send({ ...valid, website: 'http://spam.example' });
    expect(res.status).toBe(400);
    expect(await Volunteer.countDocuments()).toBe(0);
  });
});
