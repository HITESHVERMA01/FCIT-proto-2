import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  SignOut,
  Trash,
  UploadSimple,
  UsersThree,
} from '@phosphor-icons/react';
import { MainLayout } from '../layouts/MainLayout';
import { AdminResourceManager } from '../components/admin/AdminResourceManager';
import {
  CardGridSkeleton,
  EmptyState,
  StatusBanner,
} from '../components/shared/StateViews';
import { useAuth } from '../context/AuthContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { api, resolveMediaUrl } from '../services/api';

const PHOTO_POSITION_OPTIONS = [
  { value: 'object-top', label: 'Top Aligned (Recommended Portraits)' },
  { value: 'object-center', label: 'Center Aligned' },
  { value: 'object-bottom', label: 'Bottom Aligned' },
];

const RESOURCE_CONFIGS = {
  faculty: {
    title: 'Faculty & Mentors',
    endpoint: '/faculty',
    photoField: 'photo',
    supportsReorder: true,
    titleField: 'name',
    subtitleField: 'designation',
    fields: [
      { name: 'name', label: 'Full Name', required: true },
      {
        name: 'designation',
        label: 'Official Designation',
        required: true,
        placeholder: 'Head of Department, Professor, Associate Professor, Assistant Professor',
      },
      {
        name: 'department',
        label: 'Department',
        defaultValue: 'Department of Computer Science and Engineering',
      },
      {
        name: 'qualifications',
        label: 'Qualifications (comma separated)',
        type: 'tags',
        placeholder: 'Ph.D. (CSE), M.Tech',
      },
      { name: 'expertise', label: 'Expertise Areas (comma separated)', type: 'tags' },
      { name: 'profileUrl', label: 'Institutional Profile URL', type: 'url' },
      {
        name: 'photoAlt',
        label: 'Portrait Alt Text (Optional)',
        placeholder: 'Describe faculty portrait for screen readers',
      },
      {
        name: 'photoPosition',
        label: 'Portrait Crop Alignment',
        type: 'select',
        defaultValue: 'object-top',
        options: PHOTO_POSITION_OPTIONS,
      },
      {
        name: 'verificationStatus',
        label: 'Verification Status',
        type: 'select',
        defaultValue: 'verified',
        options: [
          { value: 'verified', label: 'Verified' },
          { value: 'pending_verification', label: 'Pending Verification' },
          { value: 'draft', label: 'Draft' },
        ],
      },
      { name: 'isPublished', label: 'Publish immediately on public website', type: 'checkbox', defaultValue: false },
    ],
  },
  team: {
    title: 'Student Team',
    endpoint: '/team',
    photoField: 'photo',
    supportsReorder: true,
    titleField: 'name',
    subtitleField: 'designation',
    fields: [
      { name: 'name', label: 'Full Name', required: true },
      {
        name: 'designation',
        label: 'FCIT Role / Designation',
        required: true,
        placeholder: 'President, Vice President, General Secretary, Technical Head, Event Head, Design Head, Coordinator',
      },
      {
        name: 'academicYear',
        label: 'Academic Session (e.g. 2026 / 2027)',
        required: true,
        placeholder: '2026 / 2027',
      },
      { name: 'department', label: 'Department / Branch', defaultValue: 'Computer Science and Engineering' },
      { name: 'introduction', label: 'Short Introduction', type: 'textarea' },
      { name: 'linkedin', label: 'LinkedIn URL', type: 'url' },
      { name: 'github', label: 'GitHub URL', type: 'url' },
      {
        name: 'email',
        label: 'Email Address (Optional)',
        type: 'email',
        placeholder: 'member@domain.edu',
      },
      {
        name: 'showEmailPublicly',
        label: 'Allow displaying this student email publicly on the website card',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'photoAlt',
        label: 'Portrait Alt Text (Optional)',
        placeholder: 'Describe student portrait for screen readers',
      },
      {
        name: 'photoPosition',
        label: 'Portrait Crop Alignment',
        type: 'select',
        defaultValue: 'object-top',
        options: PHOTO_POSITION_OPTIONS,
      },
      {
        name: 'verificationStatus',
        label: 'Verification Status',
        type: 'select',
        defaultValue: 'verified',
        options: [
          { value: 'verified', label: 'Verified' },
          { value: 'pending_verification', label: 'Pending Verification' },
          { value: 'draft', label: 'Draft' },
        ],
      },
      { name: 'isPublished', label: 'Publish immediately', type: 'checkbox', defaultValue: false },
    ],
  },
  events: {
    title: 'Events',
    endpoint: '/events',
    photoField: 'poster',
    supportsReorder: false,
    titleField: 'title',
    subtitleField: 'venue',
    fields: [
      { name: 'title', label: 'Event Title', required: true },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        defaultValue: 'workshop',
        options: [
          { value: 'workshop', label: 'Workshop' },
          { value: 'hackathon', label: 'Hackathon' },
          { value: 'seminar', label: 'Seminar' },
          { value: 'contest', label: 'Contest' },
          { value: 'community', label: 'Community' },
          { value: 'symposium', label: 'Symposium' },
        ],
      },
      { name: 'date', label: 'Event Date', type: 'date', required: true },
      { name: 'registrationDeadline', label: 'Registration Deadline', type: 'date' },
      { name: 'venue', label: 'Venue', required: true },
      { name: 'capacity', label: 'Capacity (0 for unlimited)', type: 'number', defaultValue: 0 },
      {
        name: 'status',
        label: 'Event Status',
        type: 'select',
        defaultValue: 'upcoming',
        options: [
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'ongoing', label: 'Ongoing' },
          { value: 'completed', label: 'Completed' },
          { value: 'draft', label: 'Draft' },
        ],
      },
      { name: 'registrationLink', label: 'External Registration URL (Optional)', type: 'url' },
      { name: 'summary', label: 'Short Summary', type: 'textarea', required: true },
      { name: 'description', label: 'Full Event Details & Agenda', type: 'textarea', required: true },
      { name: 'isPublished', label: 'Publish on public website', type: 'checkbox', defaultValue: false },
    ],
  },
  history: {
    title: 'History Archive',
    endpoint: '/history',
    photoField: 'primaryImage',
    supportsReorder: true,
    supportsVerification: true,
    supportsAdditionalImages: true,
    titleField: 'title',
    subtitleField: 'year',
    fields: [
      { name: 'year', label: 'Verified Year or Era Label', required: true },
      { name: 'title', label: 'Milestone Title', required: true },
      { name: 'shortTitle', label: 'Short Indicator Label (Optional)' },
      { name: 'category', label: 'Category', required: true },
      {
        name: 'layoutVariant',
        label: 'Visual Panel Composition',
        type: 'select',
        defaultValue: 'auto',
        options: [
          { value: 'auto', label: 'Auto Vary by Index' },
          { value: 'full-bleed', label: 'Full Bleed Photograph' },
          { value: 'studio-split', label: 'Studio Split Plate' },
          { value: 'collage', label: 'Multi Photo Collage' },
          { value: 'emblem-seal', label: 'Emblem Optical Mat' },
          { value: 'archival-draft', label: 'Non Photographic Archival Plate' },
        ],
      },
      { name: 'description', label: 'Archival Description', type: 'textarea', required: true },
      { name: 'highlights', label: 'Highlights (comma separated)', type: 'tags' },
      { name: 'relatedEvents', label: 'Related Events (comma separated)', type: 'tags' },
      { name: 'contributors', label: 'Contributors (comma separated)', type: 'tags' },
      { name: 'historicalSource', label: 'Historical Source / Citation' },
      {
        name: 'verificationStatus',
        label: 'Verification Status',
        type: 'select',
        defaultValue: 'pending_verification',
        options: [
          { value: 'verified', label: 'Verified' },
          { value: 'pending_verification', label: 'Pending Verification' },
          { value: 'draft', label: 'Draft' },
        ],
      },
      { name: 'isPublished', label: 'Publish in Interactive History Archive', type: 'checkbox', defaultValue: false },
    ],
  },
  achievements: {
    title: 'Achievements',
    endpoint: '/achievements',
    photoField: 'image',
    supportsReorder: false,
    titleField: 'title',
    subtitleField: 'year',
    fields: [
      { name: 'title', label: 'Achievement Title', required: true },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        defaultValue: 'hackathon',
        options: [
          { value: 'hackathon', label: 'Hackathon' },
          { value: 'competition', label: 'Competition' },
          { value: 'research', label: 'Research' },
          { value: 'publication', label: 'Publication' },
          { value: 'initiative', label: 'Initiative' },
        ],
      },
      { name: 'year', label: 'Year', required: true },
      { name: 'recipients', label: 'Recipients (comma separated)', type: 'tags' },
      { name: 'summary', label: 'Summary', type: 'textarea', required: true },
      { name: 'proofUrl', label: 'Verification / Reference URL', type: 'url' },
      { name: 'isPublished', label: 'Publish', type: 'checkbox', defaultValue: false },
    ],
  },
  projects: {
    title: 'Student Projects',
    endpoint: '/projects',
    photoField: 'thumbnail',
    supportsReorder: false,
    titleField: 'title',
    subtitleField: 'domain',
    fields: [
      { name: 'title', label: 'Project Title', required: true },
      { name: 'domain', label: 'Domain (e.g. Systems, Web, AI)', required: true },
      { name: 'year', label: 'Year', required: true },
      { name: 'authors', label: 'Student Authors (comma separated)', type: 'tags' },
      { name: 'techStack', label: 'Technologies (comma separated)', type: 'tags' },
      { name: 'repositoryUrl', label: 'Repository URL', type: 'url' },
      { name: 'demoUrl', label: 'Live Demo URL', type: 'url' },
      { name: 'summary', label: 'Project Summary', type: 'textarea', required: true },
      { name: 'isPublished', label: 'Publish', type: 'checkbox', defaultValue: false },
    ],
  },
  alumni: {
    title: 'Alumni Network',
    endpoint: '/alumni',
    photoField: 'photo',
    supportsReorder: false,
    titleField: 'name',
    subtitleField: 'organization',
    fields: [
      { name: 'name', label: 'Alumnus Name', required: true },
      { name: 'graduationYear', label: 'Graduation Year', required: true },
      { name: 'degree', label: 'Degree', defaultValue: 'B.Tech CSE / IT' },
      { name: 'currentRole', label: 'Current Role', required: true },
      { name: 'organization', label: 'Organization', required: true },
      { name: 'mentorshipAreas', label: 'Mentorship Areas (comma separated)', type: 'tags' },
      { name: 'story', label: 'Perspective / Advice', type: 'textarea' },
      { name: 'linkedin', label: 'LinkedIn URL', type: 'url' },
      { name: 'isPublished', label: 'Publish', type: 'checkbox', defaultValue: false },
    ],
  },
  resources: {
    title: 'Learning Resources',
    endpoint: '/resources',
    supportsReorder: false,
    titleField: 'title',
    subtitleField: 'category',
    fields: [
      { name: 'title', label: 'Resource Title', required: true },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        defaultValue: 'dsa',
        options: [
          { value: 'dsa', label: 'DSA & Algorithms' },
          { value: 'roadmap', label: 'Roadmaps' },
          { value: 'workshop', label: 'Workshop Decks' },
          { value: 'notes', label: 'Department Notes' },
          { value: 'placement', label: 'Placement Prep' },
          { value: 'reference', label: 'References' },
        ],
      },
      {
        name: 'level',
        label: 'Level',
        type: 'select',
        defaultValue: 'all',
        options: [
          { value: 'all', label: 'All Levels' },
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' },
        ],
      },
      { name: 'contributor', label: 'Contributor / Author' },
      { name: 'resourceUrl', label: 'Resource Link URL', type: 'url' },
      { name: 'tags', label: 'Tags (comma separated)', type: 'tags' },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'isPublished', label: 'Publish', type: 'checkbox', defaultValue: false },
    ],
  },
  announcements: {
    title: 'Announcements',
    endpoint: '/announcements',
    supportsReorder: false,
    titleField: 'title',
    subtitleField: 'category',
    fields: [
      { name: 'title', label: 'Announcement Title', required: true },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        defaultValue: 'notice',
        options: [
          { value: 'notice', label: 'Notice' },
          { value: 'recruitment', label: 'Recruitment' },
          { value: 'event', label: 'Event' },
          { value: 'academic', label: 'Academic' },
        ],
      },
      { name: 'linkUrl', label: 'Related URL', type: 'url' },
      { name: 'priority', label: 'Priority Order', type: 'number', defaultValue: 0 },
      { name: 'summary', label: 'Summary', type: 'textarea', required: true },
      { name: 'isPublished', label: 'Publish', type: 'checkbox', defaultValue: false },
    ],
  },
};

export function AdminDashboardPage() {
  useDocumentMeta({
    title: 'Admin Dashboard · FCIT, HBTU Kanpur',
    description: 'Role protected content management system for FCIT coordinators and faculty.',
    canonicalPath: '/admin',
    noIndex: true,
  });

  const { user, loading: authLoading, isStaff, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [messages, setMessages] = useState([]);
  const [galleryAlbums, setGalleryAlbums] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [regEvents, setRegEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [panelStatus, setPanelStatus] = useState({ type: '', message: '' });

  const loadOverview = async () => {
    try {
      const res = await api.get('/admin/overview');
      setOverview(res?.data || null);
    } catch {
      // Handled per view
    }
  };

  useEffect(() => {
    if (!isStaff) return;
    loadOverview();
  }, [isStaff, activeTab]);

  useEffect(() => {
    if (!isStaff) return;
    if (activeTab === 'messages') {
      api.get('/contact').then((r) => setMessages(r?.data || [])).catch(() => {});
    }
    if (activeTab === 'gallery') {
      Promise.all([
        api.get('/gallery/albums?includeDrafts=true'),
        api.get('/gallery/images?includeDrafts=true'),
      ])
        .then(([a, i]) => {
          setGalleryAlbums(a?.data || []);
          setGalleryImages(i?.data || []);
        })
        .catch(() => {});
    }
    if (activeTab === 'registrations') {
      api
        .get('/events?includeDrafts=true')
        .then((r) => {
          const list = r?.data || [];
          setRegEvents(list);
          if (list[0]) {
            setSelectedEventId((prev) => prev || list[0]._id);
          }
        })
        .catch(() => {});
    }
    if (activeTab === 'users' && user?.role === 'super_admin') {
      api.get('/auth/users').then((r) => setUsersList(r?.data || [])).catch(() => {});
    }
  }, [activeTab, isStaff, user?.role]);

  useEffect(() => {
    if (activeTab === 'registrations' && selectedEventId) {
      api
        .get(`/events/${selectedEventId}/registrations`)
        .then((r) => setRegistrations(r?.data || []))
        .catch(() => {});
    }
  }, [activeTab, selectedEventId]);

  if (authLoading) {
    return (
      <MainLayout showBowlGlow={false}>
        <div className="mx-auto max-w-6xl px-4 pt-32 pb-20">
          <CardGridSkeleton count={3} />
        </div>
      </MainLayout>
    );
  }

  if (!user || !isStaff) {
    return <Navigate to="/login" replace />;
  }

  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      await api.post('/gallery/images/upload', fd);
      setPanelStatus({ type: 'success', message: 'Photograph uploaded to Gallery.' });
      form.reset();
      const res = await api.get('/gallery/images?includeDrafts=true');
      setGalleryImages(res?.data || []);
    } catch (err) {
      setPanelStatus({ type: 'error', message: err?.message || 'Gallery upload failed.' });
    }
  };

  const handleMessageStatus = async (msgId, nextStatus) => {
    try {
      await api.patch(`/contact/${msgId}`, { status: nextStatus });
      setMessages((prev) =>
        prev.map((m) => (m._id === msgId ? { ...m, status: nextStatus } : m))
      );
    } catch (err) {
      setPanelStatus({ type: 'error', message: err?.message || 'Update failed.' });
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'faculty', label: 'Faculty' },
    { key: 'team', label: 'Student Team' },
    { key: 'events', label: 'Events' },
    { key: 'registrations', label: 'Registrations' },
    { key: 'history', label: 'History' },
    { key: 'gallery', label: 'Gallery' },
    { key: 'achievements', label: 'Achievements' },
    { key: 'projects', label: 'Projects' },
    { key: 'alumni', label: 'Alumni' },
    { key: 'resources', label: 'Resources' },
    { key: 'announcements', label: 'Announcements' },
    { key: 'messages', label: 'Contact Inbox' },
    ...(user.role === 'super_admin' ? [{ key: 'users', label: 'User Roles' }] : []),
  ];

  const activeConfig = RESOURCE_CONFIGS[activeTab];
  const isAdmin = user.role === 'super_admin' || user.role === 'admin';

  return (
    <MainLayout showBowlGlow={false}>
      <section className="pt-28 pb-20 bg-fcit-cream min-h-screen">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-fcit-navy/15 pb-6 mb-8">
            <div>
              <p className="mono-meta uppercase text-fcit-goldInk mb-1">
                Role: {user.role}
              </p>
              <h1 className="heading-3 text-fcit-navyDeep">FCIT Admin Dashboard</h1>
              <p className="body-6 text-fcit-muted">
                Signed in as {user.name} ({user.email})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="rounded-lg border border-fcit-navy/20 bg-fcit-ivory px-3 py-2 button-sm text-fcit-navyDeep hover:bg-fcit-lemonSoft"
              >
                View Public Site
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-lg bg-fcit-navyDeep px-3 py-2 button-sm text-fcit-cream hover:bg-fcit-navy"
              >
                <SignOut size={16} aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setPanelStatus({ type: '', message: '' });
                }}
                className={`rounded-lg px-3 py-2 button-sm transition duration-300 ease-fcit ${
                  activeTab === tab.key
                    ? 'bg-fcit-navyDeep text-fcit-cream'
                    : 'border border-fcit-navy/15 bg-fcit-ivory text-fcit-secondary hover:bg-fcit-lemonSoft'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <StatusBanner type={panelStatus.type} message={panelStatus.message} />

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8 mt-4">
              {overview ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Events', value: overview.counts.events },
                      { label: 'Registrations', value: overview.counts.registrations },
                      { label: 'Faculty Profiles', value: overview.counts.faculty },
                      { label: 'Team Members', value: overview.counts.team },
                      { label: 'History Records', value: overview.counts.history },
                      { label: 'Gallery Photos', value: overview.counts.galleryImages },
                      { label: 'Resources', value: overview.counts.resources },
                      { label: 'Unread Messages', value: overview.counts.unreadMessages },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/90 p-5"
                      >
                        <p className="caption-3 text-fcit-muted mb-1">{stat.label}</p>
                        <p className="heading-3 text-fcit-navyDeep">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/90 p-6">
                      <h2 className="heading-6 text-fcit-navyDeep mb-4">Recent Inquiries</h2>
                      {overview.recentActivity.messages.length === 0 ? (
                        <p className="body-6 text-fcit-muted">No contact inquiries yet.</p>
                      ) : (
                        <ul className="space-y-3">
                          {overview.recentActivity.messages.map((m) => (
                            <li
                              key={m._id}
                              className="rounded-xl border border-fcit-navy/10 bg-fcit-cream p-3 flex items-center justify-between gap-2"
                            >
                              <div>
                                <p className="body-4 text-fcit-navyDeep">{m.subject}</p>
                                <p className="caption-4 text-fcit-muted">
                                  {m.name} · {m.category}
                                </p>
                              </div>
                              <span className="caption-5 rounded-full border border-fcit-navy/15 px-2 py-0.5">
                                {m.status}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/90 p-6">
                      <h2 className="heading-6 text-fcit-navyDeep mb-4">Recent Event Registrations</h2>
                      {overview.recentActivity.registrations.length === 0 ? (
                        <p className="body-6 text-fcit-muted">No student registrations yet.</p>
                      ) : (
                        <ul className="space-y-3">
                          {overview.recentActivity.registrations.map((r) => (
                            <li
                              key={r._id}
                              className="rounded-xl border border-fcit-navy/10 bg-fcit-cream p-3 flex items-center justify-between gap-2"
                            >
                              <div>
                                <p className="body-4 text-fcit-navyDeep">{r.studentName}</p>
                                <p className="caption-4 text-fcit-muted">
                                  {r.eventId?.title || 'Event'} · {r.rollNumber}
                                </p>
                              </div>
                              <span className="caption-5 text-fcit-navy">{r.branch}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <CardGridSkeleton count={4} />
              )}
            </div>
          )}

          {/* Standard CRUD Resource Managers */}
          {activeConfig && (
            <div className="mt-4">
              <AdminResourceManager
                {...activeConfig}
                canDelete={isAdmin}
              />
            </div>
          )}

          {/* Registrations Manager */}
          {activeTab === 'registrations' && (
            <div className="space-y-6 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="heading-4 text-fcit-navyDeep">Event Registrations</h2>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="rounded-lg border border-fcit-navy/20 bg-fcit-ivory px-3 py-2 body-6 text-fcit-ink"
                >
                  {regEvents.map((ev) => (
                    <option key={ev._id} value={ev._id}>
                      {ev.title}
                    </option>
                  ))}
                </select>
              </div>

              {registrations.length === 0 ? (
                <EmptyState
                  title="No registrations recorded for this event"
                  description="Student registrations submitted on the public event page appear here."
                />
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-fcit-navy/15 bg-fcit-ivory p-4">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-fcit-navy/15 caption-3 text-fcit-muted">
                        <th className="py-2 pr-4">Student</th>
                        <th className="py-2 pr-4">Roll No.</th>
                        <th className="py-2 pr-4">Branch &amp; Year</th>
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="body-6 text-fcit-secondary">
                      {registrations.map((r) => (
                        <tr key={r._id} className="border-b border-fcit-navy/10 last:border-b-0">
                          <td className="py-3 pr-4 font-medium text-fcit-navyDeep">{r.studentName}</td>
                          <td className="py-3 pr-4 mono-meta">{r.rollNumber}</td>
                          <td className="py-3 pr-4">{r.branch} · {r.year}</td>
                          <td className="py-3 pr-4">{r.email}</td>
                          <td className="py-3">
                            <select
                              value={r.status}
                              onChange={async (e) => {
                                const next = e.target.value;
                                try {
                                  await api.patch(`/events/registrations/${r._id}/status`, { status: next });
                                  setRegistrations((prev) =>
                                    prev.map((x) => (x._id === r._id ? { ...x, status: next } : x))
                                  );
                                } catch (err) {
                                  setPanelStatus({
                                    type: 'error',
                                    message: err?.message || 'Unable to update registration status.',
                                  });
                                }
                              }}
                              className="rounded border border-fcit-navy/20 bg-fcit-cream px-2 py-1 caption-4"
                            >
                              <option value="registered">Registered</option>
                              <option value="attended">Attended</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Gallery Manager */}
          {activeTab === 'gallery' && (
            <div className="space-y-8 mt-4">
              <AdminResourceManager
                title="Gallery Albums"
                endpoint="/gallery/albums"
                photoField="coverImage"
                supportsReorder
                titleField="title"
                subtitleField="category"
                canDelete={isAdmin}
                onMutate={() => {
                  api
                    .get('/gallery/albums?includeDrafts=true')
                    .then((a) => setGalleryAlbums(a?.data || []))
                    .catch(() => {});
                }}
                fields={[
                  { name: 'title', label: 'Album Title', required: true },
                  { name: 'category', label: 'Category', required: true },
                  { name: 'year', label: 'Year', required: true },
                  { name: 'description', label: 'Description', type: 'textarea' },
                  { name: 'isPublished', label: 'Publish Album', type: 'checkbox', defaultValue: false },
                ]}
              />

              <form
                onSubmit={handleGalleryUpload}
                className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory p-6 space-y-4"
              >
                <h3 className="heading-5 text-fcit-navyDeep">Upload Photograph to Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="title"
                    required
                    placeholder="Photograph Title"
                    className="rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6"
                  />
                  <input
                    name="category"
                    required
                    placeholder="Category (e.g. Campus, Workshop)"
                    className="rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6"
                  />
                  <input
                    name="year"
                    required
                    placeholder="Year (e.g. 2026)"
                    className="rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6"
                  />
                  <select
                    name="albumId"
                    className="rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6"
                  >
                    <option value="">No Album (Standalone Photo)</option>
                    {galleryAlbums.map((al) => (
                      <option key={al._id} value={al._id}>
                        {al.title}
                      </option>
                    ))}
                  </select>
                  <input
                    name="altText"
                    required
                    placeholder="Accessible Alt Text Description"
                    className="sm:col-span-2 rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6"
                  />
                  <input
                    name="caption"
                    placeholder="Optional Caption"
                    className="sm:col-span-2 rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6"
                  />
                  <input
                    name="image"
                    type="file"
                    required
                    accept="image/jpeg,image/png,image/webp"
                    className="sm:col-span-2 body-6"
                  />
                  <label className="flex items-center gap-2 sm:col-span-2">
                    <input
                      type="checkbox"
                      name="isPublished"
                      value="true"
                      defaultChecked
                      className="h-4 w-4 accent-[#0B2747]"
                    />
                    <span className="title-4 text-fcit-navyDeep">Publish immediately</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-fcit-navyDeep px-4 py-2 button-sm text-fcit-cream hover:bg-fcit-navy"
                >
                  <UploadSimple size={16} aria-hidden="true" />
                  <span>Upload Photo</span>
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {galleryImages.map((img) => (
                  <div
                    key={img._id}
                    className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory p-3 flex flex-col justify-between"
                  >
                    <img
                      src={resolveMediaUrl(img.imageUrl)}
                      alt={img.altText}
                      className="aspect-[16/10] w-full rounded-xl object-cover mb-3"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="title-4 text-fcit-navyDeep">{img.title}</p>
                        <p className="caption-5 text-fcit-muted">
                          {img.category} · {img.year}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await api.del(`/gallery/images/${img._id}`);
                            setGalleryImages((prev) => prev.filter((x) => x._id !== img._id));
                            setPanelStatus({
                              type: 'success',
                              message: `Removed photograph "${img.title}".`,
                            });
                          } catch (err) {
                            setPanelStatus({
                              type: 'error',
                              message: err?.message || 'Could not remove gallery photograph.',
                            });
                          }
                        }}
                        aria-label={`Delete ${img.title}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-900/20 bg-[#F6E2E0] text-[#8C1D18]"
                      >
                        <Trash size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Messages Inbox */}
          {activeTab === 'messages' && (
            <div className="space-y-4 mt-4">
              <h2 className="heading-4 text-fcit-navyDeep">Contact Inquiries</h2>
              {messages.length === 0 ? (
                <EmptyState
                  title="Inbox is empty"
                  description="Messages submitted from the public Contact page appear here."
                />
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m._id}
                      className="rounded-2xl border border-fcit-navy/15 bg-fcit-ivory p-5 space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <span className="mono-meta text-fcit-goldInk uppercase">{m.category}</span>
                          <h3 className="heading-6 text-fcit-navyDeep">{m.subject}</h3>
                          <p className="caption-2 text-fcit-muted">
                            From {m.name} ({m.email})
                          </p>
                        </div>
                        <select
                          value={m.status}
                          onChange={(e) => handleMessageStatus(m._id, e.target.value)}
                          className="rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-1.5 caption-3"
                        >
                          <option value="new">New</option>
                          <option value="in_review">In Review</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                      <p className="body-6 text-fcit-secondary">{m.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Super Admin User Roles */}
          {activeTab === 'users' && user.role === 'super_admin' && (
            <div className="space-y-4 mt-4">
              <h2 className="heading-4 text-fcit-navyDeep flex items-center gap-2">
                <UsersThree size={24} aria-hidden="true" />
                <span>Account Role Governance</span>
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-fcit-navy/15 bg-fcit-ivory p-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-fcit-navy/15 caption-3 text-fcit-muted">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Role</th>
                      <th className="py-2">Active</th>
                    </tr>
                  </thead>
                  <tbody className="body-6">
                    {usersList.map((u) => (
                      <tr key={u._id} className="border-b border-fcit-navy/10 last:border-b-0">
                        <td className="py-3 pr-4 font-medium text-fcit-navyDeep">{u.name}</td>
                        <td className="py-3 pr-4">{u.email}</td>
                        <td className="py-3 pr-4">
                          <select
                            value={u.role}
                            onChange={async (e) => {
                              const role = e.target.value;
                              try {
                                const res = await api.patch(`/auth/users/${u._id}/role`, { role });
                                setUsersList((prev) =>
                                  prev.map((x) => (x._id === u._id ? res.data : x))
                                );
                                setPanelStatus({
                                  type: 'success',
                                  message: `Updated ${u.name}'s role to ${role}.`,
                                });
                              } catch (err) {
                                setPanelStatus({
                                  type: 'error',
                                  message: err?.message || 'Unable to update user role.',
                                });
                              }
                            }}
                            className="rounded border border-fcit-navy/20 bg-fcit-cream px-2 py-1 caption-4"
                          >
                            <option value="super_admin">super_admin</option>
                            <option value="admin">admin</option>
                            <option value="faculty">faculty</option>
                            <option value="team_member">team_member</option>
                            <option value="student">student</option>
                            <option value="visitor">visitor</option>
                          </select>
                        </td>
                        <td className="py-3">{u.isActive ? 'Yes' : 'Disabled'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
