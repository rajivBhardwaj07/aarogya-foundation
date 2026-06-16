/** Home — hero "thesis" + lifeline, programmes preview, impact, transparency teaser. */
import { Link } from 'react-router-dom';
import Seo, { orgJsonLd } from '../components/Seo.jsx';
import Lifeline, { LifelineDivider } from '../components/Lifeline.jsx';
import ImpactCounters from '../components/ImpactCounters.jsx';
import { Section, Eyebrow, Badge } from '../components/ui.jsx';
import { PROGRAMS, VALUES, ORG } from '../lib/site.js';
import { PROGRAM_ICONS, ArrowRight } from '../components/icons.jsx';

function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="container-px pt-16 pb-10 md:pt-24">
        <div className="mx-auto max-w-3xl text-center motion-safe:animate-fade-up">
          <Eyebrow className="justify-center">Primary healthcare · since {ORG.founded}</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-600 leading-[1.07] text-ink sm:text-6xl">
            A heartbeat should not stop
            <br className="hidden sm:block" /> at the end of the road.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate">
            Aarogya Foundation drives doctors, medicines and maternal care to the villages and
            slums that the nearest clinic forgot — across {ORG.regions.join(', ')}.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/donate" className="btn-donate w-full sm:w-auto">
              Donate now
            </Link>
            <Link to="/get-involved" className="btn-ghost w-full sm:w-auto">
              Volunteer with us
            </Link>
          </div>
        </div>
      </div>

      {/* The signature lifeline drawing across the hero. */}
      <div className="text-healing" aria-hidden="false">
        <Lifeline height={150} />
      </div>
      <p className="container-px -mt-6 pb-12 text-center text-xs uppercase tracking-[0.2em] text-slate">
        Each pulse · a village reached
      </p>
    </section>
  );
}

function ProgramsPreview() {
  return (
    <Section>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <Eyebrow>What we do</Eyebrow>
          <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">
            Four programmes, one circuit of care
          </h2>
        </div>
        <Link to="/programs" className="link-underline text-sm font-semibold text-healing">
          See all programmes →
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {PROGRAMS.map((p) => {
          const Icon = PROGRAM_ICONS[p.icon];
          return (
            <Link
              key={p.key}
              to="/programs"
              className="card group flex flex-col gap-3 p-7 transition-transform hover:-translate-y-1"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-healing-soft text-healing">
                <Icon />
              </span>
              <h3 className="font-display text-xl text-ink">{p.name}</h3>
              <p className="text-slate">{p.short}</p>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-healing">
                {p.stat}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}

function ImpactBand() {
  return (
    <div className="bg-ink text-paper">
      <Section className="py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-lg">
            <Eyebrow className="text-marigold">A decade of reach</Eyebrow>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              Numbers we are accountable to
            </h2>
          </div>
          <Link to="/impact" className="text-sm font-semibold text-marigold hover:underline">
            How we spend every rupee →
          </Link>
        </div>
        <div className="mt-12 [&_.text-ink]:text-paper [&_.text-slate]:text-paper/65">
          <ImpactCounters limit={4} />
        </div>
      </Section>
    </div>
  );
}

function Values() {
  return (
    <Section>
      <div className="grid gap-10 md:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title}>
            <div className="text-healing">
              <Lifeline height={28} animate={false} showDots={false} strokeWidth={2} />
            </div>
            <h3 className="mt-3 font-display text-xl text-ink">{v.title}</h3>
            <p className="mt-2 text-slate">{v.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function DonateCta() {
  return (
    <Section>
      <div className="card overflow-hidden bg-healing text-paper">
        <div className="grid items-center gap-6 p-10 md:grid-cols-[1.4fr_1fr] md:p-14">
          <div>
            <Badge tone="marigold">₹1,000 = a full mobile-clinic day for one patient</Badge>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">
              Your gift becomes a doctor at someone's door.
            </h2>
            <p className="mt-3 max-w-lg text-paper/85">
              82 paise of every rupee reaches the field. Every donation is 80G tax-deductible and
              receipted instantly.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Link to="/donate" className="btn-donate w-full justify-center md:w-auto">
              Donate now
            </Link>
            <Link to="/impact" className="text-sm font-semibold text-paper/80 hover:text-marigold">
              Read our transparency report →
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default function Home() {
  return (
    <>
      <Seo path="/" jsonLd={orgJsonLd} />
      <Hero />
      <LifelineDivider className="container-px" />
      <ProgramsPreview />
      <ImpactBand />
      <Values />
      <DonateCta />
    </>
  );
}
