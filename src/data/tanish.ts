export interface TanishData {
  basic: {
    name: string;
    title: string;
    shortBio: string;
  };
  bio: {
    longBio: string;
  };
  address: {
    temporary: string;
    permanent: string;
  };
  goals: {
    shortTerm: string;
    longTerm: string;
  };
  personality: {
    coreTraits: string[];
    copingMechanisms: string[];
    workStyle: string;
    motivation: string;
    valuesInWork: string[];
    strengths: string[];
  };
  skills: {
    programmingLanguages: string[];
    frontend: string[];
    backend: string[];
    devopsCloud: string[];
    databases: string[];
    tools: string[];
    deployment: string[];
  };
  education: {
    college: {
      name: string;
      degree: string;
      location: string;
      duration: string;
      gpa: string;
    };
    schools: Array<{
      name: string;
      level: string;
      location: string;
      duration: string;
      score: string;
    }>;
  };
  experience: Array<{
    company: string;
    role: string;
    type: string;
    duration: string;
    location: string;
    details: string[];
    technologies: string[];
  }>;
  achievements: string[];
  projects: Array<{
    name: string;
    tech: string[];
    highlights: string[];
    description: string;
  }>;
  contact: {
    email: string;
    phone: string;
    github: string;
    linkedin: string;
  };
}

export const tanishData: TanishData = {
  basic: {
    name: "Tanish Dhingra",
    title: "Full-Stack & DevOps Engineer",
    shortBio: "Full-stack developer with strong experience in modern web apps, real-time systems, and cloud infrastructure.",
  },
  bio: {
    longBio: "I started coding through building hands-on projects and gaining real-world experience from internships. I focus on clean architecture, high-performance web systems, and responsive user experiences.",
  },
  address: {
    temporary: "Gurugram, Haryana",
    permanent: "Alwar, Rajasthan",
  },
  goals: {
    shortTerm: "Build impactful production-grade applications and master cloud/DevOps architectures.",
    longTerm: "Lead engineering teams building scalable distributed software.",
  },
  personality: {
    coreTraits: ["Logical", "Perfectionist", "Focused", "Continuous learner"],
    copingMechanisms: ["Video games", "Friends", "Music"],
    workStyle: "I focus deeply with earphones and music, learning by building and eliminating wrong paths.",
    motivation: "Staying proactive, building tangible products, and maximizing potential.",
    valuesInWork: ["Clean code", "Perfection", "User experience"],
    strengths: ["Fast learner", "Problem solver", "Full-stack versatility"],
  },
  skills: {
    programmingLanguages: ["JavaScript", "TypeScript", "Python", "Java", "C++"],
    frontend: ["React", "React Native", "Next.js", "Redux", "Tailwind CSS", "HTML5"],
    backend: ["Node.js", "Express.js", "FastAPI", "REST APIs", "JWT Auth"],
    devopsCloud: ["Docker", "Kubernetes", "Terraform", "AWS", "Jenkins", "GitHub Actions"],
    databases: ["MongoDB", "PostgreSQL", "MySQL"],
    tools: ["Git", "Postman", "Figma", "VS Code"],
    deployment: ["Vercel", "Render"],
  },
  education: {
    college: {
      name: "BML Munjal University",
      degree: "B.Tech in Computer Science & Engineering",
      location: "Gurugram, Haryana",
      duration: "2022 - 2026",
      gpa: "7.53 CGPA",
    },
    schools: [
      {
        name: "Children's Academy School",
        level: "Senior Secondary (12th)",
        location: "Alwar, Rajasthan",
        duration: "2019 - 2021",
        score: "81%",
      },
      {
        name: "Sunhill Academy School",
        level: "High School (10th)",
        location: "Alwar, Rajasthan",
        duration: "2008 - 2019",
        score: "92%",
      },
    ],
  },
  experience: [
    {
      company: "CloudTechner Services Private Limited",
      role: "DevOps & Backend Engineer",
      type: "Internship",
      duration: "Mar 23, 2026 – Sep 21, 2026",
      location: "Gurugram, India · Hybrid/Remote",
      details: [
        "Trained and worked with DevOps technologies including Docker, Kubernetes, Terraform, AWS, Jenkins, and GitHub Actions.",
        "Developed backend services and REST APIs using Python and FastAPI.",
        "Worked with React to develop frontend components and integrate them with backend APIs.",
        "Worked with databases, authentication, API integration, and application deployment.",
        "Gained hands-on experience with CI/CD, containerization, cloud infrastructure, and deployment workflows.",
      ],
      technologies: ["Docker", "Kubernetes", "Terraform", "AWS", "Jenkins", "FastAPI", "Python", "React"],
    },
    {
      company: "ADAYPTUS CONSULTING",
      role: "Backend Developer",
      type: "Internship",
      duration: "Feb 2026 - Mar 2026",
      location: "Noida, India | Hybrid",
      details: [
        "Integrated and managed database operations while optimizing queries for performance.",
        "Identified and fixed backend issues to improve system stability and reliability.",
        "Worked closely with frontend developers to ensure seamless API integration.",
        "Configured SMTP and email services to implement automated system emails.",
      ],
      technologies: ["Node.js", "Express", "MongoDB", "SMTP"],
    },
    {
      company: "CODINGBLOCKS",
      role: "Full Stack Developer",
      type: "Internship",
      duration: "Jun 2024 - Aug 2024",
      location: "Delhi, India | Remote",
      details: [
        "Hands-on experience in HTML, CSS, JavaScript, building responsive web applications.",
        "Collaborated in a team of 5 to deliver responsive web apps, improving load speed by 25%.",
        "Built reusable UI components that reduced redundant code by 30%.",
      ],
      technologies: ["React", "Node.js", "Tailwind CSS", "JavaScript"],
    },
  ],
  achievements: [
    "Secured 4th place at Smart India Hackathon (SIH) 2023",
    "Built and shipped multiple full-stack and real-time production apps",
  ],
  projects: [
    {
      name: "TweniQ",
      tech: ["React", "Node.js", "Express", "MongoDB", "WebSockets", "Tailwind CSS"],
      highlights: [
        "Dual-mode platform: Social + Professional",
        "Two separate profiles and chat accounts per user",
        "40+ REST API endpoints with real-time WebSockets chat",
      ],
      description: "A dual-mode social and professional network featuring dual profiles, independent chat accounts, and real-time feeds.",
    },
    {
      name: "CopyWizz",
      tech: ["Electron", "Node.js", "React", "Gemini API", "Tailwind CSS"],
      highlights: [
        "OS-level global hotkey activation",
        "Instant AI explanations on any desktop screen",
        "Built with Electron and AI integration",
      ],
      description: "An AI-powered desktop companion tool providing instant explanations anywhere via global hotkeys.",
    },
  ],
  contact: {
    email: "tanishdhingra2003@gmail.com",
    phone: "+91 8107016363",
    github: "https://github.com/tanish303",
    linkedin: "https://www.linkedin.com/in/tanish-dhingraa",
  },
};
