import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EnvelopeSimple, MapPin, PaperPlaneTilt } from '@phosphor-icons/react';
import { MainLayout } from '../layouts/MainLayout';
import { PageHeader } from '../components/shared/PageHeader';
import { ScrollSection } from '../components/scrolling/ScrollSection';
import { Reveal } from '../components/shared/Reveal';
import { StatusBanner } from '../components/shared/StateViews';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { api } from '../services/api';
import { FCIT_IDENTITY } from '../data/verifiedShellContent';

const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Please provide your full name.'),
  email: z.string().trim().email('Please provide a valid email address.'),
  category: z.enum([
    'general',
    'events',
    'faculty',
    'collaboration',
    'alumni',
    'resources',
  ]),
  subject: z.string().trim().min(3, 'Please enter a concise subject.'),
  message: z
    .string()
    .trim()
    .min(10, 'Message should contain at least 10 characters.')
    .max(2500),
});

export function ContactPage() {
  useDocumentMeta({
    title: 'Contact · FCIT, HBTU Kanpur',
    description:
      'Get in touch with the Association of Computer Science and Information Technology at HBTU Kanpur.',
    canonicalPath: '/contact',
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const hasConfiguredEmail =
    FCIT_IDENTITY.contactEmail &&
    !FCIT_IDENTITY.contactEmail.includes('placeholder.invalid');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      category: 'general',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values) => {
    setStatus({ type: '', message: '' });
    try {
      const res = await api.post('/contact', values);
      setStatus({
        type: 'success',
        message:
          res?.message ||
          'Message saved cleanly. Authorized FCIT coordinators can review it in the Admin Portal.',
      });
      reset();
    } catch (err) {
      setStatus({
        type: 'error',
        message:
          err?.message ||
          'Unable to submit your inquiry right now. Please try again shortly.',
      });
    }
  };

  return (
    <MainLayout>
      <PageHeader
        eyebrow="Direct Correspondence"
        title="Contact FCIT"
        description="Reach the student council and department coordinators regarding workshops, technical collaborations, alumni mentorship, or resource contributions."
        toneClass="bg-fcit-peachSoft/60"
      />

      <ScrollSection tone="cream" revealContent={false} className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Institutional Details */}
            <Reveal className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/90 p-6 space-y-4">
                <h2 className="heading-5 text-fcit-navyDeep">Department Location</h2>
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-fcit-navy shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="body-6 text-fcit-secondary">
                    <p className="body-4 text-fcit-navyDeep mb-1">
                      Department of Computer Science and Engineering &amp; IT
                    </p>
                    <p>Harcourt Butler Technical University</p>
                    <p>Nawabganj, Kanpur, Uttar Pradesh, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <EnvelopeSimple size={20} className="text-fcit-navy shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="body-4 text-fcit-navyDeep mb-1">Official Email</p>
                    {hasConfiguredEmail ? (
                      <a
                        href={`mailto:${FCIT_IDENTITY.contactEmail}`}
                        className="body-6 text-fcit-navy underline underline-offset-4"
                      >
                        {FCIT_IDENTITY.contactEmail}
                      </a>
                    ) : (
                      <p className="caption-2 text-fcit-muted">
                        Direct web form submissions are saved securely in the FCIT database. Official mailbox integration can be enabled in environment configuration.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-fcit-navy/15 bg-fcit-lemonSoft/80 p-6">
                <p className="title-3 text-fcit-navyDeep mb-2">
                  Zero Cost Open Correspondence
                </p>
                <p className="body-6 text-fcit-secondary">
                  All inquiries sent here are persisted directly to MongoDB for review by verified FCIT coordinators, ensuring zero dependency on paid third party mail services.
                </p>
              </div>
            </Reveal>

            {/* Contact Form */}
            <Reveal delayMs={80} className="lg:col-span-7">
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/90 p-6 sm:p-8 space-y-4"
              >
                <h2 className="heading-5 text-fcit-navyDeep mb-2">Send a Message</h2>

                <StatusBanner type={status.type} message={status.message} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-name" className="title-4 text-fcit-navyDeep block mb-1">
                      Your Name
                    </label>
                    <input
                      id="c-name"
                      type="text"
                      {...register('name')}
                      className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                    />
                    {errors.name && (
                      <p className="caption-4 text-[#8C1D18] mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="c-email" className="title-4 text-fcit-navyDeep block mb-1">
                      Email Address
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      {...register('email')}
                      className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                    />
                    {errors.email && (
                      <p className="caption-4 text-[#8C1D18] mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-category" className="title-4 text-fcit-navyDeep block mb-1">
                      Inquiry Category
                    </label>
                    <select
                      id="c-category"
                      {...register('category')}
                      className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="events">Events &amp; Workshops</option>
                      <option value="collaboration">Technical Collaboration</option>
                      <option value="alumni">Alumni &amp; Mentorship</option>
                      <option value="resources">Learning Resources</option>
                      <option value="faculty">Faculty Coordination</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="c-subject" className="title-4 text-fcit-navyDeep block mb-1">
                      Subject
                    </label>
                    <input
                      id="c-subject"
                      type="text"
                      {...register('subject')}
                      className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                    />
                    {errors.subject && (
                      <p className="caption-4 text-[#8C1D18] mt-1">{errors.subject.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="c-message" className="title-4 text-fcit-navyDeep block mb-1">
                    Message
                  </label>
                  <textarea
                    id="c-message"
                    rows={5}
                    {...register('message')}
                    className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                  />
                  {errors.message && (
                    <p className="caption-4 text-[#8C1D18] mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-fcit-navyDeep px-4 py-2 button-md text-fcit-cream transition duration-300 ease-fcit hover:bg-fcit-navy disabled:opacity-60"
                >
                  <PaperPlaneTilt size={18} aria-hidden="true" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </ScrollSection>
    </MainLayout>
  );
}
