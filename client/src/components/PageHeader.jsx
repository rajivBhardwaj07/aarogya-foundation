/** Consistent inner-page header band with the lifeline motif. */
import { Eyebrow } from './ui.jsx';
import { LifelineDivider } from './Lifeline.jsx';

export default function PageHeader({ eyebrow, title, intro }) {
  return (
    <header className="bg-paper">
      <div className="container-px pt-14 pb-6 md:pt-20">
        <div className="max-w-2xl motion-safe:animate-fade-up">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="mt-3 font-display text-4xl font-600 text-ink md:text-5xl">{title}</h1>
          {intro && <p className="mt-4 text-lg text-slate">{intro}</p>}
        </div>
      </div>
      <LifelineDivider className="container-px pb-2" />
    </header>
  );
}
