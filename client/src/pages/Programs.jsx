/** Programs — detailed cards for each of the four programmes. */
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { Section } from '../components/ui.jsx';
import { PROGRAMS } from '../lib/site.js';
import { PROGRAM_ICONS } from '../components/icons.jsx';

export default function Programs() {
  return (
    <>
      <Seo
        title="Our programmes"
        path="/programs"
        description="Mobile health clinics, maternal & child health, nutrition, and emergency relief."
      />
      <PageHeader
        eyebrow="What we do"
        title="Care that travels the last mile."
        intro="Four programmes that share one circuit, one register, and one promise: come back next week."
      />

      <Section className="space-y-6">
        {PROGRAMS.map((p, i) => {
          const Icon = PROGRAM_ICONS[p.icon];
          return (
            <article
              key={p.key}
              id={p.key}
              className="card grid gap-6 p-8 md:grid-cols-[auto_1fr_auto] md:items-center md:p-10"
            >
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-healing-soft text-healing">
                <Icon width={32} height={32} />
              </span>
              <div>
                <span className="data text-xs text-slate">0{i + 1}</span>
                <h2 className="font-display text-2xl text-ink md:text-3xl">{p.name}</h2>
                <p className="mt-2 max-w-2xl text-slate">{p.body}</p>
              </div>
              <div className="md:text-right">
                <p className="font-display text-lg text-healing">{p.stat}</p>
                <Link to="/donate" className="btn-ghost mt-3">
                  Fund this work
                </Link>
              </div>
            </article>
          );
        })}
      </Section>

      <Section className="pt-0">
        <div className="card bg-ink p-10 text-center text-paper md:p-14">
          <h2 className="font-display text-3xl md:text-4xl">Partner with a programme</h2>
          <p className="mx-auto mt-3 max-w-xl text-paper/80">
            Corporates and foundations can adopt a clinic circuit, a district, or an entire
            programme under CSR-1.
          </p>
          <Link to="/get-involved#contact" className="btn-donate mt-6">
            Talk to our partnerships team
          </Link>
        </div>
      </Section>
    </>
  );
}
