import React from 'react';
import { soundController } from '../../../audio/SoundController';

interface JupiterEducationPanelProps {
  uiX?: number;
  uiY?: number;
}

interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  percentage: string;
  year: string;
  description: string;
}

const EDUCATION_DATA: EducationItem[] = [
  {
    id: 'sunhill',
    degree: 'High School',
    school: 'Sunhill Academy School',
    location: 'Alwar, Rajasthan, India',
    percentage: '92%',
    year: '2008 - 2019',
    description: 'Passed 10th grade with 92% marks.',
  },
  {
    id: 'childrens',
    degree: 'Senior Secondary',
    school: "Children's Academy School",
    location: 'Alwar, Rajasthan, India',
    percentage: '81%',
    year: '2019 - 2021',
    description: 'Passed 12th grade with 81% marks.',
  },
  {
    id: 'bml',
    degree: 'B.Tech in Computer Science & Engineering',
    school: 'BML Munjal University',
    location: 'Gurugram, Haryana, India',
    percentage: '7.53 CGPA',
    year: '2022 - 2026',
    description: 'Pursuing B.Tech in CSE with a current CGPA of 7.53.',
  },
];

export const JupiterEducationPanel: React.FC<JupiterEducationPanelProps> = ({
  uiX = 0,
  uiY = 0,
}) => {
  return (
    <div
      className="jupiter-centered-panel-wrapper"
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
      <div className="jupiter-education-flow">
        {EDUCATION_DATA.map((item, index) => (
          <React.Fragment key={item.id}>
            {/* Education Card */}
            <div
              className="jupiter-edu-card"
              onMouseEnter={() => soundController.playHoverGlass()}
            >
              <div className="jupiter-edu-badge-row">
                <span className="jupiter-edu-year">{item.year}</span>
                <span className="jupiter-edu-score">{item.percentage}</span>
              </div>

              <h3 className="jupiter-edu-degree">{item.degree}</h3>
              <h4 className="jupiter-edu-school">{item.school}</h4>

              <p className="jupiter-edu-desc">{item.description}</p>

              <div className="jupiter-edu-location">
                <span>📍 {item.location}</span>
              </div>
            </div>

            {/* Right Arrow between card 1 and 2, and card 2 and 3 */}
            {index < EDUCATION_DATA.length - 1 && (
              <div className="jupiter-flow-arrow" aria-hidden="true">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default JupiterEducationPanel;
