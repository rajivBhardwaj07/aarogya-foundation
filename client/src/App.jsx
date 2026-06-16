/**
 * App router. Public routes use the marketing Layout; admin routes are lazy
 * and gated by RequireAdmin. Routes are code-split with React.lazy for
 * performance (smaller initial bundle). See /docs/architecture.md.
 */
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { Loading } from './components/ui.jsx';

// Public pages
const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Programs = lazy(() => import('./pages/Programs.jsx'));
const Impact = lazy(() => import('./pages/Impact.jsx'));
const Events = lazy(() => import('./pages/Events.jsx'));
const EventDetail = lazy(() => import('./pages/EventDetail.jsx'));
const PostDetail = lazy(() => import('./pages/PostDetail.jsx'));
const Donate = lazy(() => import('./pages/Donate.jsx'));
const ThankYou = lazy(() => import('./pages/ThankYou.jsx'));
const GetInvolved = lazy(() => import('./pages/GetInvolved.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const Terms = lazy(() => import('./pages/Terms.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// Admin
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminContent = lazy(() => import('./pages/admin/AdminContent.jsx'));
const AdminSubmissions = lazy(() => import('./pages/admin/AdminSubmissions.jsx'));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/news/:slug" element={<PostDetail />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="posts" element={<AdminContent resource="posts" />} />
          <Route path="events" element={<AdminContent resource="events" />} />
          <Route path="stats" element={<AdminContent resource="stats" />} />
          <Route path="transparency" element={<AdminContent resource="transparency" />} />
          <Route path="donations" element={<AdminSubmissions resource="donations" />} />
          <Route path="volunteers" element={<AdminSubmissions resource="volunteers" />} />
          <Route path="contacts" element={<AdminSubmissions resource="contacts" />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
