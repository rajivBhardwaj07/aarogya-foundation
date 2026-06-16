/** About — story, approach, registration/compliance. */
import Seo from '../components/Seo.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { Section, Eyebrow } from '../components/ui.jsx';
import { ORG, VALUES } from '../lib/site.js';

const TIMELINE = [
  { year: '2014', text: 'Founded in Patna with one converted van serving four villages around the city.' },
  { year: '2017', text: 'Maternal & child health programme launched; first 1,000 safe deliveries supported.' },
  { year: '2019', text: 'Expanded into Jharkhand and eastern Uttar Pradesh; fleet grows to nine clinics.' },
  { year: '2021', text: 'Awarded 12A & 80G; began publishing full annual financials.' },
  { year: '2023', text: 'Shifted reporting from footfall to follow-up; chronic-care return rate crosses 60%.' },
  { year: '2024', text: '640+ villages on the weekly circuit; 248,000 patients treated to date.' },
];

export default function About() {
  return (
    <>
      <Seo
        title="About us"
        path="/about"
        description="Aarogya Foundation has delivered primary healthcare to underserved communities since 2014."
      />
      <PageHeader
        eyebrow={`Since ${ORG.founded}`}
        title="We go where the road runs out."
        intro="Aarogya Foundation is a registered non-profit delivering primary healthcare and humanitarian aid to rural and urban-slum communities that sit beyond the reach of the nearest clinic."
      />

      <Section>
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr]">
          <div className="prose-aarogya text-lg">
            <p>
              It began with a simple, stubborn observation: in much of Bihar and Jharkhand, the
              barrier to healthcare is not the cost of a consultation — it is the distance to one.
              A mother in labour, a child with a fever, an elder whose blood pressure has crept up:
              for them, the nearest doctor can be a two-hour journey on a road that floods.
            </p>
            <p>
              So we brought the clinic to the road's end. Today our equipped vans run a fixed weekly
              circuit, each carrying a doctor, nurse, pharmacist and — most importantly — a
              community mobiliser who knows every household by name.
            </p>
            <p>
              We are not interested in one-off camps that look good in photographs. We measure who
              comes back, and who gets better. That is harder, slower, and the only thing that
              actually changes a life.
            </p>
          </div>

          <aside className="card h-fit p-7">
            <Eyebrow>Registered &amp; compliant</Eyebrow>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ['Registration No.', ORG.regNo],
                ['80G', ORG.reg80G],
                ['12A', ORG.reg12A],
                ['CSR-1', ORG.csr1],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 border-b border-ink/8 pb-2">
                  <dt className="text-slate">{k}</dt>
                  <dd className="data text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-slate">{ORG.address}</p>
          </aside>
        </div>
      </Section>

      <div className="bg-paper-deep/40">
        <Section>
          <Eyebrow>Our journey</Eyebrow>
          <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">A decade, year by year</h2>
          <ol className="mt-10 space-y-6 border-l-2 border-healing/30 pl-6">
            {TIMELINE.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-marigold ring-4 ring-paper" />
                <span className="data text-sm font-semibold text-healing">{t.year}</span>
                <p className="mt-1 text-ink/90">{t.text}</p>
              </li>
            ))}
          </ol>
        </Section>
      </div>

      <Section>
        <Eyebrow>What guides us</Eyebrow>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="card p-7">
              <h3 className="font-display text-xl text-ink">{v.title}</h3>
              <p className="mt-2 text-slate">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
