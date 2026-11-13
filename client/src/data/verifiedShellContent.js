/**
 * Authentic FCIT & HBTU Kanpur base facts and clearly marked structural templates.
 * Zero fabricated names, founding dates, statistics, or artificial awards.
 */

export const FCIT_IDENTITY = {
  shortName: 'FCIT',
  fullName: 'Association of Computer Science and Information Technology',
  university: 'Harcourt Butler Technical University, Kanpur',
  department: 'Department of Computer Science and Engineering & Information Technology',
  logoSrc: '/assets/logo/fcit-logo.webp',
  logoFallbackSrc: '/assets/logo/fcit-logo.png',
  buildingSrc: '/assets/campus/cse-building-980.webp',
  buildingSrcSet:
    '/assets/campus/cse-building-640.webp 640w, /assets/campus/cse-building-980.webp 980w',
  buildingFallbackSrc: '/assets/campus/cse-building-980.jpg',
  contactEmail:
    import.meta.env.VITE_CONTACT_EMAIL || 'fcit.hbtu@placeholder.invalid',
};

export const NAV_LINKS = [
  { label: 'Home', to: '/', group: 'primary' },
  { label: 'About FCIT', to: '/about', group: 'primary' },
  { label: 'Events', to: '/events', group: 'primary' },
  { label: 'Faculty & Mentors', to: '/faculty', group: 'people' },
  { label: 'Student Team', to: '/team', group: 'people' },
  { label: 'History Archive', to: '/history', group: 'archive' },
  { label: 'Gallery', to: '/gallery', group: 'archive' },
  { label: 'Achievements', to: '/achievements', group: 'work' },
  { label: 'Student Projects', to: '/projects', group: 'work' },
  { label: 'Alumni Network', to: '/alumni', group: 'community' },
  { label: 'Learning Resources', to: '/resources', group: 'community' },
  { label: 'Contact', to: '/contact', group: 'community' },
];

export const GLANCE_STATEMENTS = [
  {
    index: '01',
    title: 'Learn. Connect. Grow.',
    subtitle: 'A thriving community of innovators.',
    description:
      'Peer coding sessions, systems study circles, and candid conversations between batches build lasting technical fluency across the department.',
  },
  {
    index: '02',
    title: 'Build. Compete. Excel.',
    subtitle: 'From technical learning to meaningful achievements.',
    description:
      'Hands on software engineering sprints, algorithmic problem solving, and national hackathon preparation turn classroom theory into shippable craft.',
  },
  {
    index: '03',
    title: 'Explore. Innovate. Lead.',
    subtitle: 'Opportunities beyond the classroom.',
    description:
      'Students organize symposia, mentor incoming cohorts, collaborate with faculty mentors, and contribute to open source ecosystems.',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Discover FCIT',
    detail:
      'Browse active technical domains, upcoming department events, faculty focus areas, and curated study roadmaps across Computer Science and Information Technology.',
  },
  {
    step: '02',
    title: 'Participate in activities',
    detail:
      'Register directly for workshops, competitive coding rounds, engineering seminars, and collaborative project sprints hosted at HBTU Kanpur.',
  },
  {
    step: '03',
    title: 'Contribute to the community',
    detail:
      'Share verified learning notes, publish student projects, mentor first year peers, and help steer future chapters of the association.',
  },
];

export const PLACEHOLDER_FACULTY_SLOTS = [
  {
    _id: 'placeholder-hod',
    name: 'Head of Department (Profile Pending)',
    designation: 'Head of Department · CSE & IT',
    department: 'Department of Computer Science and Engineering',
    qualifications: 'Official academic credentials to be verified via FCIT Admin',
    expertise: ['Academic Leadership', 'Research Supervision'],
    photo: '',
    verificationStatus: 'pending_verification',
    isPlaceholder: true,
  },
  {
    _id: 'placeholder-advisor',
    name: 'Faculty Advisor (Profile Pending)',
    designation: 'Faculty Advisor · FCIT',
    department: 'Department of Computer Science and Engineering',
    qualifications: 'Official faculty record awaiting upload',
    expertise: ['Student Mentorship', 'Technical Community'],
    photo: '',
    verificationStatus: 'pending_verification',
    isPlaceholder: true,
  },
  {
    _id: 'placeholder-prof',
    name: 'Professor (Profile Pending)',
    designation: 'Professor · CSE & IT',
    department: 'Department of Computer Science and Engineering',
    qualifications: 'Verified faculty details managed through Admin Dashboard',
    expertise: ['Distributed Systems', 'Algorithms'],
    photo: '',
    verificationStatus: 'pending_verification',
    isPlaceholder: true,
  },
  {
    _id: 'placeholder-assoc',
    name: 'Associate Professor (Profile Pending)',
    designation: 'Associate Professor · CSE & IT',
    department: 'Department of Information Technology',
    qualifications: 'Verified faculty details managed through Admin Dashboard',
    expertise: ['Software Engineering', 'Machine Intelligence'],
    photo: '',
    verificationStatus: 'pending_verification',
    isPlaceholder: true,
  },
  {
    _id: 'placeholder-asst',
    name: 'Assistant Professor (Profile Pending)',
    designation: 'Assistant Professor · CSE & IT',
    department: 'Department of Computer Science and Engineering',
    qualifications: 'Verified faculty details managed through Admin Dashboard',
    expertise: ['Networks', 'Security'],
    photo: '',
    verificationStatus: 'pending_verification',
    isPlaceholder: true,
  },
];

export const PLACEHOLDER_TEAM_SLOTS = [
  {
    _id: 'team-slot-1',
    name: 'President (Awaiting Record)',
    designation: 'President, FCIT',
    academicYear: 'Current Session',
    department: 'CSE & IT · HBTU Kanpur',
    introduction: 'Leads association direction, faculty coordination, and annual community initiatives.',
    photo: '',
    isPlaceholder: true,
  },
  {
    _id: 'team-slot-2',
    name: 'Vice President (Awaiting Record)',
    designation: 'Vice President, FCIT',
    academicYear: 'Current Session',
    department: 'CSE & IT · HBTU Kanpur',
    introduction: 'Coordinates cross year student chapters, technical circles, and inter college outreach.',
    photo: '',
    isPlaceholder: true,
  },
  {
    _id: 'team-slot-3',
    name: 'General Secretary (Awaiting Record)',
    designation: 'General Secretary, FCIT',
    academicYear: 'Current Session',
    department: 'CSE & IT · HBTU Kanpur',
    introduction: 'Maintains association records, schedules, announcements, and official correspondence.',
    photo: '',
    isPlaceholder: true,
  },
  {
    _id: 'team-slot-4',
    name: 'Technical Lead (Awaiting Record)',
    designation: 'Technical Lead, FCIT',
    academicYear: 'Current Session',
    department: 'CSE & IT · HBTU Kanpur',
    introduction: 'Directs workshops, software architecture sprints, coding contests, and open source mentorship.',
    photo: '',
    isPlaceholder: true,
  },
  {
    _id: 'team-slot-5',
    name: 'Design Lead (Awaiting Record)',
    designation: 'Design & Identity Lead, FCIT',
    academicYear: 'Current Session',
    department: 'CSE & IT · HBTU Kanpur',
    introduction: 'Guides visual communication, event documentation, and accessible digital interfaces.',
    photo: '',
    isPlaceholder: true,
  },
  {
    _id: 'team-slot-6',
    name: 'Events Coordinator (Awaiting Record)',
    designation: 'Events Coordinator, FCIT',
    academicYear: 'Current Session',
    department: 'CSE & IT · HBTU Kanpur',
    introduction: 'Plans logistics, speaker sessions, registration workflows, and campus venues.',
    photo: '',
    isPlaceholder: true,
  },
];

export const PLACEHOLDER_HISTORY_SLOTS = [
  {
    _id: 'history-slot-1',
    year: 'Campus Anchor',
    title: 'Department of Computer Science and Engineering',
    shortTitle: 'CSE Department',
    category: 'Institutional Presence',
    layoutVariant: 'full-bleed',
    description:
      'The physical home of computing education and student engineering discourse at Harcourt Butler Technical University, Kanpur. Authentic campus photography is anchored here while dated archival records are compiled.',
    primaryImage: '/assets/campus/cse-building-980.webp',
    primaryImageFallback: '/assets/campus/cse-building-980.jpg',
    primaryImageAlt:
      'Computer Science and Engineering Department building at Harcourt Butler Technical University, Kanpur',
    additionalImages: ['/assets/timeline/charter-preview.webp'],
    highlights: [
      'Authentic department building photograph verified on campus',
      'Houses lecture halls, computing laboratories, and student forum spaces',
    ],
    relatedEvents: ['Department Orientation', 'Student Engineering Gatherings'],
    contributors: ['Department of CSE & IT, HBTU Kanpur'],
    historicalSource: 'Supplied authentic campus architectural photograph',
    verificationStatus: 'verified',
    isPlaceholder: false,
  },
  {
    _id: 'history-slot-2',
    year: 'Charter Record',
    title: 'Formation of the FCIT Association',
    shortTitle: 'Founding Charter',
    category: 'Founding Charter · Archive Slot',
    layoutVariant: 'studio-split',
    description:
      'Archival record reserved for the verified establishment year, founding minutes, and early student faculty coordinators of FCIT. Sample visual preview shown until historical documents are uploaded in Admin.',
    primaryImage: '/assets/timeline/charter-preview.webp',
    primaryImageFallback: '/assets/timeline/charter-preview.jpg',
    primaryImageAlt:
      'Sample archival desk photograph showing computing diagrams, fountain pen, and drafting compass',
    additionalImages: ['/assets/campus/cse-building-980.webp'],
    highlights: [
      'Awaiting verified founding year and archival charter citation',
      'Ready for authentic photograph and document upload via Admin Dashboard',
    ],
    relatedEvents: ['Inaugural General Body Meeting'],
    contributors: ['Founding Coordinators · Pending Verification'],
    historicalSource: 'Sample test visual · Upload verified source in Admin',
    verificationStatus: 'pending_verification',
    isPlaceholder: true,
  },
  {
    _id: 'history-slot-3',
    year: 'Peer Circles',
    title: 'Early Technical Workshops & Coding Culture',
    shortTitle: 'Coding Culture',
    category: 'Community Programs · Archive Slot',
    layoutVariant: 'collage',
    description:
      'Reserved milestone preserving peer programming sessions, systems workshops, and department coding contests organized across graduating cohorts at HBTU Kanpur.',
    primaryImage: '/assets/timeline/workshop-preview.webp',
    primaryImageFallback: '/assets/timeline/workshop-preview.jpg',
    primaryImageAlt:
      'Sample studio workshop photograph showing algorithm diagrams and software development workstations',
    additionalImages: ['/assets/timeline/charter-preview.webp'],
    highlights: [
      'Structured peer workshops and algorithm study tracks',
      'Ready for batch attendance records and workshop photographs in Admin',
    ],
    relatedEvents: ['Department Coding Series', 'Systems Study Circles'],
    contributors: ['Cohort Technical Leads · Pending Verification'],
    historicalSource: 'Sample test visual · Upload workshop media in Admin',
    verificationStatus: 'pending_verification',
    isPlaceholder: true,
  },
  {
    _id: 'history-slot-4',
    year: 'Open Builds',
    title: 'Student Exhibitions, Symposia & Hardware Prototypes',
    shortTitle: 'Student Builds',
    category: 'Exhibitions & Initiatives · Archive Slot',
    layoutVariant: 'full-bleed',
    description:
      'Dedicated record celebrating collaborative student engineering builds, applied hardware software prototypes, and inter departmental technical showcases hosted at HBTU Kanpur.',
    primaryImage: '/assets/timeline/exhibition-preview.webp',
    primaryImageFallback: '/assets/timeline/exhibition-preview.jpg',
    primaryImageAlt:
      'Sample engineering showcase hall with graph topology displays and embedded hardware boards',
    additionalImages: ['/assets/timeline/workshop-preview.webp'],
    highlights: [
      'Cross semester student software systems and hardware demonstrations',
      'Supports linked events, contributors, and historical source attribution',
    ],
    relatedEvents: ['Annual Technical Symposium', 'Campus Project Expo'],
    contributors: ['Student Engineering Teams · Pending Verification'],
    historicalSource: 'Sample test visual · Upload exhibition media in Admin',
    verificationStatus: 'pending_verification',
    isPlaceholder: true,
  },
  {
    _id: 'history-slot-5',
    year: 'Present Session',
    title: 'FCIT 2.0 Digital Archive & Open Portal',
    shortTitle: 'FCIT 2.0 Portal',
    category: 'Digital Continuity',
    layoutVariant: 'emblem-seal',
    description:
      'Launch of the unified open architecture platform preserving faculty mentorship records, verified student teams, learning notes, event registrations, and living institutional memory.',
    primaryImage: '/assets/logo/fcit-logo.png',
    primaryImageFallback: '/assets/logo/fcit-logo.webp',
    primaryImageAlt: 'Official FCIT circular emblem in institutional navy and gold',
    additionalImages: ['/assets/timeline/exhibition-preview.webp'],
    highlights: [
      'Role based content stewardship for future student councils',
      'Public learning resources and interactive milestone archive',
    ],
    relatedEvents: ['FCIT Digital Archive Launch'],
    contributors: ['FCIT Web & Engineering Team'],
    historicalSource: 'FCIT 2.0 Platform Release · HBTU Kanpur',
    verificationStatus: 'verified',
    isPlaceholder: false,
  },
];

export const PLACEHOLDER_GALLERY_PHOTOS = [
  {
    _id: 'campus-photo-1',
    title: 'Department of Computer Science and Engineering Building',
    caption:
      'Main entrance and architectural facade of the Computer Science and Engineering Department at HBTU Kanpur.',
    imageUrl: '/assets/campus/cse-building-980.webp',
    altText:
      'Exterior photograph of the Computer Science and Engineering Department building at HBTU Kanpur',
    category: 'Campus',
    year: 'Current',
    photographer: 'Campus Archive',
    isVerifiedAsset: true,
  },
];

export const FAQ_ITEMS = [
  {
    question: 'What is FCIT at HBTU Kanpur?',
    answer:
      'FCIT is the official Association of Computer Science and Information Technology at Harcourt Butler Technical University, Kanpur. It brings together students and faculty mentors across CSE and IT for technical learning, collaborative projects, events, and community initiatives.',
  },
  {
    question: 'Who can participate in FCIT workshops and sessions?',
    answer:
      'Open workshops, seminar talks, coding circles, and community drives are welcoming to students across Computer Science and Engineering, Information Technology, and interested learners across HBTU Kanpur, subject to specific event guidelines.',
  },
  {
    question: 'How do students register for upcoming FCIT events?',
    answer:
      'Visit the Events page or select an upcoming event card on the homepage to inspect venue details, schedules, deadlines, and complete registration directly through the platform.',
  },
  {
    question: 'How are faculty mentors and the student team selected and displayed?',
    answer:
      'Faculty profiles represent verified members of the CSE and IT departments. Student team cohorts are updated each academic session by authorized FCIT administrators. Where real photos or records are still being compiled, architectural portrait plates indicate verified pending slots.',
  },
  {
    question: 'Where can students access DSA sheets, roadmaps, and past workshop materials?',
    answer:
      'All curated study guides, competitive programming paths, workshop decks, and placement preparation references are published in the Learning Resources section.',
  },
  {
    question: 'How can alumni or guest speakers collaborate with FCIT?',
    answer:
      'Alumni of HBTU Kanpur and technical practitioners can reach out through the Contact page under the Alumni or Collaboration category to schedule mentorship sessions, technical reviews, or department talks.',
  },
];
