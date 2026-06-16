/**
 * Get Involved — volunteer sign-up + contact form.
 * react-hook-form + Zod (mirrors the server schema), honeypot spam trap,
 * accessible inline errors, success states in the product's voice.
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Seo from '../components/Seo.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { Section, Eyebrow } from '../components/ui.jsx';
import { TextField, TextArea, SelectField, Honeypot } from '../components/Field.jsx';
import { CheckIcon } from '../components/icons.jsx';
import { volunteerFormSchema, contactFormSchema, VOLUNTEER_SKILLS, AVAILABILITY } from '../lib/validators.js';
import { submitVolunteer, submitContact } from '../lib/api.js';
import { ORG } from '../lib/site.js';

function SuccessNote({ title, body }) {
  return (
    <div className="card flex items-start gap-4 bg-healing-soft p-7">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-healing text-paper">
        <CheckIcon width={20} height={20} />
      </span>
      <div>
        <p className="font-display text-xl text-ink">{title}</p>
        <p className="mt-1 text-slate">{body}</p>
      </div>
    </div>
  );
}

function VolunteerForm() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: { skills: [], availability: AVAILABILITY[0], website: '' },
  });

  const selectedSkills = watch('skills') || [];
  const toggleSkill = (skill) => {
    const next = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill];
    setValue('skills', next, { shouldValidate: true });
  };

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await submitVolunteer(values);
      setDone(true);
      reset();
    } catch (err) {
      setServerError(err.message);
    }
  };

  if (done)
    return (
      <SuccessNote
        title="Welcome aboard 🙌"
        body="Thank you for offering your time. Our volunteer team will reach out within 3–5 working days. Check your inbox for a confirmation."
      />
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card relative p-7 md:p-9" noValidate>
      <Honeypot {...register('website')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="v-name" label="Full name" error={errors.name} {...register('name')} />
        <TextField id="v-email" label="Email" type="email" error={errors.email} {...register('email')} />
        <TextField id="v-phone" label="Phone" error={errors.phone} {...register('phone')} />
        <TextField id="v-city" label="City" error={errors.city} {...register('city')} />
      </div>

      <fieldset className="mt-5">
        <legend className="field-label">How can you help? (pick any)</legend>
        <div className="flex flex-wrap gap-2">
          {VOLUNTEER_SKILLS.map((skill) => {
            const active = selectedSkills.includes(skill);
            return (
              <button
                type="button"
                key={skill}
                aria-pressed={active}
                onClick={() => toggleSkill(skill)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active ? 'border-healing bg-healing text-paper' : 'border-ink/15 text-ink hover:border-ink/30'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
        {errors.skills && (
          <p className="field-error" role="alert">
            {errors.skills.message}
          </p>
        )}
      </fieldset>

      <div className="mt-5">
        <SelectField id="v-availability" label="Availability" error={errors.availability} {...register('availability')}>
          {AVAILABILITY.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="mt-5">
        <TextArea id="v-message" label="Anything you'd like us to know? (optional)" error={errors.message} {...register('message')} />
      </div>

      {serverError && (
        <p className="mt-4 rounded-xl bg-rose/10 px-4 py-3 text-sm text-rose" role="alert">
          {serverError}
        </p>
      )}

      <button type="submit" className="btn-primary mt-6 w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Sign up to volunteer'}
      </button>
    </form>
  );
}

function ContactForm() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(contactFormSchema), defaultValues: { website: '' } });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await submitContact(values);
      setDone(true);
      reset();
    } catch (err) {
      setServerError(err.message);
    }
  };

  if (done)
    return (
      <SuccessNote
        title="Message received"
        body="Thanks for writing in. A member of our team will get back to you shortly."
      />
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card relative p-7 md:p-9" noValidate>
      <Honeypot {...register('website')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="c-name" label="Your name" error={errors.name} {...register('name')} />
        <TextField id="c-email" label="Email" type="email" error={errors.email} {...register('email')} />
      </div>
      <div className="mt-4">
        <TextField id="c-subject" label="Subject" error={errors.subject} {...register('subject')} />
      </div>
      <div className="mt-4">
        <TextArea id="c-body" label="Message" rows={5} error={errors.body} {...register('body')} />
      </div>

      {serverError && (
        <p className="mt-4 rounded-xl bg-rose/10 px-4 py-3 text-sm text-rose" role="alert">
          {serverError}
        </p>
      )}

      <button type="submit" className="btn-dark mt-6 w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}

export default function GetInvolved() {
  return (
    <>
      <Seo
        title="Get involved"
        path="/get-involved"
        description="Volunteer your skills or get in touch with Aarogya Foundation."
      />
      <PageHeader
        eyebrow="Lend a hand"
        title="There's a place for you on the van."
        intro="Clinicians, mobilisers, photographers, fundraisers, coders — every camp needs more than doctors."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Volunteer</Eyebrow>
            <h2 className="mt-3 font-display text-2xl text-ink">Join the field team</h2>
            <p className="mt-2 mb-6 text-slate">
              Tell us how you can help and when you're free. We'll match you to a camp near you.
            </p>
            <VolunteerForm />
          </div>

          <div id="contact" className="scroll-mt-24">
            <Eyebrow>Contact</Eyebrow>
            <h2 className="mt-3 font-display text-2xl text-ink">Talk to us</h2>
            <p className="mt-2 mb-6 text-slate">
              Partnerships, press, or a request for a camp in your area — write to us.
            </p>
            <ContactForm />
            <div className="card mt-5 p-6 text-sm text-slate">
              <p className="data text-ink">{ORG.phone}</p>
              <p className="mt-1">{ORG.email}</p>
              <p className="mt-1">{ORG.address}</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
