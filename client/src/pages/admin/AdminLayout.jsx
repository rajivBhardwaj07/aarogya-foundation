/**
 * Admin shell: guards the route (redirects to /admin/login if no session),
 * renders the sidebar nav + outlet. RBAC note: delete actions are also
 * enforced on the server; the UI hides destructive actions from EDITORs.
 */
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Loading } from '../../components/ui.jsx';
import Lifeline from '../../components/Lifeline.jsx';

const NAV = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/donations', label: 'Donations' },
  { to: '/admin/volunteers', label: 'Volunteers' },
  { to: '/admin/contacts', label: 'Messages' },
  { to: '/admin/posts', label: 'News & Blog' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/stats', label: 'Impact stats' },
  { to: '/admin/transparency', label: 'Transparency' },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <Loading label="Checking your session…" />;
  if (!user) return <Navigate to="/admin/login" replace />;

  const onLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-paper-deep/30 md:grid md:grid-cols-[250px_1fr]">
      <aside className="border-r border-ink/10 bg-ink text-paper md:min-h-screen">
        <div className="flex items-center gap-2 px-6 py-5">
          <span className="text-marigold">
            <Lifeline height={22} animate={false} showDots={false} />
          </span>
          <span className="font-display text-lg">Aarogya Admin</span>
        </div>
        <nav className="flex flex-row flex-wrap gap-1 px-3 pb-4 md:flex-col" aria-label="Admin">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-paper/15 text-paper' : 'text-paper/70 hover:bg-paper/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto hidden px-6 py-5 md:block">
          <p className="text-sm text-paper/80">{user.name}</p>
          <p className="text-xs text-paper/50">{user.role}</p>
          <button onClick={onLogout} className="mt-3 text-sm font-semibold text-marigold hover:underline">
            Sign out
          </button>
        </div>
      </aside>

      <div>
        <header className="flex items-center justify-between border-b border-ink/10 bg-paper px-6 py-4 md:hidden">
          <span className="font-display text-ink">{user.name}</span>
          <button onClick={onLogout} className="text-sm font-semibold text-healing">
            Sign out
          </button>
        </header>
        <main className="p-5 md:p-8">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}
