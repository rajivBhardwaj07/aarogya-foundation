/** Post-donation thank-you. Reads the verified result from router state. */
import { Link, useLocation } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Lifeline from '../components/Lifeline.jsx';
import { Section } from '../components/ui.jsx';
import { paiseToINR } from '../lib/format.js';

export default function ThankYou() {
  const { state } = useLocation();

  return (
    <>
      <Seo title="Thank you" path="/thank-you" />
      <Section className="text-center">
        <div className="mx-auto max-w-lg">
          <div className="text-healing">
            <Lifeline height={80} />
          </div>
          <h1 className="mt-6 font-display text-4xl text-ink">Thank you{state?.donorName ? `, ${state.donorName}` : ''}.</h1>
          {state?.amountInPaise ? (
            <p className="mt-3 text-lg text-slate">
              Your gift of <span className="data font-semibold text-ink">{paiseToINR(state.amountInPaise)}</span> is
              confirmed. A receipt is on its way to your inbox.
            </p>
          ) : (
            <p className="mt-3 text-lg text-slate">
              Your donation is confirmed. A receipt is on its way to your inbox.
            </p>
          )}

          {state?.receiptNo && (
            <p className="mt-4 inline-block rounded-full bg-paper-deep px-4 py-2 data text-sm text-ink">
              Receipt No. {state.receiptNo}
            </p>
          )}

          <p className="mt-6 text-slate">
            Because of you, a clinic van will reach a village this week — and come back the next.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link to="/" className="btn-primary">Back to home</Link>
            <Link to="/impact" className="btn-ghost">See your impact</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
