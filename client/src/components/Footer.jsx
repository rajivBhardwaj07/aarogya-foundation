/** Site footer — navigation, registration/compliance details, contact. */
import { Link } from 'react-router-dom';
import { ORG } from '../lib/site.js';
import { LifelineDivider } from './Lifeline.jsx';

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-paper">
      <LifelineDivider className="text-marigold/40 -mb-2 pt-6" />
      <div className="container-px grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-display text-xl">Aarogya Foundation</div>
          <p className="mt-3 max-w-xs text-sm text-paper/70">{ORG.tagline}</p>
          <p className="mt-4 text-sm text-paper/60">{ORG.address}</p>
        </div>

        <nav className="text-sm" aria-label="Footer — Explore">
          <h2 className="eyebrow text-marigold">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-paper/80">
            <li><Link to="/about" className="hover:text-marigold">About us</Link></li>
            <li><Link to="/programs" className="hover:text-marigold">Our programmes</Link></li>
            <li><Link to="/impact" className="hover:text-marigold">Impact &amp; transparency</Link></li>
            <li><Link to="/events" className="hover:text-marigold">Events &amp; news</Link></li>
          </ul>
        </nav>

        <nav className="text-sm" aria-label="Footer — Act">
          <h2 className="eyebrow text-marigold">Act</h2>
          <ul className="mt-4 space-y-2.5 text-paper/80">
            <li><Link to="/donate" className="hover:text-marigold">Donate</Link></li>
            <li><Link to="/get-involved" className="hover:text-marigold">Volunteer</Link></li>
            <li><Link to="/get-involved#contact" className="hover:text-marigold">Contact us</Link></li>
            <li><a href={`mailto:${ORG.email}`} className="hover:text-marigold">{ORG.email}</a></li>
          </ul>
        </nav>

        <div className="text-sm">
          <h2 className="eyebrow text-marigold">Registered &amp; compliant</h2>
          <ul className="mt-4 space-y-1.5 text-paper/70 data text-[13px]">
            <li>Reg. No. {ORG.regNo}</li>
            <li>80G: {ORG.reg80G}</li>
            <li>12A: {ORG.reg12A}</li>
            <li>CSR-1: {ORG.csr1}</li>
          </ul>
          <p className="mt-4 text-xs text-paper/50">
            Donations are eligible for tax deduction under Section 80G.
          </p>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-px flex flex-col gap-3 py-6 text-xs text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {ORG.founded}–2026 Aarogya Foundation. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-marigold">Privacy</Link>
            <Link to="/terms" className="hover:text-marigold">Terms</Link>
            <Link to="/admin/login" className="hover:text-marigold">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
