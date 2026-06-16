/** Events & News — upcoming/past event filter + latest stories. */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Seo from '../components/Seo.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { Section, Eyebrow, Loading, EmptyState, Badge } from '../components/ui.jsx';
import { getEvents, getPosts } from '../lib/api.js';
import { formatDate } from '../lib/format.js';
import { MapPin, CalendarIcon } from '../components/icons.jsx';

function EventCard({ ev }) {
  return (
    <Link to={`/events/${ev.slug}`} className="card group overflow-hidden transition-transform hover:-translate-y-1">
      {ev.coverImage && (
        <img
          src={ev.coverImage}
          alt={ev.title}
          loading="lazy"
          className="h-44 w-full object-cover"
        />
      )}
      <div className="p-6">
        <Badge tone={ev.type === 'UPCOMING' ? 'healing' : 'ink'}>
          {ev.type === 'UPCOMING' ? 'Upcoming' : 'Past'}
        </Badge>
        <h3 className="mt-3 font-display text-xl text-ink group-hover:text-healing">{ev.title}</h3>
        <div className="mt-3 space-y-1.5 text-sm text-slate">
          <p className="flex items-center gap-2"><CalendarIcon width={16} height={16} /> {formatDate(ev.startsAt)}</p>
          <p className="flex items-center gap-2"><MapPin width={16} height={16} /> {ev.location}</p>
        </div>
      </div>
    </Link>
  );
}

export default function Events() {
  const [filter, setFilter] = useState('UPCOMING');
  const { data: events, isLoading } = useQuery({
    queryKey: ['events', filter],
    queryFn: () => getEvents(filter),
  });
  const { data: posts } = useQuery({ queryKey: ['posts'], queryFn: () => getPosts() });

  return (
    <>
      <Seo
        title="Events & news"
        path="/events"
        description="Upcoming health camps and drives, plus the latest news and field stories from Aarogya Foundation."
      />
      <PageHeader
        eyebrow="On the ground"
        title="Camps, drives & dispatches."
        intro="Where we will be next, where we have been, and what we are learning in the field."
      />

      <Section>
        <div className="flex items-center gap-2" role="tablist" aria-label="Filter events">
          {[
            ['UPCOMING', 'Upcoming'],
            ['PAST', 'Past'],
          ].map(([val, label]) => (
            <button
              key={val}
              role="tab"
              aria-selected={filter === val}
              onClick={() => setFilter(val)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                filter === val ? 'bg-healing text-paper' : 'bg-paper-deep text-ink hover:bg-paper-deep/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {isLoading ? (
            <Loading />
          ) : events?.length ? (
            <div className="grid gap-6 md:grid-cols-3">
              {events.map((ev) => (
                <EventCard key={ev._id} ev={ev} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={filter === 'UPCOMING' ? 'No upcoming events just yet' : 'No past events listed'}
              body="Check back soon — our next camps are usually announced two to three weeks ahead."
            />
          )}
        </div>
      </Section>

      {posts?.length > 0 && (
        <div className="bg-paper-deep/40">
          <Section>
            <Eyebrow>Latest stories</Eyebrow>
            <h2 className="mt-3 font-display text-3xl text-ink">News &amp; field notes</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {posts.slice(0, 6).map((p) => (
                <Link
                  key={p._id}
                  to={`/news/${p.slug}`}
                  className="card group overflow-hidden transition-transform hover:-translate-y-1"
                >
                  {p.coverImage && (
                    <img src={p.coverImage} alt={p.title} loading="lazy" className="h-40 w-full object-cover" />
                  )}
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-marigold">
                      {p.category} · {p.readingTimeMin} min read
                    </p>
                    <h3 className="mt-2 font-display text-lg text-ink group-hover:text-healing">{p.title}</h3>
                    <p className="mt-2 text-sm text-slate line-clamp-3">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        </div>
      )}
    </>
  );
}
