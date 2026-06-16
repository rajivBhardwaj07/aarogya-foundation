/** 404 — in the product's voice, not apologetic. */
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Lifeline from '../components/Lifeline.jsx';
import { Section } from '../components/ui.jsx';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" path="/404" />
      <Section className="text-center">
        <div className="mx-auto max-w-md">
          <div className="text-rose">
            <Lifeline height={70} animate={false} showDots={false} strokeWidth={2.5} />
          </div>
          <p className="data mt-6 text-5xl text-ink">404</p>
          <h1 className="mt-3 font-display text-3xl text-ink">This road runs out here.</h1>
          <p className="mt-3 text-slate">
            The page you were looking for has moved or never existed. Let's get you back on the map.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link to="/" className="btn-primary">Back to home</Link>
            <Link to="/donate" className="btn-ghost">Donate</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
