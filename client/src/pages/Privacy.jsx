/** Privacy policy — concise, real copy. */
import Seo from '../components/Seo.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { Section } from '../components/ui.jsx';
import { ORG } from '../lib/site.js';

export default function Privacy() {
  return (
    <>
      <Seo title="Privacy policy" path="/privacy" />
      <PageHeader eyebrow="Your data" title="Privacy policy" intro="What we collect, why, and the control you have over it." />
      <Section className="max-w-3xl prose-aarogya">
        <h2 className="font-display text-2xl text-ink">What we collect</h2>
        <p>When you donate, volunteer or contact us, we collect the details you provide — name, email, phone, city, and (for 80G receipts) your PAN. Payment card details are handled entirely by our payment processor, Razorpay; we never see or store them.</p>
        <h2 className="mt-8 font-display text-2xl text-ink">How we use it</h2>
        <p>To process donations and issue receipts, to coordinate volunteering, to respond to your messages, and to send occasional updates you have asked for. We do not sell or rent your data to anyone.</p>
        <h2 className="mt-8 font-display text-2xl text-ink">Retention &amp; security</h2>
        <p>Donation records are retained as required by Indian tax and audit law. Data is stored on access-controlled infrastructure and transmitted over encrypted connections.</p>
        <h2 className="mt-8 font-display text-2xl text-ink">Your rights</h2>
        <p>You can ask us to access, correct or delete your personal data (subject to legal retention) by writing to <a className="link-underline" href={`mailto:${ORG.email}`}>{ORG.email}</a>.</p>
      </Section>
    </>
  );
}
