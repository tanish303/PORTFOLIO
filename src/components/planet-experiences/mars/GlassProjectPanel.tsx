import React, { useState } from 'react';
import { soundController } from '../../../audio/SoundController';

interface GlassProjectPanelProps {
  uiX: number;
  uiY: number;
}

interface ProjectItem {
  id: string;
  badge: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  extendedDetails: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'tweniq',
    badge: 'PROJECT // 01',
    index: 'SYS.TWENIQ.01',
    title: 'TWENIQ',
    subtitle: 'Dual-Mode Social & Professional Platform',
    description:
      'A dual-mode networking platform allowing users to toggle between social and professional profiles, with distinct feeds, real-time chat, polls, and followers.',
    extendedDetails:
      'Engineered completely solo to master full-stack and real-time systems. Features dual user profiles, two independent chat identities per account, 40+ REST API endpoints, JWT authentication, and WebSockets/Socket.io real-time chat infrastructure.',
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT'],
    metrics: [
      { label: 'ENDPOINTS', value: '40+ APIs' },
      { label: 'PROFILES', value: 'Dual Mode' },
      { label: 'REAL-TIME', value: 'Socket.io' },
    ],
  },
  {
    id: 'copywizz',
    badge: 'PROJECT // 02',
    index: 'SYS.COPYWIZZ.02',
    title: 'COPYWIZZ',
    subtitle: 'AI-Powered Desktop Assistant',
    description:
      'Desktop application built with Electron and React that instantly provides AI-powered explanations for copied text with global hotkeys and toast notifications.',
    extendedDetails:
      'Integrates at the OS-level with auto-start on boot, global keyboard shortcuts, persistent query history, favoriting, safe-save storage, and Google Gemini API integration for instantaneous smart explanations from any active window.',
    technologies: ['Electron', 'React', 'Tailwind CSS', 'Node.js', 'Gemini API', 'JavaScript'],
    metrics: [
      { label: 'ACTIVATION', value: 'Global Hotkey' },
      { label: 'INTEGRATION', value: 'Desktop OS' },
      { label: 'AI ENGINE', value: 'Gemini API' },
    ],
  },
  {
    id: 'browser-vuln-analyzer',
    badge: 'PROJECT // 03',
    index: 'SYS.VULN.03',
    title: 'BROWSER VULNERABILITY ANALYZER',
    subtitle: 'Cybersecurity Analysis & Automation Tool',
    description:
      'Automated cybersecurity assessment tool that extracts and analyzes sensitive browser artifacts (passwords, cookies, history, bookmarks) to simulate exfiltration vectors.',
    extendedDetails:
      'Built to explore browser storage internals and operating system cryptographic behaviors using Python and PyCryptodome. Features automated Telegram bot integration to dispatch real-time vulnerability telemetry.',
    technologies: ['Python', 'PyCryptodome', 'Telegram API', 'Cryptography', 'Security Automation'],
    metrics: [
      { label: 'ANALYSIS', value: 'Passwords & Cookies' },
      { label: 'AUTOMATION', value: 'Telegram Bot' },
      { label: 'CORE ENGINE', value: 'PyCryptodome' },
    ],
  },
];

export const GlassProjectPanel: React.FC<GlassProjectPanelProps> = ({ uiX, uiY }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeProject = PROJECTS_DATA[selectedIndex];

  return (
    <>
      {/* 1. Refined Floating Glass HUD Interface (Preserves ~80% of Mars Landscape) */}
      <div
        className="mars-glass-panel-wrapper"
        style={{
          position: 'absolute',
          bottom: '48px',
          right: '48px',
          zIndex: 20,
          transform: `translate3d(${uiX}px, ${uiY}px, 0)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div
          className="mars-glass-card"
          onMouseEnter={() => soundController.playHoverGlass()}
        >
          {/* Card Header & Project Switcher Tabs */}
          <div className="mars-glass-header">
            <div className="mars-glass-tag">
              <span className="mars-glass-dot" />
              <span>{activeProject.badge}</span>
            </div>

            {/* Compact Project Switcher 01 / 02 / 03 */}
            <div className="mars-project-tabs">
              {PROJECTS_DATA.map((p, idx) => (
                <button
                  key={p.id}
                  className={`mars-tab-btn ${selectedIndex === idx ? 'active' : ''}`}
                  onClick={() => {
                    soundController.playDestinationSelect();
                    setSelectedIndex(idx);
                  }}
                  title={`Switch to ${p.title}`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Project Title & Short Description */}
          <div className="mars-glass-body">
            <h3 className="mars-glass-title">{activeProject.title}</h3>
            <div className="mars-glass-subtitle">{activeProject.subtitle}</div>
            <p className="mars-glass-desc">{activeProject.description}</p>
          </div>

          {/* Tech Stack Chips */}
          <div className="mars-tech-pills">
            {activeProject.technologies.slice(0, 4).map((tech, idx) => (
              <span key={idx} className="mars-tech-pill">
                {tech}
              </span>
            ))}
          </div>

          {/* Card Footer: Expand Interaction */}
          <div className="mars-glass-footer">
            <button
              className="mars-expand-btn"
              onClick={() => {
                soundController.playDestinationSelect();
                setIsExpanded(true);
              }}
            >
              <span>EXPAND MISSION TELEMETRY</span>
              <span className="mars-arrow">↗</span>
            </button>
            <span className="mars-sys-label">{activeProject.index}</span>
          </div>
        </div>
      </div>

      {/* 2. Expanded Project Details Modal */}
      {isExpanded && (
        <div
          className="mars-modal-backdrop"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="mars-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mars-modal-header">
              <div className="mars-glass-tag">
                <span className="mars-glass-dot" />
                <span>{activeProject.badge} • DETAILED ARCHITECTURE</span>
              </div>
              <button
                className="mars-modal-close"
                onClick={() => setIsExpanded(false)}
              >
                ✕
              </button>
            </div>

            <h2 className="mars-modal-title">{activeProject.title}</h2>
            <div className="mars-glass-subtitle">{activeProject.subtitle}</div>

            <p className="mars-modal-desc">{activeProject.description}</p>
            <p className="mars-modal-extended">{activeProject.extendedDetails}</p>

            {/* Telemetry Metrics */}
            <div className="mars-metrics-grid">
              {activeProject.metrics.map((m, idx) => (
                <div key={idx} className="mars-metric-box">
                  <div className="mars-metric-label">{m.label}</div>
                  <div className="mars-metric-val">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Technologies */}
            <div style={{ marginTop: '20px' }}>
              <div className="mars-metric-label" style={{ marginBottom: '8px' }}>
                MISSION TECHNOLOGIES
              </div>
              <div className="mars-tech-pills">
                {activeProject.technologies.map((t, idx) => (
                  <span key={idx} className="mars-tech-pill" style={{ padding: '6px 12px' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
