/**
 * Sticky site header. Prioritises the Donate action (marigold).
 * Fully responsive: collapses to an accessible mobile drawer at < md.
 */
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MenuIcon, CloseIcon } from './icons.jsx';
import Lifeline from './Lifeline.jsx';

const NAV = [
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/impact', label: 'Impact' },
  { to: '/events', label: 'Events' },
  { to: '/get-involved', label: 'Get Involved' },
];

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Aarogya Foundation home">
      <span className="h-9 w-9 rounded-xl bg-ink text-marigold grid place-items-center overflow-hidden">
        <Lifeline height={22} animate={false} showDots={false} strokeWidth={2.5} />
      </span>
      <span className="font-display text-lg font-600 leading-none text-ink">
        Aarogya<span className="text-healing"> Foundation</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/8 bg-paper/85 backdrop-blur-md">
      <div className="container-px flex h-16 items-center justify-between">
        <Brand />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-healing' : 'text-ink/70 hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/donate" className="btn-donate ml-2 py-2.5">
            Donate
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden rounded-lg p-2 text-ink"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-ink/8 bg-paper">
          <nav className="container-px flex flex-col py-3" aria-label="Mobile">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-2 py-3 text-base font-medium ${
                    isActive ? 'text-healing' : 'text-ink/80'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/donate" className="btn-donate mt-2 w-full">
              Donate
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
