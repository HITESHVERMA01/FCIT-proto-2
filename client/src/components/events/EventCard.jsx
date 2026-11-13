import { Link } from 'react-router-dom';
import { CalendarBlank, MapPin, ArrowUpRight, Clock } from '@phosphor-icons/react';
import { resolveMediaUrl } from '../../services/api';

function formatDate(dateVal) {
  if (!dateVal) return 'Date to be announced';
  const parsed = new Date(dateVal);
  if (Number.isNaN(parsed.getTime())) return 'Date to be announced';
  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const STATUS_BADGE = {
  upcoming: 'bg-fcit-sage text-[#1C4B2C] border-[#1C4B2C]/20',
  ongoing: 'bg-fcit-lemon text-[#6B4E08] border-[#6B4E08]/20',
  completed: 'bg-fcit-cream text-fcit-muted border-fcit-navy/15',
  draft: 'bg-fcit-roseSoft text-fcit-secondary border-fcit-navy/15',
};

export function EventCard({ event }) {
  const badgeStyle = STATUS_BADGE[event.status] || STATUS_BADGE.upcoming;
  const posterUrl = resolveMediaUrl(event.poster);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/90 p-3 transition duration-300 ease-fcit hover:border-fcit-navy/35">
      <div className="mb-4 overflow-hidden rounded-xl border border-fcit-navy/10 bg-fcit-lemonSoft aspect-[16/10]">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={event.posterAlt || event.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col justify-between p-4 bg-fcit-ivory">
            <span className="mono-meta uppercase text-fcit-goldInk">
              {event.category}
            </span>
            <p className="heading-6 text-fcit-navyDeep">{event.title}</p>
            <span className="caption-5 text-fcit-muted">FCIT Event Poster Frame</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between px-1 pb-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="mono-meta uppercase text-fcit-navy">
              {event.category}
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 caption-4 capitalize ${badgeStyle}`}>
              {event.status}
            </span>
          </div>

          <h3 className="heading-5 text-fcit-navyDeep mb-2">{event.title}</h3>
          <p className="body-6 text-fcit-secondary mb-4">{event.summary}</p>
        </div>

        <div>
          <div className="space-y-1.5 mb-4 caption-2 text-fcit-muted">
            <div className="flex items-center gap-2">
              <CalendarBlank size={15} className="shrink-0 text-fcit-navy" aria-hidden="true" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={15} className="shrink-0 text-fcit-navy" aria-hidden="true" />
              <span>{event.venue}</span>
            </div>
            {event.registrationDeadline && (
              <div className="flex items-center gap-2">
                <Clock size={15} className="shrink-0 text-fcit-navy" aria-hidden="true" />
                <span>Deadline: {formatDate(event.registrationDeadline)}</span>
              </div>
            )}
          </div>

          <Link
            to={`/events/${event.slug || event._id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-fcit-navyDeep px-3 py-2 button-sm text-fcit-cream transition duration-300 ease-fcit hover:bg-fcit-navy active:scale-[0.98]"
          >
            <span>View Details</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
