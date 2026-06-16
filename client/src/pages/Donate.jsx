/**
 * Donate — preset/custom amounts, one-time vs monthly, cover-fee, PAN for 80G.
 * Flow: create order on the server → open Razorpay Checkout → server verifies
 * the signature → redirect to /thank-you. The client never marks "paid".
 * See /docs/payments.md.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Seo from '../components/Seo.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { Section, Badge } from '../components/ui.jsx';
import { TextField } from '../components/Field.jsx';
import { donationFormSchema, PRESET_AMOUNTS } from '../lib/validators.js';
import { createDonationOrder, verifyDonation } from '../lib/api.js';
import { loadRazorpay } from '../lib/razorpay.js';
import { formatINR } from '../lib/format.js';
import { ORG } from '../lib/site.js';
import { CheckIcon } from '../components/icons.jsx';

const IMPACT_LINES = {
  500: 'Medicines for five patients at a mobile clinic.',
  1000: 'A full mobile-clinic day of care for one patient.',
  2500: 'Antenatal care through an entire pregnancy.',
  5000: "A month's iron supplements for 30 adolescent girls.",
};

export default function Donate() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [processing, setProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(donationFormSchema),
    defaultValues: { amountInRupees: 1000, frequency: 'ONE_TIME', coverFee: false },
  });

  const amount = Number(watch('amountInRupees')) || 0;
  const frequency = watch('frequency');

  const onSubmit = async (values) => {
    setServerError('');
    setProcessing(true);
    try {
      await loadRazorpay();
      const order = await createDonationOrder(values);

      const rzp = new window.Razorpay({
        key: order.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amountInPaise,
        currency: order.currency,
        name: ORG.name,
        description: `${frequency === 'MONTHLY' ? 'Monthly' : 'One-time'} donation`,
        order_id: order.orderId,
        prefill: { name: order.donorName, email: order.email },
        theme: { color: '#1E6B5C' },
        handler: async (response) => {
          try {
            const result = await verifyDonation({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate('/thank-you', { state: result });
          } catch (err) {
            setServerError(err.message);
          } finally {
            setProcessing(false);
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
      });
      rzp.on('payment.failed', (resp) => {
        setServerError(resp.error?.description || 'The payment could not be completed.');
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      setServerError(err.message);
      setProcessing(false);
    }
  };

  const totalWithFee = watch('coverFee') ? Math.round(amount * 1.02) : amount;

  return (
    <>
      <Seo
        title="Donate"
        path="/donate"
        description="Give to Aarogya Foundation. 82% reaches the field, every gift is 80G tax-deductible, and receipts are instant."
      />
      <PageHeader
        eyebrow="Make a gift"
        title="Put a doctor at someone's door."
        intro="Secure payment via Razorpay. 80G tax-deductible. Your receipt arrives by email the moment your gift is confirmed."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="card p-7 md:p-9" noValidate>
            {/* Frequency */}
            <fieldset>
              <legend className="field-label">How often?</legend>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['ONE_TIME', 'One-time'],
                  ['MONTHLY', 'Monthly'],
                ].map(([val, label]) => (
                  <label
                    key={val}
                    className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-colors ${
                      frequency === val
                        ? 'border-healing bg-healing-soft text-healing'
                        : 'border-ink/15 text-ink hover:border-ink/30'
                    }`}
                  >
                    <input type="radio" value={val} className="sr-only" {...register('frequency')} />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Amount presets */}
            <fieldset className="mt-6">
              <legend className="field-label">Choose an amount</legend>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setValue('amountInRupees', amt, { shouldValidate: true })}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${
                      amount === amt
                        ? 'border-marigold bg-marigold/10 text-ink'
                        : 'border-ink/15 text-ink hover:border-ink/30'
                    }`}
                  >
                    {formatINR(amt)}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <TextField
                  id="amountInRupees"
                  label="Or enter your own amount (₹)"
                  type="number"
                  min={100}
                  error={errors.amountInRupees}
                  {...register('amountInRupees')}
                />
              </div>
              {IMPACT_LINES[amount] && (
                <p className="mt-2 flex items-center gap-2 text-sm text-healing">
                  <CheckIcon width={16} height={16} /> {IMPACT_LINES[amount]}
                </p>
              )}
            </fieldset>

            {/* Donor details */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <TextField id="donorName" label="Full name" error={errors.donorName} {...register('donorName')} />
              <TextField id="email" label="Email" type="email" error={errors.email} {...register('email')} />
            </div>
            <div className="mt-4">
              <TextField
                id="pan"
                label="PAN (optional, for 80G receipt)"
                hint="Needed only if you want a tax-deduction receipt."
                error={errors.pan}
                {...register('pan')}
              />
            </div>

            <label className="mt-5 flex items-start gap-3 text-sm text-ink">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-ink/30" {...register('coverFee')} />
              <span>
                Add ~2% to cover payment processing, so 100% of my intended gift reaches the field.
              </span>
            </label>

            {serverError && (
              <p className="mt-4 rounded-xl bg-rose/10 px-4 py-3 text-sm text-rose" role="alert">
                {serverError}
              </p>
            )}

            <button type="submit" className="btn-donate mt-6 w-full" disabled={processing}>
              {processing ? 'Opening secure checkout…' : `Donate ${formatINR(totalWithFee)}${frequency === 'MONTHLY' ? '/mo' : ''}`}
            </button>
            <p className="mt-3 text-center text-xs text-slate">
              Secured by Razorpay. We never see or store your card details.
            </p>
          </form>

          {/* Reassurance rail */}
          <aside className="space-y-5">
            <div className="card p-7">
              <Badge tone="healing">Where it goes</Badge>
              <p className="mt-3 font-display text-4xl text-ink data">82%</p>
              <p className="text-slate">of every rupee reaches programmes in the field.</p>
            </div>
            <div className="card p-7">
              <h3 className="font-display text-lg text-ink">Why give monthly?</h3>
              <p className="mt-2 text-slate">
                A mobile clinic's circuit is weekly and predictable. Regular gifts let us promise a
                village we'll be back — the follow-up visit is where chronic care actually works.
              </p>
            </div>
            <div className="card p-7 text-sm text-slate">
              <p>
                {ORG.name} is registered under 80G ({ORG.reg80G}) and 12A ({ORG.reg12A}).
                Donations are tax-deductible in India.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
