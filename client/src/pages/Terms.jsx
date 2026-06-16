/** Terms of use + donation terms. */
import Seo from '../components/Seo.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { Section } from '../components/ui.jsx';
import { ORG } from '../lib/site.js';

export default function Terms() {
  return (
    <>
      <Seo title="Terms" path="/terms" />
      <PageHeader eyebrow="The fine print" title="Terms of use" intro="The basis on which we accept donations and you use this site." />
      <Section className="max-w-3xl prose-aarogya">
        <h2 className="font-display text-2xl text-ink">Donations</h2>
        <p>All donations to {ORG.name} are voluntary and non-refundable, except in the case of a proven duplicate or erroneous transaction reported within 7 days. Donations are eligible for tax deduction under Section 80G of the Income Tax Act, 1961; a receipt is issued by email on successful payment.</p>
        <h2 className="mt-8 font-display text-2xl text-ink">Use of funds</h2>
        <p>Funds are applied to our programmes at the discretion of the Foundation's board, in line with our registered objects. Where a donation is made to a specific programme, we honour that designation.</p>
        <h2 className="mt-8 font-display text-2xl text-ink">Use of this site</h2>
        <p>Content on this site is provided for information. The Aarogya Foundation name, logo and the lifeline mark are our property. Please do not reproduce them without permission.</p>
        <h2 className="mt-8 font-display text-2xl text-ink">Contact</h2>
        <p>Questions about these terms? Write to <a className="link-underline" href={`mailto:${ORG.email}`}>{ORG.email}</a>.</p>
      </Section>
    </>
  );
}
