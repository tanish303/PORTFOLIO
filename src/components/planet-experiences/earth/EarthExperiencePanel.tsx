import React from 'react';

interface EarthExperiencePanelProps {
  uiX?: number;
  uiY?: number;
}

export const EarthExperiencePanel: React.FC<EarthExperiencePanelProps> = ({ uiX = 0, uiY = 0 }) => {
  return (
    <div
      className="earth-glass-panel-wrapper"
      style={{
        position: 'fixed',
        left: `calc(50% + ${uiX * 0.25}px)`,
        top: `calc(50% + ${uiY * 0.25}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: 25,
        pointerEvents: 'auto',
      }}
    >
      <div className="earth-center-glass-card">
        <h1 className="earth-hero-heading">
          Hii, I'm <span className="earth-hero-name">Tanish</span>
        </h1>
        <p className="earth-hero-subtext">
          Explore the planets to discover more about me, my skills, and my work.
        </p>
      </div>
    </div>
  );
};

export default EarthExperiencePanel;
