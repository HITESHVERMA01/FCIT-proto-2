import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarBlank, Clock, MapPin, ArrowUpRight, ArrowLeft } from '@phosphor-icons/react';
import { MainLayout } from '../layouts/MainLayout';
import { ScrollSection } from '../components/scrolling/ScrollSection';
import { Reveal } from '../components/shared/Reveal';
import {
  CardGridSkeleton,
  ErrorState,
  StatusBanner,
} from '../components/shared/StateViews';
import { useApiResource } from '../hooks/useApiResource';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { api, resolveMediaUrl } from '../services/api';

const registrationSchema = z.object({
  studentName: z.string().trim().min(2, 'Please enter your full name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  rollNumber: z.string().trim().min(3, 'Please enter your HBTU roll number.'),
  branch: z.string().trim().min(2, 'Please select your department or branch.'),
  year: z.string().trim().min(1, 'Please select your academic year.'),
  notes: z.string().trim().max(500).optional().default(''),
});

export function EventDetailPage() {
  const { slug } = useParams();
  const { data: event, loading, error, refetch } = useApiResource(`/events/${slug}`, {
    initialData: null,
  });

  useDocumentMeta({
    title: event ? `${event.title} · FCIT Events` : 'Event Details · FCIT, HBTU Kanpur',
    description: event?.summary || 'Detailed schedule, venue, and registration for FCIT events.',
    canonicalPath: `/events/${slug}`,
  });

  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      studentName: '',
      email: '',
      rollNumber: '',
      branch: 'Computer Science and Engineering',
      year: '1st Year',
      notes: '',
    },
  });

  const onSubmit = async (values) => {
    setSubmitStatus({ type: '', message: '' });
    try {
      const res = await api.post(`/events/${event._id}/register`, values);
      setSubmitStatus({
        type: 'success',
        message: res?.message || 'Registration recorded cleanly.',
      });
      reset();
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: err?.message || 'Registration could not be saved. Please try again.',
      });
    }
  };

  const canRegister =
    event &&
    (event.status === 'upcoming' || event.status === 'ongoing') &&
    (!event.registrationDeadline || new Date() <= new Date(event.registrationDeadline));

  return (
    <MainLayout>
      <ScrollSection tone="cream" revealContent={false} className="pt-28 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <div className="hero-stage-item hero-stage-1">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-lg border border-fcit-navy/15 bg-fcit-ivory px-3 py-1.5 caption-3 text-fcit-navyDeep mb-8 hover:bg-fcit-lemonSoft"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              <span>All Events</span>
            </Link>
          </div>

          {loading ? (
            <CardGridSkeleton count={1} columns="grid-cols-1" />
          ) : error || !event ? (
            <ErrorState message={error || 'Event record not found.'} onRetry={refetch} />
          ) : (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              {/* Event Body */}
              <Reveal className="lg:col-span-7">
                <span className="mono-meta uppercase text-fcit-goldInk block mb-2">
                  {event.category} · {event.status}
                </span>
                <h1 className="heading-3 sm:heading-2 text-fcit-navyDeep mb-4">
                  {event.title}
                </h1>
                <p className="body-2 text-fcit-secondary mb-6">{event.summary}</p>

                {event.poster && (
                  <div className="overflow-hidden rounded-2xl bg-fcit-ivory shadow-[0_18px_46px_-22px_rgba(11,39,71,0.18)] mb-8">
                    <img
                      src={resolveMediaUrl(event.poster)}
                      alt={event.posterAlt || event.title}
                      className="w-full object-cover max-h-[420px]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/80 p-4 mb-8">
                  <div className="flex items-start gap-2">
                    <CalendarBlank size={18} className="text-fcit-navy shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="caption-4 text-fcit-muted">Date</p>
                      <p className="body-5 text-fcit-navyDeep">
                        {new Date(event.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-fcit-navy shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="caption-4 text-fcit-muted">Venue</p>
                      <p className="body-5 text-fcit-navyDeep">{event.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={18} className="text-fcit-navy shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="caption-4 text-fcit-muted">Deadline</p>
                      <p className="body-5 text-fcit-navyDeep">
                        {event.registrationDeadline
                          ? new Date(event.registrationDeadline).toLocaleDateString('en-IN')
                          : 'Open until start'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="heading-5 text-fcit-navyDeep">Overview &amp; Guidelines</h2>
                  <div className="body-3 text-fcit-secondary whitespace-pre-line">
                    {event.description}
                  </div>
                </div>
              </Reveal>

              {/* Registration Panel */}
              <Reveal delayMs={80} className="lg:col-span-5">
                <div className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/90 p-6">
                  <h2 className="heading-5 text-fcit-navyDeep mb-2">
                    Event Registration
                  </h2>
                  <p className="body-6 text-fcit-secondary mb-6">
                    {canRegister
                      ? 'Submit your student details below to register directly with the FCIT team.'
                      : 'Registration for this session is currently closed.'}
                  </p>

                  {event.registrationLink && canRegister && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-fcit-navy/25 bg-fcit-cream px-3 py-2 button-sm text-fcit-navyDeep hover:bg-fcit-lemonSoft"
                    >
                      <span>Open External Registration Link</span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  )}

                  {canRegister && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                      <StatusBanner type={submitStatus.type} message={submitStatus.message} />

                      <div>
                        <label htmlFor="reg-name" className="title-4 text-fcit-navyDeep block mb-1">
                          Full Name
                        </label>
                        <input
                          id="reg-name"
                          type="text"
                          {...register('studentName')}
                          className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                        />
                        {errors.studentName && (
                          <p className="caption-4 text-[#8C1D18] mt-1">{errors.studentName.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="reg-email" className="title-4 text-fcit-navyDeep block mb-1">
                          Email Address
                        </label>
                        <input
                          id="reg-email"
                          type="email"
                          {...register('email')}
                          className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                        />
                        {errors.email && (
                          <p className="caption-4 text-[#8C1D18] mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="reg-roll" className="title-4 text-fcit-navyDeep block mb-1">
                          University Roll Number
                        </label>
                        <input
                          id="reg-roll"
                          type="text"
                          {...register('rollNumber')}
                          className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                        />
                        {errors.rollNumber && (
                          <p className="caption-4 text-[#8C1D18] mt-1">{errors.rollNumber.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="reg-branch" className="title-4 text-fcit-navyDeep block mb-1">
                            Branch
                          </label>
                          <select
                            id="reg-branch"
                            {...register('branch')}
                            className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                          >
                            <option value="Computer Science and Engineering">CSE</option>
                            <option value="Information Technology">IT</option>
                            <option value="Electronics Engineering">ET</option>
                            <option value="Other HBTU Department">Other</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="reg-year" className="title-4 text-fcit-navyDeep block mb-1">
                            Year
                          </label>
                          <select
                            id="reg-year"
                            {...register('year')}
                            className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                          >
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="MCA / Postgrad">MCA / Postgrad</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="reg-notes" className="title-4 text-fcit-navyDeep block mb-1">
                          Notes or Questions (Optional)
                        </label>
                        <textarea
                          id="reg-notes"
                          rows={2}
                          {...register('notes')}
                          className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center rounded-lg bg-fcit-navyDeep px-3 py-2 button-md text-fcit-cream transition duration-300 ease-fcit hover:bg-fcit-navy disabled:opacity-60"
                      >
                        {isSubmitting ? 'Submitting Registration...' : 'Confirm Registration'}
                      </button>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </ScrollSection>
    </MainLayout>
  );
}
