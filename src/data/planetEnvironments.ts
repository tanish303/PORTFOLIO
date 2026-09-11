export interface PlanetTelemetry {
  gravity: string;
  temperature: string;
  pressure: string;
  atmosphereComp: string;
}

export interface PortfolioItem {
  id: string;
  badge: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  extendedDetails: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  actionLink?: { label: string; url?: string; onClickAction?: string };
}

export interface GuestbookEntry {
  id: string;
  author: string;
  callsign: string;
  timestamp: string;
  message: string;
  origin: string;
}

export interface PlanetEnvironmentConfig {
  id: string;
  name: string;
  subTitle: string;
  sectorBadge: string;
  locationTag: string;
  siteDescription: string;
  bgImage: string;
  themeColor: string;
  themeColorRgb: string;
  accentColor: string;
  atmosphereType: 'earth' | 'mercury' | 'venus' | 'jupiter' | 'saturn' | 'uranus' | 'neptune';
  telemetry: PlanetTelemetry;
  contentCategory: string;
  items: PortfolioItem[];
  // Special section modes
  isGuestbook?: boolean;
  isContact?: boolean;
}

export const PLANET_ENVIRONMENTS: Record<string, PlanetEnvironmentConfig> = {
  // 1. MERCURY -> SKILLS
  skills: {
    id: 'skills',
    name: 'MERCURY // SKILLS & TECH STACK',
    subTitle: 'SOLAR ORBIT 0.387 AU // TECHNICAL ARRAY',
    sectorBadge: 'MERCURY // SECTOR 01',
    locationTag: 'CALORIS BASIN // CORE PROFICIENCIES',
    siteDescription: 'LANGUAGES • FRONTEND • BACKEND • DATABASES • CLOUD TOOLS',
    bgImage: '/images/planets/mercury.png',
    themeColor: '#94a3b8',
    themeColorRgb: '148, 163, 184',
    accentColor: '#e2e8f0',
    atmosphereType: 'mercury',
    telemetry: {
      gravity: '0.38 G (3.7 m/s²)',
      temperature: '+427°C / -173°C',
      pressure: '10⁻¹⁴ bar (Exosphere)',
      atmosphereComp: 'Trace: 42% O • 29% Na • 22% H₂',
    },
    contentCategory: 'TECHNICAL SKILLS',
    items: [
      {
        id: 'skills-languages',
        badge: 'LANGUAGES // 01',
        index: 'SKILL.LANG.01',
        title: 'PROGRAMMING LANGUAGES',
        subtitle: 'C++, Java, Python, JavaScript, TypeScript, SQL',
        description:
          'Solid foundation in object-oriented programming, data structures, and algorithms. Actively solving LeetCode problems in C++ and Java, while using JavaScript, TypeScript, and Python for full-stack engineering and automation.',
        extendedDetails:
          'Deep conceptual clarity in memory models, time complexity, and asynchronous event loops. Utilizes Python for rapid scripting, data parsing, and AI integrations, and SQL for relational schema designs and optimized transactions.',
        tags: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C', 'SQL'],
        metrics: [
          { label: 'CORE STACK', value: 'C++ & JS/TS' },
          { label: 'PROBLEM SOLVING', value: 'LeetCode' },
          { label: 'LANGUAGES', value: '7 Active' },
        ],
      },
      {
        id: 'skills-frontend',
        badge: 'FRONTEND // 02',
        index: 'SKILL.FE.02',
        title: 'FRONTEND ARCHITECTURE',
        subtitle: 'React.js, Next.js, Redux, Tailwind CSS',
        description:
          'Building fluid, responsive, and component-driven web interfaces. Experienced in React 18 hooks, Next.js server components, client-side caching, and modern glassmorphic styling.',
        extendedDetails:
          'Architected dual-mode user experiences with instant theme and profile switching. Focuses on reusable UI primitives, sub-16ms render loops, mobile-first responsive layouts, and clean Tailwind utility compositions.',
        tags: ['React.js', 'Next.js', 'Redux', 'Tailwind CSS', 'HTML5', 'CSS3', 'WebSockets'],
        metrics: [
          { label: 'FRAMEWORKS', value: 'React & Next' },
          { label: 'STYLING', value: 'Tailwind CSS' },
          { label: 'STATE MGMT', value: 'Redux / Hooks' },
        ],
      },
      {
        id: 'skills-backend-tools',
        badge: 'BACKEND & TOOLS // 03',
        index: 'SKILL.BE.03',
        title: 'BACKEND, DATABASES & DEVOPS',
        subtitle: 'Node.js, Express, MongoDB, Postgres, Docker, Git',
        description:
          'Designing robust RESTful endpoints with Node.js and Express. Managing both NoSQL (MongoDB) and SQL databases, with automated deployments using Docker, Git, Render, and Vercel.',
        extendedDetails:
          'Implemented secure JWT user authentication, real-time WebSocket communication, automated SMTP email services, and containerized microservice architectures. API workflows verified through Postman test collections.',
        tags: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'Docker', 'Git', 'Postman', 'Render', 'Vercel'],
        metrics: [
          { label: 'RUNTIME', value: 'Node & Express' },
          { label: 'DATABASES', value: 'Mongo & Postgres' },
          { label: 'DEVOPS', value: 'Docker & Git' },
        ],
      },
    ],
  },

  // 2. VENUS -> EXPERIENCE
  experience: {
    id: 'experience',
    name: 'VENUS // WORK EXPERIENCE',
    subTitle: 'SOLAR ORBIT 0.723 AU // PROFESSIONAL CHRONICLE',
    sectorBadge: 'VENUS // SECTOR 02',
    locationTag: 'ISHTAR TERRA // INDUSTRY EXPEDITIONS',
    siteDescription: 'SOFTWARE ENGINEERING INTERNSHIPS • PRODUCTION CODE • AGILE DELIVERIES',
    bgImage: '/images/planets/venus.png',
    themeColor: '#facc15',
    themeColorRgb: '250, 204, 21',
    accentColor: '#f59e0b',
    atmosphereType: 'venus',
    telemetry: {
      gravity: '0.904 G (8.87 m/s²)',
      temperature: '+464°C (737 K)',
      pressure: '92.0 bar (Supercritical)',
      atmosphereComp: '96.5% CO₂ • 3.5% N₂ • SO₂ Clouds',
    },
    contentCategory: 'WORK EXPERIENCE',
    items: [
      {
        id: 'exp-adayptus',
        badge: 'INTERNSHIP // FEB 2026 - MAR 2026',
        index: 'EXP.01',
        title: 'BACKEND DEVELOPER',
        subtitle: 'ADAYPTUS CONSULTING // Noida, India (Hybrid)',
        description:
          'Backend Developer Intern responsible for database query optimizations, API integrations, and automated email services for enterprise clients.',
        extendedDetails:
          'Integrated and managed database operations while optimizing queries for higher query performance. Identified and resolved backend bugs to improve system stability and reliability. Worked closely with frontend developers for seamless API integration, and configured SMTP services to deliver automated system-generated emails.',
        tags: ['Node.js', 'Express', 'MongoDB', 'SMTP Services', 'Query Optimization', 'API Integration'],
        metrics: [
          { label: 'COMPANY', value: 'Adayptus' },
          { label: 'LOCATION', value: 'Noida (Hybrid)' },
          { label: 'FOCUS', value: 'Backend & DB' },
        ],
      },
      {
        id: 'exp-codingblocks',
        badge: 'INTERNSHIP // JUN 2024 - AUG 2024',
        index: 'EXP.02',
        title: 'FULL STACK DEVELOPER',
        subtitle: 'CODINGBLOCKS // Delhi, India (Remote)',
        description:
          'Collaborated in an Agile squad of 5 engineers to deliver 3+ responsive web applications, boosting load performance by 25%.',
        extendedDetails:
          'Gained intensive hands-on experience across HTML, CSS, JavaScript, and React building responsive, user-friendly web applications. Built modular UI components that reduced redundant code by 30%, and actively debugged and resolved 15+ frontend and backend issues in fast-paced sprint cycles.',
        tags: ['React', 'Node.js', 'Tailwind CSS', 'JavaScript', 'Agile / Scrum', 'UI Optimization'],
        metrics: [
          { label: 'PERFORMANCE', value: '+25% Speed' },
          { label: 'CODE REUSE', value: '+30% Reduced' },
          { label: 'SQUAD SIZE', value: '5 Engineers' },
        ],
      },
      {
        id: 'exp-sih-hackathon',
        badge: 'NATIONAL RECOGNITION // 2023',
        index: 'EXP.03',
        title: 'SMART INDIA HACKATHON FINALIST',
        subtitle: 'Secured 4th Place Nationally // SIH 2023',
        description:
          'Secured 4th place at the prestigious Smart India Hackathon (SIH) 2023, building a full-stack digital solution under continuous 36-hour sprint conditions.',
        extendedDetails:
          'Architected an end-to-end software platform evaluated by industry veterans and government panels. Spearheaded rapid feature prototyping, real-time collaboration logic, and presentation delivery under intense competitive deadlines.',
        tags: ['SIH 2023', 'National 4th Place', 'Hackathon Finalist', 'Team Leadership', 'Full-Stack'],
        metrics: [
          { label: 'RANK', value: '4th Nationally' },
          { label: 'COMPETITION', value: 'SIH 2023' },
          { label: 'SPRINT TIME', value: '36 Hours' },
        ],
      },
    ],
  },

  // 3. EARTH -> KEPT UNTOUCHED AS REQUESTED
  earth: {
    id: 'earth',
    name: 'EARTH // TERRA BASE',
    subTitle: 'HOME WORLD // EXPEDITION HEADQUARTERS',
    sectorBadge: 'TERRA BASE // SECTOR 03',
    locationTag: 'ALPINE SUMMIT // PACIFIC CREST OBSERVATORY',
    siteDescription: 'ELEVATION 4,200M • ATMOSPHERIC CLARITY OPTIMAL • TELEMETRY NOMINAL',
    bgImage: '/images/planets/earth.png',
    themeColor: '#38bdf8',
    themeColorRgb: '56, 189, 248',
    accentColor: '#10b981',
    atmosphereType: 'earth',
    telemetry: {
      gravity: '1.00 G (9.81 m/s²)',
      temperature: '+14.2°C (287.3 K)',
      pressure: '1.013 bar (101.3 kPa)',
      atmosphereComp: '78% N₂ • 21% O₂ • 0.93% Ar',
    },
    contentCategory: 'MISSION OVERVIEW',
    items: [
      {
        id: 'overview-bio',
        badge: 'TERRA // 01',
        index: 'SYS.TERRA.01',
        title: 'MISSION COMMANDER',
        subtitle: 'Full Stack Developer & Systems Engineer',
        description:
          'Passionate software engineer specializing in clean, fast, real-time web applications, responsive frontend architecture, and robust backend systems.',
        extendedDetails:
          'Learning by building, not just theory. With hands-on experience in MERN stack, WebSockets, real-time sync, and desktop applications, every project is crafted with high standards of performance and polish.',
        tags: ['Full Stack', 'React / Next.js', 'Node.js', 'WebSockets', 'Tailwind CSS'],
        metrics: [
          { label: 'CORE FOCUS', value: 'Real-Time Web' },
          { label: 'ACADEMICS', value: 'B.Tech CSE' },
          { label: 'PASSION', value: 'Building' },
        ],
        actionLink: { label: 'EXPLORE SOLAR OUTPOSTS' },
      },
      {
        id: 'overview-philosophy',
        badge: 'TERRA // 02',
        index: 'SYS.TERRA.02',
        title: 'ENGINEERING ETHOS',
        subtitle: 'Perfectionism & Practical Execution',
        description:
          'Approach problems by systematically eliminating wrong paths until only the most elegant, performant solution remains.',
        extendedDetails:
          'From sub-millisecond database queries to zero-jank 60+ FPS UI transitions, code is crafted to be lightweight, scalable, and human-friendly.',
        tags: ['Clean Architecture', 'Real-Time Graphics', 'Zero-Latency UX', 'Fault Tolerance'],
        metrics: [
          { label: 'CORE RENDERING', value: '60 FPS' },
          { label: 'TYPE SAFETY', value: '100% Strict' },
          { label: 'CODE QUALITY', value: 'Perfection' },
        ],
      },
      {
        id: 'overview-fleet',
        badge: 'TERRA // 03',
        index: 'SYS.TERRA.03',
        title: 'EXPEDITION FLEET',
        subtitle: 'Planetary Outposts Map',
        description:
          'Navigate through the solar system to explore each dimension of experience: Mercury (Skills), Venus (Experience), Mars (Projects), Jupiter (Education), Saturn (Guestbook), Uranus (Contact), and Neptune (Ask AI).',
        extendedDetails:
          'Select any planet in orbit to launch the rocket and transition seamlessly into its surface environment.',
        tags: ['Mercury: Skills', 'Venus: Experience', 'Mars: Projects', 'Jupiter: Education', 'Saturn: Guestbook'],
        metrics: [
          { label: 'OUTPOSTS ACTIVE', value: '8 SECTORS' },
          { label: 'ORBITAL RADIUS', value: '162 AU' },
          { label: 'NAVIGATION', value: '3D VELOCITY' },
        ],
      },
    ],
  },

  // 4. JUPITER -> EDUCATION
  education: {
    id: 'education',
    name: 'JUPITER // EDUCATION & ACADEMICS',
    subTitle: 'SOLAR ORBIT 5.204 AU // ACADEMIC CHRONICLE',
    sectorBadge: 'JUPITER // SECTOR 04',
    locationTag: 'GREAT RED SPOT // ACADEMIC FOUNDATION',
    siteDescription: 'B.TECH COMPUTER SCIENCE • SENIOR SECONDARY • ACADEMIC HONORS',
    bgImage: '/images/planets/jupiter.png',
    themeColor: '#f59e0b',
    themeColorRgb: '245, 158, 11',
    accentColor: '#ea580c',
    atmosphereType: 'jupiter',
    telemetry: {
      gravity: '2.528 G (24.79 m/s²)',
      temperature: '-110°C (163 K)',
      pressure: '2.0-100 bar (Variable)',
      atmosphereComp: '89.8% H₂ • 10.2% He • CH₄ / NH₃',
    },
    contentCategory: 'ACADEMIC JOURNEY',
    items: [
      {
        id: 'edu-college',
        badge: 'COLLEGE // 2022 - 2026',
        index: 'EDU.01',
        title: 'B.TECH IN COMPUTER SCIENCE & ENGINEERING',
        subtitle: 'BML Munjal University // Gurugram, Haryana',
        description:
          'Pursuing B.Tech in Computer Science and Engineering with a current cumulative grade point average of 7.53 / 10.',
        extendedDetails:
          'Core focus on Data Structures, Algorithms, Operating Systems, Database Management Systems, Computer Networks, and Full-Stack Web Development. Actively building production-grade web applications and participating in collegiate and national hackathons.',
        tags: ['BML Munjal University', 'B.Tech CSE', '7.53 CGPA', 'Data Structures', 'Web Engineering'],
        metrics: [
          { label: 'DEGREE', value: 'B.Tech CSE' },
          { label: 'CGPA', value: '7.53 / 10' },
          { label: 'DURATION', value: '2022–2026' },
        ],
      },
      {
        id: 'edu-12th',
        badge: 'SENIOR SECONDARY // 2019 - 2021',
        index: 'EDU.02',
        title: 'SENIOR SECONDARY (12TH GRADE)',
        subtitle: "Children's Academy School // Alwar, Rajasthan",
        description:
          'Completed 12th Grade Senior Secondary Education with 81% marks, concentrating in Science and Mathematics.',
        extendedDetails:
          'Excelled in Mathematics, Physics, Chemistry, and Computer Science. Developed analytical rigor, algorithmic curiosity, and a drive for technical problem-solving during these formative years.',
        tags: ['Children Academy', '12th Grade', '81% Marks', 'Science & Math', 'Alwar RJ'],
        metrics: [
          { label: 'SCORE', value: '81%' },
          { label: 'STREAM', value: 'Science / Math' },
          { label: 'DURATION', value: '2019–2021' },
        ],
      },
      {
        id: 'edu-10th',
        badge: 'HIGH SCHOOL // 2008 - 2019',
        index: 'EDU.03',
        title: 'HIGH SCHOOL (10TH GRADE)',
        subtitle: "Sunhill Academy School // Alwar, Rajasthan",
        description:
          'Passed 10th grade secondary board examination with distinction, achieving 92% marks.',
        extendedDetails:
          'Consistently ranked top of the class with exceptional marks in Mathematics and Science. Participated in science fairs, mathematics Olympiads, and logic quizzes.',
        tags: ['Sunhill Academy', '10th Grade', '92% Distinction', 'Top Marks', 'Alwar RJ'],
        metrics: [
          { label: 'SCORE', value: '92% Distinction' },
          { label: 'SUBJECTS', value: 'Math & Science' },
          { label: 'DURATION', value: '2008–2019' },
        ],
      },
    ],
  },

  // 5. SATURN -> GUESTBOOK
  guestbook: {
    id: 'guestbook',
    name: 'SATURN // GUESTBOOK & STATS',
    subTitle: 'SOLAR ORBIT 9.582 AU // VISITOR TRANSMISSIONS',
    sectorBadge: 'SATURN // SECTOR 05',
    locationTag: 'CASSINI DIVISION // INTERPLANETARY LOGBOOK',
    siteDescription: 'LEAVE A MESSAGE • CONNECT WITH VISITORS • PERMANENT TRANSMISSIONS',
    bgImage: '/images/planets/saturn.png',
    themeColor: '#fde047',
    themeColorRgb: '253, 224, 71',
    accentColor: '#eab308',
    atmosphereType: 'saturn',
    telemetry: {
      gravity: '1.065 G (10.44 m/s²)',
      temperature: '-140°C (133 K)',
      pressure: '1.4 bar (Cloud tops)',
      atmosphereComp: '96.3% H₂ • 3.25% He • 0.45% CH₄',
    },
    contentCategory: 'VISITOR LOGBOOK',
    isGuestbook: true,
    items: [
      {
        id: 'guestbook-info',
        badge: 'GUESTBOOK // LIVE',
        index: 'COMM.LOG',
        title: 'VISITOR TRANSMISSION LOGBOOK',
        subtitle: 'Leave a Message for Tanish Dhingra',
        description:
          'Leave your name, callsign, and feedback in the permanent planetary log. Messages are recorded in telemetry storage and visible to subsequent explorers.',
        extendedDetails:
          'Whether you have thoughts on TweniQ, feedback on CopyWizz, or want to discuss full-stack engineering collaborations, broadcast your transmission here.',
        tags: ['Visitor Log', 'Local Persistence', 'Interactive', 'Instant Broadcast'],
        metrics: [
          { label: 'STATUS', value: 'Accepting Logs' },
          { label: 'ENCRYPTION', value: 'AES-256' },
          { label: 'TRANSMISSION', value: 'Instant' },
        ],
      },
    ],
  },

  // 6. URANUS -> CONTACT
  contact: {
    id: 'contact',
    name: 'URANUS // GET IN TOUCH',
    subTitle: 'SOLAR ORBIT 19.22 AU // DIRECT COMMUNICATIONS',
    sectorBadge: 'URANUS // SECTOR 06',
    locationTag: 'TITANIA RELAY // DIRECT TERMINAL',
    siteDescription: 'EMAIL • PHONE • GITHUB • LINKEDIN • OPEN FOR OPPORTUNITIES',
    bgImage: '/images/planets/uranus.png',
    themeColor: '#67e8f9',
    themeColorRgb: '103, 232, 249',
    accentColor: '#06b6d4',
    atmosphereType: 'uranus',
    telemetry: {
      gravity: '0.886 G (8.69 m/s²)',
      temperature: '-195°C (78 K)',
      pressure: '1.2 bar (Troposphere)',
      atmosphereComp: '82.5% H₂ • 15.2% He • 2.3% CH₄',
    },
    contentCategory: 'GET IN TOUCH',
    isContact: true,
    items: [
      {
        id: 'contact-gateway',
        badge: 'COMMUNICATIONS // ONLINE',
        index: 'COMM.DIR',
        title: 'LET’S CONNECT',
        subtitle: 'Open for Roles, Freelance & Collaborations',
        description:
          'I’m interested in hearing about new full-stack opportunities, creative engineering projects, or chatting about technology. Feel free to reach out directly!',
        extendedDetails:
          'Available via direct email (tanishdhingra2003@gmail.com), phone (+91 8107016363), GitHub (github.com/tanish303), and LinkedIn (linkedin.com/in/tanish-dhingraa). Interested in Frontend, Backend, and Full-Stack Developer roles.',
        tags: ['Frontend Roles', 'Backend Roles', 'Full-Stack Roles', 'Open to Inquiries'],
        metrics: [
          { label: 'RESPONSE TIME', value: '< 24 Hours' },
          { label: 'LOCATION', value: 'Gurugram / Alwar' },
          { label: 'STATUS', value: 'OPEN FOR WORK' },
        ],
      },
    ],
  },

  // 7. NEPTUNE -> ASK AI (Minimal as requested: "don't do anything for neptune (ask ai) for now , will do it later")
  askai: {
    id: 'askai',
    name: 'NEPTUNE // ASK AI',
    subTitle: 'SOLAR ORBIT 30.07 AU // AI ASSISTANT',
    sectorBadge: 'NEPTUNE // SECTOR 07',
    locationTag: 'TRITON GATEWAY // AI CORE',
    siteDescription: 'NEPTUNE AI ASSISTANT // COMING SOON',
    bgImage: '/images/planets/neptune.png',
    themeColor: '#3b82f6',
    themeColorRgb: '59, 130, 246',
    accentColor: '#1d4ed8',
    atmosphereType: 'neptune',
    telemetry: {
      gravity: '1.14 G (11.15 m/s²)',
      temperature: '-201°C (72 K)',
      pressure: '1-5 bar (Dynamic)',
      atmosphereComp: '80% H₂ • 19% He • 1.5% CH₄',
    },
    contentCategory: 'AI ASSISTANT',
    items: [
      {
        id: 'askai-pending',
        badge: 'AI ASSISTANT // STANDBY',
        index: 'AI.01',
        title: 'NEPTUNE AI CORE',
        subtitle: 'Intelligent Portfolio Assistant',
        description:
          'The interactive AI assistant module for Neptune is currently in calibration. Check back soon for direct conversational telemetry.',
        extendedDetails:
          'Will support natural-language querying about Tanish Dhingra’s skills, experience, projects, and tech stack.',
        tags: ['Gemini API', 'AI Assistant', 'Coming Soon'],
        metrics: [
          { label: 'MODULE', value: 'Ask AI' },
          { label: 'STATUS', value: 'STANDBY' },
          { label: 'SECURITY', value: 'Active' },
        ],
      },
    ],
  },
};
