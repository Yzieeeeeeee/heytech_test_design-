/**
 * ============================================================================
 *  HEY TECH TECHNOLOGIES — SITE CONFIGURATION
 * ============================================================================
 *  This is the ONLY file you need to edit for day-to-day content updates:
 *  contact details, social links, services, tech stack, projects, founders,
 *  process steps and testimonials all live here.
 *
 *  Values that still contain the placeholder prefix `YOUR_` are treated as
 *  "not configured": the UI hides or disables those actions instead of
 *  linking somewhere broken, and no fake data is ever shown.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type ProjectCategory = 'Mobile' | 'Web' | 'Backend' | 'UI/UX';

export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  number: string;
  slug: string;
  title: string;
  description: string;
  /** Short capability bullets revealed on hover / focus / tap. */
  points: string[];
  /** Generated abstract artwork in /public (no stock photography). */
  art: string;
}

export interface TechItem {
  name: string;
  /** Neutral descriptor — deliberately no expertise-level claims. */
  descriptor: string;
  /** Initials used by the badge artwork. */
  mark: string;
}

export interface Project {
  id: string;
  name: string;
  /** One-line summary used on the card. */
  summary: string;
  /** Longer copy shown in the project detail dialog. */
  description: string;
  category: ProjectCategory;
  tags: string[];
  /** First-party artwork in /public. Never stock photography. */
  image: string;
  imageAlt: string;
  /** Shown as a chip on the card so placeholder slots are never disguised. */
  badge?: string;
  /** `true` = reserved slot, no shipped work attached yet. */
  isPlaceholder?: boolean;
  year?: string;
  github?: string;
  liveUrl?: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  detail: string;
}

export interface Founder {
  name: string;
  initials: string;
  role: string;
  focus: string;
  bio: string;
  /**
   * OPTIONAL real photo path, e.g. '/founders/muhammed-yasir.jpg'.
   * Leave undefined/empty to render the styled initials avatar.
   */
  photo?: string;
  socials: {
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  /** Optional company / project context. */
  context?: string;
  avatar?: string;
}

export interface WhyCard {
  number: string;
  title: string;
  description: string;
}

export interface FlowStep {
  label: string;
}

/* -------------------------------------------------------------------------- */
/*  Placeholder handling                                                      */
/* -------------------------------------------------------------------------- */

export const PLACEHOLDER_PREFIX = 'YOUR_';

/**
 * Returns true only when a value is real content.
 * Placeholder tokens (YOUR_WHATSAPP_NUMBER, YOUR_EMAIL@example.com, …) and
 * empty strings both count as "not configured".
 */
export function isConfigured(value?: string | null): boolean {
  if (!value) return false;
  const v = value.trim();
  if (!v) return false;
  if (v.startsWith(PLACEHOLDER_PREFIX)) return false;
  if (v.includes('YOUR_EMAIL')) return false;
  if (v.includes('example.com')) return false;
  return true;
}

/** Digits-only WhatsApp number for use inside a wa.me link. */
export function toWhatsAppNumber(raw: string): string {
  return raw.replace(/[^\d]/g, '');
}

/* -------------------------------------------------------------------------- */
/*  Site configuration                                                        */
/* -------------------------------------------------------------------------- */

export const siteConfig = {
  companyName: 'Hey Tech Technologies',
  shortName: 'Hey Tech',
  monogram: 'HT',
  tagline: 'BUILDING IDEAS INTO DIGITAL PRODUCTS.',
  message: 'Small team. Serious work. Big ideas.',
  legalDescriptor: 'Independent Freelance Technology Studio',
  foundedYear: 2026,
  location: 'Kerala, India',

  /** Used by metadata, canonical URLs, sitemap and JSON-LD. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000',

  seo: {
    title: 'Hey Tech Technologies | Software Development & Digital Solutions',
    description:
      'Hey Tech Technologies is an independent freelance technology studio building mobile applications, web applications, backend systems and digital solutions.',
    /**
     * Served by app/opengraph-image.tsx (Next generates the PNG at build time
     * from the brand tokens, so it can never drift out of date).
     */
    ogImage: '/opengraph-image',
    keywords: [
      'Hey Tech Technologies',
      'freelance technology studio',
      'software development',
      'mobile app development',
      'web application development',
      'backend development',
      'Flutter developer',
      'final year project guidance',
      'Kerala software studio',
    ],
  },

  /**
   * REPLACE THESE before launch — see the README checkpoint list.
   * Any value still starting with YOUR_ is treated as unconfigured and the
   * matching button/link is hidden or disabled automatically.
   */
  contact: {
    email: 'YOUR_EMAIL@example.com',
    /** International format without "+" or spaces, e.g. 919876543210 */
    whatsapp: 'YOUR_WHATSAPP_NUMBER',
    /** Human-readable number for display, e.g. "+91 98765 43210" */
    phoneDisplay: '',
    /** Typical reply window — keep it honest. */
    responseNote: 'We usually reply within a day or two.',
  },

  socials: {
    github: 'YOUR_GITHUB_URL',
    instagram: 'YOUR_INSTAGRAM_URL',
    linkedin: 'YOUR_LINKEDIN_URL',
  },

  theme: {
    /** Dark is the house style. */
    default: 'dark' as 'dark' | 'light',
    /**
     * On a first visit (no saved choice) follow the OS preference when the
     * browser reports one; otherwise fall back to `default`.
     */
    respectSystemPreference: true,
    storageKey: 'heytech-theme',
  },

  nav: [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Projects', href: '#projects' },
    { label: 'Process', href: '#process' },
    { label: 'Founders', href: '#founders' },
    { label: 'Contact', href: '#contact' },
  ] as NavLink[],

  hero: {
    eyebrow: 'Independent Freelance Technology Studio · Founded 2026',
    headingLines: ['BUILDING IDEAS', 'INTO DIGITAL', 'PRODUCTS.'],
    headingPlain: 'BUILDING IDEAS INTO DIGITAL PRODUCTS.',
    paragraph:
      'Hey Tech Technologies is a two-founder freelance technology studio building modern mobile applications, web applications, backend systems, and digital solutions.',
    status: 'Currently accepting selected projects',
    primaryCta: { label: 'START A PROJECT', href: '#contact' },
    secondaryCta: { label: 'VIEW OUR WORK', href: '#projects' },
  },

  /** Capability strip pinned to the bottom of the hero. */
  heroStrip: ['Flutter', 'Firebase', 'Node.js', 'MySQL', 'REST APIs'],

  /**
   * Section numbering for the mono eyebrows ("01 / ABOUT US").
   * Keep in sync with the order of the sections on the page.
   */
  numbering: {
    about: '01',
    services: '02',
    stack: '03',
    projects: '04',
    students: '05',
    businesses: '06',
    process: '07',
    founders: '08',
    why: '09',
    feedback: '10',
    github: '11',
    contact: '12',
  },

  about: {
    eyebrow: 'About',
    heading: 'SMALL TEAM. BIG IDEAS.',
    paragraphs: [
      'Founded in 2026, Hey Tech Technologies is an independent freelance technology studio built by two founders with a shared goal of turning ideas into practical digital products.',
      'We work closely with students, entrepreneurs, startups, and small businesses to design and develop modern software solutions.',
    ],
    timeline: [
      { year: '2026', label: 'Hey Tech Technologies founded' },
      { year: 'Now', label: 'Taking on selected projects and collaborations' },
    ],
    flow: [
      { label: 'Idea' },
      { label: 'Design' },
      { label: 'Development' },
      { label: 'Testing' },
      { label: 'Delivery' },
    ] as FlowStep[],
  },

  /** The statement band that sits directly under the hero. */
  intro: {
    statement:
      'An independent studio building mobile applications, web applications, backend systems and digital products for students, founders, startups and small businesses.',
    support:
      'Founded in 2026 by two developers who would rather do a few projects properly than many in a hurry.',
  },

  services: [
    {
      number: '01',
      slug: 'mobile-apps',
      art: '/services/service-mobile.png',
      title: 'Mobile App Development',
      description:
        'Flutter-based Android and cross-platform apps with modern responsive interfaces.',
      points: ['Cross-platform builds', 'Responsive UI', 'Android delivery'],
    },
    {
      number: '02',
      slug: 'web-apps',
      art: '/services/service-web.png',
      title: 'Web Application Development',
      description:
        'Modern responsive web apps for businesses, startups and projects.',
      points: ['Responsive layouts', 'Dashboard interfaces', 'Deployment ready'],
    },
    {
      number: '03',
      slug: 'backend',
      art: '/services/service-backend.png',
      title: 'Backend & Database',
      description:
        'Backend architecture, Firebase, databases, authentication and data management.',
      points: ['Data modelling', 'Authentication', 'Firebase & SQL'],
    },
    {
      number: '04',
      slug: 'api',
      art: '/services/service-api.png',
      title: 'API Integration',
      description:
        'REST APIs, JSON, authentication, third-party integration and backend communication.',
      points: ['REST & JSON', 'Auth flows', 'Third-party services'],
    },
    {
      number: '05',
      slug: 'ui-ux',
      art: '/services/service-uiux.png',
      title: 'UI/UX Development',
      description:
        'Clean, responsive interfaces focused on usability and visual consistency.',
      points: ['Interface design', 'Design consistency', 'Accessibility basics'],
    },
    {
      number: '06',
      slug: 'student-projects',
      art: '/services/service-student.png',
      title: 'Final-Year Project Development & Guidance',
      description:
        'Technical development support and guidance for software-based degree projects.',
      points: ['Development support', 'Technical guidance', 'Mentoring'],
    },
  ] as Service[],

  techStack: [
    { name: 'Flutter', descriptor: 'Cross-platform application development', mark: 'FL' },
    { name: 'Dart', descriptor: 'Language used with Flutter', mark: 'DA' },
    { name: 'Firebase', descriptor: 'Authentication, database and hosting', mark: 'FB' },
    { name: 'REST APIs', descriptor: 'Client and server communication', mark: 'RS' },
    { name: 'Node.js', descriptor: 'Server-side JavaScript runtime', mark: 'ND' },
    { name: 'JavaScript', descriptor: 'Interactive web behaviour', mark: 'JS' },
    { name: 'HTML', descriptor: 'Document structure for the web', mark: 'HT' },
    { name: 'CSS', descriptor: 'Layout, styling and responsive design', mark: 'CS' },
    { name: 'Git', descriptor: 'Version control for code changes', mark: 'GT' },
    { name: 'GitHub', descriptor: 'Code hosting and collaboration', mark: 'GH' },
    { name: 'SQLite', descriptor: 'Lightweight local database', mark: 'SL' },
    { name: 'MySQL', descriptor: 'Relational database systems', mark: 'MY' },
  ] as TechItem[],

  /**
   * PROJECTS — replace these placeholder slots with real work as it ships.
   * Every card, filter and detail view is driven by this array.
   *
   * To add a real project, copy one object and fill in:
   *   id, name, summary, description, category, tags, image, imageAlt
   * Then delete the placeholder objects and set `isPlaceholder: false`
   * (or remove the key entirely).
   */
  projects: [
    {
      id: 'placeholder-mobile',
      name: 'Your project here',
      summary: 'A reserved slot for the next mobile application we build.',
      description:
        'This is a placeholder card, not a finished project. When a mobile application ships, its name, description, screenshots and links will appear here. If you have an app idea, this slot could be yours.',
      category: 'Mobile',
      tags: ['Flutter', 'Dart', 'Firebase'],
      image: '/projects/project-mobile.png',
      imageAlt:
        'Abstract gradient artwork with layered cyan and blue shapes representing a mobile app interface',
      badge: 'Placeholder slot',
      isPlaceholder: true,
    },
    {
      id: 'placeholder-web',
      name: 'Your project here',
      summary: 'A reserved slot for a web application or business platform.',
      description:
        'This is a placeholder card, not a finished project. Web applications built for startups, small businesses or student projects will be listed here with real details and links.',
      category: 'Web',
      tags: ['Next.js', 'JavaScript', 'Responsive UI'],
      image: '/projects/project-web.png',
      imageAlt:
        'Abstract gradient artwork with a soft violet and blue mesh representing a web application dashboard',
      badge: 'Placeholder slot',
      isPlaceholder: true,
    },
    {
      id: 'placeholder-backend',
      name: 'Your project here',
      summary: 'A reserved slot for backend systems and API work.',
      description:
        'This is a placeholder card, not a finished project. Backend architecture, database design, authentication systems and API integrations will be documented here.',
      category: 'Backend',
      tags: ['Node.js', 'REST APIs', 'MySQL'],
      image: '/projects/project-backend.png',
      imageAlt:
        'Abstract gradient artwork with connected lines and nodes representing a backend service architecture',
      badge: 'Placeholder slot',
      isPlaceholder: true,
    },
    {
      id: 'placeholder-uiux',
      name: 'Your project here',
      summary: 'A reserved slot for interface and experience design work.',
      description:
        'This is a placeholder card, not a finished project. Interface design and design-system work will be shown here with real screens and reasoning behind the decisions.',
      category: 'UI/UX',
      tags: ['UI Design', 'Prototyping', 'Accessibility'],
      image: '/projects/project-uiux.png',
      imageAlt:
        'Abstract gradient artwork with geometric panels representing interface design components',
      badge: 'Placeholder slot',
      isPlaceholder: true,
    },
  ] as Project[],

  projectsIntro:
    'We are at the start of our journey, so this section is honest about what exists: these are reserved slots ready for real work. Each project we take on will be documented here with the actual problem, the build and the outcome.',

  projectFilters: ['ALL', 'MOBILE', 'WEB', 'BACKEND', 'UI/UX'] as const,

  students: {
    eyebrow: 'For students',
    heading: 'HAVE A FINAL-YEAR PROJECT IDEA?',
    paragraph:
      'Turn your concept into a working software prototype with structured technical guidance and development support.',
    note: 'Support is provided for software development, technical guidance, prototyping, and project learning.',
    steps: [
      { number: '01', title: 'Share Your Idea', description: 'Tell us your concept, scope and timeline.' },
      { number: '02', title: 'Plan the Project', description: 'Break the idea into features and modules.' },
      { number: '03', title: 'Design the Interface', description: 'Plan the screens and user flow.' },
      { number: '04', title: 'Develop the Application', description: 'Build the working prototype.' },
      { number: '05', title: 'Test & Refine', description: 'Review behaviour and fix issues.' },
      { number: '06', title: 'Guidance on Documentation', description: 'Explain the system so you can present it.' },
    ],
    cta: { label: 'DISCUSS YOUR PROJECT', href: '#contact' },
  },

  businesses: {
    eyebrow: 'For businesses',
    heading: 'BUILDING FOR BUSINESSES TOO',
    paragraph:
      'From small business tools to startup products, we help turn ideas into functional digital experiences.',
    chips: [
      'Business Applications',
      'Custom Software',
      'Mobile Apps',
      'Web Applications',
      'MVP Development',
      'API Integration',
      'Database Systems',
    ],
    cta: { label: 'START A BUSINESS PROJECT', href: '#contact' },
  },

  process: [
    {
      number: '01',
      title: 'DISCOVER',
      description: 'Understand your idea and requirements.',
      detail: 'A conversation about the problem, the users and what success looks like.',
    },
    {
      number: '02',
      title: 'PLAN',
      description: 'Define features, technology and project scope.',
      detail: 'A clear feature list, the technology we will use and an agreed scope.',
    },
    {
      number: '03',
      title: 'DESIGN',
      description: 'Create the interface and user experience.',
      detail: 'Screen structure and visual direction before a single line of code.',
    },
    {
      number: '04',
      title: 'DEVELOP',
      description: 'Build and integrate the application.',
      detail: 'Frontend, backend, database and API work brought together.',
    },
    {
      number: '05',
      title: 'TEST',
      description: 'Review functionality, responsiveness and reliability.',
      detail: 'Checking flows on real screen sizes and fixing what breaks.',
    },
    {
      number: '06',
      title: 'DELIVER',
      description: 'Provide the completed project and technical handover.',
      detail: 'Source code, setup notes and a walkthrough of how it works.',
    },
  ] as ProcessStep[],

  founders: [
    {
      name: 'Muhammed Yasir',
      initials: 'MY',
      role: 'Co-Founder — Software Development',
      focus: 'Software Development',
      bio: 'Focused on application development, software architecture, backend integration and turning ideas into functional digital products.',
      photo: undefined,
      socials: {
        github: 'YOUR_GITHUB_URL',
        linkedin: 'YOUR_LINKEDIN_URL',
        instagram: '',
      },
    },
    {
      name: 'Anas T Nazar',
      initials: 'AN',
      role: 'Co-Founder — Marketing & Business Development',
      focus: 'Marketing & Business Development',
      bio: 'Focused on marketing, client communication, business development and helping connect digital solutions with real-world needs.',
      photo: undefined,
      socials: {
        github: '',
        linkedin: 'YOUR_LINKEDIN_URL',
        instagram: 'YOUR_INSTAGRAM_URL',
      },
    },
  ] as Founder[],

  whyCards: [
    {
      number: '01',
      title: 'PERSONAL COLLABORATION',
      description: 'Work directly with a small development team — no layers, no handoffs.',
    },
    {
      number: '02',
      title: 'MODERN TECHNOLOGY',
      description: 'Modern frameworks and practices where appropriate.',
    },
    {
      number: '03',
      title: 'CLEAR COMMUNICATION',
      description: 'Requirements and progress kept understandable, from first message to delivery.',
    },
    {
      number: '04',
      title: 'IDEA-FOCUSED DEVELOPMENT',
      description: 'Turning concepts into usable digital products.',
    },
  ] as WhyCard[],

  /**
   * TESTIMONIALS — intentionally empty at launch. No invented feedback.
   * Add a real one later using this shape and the section renders it
   * automatically:
   *
   * { id: 't1', quote: '…', authorName: '…', authorRole: '…', context: '…' }
   */
  testimonials: [] as Testimonial[],

  feedbackEmptyState:
    "We're just getting started. This space will showcase feedback from clients and collaborators as we grow.",

  github: {
    eyebrow: 'Open work',
    heading: 'EXPLORE OUR CODE',
    paragraph: 'See selected projects and development work on GitHub.',
    cta: 'VIEW GITHUB',
  },

  /** Section copy for the contact section (details live in `contact` above). */
  contactSection: {
    eyebrow: 'Contact',
    heading: "LET'S BUILD SOMETHING.",
    paragraph:
      "Have an app idea, website concept, business requirement, or final-year project? Let's discuss it.",
    projectTypes: [
      'Mobile App',
      'Web Application',
      'Backend System',
      'Final-Year Project',
      'Business Software',
      'Other',
    ],
    submitLabel: 'SEND PROJECT REQUEST',
    successTitle: 'Request sent.',
    successBody: 'Thanks — your message reached us. We usually reply within a day or two.',
  },

  whatsapp: {
    tooltip: 'Chat with us',
    ariaLabel: 'Chat with Hey Tech Technologies on WhatsApp',
    defaultMessage:
      "Hi Hey Tech Technologies, I'd like to discuss a project idea. Could we talk?",
  },

  footer: {
    tagline: 'BUILDING IDEAS INTO DIGITAL PRODUCTS.',
    links: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Services', href: '#services' },
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ] as NavLink[],
    copyright: '© 2026 Hey Tech Technologies. All rights reserved.',
    credit: 'Designed and developed in-house by the Hey Tech team.',
  },

  a11y: {
    skipToContent: 'Skip to content',
    toggleTheme: 'Switch colour theme',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    primaryNav: 'Primary navigation',
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  Derived values & helpers                                                  */
/* -------------------------------------------------------------------------- */

export const isWhatsAppConfigured = () => isConfigured(siteConfig.contact.whatsapp);
export const isEmailConfigured = () => isConfigured(siteConfig.contact.email);
export const isGithubConfigured = () => isConfigured(siteConfig.socials.github);
export const isInstagramConfigured = () => isConfigured(siteConfig.socials.instagram);
export const isLinkedinConfigured = () => isConfigured(siteConfig.socials.linkedin);

/** https://wa.me/{number}?text=… — returns null while the number is a placeholder. */
export function getWhatsAppHref(message?: string): string | null {
  if (!isWhatsAppConfigured()) return null;
  const number = toWhatsAppNumber(siteConfig.contact.whatsapp);
  if (!number) return null;
  const text = message ?? siteConfig.whatsapp.defaultMessage;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** mailto: link — returns null while the address is a placeholder. */
export function getMailtoHref(subject?: string, body?: string): string | null {
  if (!isEmailConfigured()) return null;
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString();
  return `mailto:${siteConfig.contact.email}${query ? `?${query}` : ''}`;
}

/** Absolute URL helper for canonical/OG metadata. */
export function absoluteUrl(path = '/'): string {
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export type SiteConfig = typeof siteConfig;
