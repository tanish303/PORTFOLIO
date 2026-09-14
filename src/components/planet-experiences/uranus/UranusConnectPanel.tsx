import React, { useState } from 'react';
import { soundController } from '../../../audio/SoundController';

interface UranusConnectPanelProps {
  uiX?: number;
  uiY?: number;
}

export const UranusConnectPanel: React.FC<UranusConnectPanelProps> = ({
  uiX = 0,
  uiY = 0,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText('+918107016363');
      soundController.playDestinationSelect();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div
      className="uranus-centered-panel-wrapper"
      style={{
        position: 'fixed',
        left: `calc(50% + ${uiX * 0.25}px)`,
        top: `calc(50% + ${uiY * 0.25}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: 25,
        pointerEvents: 'auto',
        width: 'min(780px, 94vw)',
      }}
    >
      <div className="uranus-connect-card">
        {/* Header */}
        <div className="uranus-connect-header">
          <h2 className="uranus-connect-title">Get In Touch</h2>
          <p className="uranus-connect-sub">
            Have a project in mind or just want to chat? I'd love to hear from you!
          </p>
        </div>

        <div className="uranus-connect-content">
          {/* Let's connect section */}
          <div className="uranus-inner-box">
            <h3 className="uranus-box-title">Let's connect</h3>
            <p className="uranus-box-text">
              I'm always interested in hearing about new opportunities, creative projects, or just
              having a conversation about technology and innovation.
            </p>
            <p className="uranus-box-text">
              Whether you're looking to build something amazing or just want to say hello, feel free
              to reach out!
            </p>
          </div>

          {/* Social Links Row */}
          <div className="uranus-inner-box">
            <h3 className="uranus-box-title" style={{ textAlign: 'center' }}>
              Find me online
            </h3>
            <div className="uranus-social-grid">
              {/* GitHub */}
              <a
                href="https://github.com/tanish303"
                target="_blank"
                rel="noopener noreferrer"
                className="uranus-social-btn"
                onClick={() => soundController.playDestinationSelect()}
              >
                <svg
                  width="18"
                  height="18"
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
                <span>GitHub</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/tanish-dhingraa"
                target="_blank"
                rel="noopener noreferrer"
                className="uranus-social-btn hover-blue"
                onClick={() => soundController.playDestinationSelect()}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span>LinkedIn</span>
              </a>

              {/* Phone (Copy) */}
              <button
                type="button"
                onClick={handleCopyPhone}
                className="uranus-social-btn hover-green"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{copied ? 'Copied! (+918107016363)' : 'Phone'}</span>
              </button>

              {/* Email */}
              <a
                href="mailto:tanishdhingra2003@gmail.com"
                className="uranus-social-btn hover-red"
                onClick={() => soundController.playDestinationSelect()}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UranusConnectPanel;
