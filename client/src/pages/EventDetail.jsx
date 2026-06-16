/** Event detail page with event JSON-LD. */
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Seo from '../components/Seo.jsx';
import { Section, Loading, ErrorState, Badge } from '../components/ui.jsx';
import { LifelineDivider } from '../components/Lifeline.jsx';
import { getEvent } from '../lib/api.js';
import { formatDate } from '../lib/format.js';
import { MapPin, CalendarIcon } from '../components/icons.jsx';

export default function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => getEvent(slug),
  });

  if (isLoading) return <Loading />;
  if (isError || !event)
    return (
      <Section>
        <ErrorState message="We could not find that event." onRetry={() => navigate('/events')} />
      </Section>
    );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.startsAt,
    location: { '@type': 'Place', name: event.location },
    description: event.description,
    organizer: { '@type': 'NGO', name: 'Aarogya Foundation' },
  };

  return (
    <>
      <Seo title={event.title} path={`/events/${event.slug}`} description={event.description.slice(0, 150)} image={event.coverImage} jsonLd={jsonLd} />
      <article>
        {event.coverImage && (
          <img src={event.coverImage} alt={event.title} className="h-72 w-full object-cover md:h-96" />
        )}
        <Section className="max-w-3xl">
          <Link to="/events" className="text-sm font-semibold text-healing hover:underline">
            ← Back to events
          </Link>
          <Badge tone={event.type === 'UPCOMING' ? 'healing' : 'ink'}>
            {event.type === 'UPCOMING' ? 'Upcoming' : 'Past'}
          </Badge>
          <h1 className="mt-4 font-display text-4xl text-ink">{event.title}</h1>
          <div className="mt-4 flex flex-wrap gap-5 text-slate">
            <span className="flex items-center gap-2"><CalendarIcon width={18} height={18} /> {formatDate(event.startsAt)}</span>
            <span className="flex items-center gap-2"><MapPin width={18} height={18} /> {event.location}</span>
          </div>
          <LifelineDivider className="my-8" />
          <div className="prose-aarogya text-lg">
            {event.description.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {event.type === 'UPCOMING' && (
            <div className="card mt-10 bg-healing-soft p-7">
              <p className="font-display text-xl text-ink">Want to help at this camp?</p>
              <p className="mt-1 text-slate">We need clinical and logistics volunteers on the ground.</p>
              <Link to="/get-involved" className="btn-primary mt-4">Volunteer for this camp</Link>
            </div>
          )}
        </Section>
      </article>
    </>
  );
}
