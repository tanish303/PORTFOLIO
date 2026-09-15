export interface KnowledgeChunk {
  id: string;
  category: 'about' | 'skills' | 'experience' | 'projects' | 'education' | 'achievements' | 'contact' | 'why_hire' | 'portfolio';
  title: string;
  keywords: string[];
  content: string;
}

export const knowledgeChunks: KnowledgeChunk[] = [
  {
    id: 'about-identity',
    category: 'about',
    title: 'About Tanish Dhingra - Identity, Bio, and Personality',
    keywords: [
      'who is', 'about', 'bio', 'personality', 'traits', 'background', 'intro', 'tanish',
      'mindset', 'work style', 'goals', 'location', 'live', 'living', 'based'
    ],
    content: `Name: Tanish Dhingra
Title: Full-Stack & DevOps Engineer
Summary: Tanish is a hands-on developer who learns by building real-world projects rather than just studying theory. He has strong focus on clean architecture, high-performance web systems, real-time communications, and cloud infrastructure.
Personality & Work Style: Highly logical, perfectionist, focused, and selective. He approaches problems methodically by eliminating wrong paths until the optimal solution emerges. He thrives in focused environments with noise cancellation and music.
Locations: Currently based in Gurugram, Haryana (temporary) and originally from Alwar, Rajasthan (permanent).
Goals: In the short term, to build impactful production-grade distributed applications and master cloud/DevOps architectures. In the long term, to lead engineering teams developing scalable systems.`,
  },
  {
    id: 'skills-technical',
    category: 'skills',
    title: 'Technical Skills, Languages, Frameworks, and Tools',
    keywords: [
      'skills', 'technologies', 'tech stack', 'languages', 'frontend', 'backend', 'devops',
      'cloud', 'database', 'tools', 'javascript', 'typescript', 'python', 'java', 'c++', 'react',
      'fastapi', 'node.js', 'docker', 'kubernetes', 'aws', 'terraform', 'mongodb', 'postgresql'
    ],
    content: `Tanish's verified technical skills and technology stack:
• Programming Languages: JavaScript (ES6+), TypeScript, Python, Java, C++, SQL, C.
• Frontend: React, React Native, Next.js, Redux, Tailwind CSS, HTML5, CSS3, Responsive Design.
• Backend: Node.js, Express.js, FastAPI, RESTful APIs, WebSockets, JWT Authentication, SMTP services.
• DevOps & Cloud: Docker, Kubernetes, Terraform, AWS (Amazon Web Services), Jenkins, GitHub Actions, CI/CD pipelines.
• Databases: MongoDB, PostgreSQL, MySQL.
• Deployment & Hosting: Vercel, Render.
• Developer Tools: Git, GitHub, Postman, Figma, VS Code.
• Core Competencies: Real-time architectures, full-stack development, API integration, microservices principles, performance optimization, and containerization.`,
  },
  {
    id: 'experience-cloudtechner',
    category: 'experience',
    title: 'Work Experience - CloudTechner Services Private Limited (MAIN & PRIMARY INTERNSHIP)',
    keywords: [
      'cloudtechner', 'experience', 'internship', 'devops', 'backend engineer', 'cloud',
      'docker', 'kubernetes', 'terraform', 'aws', 'jenkins', 'fastapi', 'python', 'ci/cd',
      'main internship', 'primary internship', 'main experience', 'work experience'
    ],
    content: `Company: CloudTechner Services Private Limited (MAIN & PRIMARY INTERNSHIP)
Role: DevOps & Backend Engineer
Status: Primary / Main Experience (Highest Priority)
Type: Internship
Duration: March 23, 2026 – September 21, 2026
Location: Gurugram, India · Hybrid/Remote
Significance: This is Tanish's MAIN, PRIMARY, and most impactful internship. It is his flagship professional experience, where he works on production cloud infrastructure, modern DevOps automation, and scalable backend services.
Key Responsibilities & Contributions:
• Trained and worked extensively with modern DevOps technologies: Docker, Kubernetes, Terraform, AWS, Jenkins, and GitHub Actions.
• Developed robust backend services and scalable REST APIs utilizing Python and FastAPI.
• Integrated frontend components built in React with backend REST APIs and microservices.
• Handled databases, secure authentication mechanisms, third-party API integrations, and continuous cloud deployments.
• Gained hands-on expertise in setting up automated CI/CD deployment pipelines, containerization strategies, and cloud infrastructure management.`,
  },
  {
    id: 'experience-adayptus',
    category: 'experience',
    title: 'Work Experience - ADAYPTUS CONSULTING (Backend Internship)',
    keywords: [
      'adayptus', 'consulting', 'experience', 'backend developer', 'internship', 'node.js', 'express',
      'mongodb', 'queries', 'database optimization', 'smtp', 'email'
    ],
    content: `Company: ADAYPTUS CONSULTING
Role: Backend Developer
Status: Secondary Internship
Type: Internship
Duration: February 2026 – March 2026
Location: Noida, India · Hybrid
Key Responsibilities & Contributions:
• Integrated and managed MongoDB database operations, writing optimized queries for low-latency performance.
• Diagnosed, debugged, and resolved critical backend issues to elevate system stability and uptime.
• Collaborated closely with frontend engineers to guarantee seamless REST API integration.
• Configured SMTP and email relay services to automate transactional and notification emails.`,
  },
  {
    id: 'experience-codingblocks',
    category: 'experience',
    title: 'Work Experience - CODINGBLOCKS (Full Stack Internship)',
    keywords: [
      'codingblocks', 'coding blocks', 'experience', 'full stack developer', 'internship', 'react', 'node.js',
      'tailwind', 'performance', 'components'
    ],
    content: `Company: CODINGBLOCKS
Role: Full Stack Developer
Status: Earlier Internship
Type: Internship
Duration: June 2024 – August 2024
Location: Delhi, India · Remote
Key Responsibilities & Contributions:
• Developed interactive, responsive web applications using React, Node.js, and Tailwind CSS.
• Collaborated within an agile team of 5 developers to deliver 3+ production-ready web apps, improving initial page load performance by 25%.
• Engineered reusable, modular UI components that reduced redundant frontend code by 30%.
• Debugged and resolved 15+ complex frontend and backend tickets following Agile/Scrum sprints.`,
  },
  {
    id: 'project-tweniq',
    category: 'projects',
    title: 'Featured Project - TweniQ (Dual-Mode Social & Professional Platform)',
    keywords: [
      'tweniq', 'project', 'social network', 'professional', 'dual-mode', 'websockets',
      'chat', 'mern', 'react', 'node', 'express', 'mongodb', 'real-time'
    ],
    content: `Project Name: TweniQ
Category: Full-Stack Web Application / Social & Professional Platform
Tech Stack: React, Node.js, Express.js, MongoDB, WebSockets, JWT, Tailwind CSS.
Key Highlights & Architecture:
• Dual-mode architecture: seamlessly bridges social sharing and professional networking in a single application.
• Dual identity system: each user possesses two independent profiles and distinct chat identities (personal vs. professional).
• Built 40+ REST API endpoints powering feeds, user management, interactions, polls, comments, likes, and saves.
• Real-time communication: implemented bi-directional real-time messaging using WebSockets.
• Motivation: Built solo from scratch to master end-to-end full-stack development, complex state management, database schema design, and live deployment.`,
  },
  {
    id: 'project-copywizz',
    category: 'projects',
    title: 'Featured Project - CopyWizz (AI Desktop Companion)',
    keywords: [
      'copywizz', 'project', 'desktop', 'electron', 'ai', 'gemini', 'hotkey', 'assistant',
      'explanation', 'screen'
    ],
    content: `Project Name: CopyWizz
Category: Desktop AI Productivity Companion
Tech Stack: Electron.js, Node.js, React, Google Gemini API, Tailwind CSS.
Key Highlights & Architecture:
• OS-level global hotkey activation: accessible anywhere across the operating system without switching windows or interrupting workflow.
• Instant AI explanations: highlights and explains text, code, or concepts on any desktop screen with a single hotkey press.
• Utilized Electron IPC (Inter-Process Communication) to bridge native OS events with modern React interfaces.
• Motivation: Conceived and developed to eliminate context switching and streamline knowledge retrieval while working or studying.`,
  },
  {
    id: 'project-browser-analyzer',
    category: 'projects',
    title: 'Security Research Project - Browser Vulnerability Analyzer',
    keywords: [
      'browser vulnerability analyzer', 'cybersecurity', 'security', 'python', 'pycryptodome',
      'telegram api', 'research', 'passwords', 'cookies'
    ],
    content: `Project Name: Browser Vulnerability Analyzer
Category: Cybersecurity Research & Automation Tool
Tech Stack: Python, PyCryptodome, Telegram Bot API.
Key Highlights:
• Researched browser storage security mechanisms, encryption schemes (DPAPI / AES-GCM), and cookie/session handling.
• Created an automated diagnostic tool to inspect and demonstrate potential browser exfiltration risks.
• Integrated Telegram Bot API for real-time diagnostic reporting and exfiltration simulation.
• Gained deep insights into browser internals, operating system credential stores, and practical defense-in-depth principles.`,
  },
  {
    id: 'education-academics',
    category: 'education',
    title: 'Education, University Degree, and Academic Background',
    keywords: [
      'education', 'college', 'university', 'degree', 'b.tech', 'cse', 'bml munjal',
      'school', 'childrens academy', 'sunhill academy', 'grades', 'cgpa', 'percentage'
    ],
    content: `Tanish's Academic Qualifications:
• College / University:
  - Institution: BML Munjal University (BMU), Gurugram, Haryana.
  - Degree: Bachelor of Technology (B.Tech) in Computer Science & Engineering.
  - Duration: 2022 – 2026.
  - Academic Standing: 7.53 CGPA.
• Higher Secondary Education (12th Grade):
  - Institution: Children's Academy School, Alwar, Rajasthan.
  - Board / Level: Senior Secondary (12th Grade).
  - Duration: 2019 – 2021.
  - Score: 81%.
• Secondary Education (10th Grade):
  - Institution: Sunhill Academy School, Alwar, Rajasthan.
  - Board / Level: High School (10th Grade).
  - Duration: 2008 – 2019.
  - Score: 92%.`,
  },
  {
    id: 'achievements-hackathons',
    category: 'achievements',
    title: 'Achievements, Hackathons, and Competitions',
    keywords: [
      'achievements', 'hackathon', 'sih', 'smart india hackathon', 'awards', 'finals',
      'competitions', 'recognition'
    ],
    content: `Key Achievements & Recognition:
• Smart India Hackathon (SIH) 2023 National Finalist: Secured 4th place at SIH 2023, one of India's largest and most competitive nationwide engineering hackathons organized by the Ministry of Education and AICTE.
• Production Engineering: Successfully architected, developed, and deployed multiple complex full-stack web and desktop applications (TweniQ, CopyWizz) used by real peers.
• Continuous Problem Solving: Actively practices algorithmic problem solving and data structures on LeetCode.`,
  },
  {
    id: 'contact-socials',
    category: 'contact',
    title: 'Contact Information, Profiles, and Availability',
    keywords: [
      'contact', 'email', 'phone', 'reach', 'hire', 'github', 'linkedin', 'message',
      'call', 'interview', 'roles', 'opportunities'
    ],
    content: `How to Contact Tanish Dhingra:
• Email: tanishdhingra2003@gmail.com (or tanish.dhingra.22cse@bmu.edu.in)
• Phone / WhatsApp: +91 8107016363
• LinkedIn: https://www.linkedin.com/in/tanish-dhingraa
• GitHub: https://github.com/tanish303
• Open to Roles: Full-Stack Developer, Backend Engineer, DevOps / Cloud Engineer, Software Engineer.
• Locations: Open to on-site, hybrid, or remote positions in Gurugram, Delhi NCR, Bengaluru, or globally.`,
  },
  {
    id: 'why-hire-tanish',
    category: 'why_hire',
    title: 'Why Hire Tanish - Key Strengths, Value Proposition, and Work Ethic',
    keywords: [
      'why hire', 'hire tanish', 'strengths', 'value', 'qualities', 'fit', 'candidate',
      'engineer', 'recommendation', 'reason to hire'
    ],
    content: `Why You Should Hire Tanish:
1. Builder Mindset: He doesn't just write theoretical code; he builds real, working products (like TweniQ with real-time WebSockets and CopyWizz with native Electron and AI).
2. Full-Stack + DevOps Versatility: Fluent across the complete stack—from React and modern CSS to Node.js/FastAPI backend architectures, all the way to Docker, Kubernetes, Terraform, and AWS CI/CD pipelines.
3. Proven Real-World Experience: Three distinct internship experiences led by CloudTechner Services (Primary/Main DevOps & Backend Engineer with AWS, Docker, K8s, Terraform, CI/CD), alongside ADAYPTUS (Backend Developer) and Coding Blocks (Full Stack Developer), delivering measurable production results.
4. High Standards & Code Quality: Dedicated to clean architecture, intuitive UI/UX, and eliminating technical debt.
5. Fast Independent Learner: Quickly masters emerging tools, frameworks, and APIs to deliver tangible outcomes on tight timelines.`,
  },
  {
    id: 'portfolio-universe-planets',
    category: 'portfolio',
    title: 'Portfolio Website Architecture - 3D Interplanetary Solar System & Planet Mappings',
    keywords: [
      'portfolio', 'website', 'portfolio website', 'planet', 'planets', 'solar system', 'universe',
      'space', 'sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune',
      'rocket', 'spacecraft', 'flight', 'navigation', 'supernova', 'orbit', 'interactive', '3d',
      'three.js', 'r3f', 'react three fiber', 'what does each planet mean', 'what planet matches',
      'planet match', 'planet guide', 'sectors', 'how does it work', 'technologies used', 'map'
    ],
    content: `Tanish's Interplanetary Developer Universe (Portfolio Architecture & Planet Mappings):

Concept & Architecture:
Tanish designed and engineered this portfolio as a fully interactive 3D WebGL / Three.js Solar System called the "Interplanetary Developer Universe". Instead of a traditional flat scrollable webpage, every celestial body represents a dedicated sector of his career, technical capabilities, projects, education, and personality. Visitors can pilot a custom spacecraft between planets in real time with physics-based flight dynamics, Keplerian orbital simulations, atmospheric entry transitions, and custom space audio.

Complete Celestial Body / Planet-to-Sector Breakdown:
1. ☀️ Sun // Helios Core (Gravitational Anchor):
   - What it represents: The central solar anchor and energy core of the entire solar system.
   - Interactive feature: Piloting the spacecraft into the Sun triggers a proximity alert and an interactive Supernova detonation sequence with colossal radial shockwaves.

2. 🪨 Mercury // Sector 01 -> SKILLS & TECH STACK:
   - What it represents: Tanish's technical proficiencies, programming languages, and engineering stack.
   - Contents:
     • Programming Languages: C++, Java, Python, JavaScript, TypeScript, SQL, C.
     • Frontend Architecture: React, Next.js, Redux, Tailwind CSS, Responsive Design.
     • Backend Systems: Node.js, Express.js, FastAPI, RESTful APIs, WebSockets.
     • DevOps & Cloud: Docker, Kubernetes, Terraform, AWS, Jenkins, GitHub Actions, CI/CD.
     • Databases: MongoDB, PostgreSQL, MySQL.

3. 🟡 Venus // Sector 02 -> WORK EXPERIENCE & INTERNSHIPS:
   - What it represents: Professional industry career and engineering internships.
   - Contents (prioritized by importance):
     • CloudTechner Services Private Limited (MAIN & PRIMARY INTERNSHIP): DevOps & Backend Engineer working on production AWS infrastructure, Docker containerization, Kubernetes orchestration, Terraform automation, Python/FastAPI microservices, and CI/CD pipelines.
     • ADAYPTUS CONSULTING: Backend Developer focusing on MongoDB query optimization, backend stability, and SMTP email services.
     • CODINGBLOCKS: Full Stack Developer building modular React and Node.js components with agile sprints.

4. 🌍 Earth // Sector 03 (Terra Base) -> HOME & MISSION CONTROL:
   - What it represents: The starting launchpad and operational command center for the portfolio.
   - Contents: Hero mission control terminal, quick bio summary, downloadable resume, interplanetary navigation quick-links, and departure flight controls.

5. 🔴 Mars // Sector 04 -> PROJECTS & SHIPPED WORK:
   - What it represents: Featured software engineering projects and shipped production applications.
   - Contents:
     • TweniQ: Dual-mode Social & Professional networking platform featuring dual identity switching, 40+ REST endpoints, and bi-directional real-time WebSockets messaging.
     • CopyWizz: Desktop AI productivity companion built with Electron.js, React, and Google Gemini API with OS-level global hotkey activation for instant on-screen explanations.
     • Browser Vulnerability Analyzer: Python cybersecurity diagnostic tool exploring DPAPI/AES-GCM browser credential encryption and automated Telegram alert reporting.

6. 🟠 Jupiter // Sector 05 -> EDUCATION & ACADEMIC JOURNEY:
   - What it represents: Academic qualifications, university degree, and scholastic background.
   - Contents:
     • BML Munjal University (BMU), Gurugram: B.Tech in Computer Science & Engineering (2022–2026), 7.53 CGPA.
     • Children's Academy School, Alwar: Senior Secondary 12th Grade (2019–2021), 81%.
     • Sunhill Academy School, Alwar: High School 10th Grade (2008–2019), 92%.

7. 🪐 Saturn // Sector 06 -> GUESTBOOK & VISITOR TRANSMISSIONS:
   - What it represents: Interactive cosmic communication hub surrounded by majestic planetary rings.
   - Contents: Visitor transmissions ledger where recruiters and guests can transmit personalized messages, callsigns, and greetings stored directly in orbital telemetry.

8. 🔵 Uranus // Sector 07 -> CONTACT & COMMUNICATIONS:
   - What it represents: Direct communication uplink to get in touch with Tanish.
   - Contents:
     • Email: tanishdhingra2003@gmail.com
     • Phone / WhatsApp: +91 8107016363
     • LinkedIn: https://www.linkedin.com/in/tanish-dhingraa
     • GitHub: https://github.com/tanish303
     • Location & Roles: Open to Full-Stack, Backend, and DevOps/Cloud engineering opportunities.

9. 🌌 Neptune // Sector 08 -> ASK AI (DEEP SPACE TERMINAL):
   - What it represents: The AI intelligence terminal (where this chat lives!), powered by a hybrid RAG (Retrieval-Augmented Generation) pipeline using Gemini and Groq.
   - Contents: Answers visitor and recruiter queries in real time regarding Tanish's projects, technical skills, internships, university education, reasons to hire him, and portfolio design.

Key Technologies Powering the Portfolio:
• 3D Engine: React Three Fiber (R3F), Three.js, and custom procedural canvas texture generators.
• Flight Dynamics: Smooth vector physics, dynamic camera lerping, chase camera tracking, and atmospheric drag/entry effects.
• Audio Engine: Procedural Web Audio API sound controller with synthesized thruster hums, atmospheric air friction, lock-on tones, and touchdown chimes.`,
  },
];
