/**
 * Public form submissions: volunteer sign-ups and contact messages.
 * Validated by Zod (incl. a honeypot field), persisted, then both the
 * submitter and the admin are emailed. See /docs/architecture.md.
 */
import { asyncHandler } from '../lib/ApiError.js';
import { Volunteer } from '../models/Volunteer.js';
import { Contact } from '../models/Contact.js';
import {
  sendVolunteerConfirmation,
  sendContactConfirmation,
  notifyAdmin,
} from '../lib/mailer.js';

/** POST /api/volunteers */
export const createVolunteer = asyncHandler(async (req, res) => {
  const { website, ...data } = req.body; // honeypot stripped (already validated empty)
  const volunteer = await Volunteer.create(data);

  // Fire emails but never block the user's success on the mail server.
  Promise.allSettled([
    sendVolunteerConfirmation(volunteer),
    notifyAdmin('New volunteer sign-up', [
      `${volunteer.name} (${volunteer.email}, ${volunteer.phone})`,
      `City: ${volunteer.city}`,
      `Skills: ${volunteer.skills.join(', ')}`,
      `Availability: ${volunteer.availability}`,
    ]),
  ]);

  res.status(201).json({ ok: true, message: 'Thank you for volunteering! We will be in touch soon.' });
});

/** POST /api/contact */
export const createContact = asyncHandler(async (req, res) => {
  const { website, ...data } = req.body;
  const contact = await Contact.create(data);

  Promise.allSettled([
    sendContactConfirmation(contact),
    notifyAdmin('New contact message', [
      `${contact.name} (${contact.email})`,
      `Subject: ${contact.subject}`,
      `Message: ${contact.body}`,
    ]),
  ]);

  res.status(201).json({ ok: true, message: 'Thanks for reaching out. We will reply shortly.' });
});
