import React from 'react';
import { soundController } from '../../../audio/SoundController';

interface VenusExperiencePanelProps {
  uiX?: number;
  uiY?: number;
}

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  type: string;
  duration: string;
  location: string;
  description: string[];
  technologies: string[];
  companyUrl?: string;
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'cloudtechner',
    role: 'DevOps Trainee & Backend Engineer',
    company: 'CloudTechner Services Private Limited',
    type: 'Internship / Trainee',
    duration: 'Mar 23, 2026 – Sep 21, 2026',
    location: 'Gurugram, India · Hybrid/Remote',
    description: [
      'Trained and worked with DevOps technologies including Docker, Kubernetes, Terraform, AWS, Jenkins, and GitHub Actions.',
      'Developed backend services and REST APIs using Python and FastAPI.',
      'Worked with React to develop frontend components and integrate them with backend APIs.',
      'Worked with databases, authentication, API integration, and application deployment.',
      'Gained hands-on experience with CI/CD, containerization, cloud infrastructure, and deployment workflows.',
    ],
    technologies: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'Jenkins', 'FastAPI', 'Python', 'React'],
  },
  {
    id: 'adayptus',
    role: 'Backend Developer',
    company: 'ADAYPTUS CONSULTING',
    type: 'Internship',
    duration: 'Feb 2026 - Mar 2026',
    location: 'Noida, India | Hybrid',
    description: [
      'Integrated and managed database operations while optimizing queries for performance.',
      'Identified and fixed backend issues to improve system stability and reliability.',
      'Worked closely with frontend developers to ensure seamless API integration.',
      'Configured SMTP and email services to implement automated system emails.',
    ],
    technologies: ['Node.js', 'Express', 'MongoDB', 'SMTP'],
  },
  {
    id: 'codingblocks',
    role: 'Full Stack Developer',
    company: 'CODINGBLOCKS',
    type: 'Internship',
    duration: 'Jun 2024 - Aug 2024',
    location: 'Delhi, India | Remote',
    description: [
      'Hands-on experience in HTML, CSS, JavaScript, building responsive web applications.',
      'Collaborated in a team of 5 to deliver responsive web apps, improving load speed by 25%.',
      'Built reusable UI components that reduced redundant code by 30%.',
    ],
    technologies: ['React', 'Node.js', 'Tailwind CSS', 'JavaScript'],
  },
];

export const VenusExperiencePanel: React.FC<VenusExperiencePanelProps> = ({
  uiX = 0,
  uiY = 0,
}) => {
  return (
    <div
      className="venus-centered-panel-wrapper"
      style={{
        position: 'fixed',
        left: `calc(50% + ${uiX * 0.25}px)`,
        top: `calc(50% + ${uiY * 0.25}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: 25,
        pointerEvents: 'auto',
        width: 'min(1180px, 95vw)',
      }}
    >
      <div className="venus-experience-grid">
        {EXPERIENCES.map((exp) => (
          <div
            key={exp.id}
            className="venus-exp-card"
            onMouseEnter={() => soundController.playHoverGlass()}
          >
            {/* Header: Role & Type Badge */}
            <div className="venus-exp-header">
              <span className="venus-exp-type">{exp.type}</span>
              <h3 className="venus-exp-role">{exp.role}</h3>
              <div className="venus-exp-company-row">
                <span className="venus-exp-company">{exp.company}</span>
                {exp.companyUrl && (
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="venus-exp-link"
                    title={`Visit ${exp.company}`}
                  >
                    ↗
                  </a>
                )}
              </div>
              <div className="venus-exp-meta">
                <span>📍 {exp.location}</span>
                <span>🗓 {exp.duration}</span>
              </div>
            </div>

            {/* Bullets List */}
            <ul className="venus-exp-bullets">
              {exp.description.map((bullet, idx) => (
                <li key={idx} className="venus-exp-bullet-item">
                  <span className="venus-bullet-dot">▸</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Tech Badges */}
            <div className="venus-exp-tech-row">
              {exp.technologies.map((tech) => (
                <span key={tech} className="venus-tech-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenusExperiencePanel;
