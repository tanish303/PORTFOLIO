import React, { useState, useEffect } from 'react';
import { soundController } from '../../../audio/SoundController';

interface GlassProjectPanelProps {
  uiX: number;
  uiY: number;
}

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image: string;
  video: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'tweniq',
    title: 'TweniQ',
    description:
      'A dual-mode social and professional networking platform. TweniQ allows users to switch between social and professional profiles, with unique feeds, interactions, and post types for each mode. Features include real-time chat, polls, likes, saved posts, followers/following, and profile customization.',
    image: '/tweniq.png',
    video: 'https://res.cloudinary.com/dhmwi7kcd/video/upload/v1773831935/Tweniq_k01j2m.mp4',
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
    githubUrl: 'https://github.com/tanish303/tweniq',
    liveUrl: 'https://tweniq.vercel.app',
  },
  {
    id: 'copywizz',
    title: 'CopyWizz',
    description:
      'A desktop assistant built with Electron and React that instantly provides AI-powered explanations for copied text. It features a global hotkey, toast-style responses, persistent query history with favoriting, safe-save storage, customizable API keys, and OS-level auto-start integration.',
    image: '/copywizz.png',
    video: 'https://res.cloudinary.com/dhmwi7kcd/video/upload/v1773831459/CopyWizz_tvfvop.mp4',
    technologies: ['Electron', 'React', 'Tailwind CSS', 'Node.js', 'Gemini API', 'JavaScript'],
    githubUrl: 'https://github.com/tanish303/CopyWizz',
  },
];

export const GlassProjectPanel: React.FC<GlassProjectPanelProps> = ({ uiX, uiY }) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedVideo(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Centered 2-Card Horizontal Layout */}
      <div
        className="mars-centered-panel-wrapper"
        style={{
          position: 'fixed',
          left: `calc(50% + ${uiX * 0.25}px)`,
          top: `calc(50% + ${uiY * 0.25}px)`,
          transform: 'translate(-50%, -50%)',
          zIndex: 25,
          pointerEvents: 'auto',
          width: 'min(980px, 94vw)',
        }}
      >
        <div className="mars-projects-grid">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="mars-project-card group"
              onMouseEnter={() => soundController.playHoverGlass()}
            >
              {/* Card Image Banner with Play Button Overlay */}
              <div className="mars-card-media-wrapper">
                <img
                  src={project.image}
                  alt={project.title}
                  className="mars-card-img"
                  onError={(e) => {
                    // graceful fallback if image is missing
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  className="mars-media-play-overlay"
                  onClick={() => {
                    soundController.playDestinationSelect();
                    setSelectedVideo(project.video);
                  }}
                  title={`Play ${project.title} Demo Video`}
                >
                  <span className="mars-play-icon">▶</span>
                  <span className="mars-play-text">Play Demo</span>
                </button>
              </div>

              {/* Card Content Body */}
              <div className="mars-card-body">
                <h3 className="mars-card-title">{project.title}</h3>
                <p className="mars-card-desc">{project.description}</p>

                {/* Tech Stack Pills */}
                <div className="mars-tech-pills">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="mars-tech-pill">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Card Action Buttons: Code, Live, Play Demo */}
                <div className="mars-card-actions">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mars-btn-outline"
                    onClick={() => soundController.playDestinationSelect()}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                    <span>Code</span>
                  </a>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mars-btn-primary"
                      onClick={() => soundController.playDestinationSelect()}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      <span>Live</span>
                    </a>
                  )}

                  <button
                    type="button"
                    className="mars-btn-demo"
                    onClick={() => {
                      soundController.playDestinationSelect();
                      setSelectedVideo(project.video);
                    }}
                  >
                    <span>▶ Demo</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player matching old portfolio-website */}
      {selectedVideo && (
        <div
          className="mars-video-modal-backdrop"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="mars-video-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="mars-video-close-btn"
              onClick={() => setSelectedVideo(null)}
              title="Close Video"
            >
              ✕
            </button>
            <div className="mars-video-frame">
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="mars-video-element"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlassProjectPanel;
