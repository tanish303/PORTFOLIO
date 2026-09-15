import React, { useState, useEffect } from 'react';
import type { PlanetEnvironmentConfig, GuestbookEntry } from '../../../data/planetEnvironments';
import { soundController } from '../../../audio/SoundController';

interface PlanetGlassPanelProps {
  config: PlanetEnvironmentConfig;
  uiX: number;
  uiY: number;
}

const DEFAULT_GUESTBOOK_ENTRIES: GuestbookEntry[] = [];
const GUESTBOOK_STORAGE_KEY = 'guestbook_transmissions_v2';

export const PlanetGlassPanel: React.FC<PlanetGlassPanelProps> = ({ config, uiX, uiY }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Guestbook state
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>(() => {
    try {
      localStorage.removeItem('guestbook_transmissions');
      const saved = localStorage.getItem(GUESTBOOK_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_GUESTBOOK_ENTRIES;
  });
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [guestCallsign, setGuestCallsign] = useState('');
  const [isSubmittingGuest, setIsSubmittingGuest] = useState(false);
  const [guestSubmitSuccess, setGuestSubmitSuccess] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    setSelectedIndex(0);
    setIsExpanded(false);
  }, [config.id]);

  const activeItem = config.items[selectedIndex] || config.items[0];

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMessage.trim()) return;

    setIsSubmittingGuest(true);
    soundController.playDestinationSelect();

    setTimeout(() => {
      const newEntry: GuestbookEntry = {
        id: `entry-${Date.now()}`,
        author: guestName.trim(),
        callsign: guestCallsign.trim() || `VISITOR-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: `${new Date().toISOString().slice(0, 10).replace(/-/g, '.')} // ${new Date()
          .toTimeString()
          .slice(0, 5)} UTC`,
        message: guestMessage.trim(),
        origin: 'Interplanetary Terminal',
      };

      const updated = [newEntry, ...guestbookEntries];
      setGuestbookEntries(updated);
      try {
        localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }

      setGuestName('');
      setGuestMessage('');
      setGuestCallsign('');
      setIsSubmittingGuest(false);
      setGuestSubmitSuccess(true);
      setTimeout(() => setGuestSubmitSuccess(false), 3000);
    }, 600);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    setIsTransmitting(true);
    soundController.playDestinationSelect();

    setTimeout(() => {
      setIsTransmitting(false);
      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setContactSuccess(false), 5000);
    }, 1000);
  };

  const handleActionClick = () => {
    soundController.playDestinationSelect();
    if (config.id === 'resume') {
      // Direct resume view or alert
      window.open('#', '_blank');
      alert('Curriculum Vitae transmission initialized. Verification hash: 0x7E3A9F21');
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <>
      {/* 1. Floating Glass HUD Interface */}
      <div
        className="planet-glass-panel-wrapper"
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
          className="planet-glass-card"
          style={{
            borderColor: `rgba(${config.themeColorRgb}, 0.32)`,
            boxShadow: `0 24px 50px rgba(0, 0, 0, 0.72), inset 0 1px 0 rgba(${config.themeColorRgb}, 0.25), 0 0 35px rgba(${config.themeColorRgb}, 0.12)`,
          }}
          onMouseEnter={() => soundController.playHoverGlass()}
        >
          {/* Accent top gradient line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, transparent, rgba(${config.themeColorRgb}, 0.9), transparent)`,
            }}
          />

          {/* Card Header & Multi-Item Tabs */}
          <div className="planet-glass-header">
            <div className="planet-glass-tag">
              <span
                className="planet-glass-dot"
                style={{
                  backgroundColor: config.themeColor,
                  boxShadow: `0 0 10px ${config.themeColor}`,
                }}
              />
              <span style={{ color: config.themeColor }}>{activeItem?.badge || config.contentCategory}</span>
            </div>

            {/* Item Tabs (if more than 1 item) */}
            {config.items.length > 1 && (
              <div className="planet-item-tabs">
                {config.items.map((item, idx) => (
                  <button
                    key={item.id}
                    className={`planet-tab-btn ${selectedIndex === idx ? 'active' : ''}`}
                    style={
                      selectedIndex === idx
                        ? {
                            backgroundColor: `rgba(${config.themeColorRgb}, 0.2)`,
                            borderColor: config.themeColor,
                            color: '#ffffff',
                            boxShadow: `0 0 15px rgba(${config.themeColorRgb}, 0.3)`,
                          }
                        : {}
                    }
                    onClick={() => {
                      soundController.playDestinationSelect();
                      setSelectedIndex(idx);
                    }}
                    title={`Switch to ${item.title}`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Body: Title, Subtitle, Description */}
          <div className="planet-glass-body">
            <h3 className="planet-glass-title">{activeItem?.title}</h3>
            <div className="planet-glass-subtitle" style={{ color: config.themeColor }}>
              {activeItem?.subtitle}
            </div>
            <p className="planet-glass-desc">{activeItem?.description}</p>
          </div>

          {/* Interactive Feature: Guestbook Quick Teaser / Form */}
          {config.isGuestbook && (
            <div className="planet-interactive-box">
              <div className="planet-guest-recent">
                <span className="planet-guest-badge">LATEST LOG</span>
                <span className="planet-guest-author">{guestbookEntries[0]?.author}:</span>
                <span className="planet-guest-snippet">"{guestbookEntries[0]?.message.slice(0, 52)}..."</span>
              </div>
            </div>
          )}

          {/* Interactive Feature: Contact Quick Channels */}
          {config.isContact && (
            <div className="planet-channels-row">
              <a
                href="https://github.com/tanish303"
                target="_blank"
                rel="noreferrer"
                className="planet-channel-link"
                style={{ borderColor: `rgba(${config.themeColorRgb}, 0.4)` }}
              >
                GITHUB ↗
              </a>
              <a
                href="https://www.linkedin.com/in/tanish-dhingraa"
                target="_blank"
                rel="noreferrer"
                className="planet-channel-link"
                style={{ borderColor: `rgba(${config.themeColorRgb}, 0.4)` }}
              >
                LINKEDIN ↗
              </a>
              <a
                href="mailto:tanishdhingra2003@gmail.com"
                className="planet-channel-link"
                style={{ borderColor: `rgba(${config.themeColorRgb}, 0.4)` }}
              >
                EMAIL ↗
              </a>
              <a
                href="tel:+918107016363"
                className="planet-channel-link"
                style={{ borderColor: `rgba(${config.themeColorRgb}, 0.4)` }}
              >
                PHONE ↗
              </a>
            </div>
          )}

          {/* Tags / Technology Chips */}
          {activeItem?.tags && activeItem.tags.length > 0 && (
            <div className="planet-tech-pills">
              {activeItem.tags.slice(0, 4).map((tag, idx) => (
                <span
                  key={idx}
                  className="planet-tech-pill"
                  style={{ borderColor: `rgba(${config.themeColorRgb}, 0.25)` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Card Footer: Expand Interaction */}
          <div className="planet-glass-footer">
            <button
              className="planet-expand-btn"
              style={{
                borderColor: `rgba(${config.themeColorRgb}, 0.35)`,
                background: `rgba(${config.themeColorRgb}, 0.1)`,
              }}
              onClick={handleActionClick}
            >
              <span>
                {config.isGuestbook
                  ? 'TRANSMIT GUESTBOOK LOG'
                  : config.isContact
                  ? 'OPEN TRANSMISSION TERMINAL'
                  : activeItem?.actionLink?.label || 'EXPAND FULL TELEMETRY'}
              </span>
              <span className="planet-arrow" style={{ color: config.themeColor }}>
                ↗
              </span>
            </button>
            <span className="planet-sys-label" style={{ color: config.themeColor }}>
              {activeItem?.index}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Expanded Modal / Interactive System Details */}
      {isExpanded && (
        <div className="planet-modal-backdrop" onClick={() => setIsExpanded(false)}>
          <div
            className="planet-modal-card"
            style={{
              borderColor: `rgba(${config.themeColorRgb}, 0.4)`,
              boxShadow: `0 30px 80px rgba(0, 0, 0, 0.85), 0 0 50px rgba(${config.themeColorRgb}, 0.2)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="planet-modal-header">
              <div className="planet-glass-tag">
                <span
                  className="planet-glass-dot"
                  style={{
                    backgroundColor: config.themeColor,
                    boxShadow: `0 0 10px ${config.themeColor}`,
                  }}
                />
                <span style={{ color: config.themeColor }}>
                  {config.name} • {config.contentCategory}
                </span>
              </div>
              <button className="planet-modal-close" onClick={() => setIsExpanded(false)}>
                ✕
              </button>
            </div>

            {/* Guestbook Full Interactive Mode */}
            {config.isGuestbook ? (
              <div className="planet-guestbook-modal-content">
                <h2 className="planet-modal-title">CRYOGENIC TRANSMISSION VAULT</h2>
                <div className="planet-glass-subtitle" style={{ color: config.themeColor }}>
                  Permanent Visitor Log • Titania Sector Data Array
                </div>

                {/* Submit New Entry Form */}
                <form onSubmit={handleGuestbookSubmit} className="planet-guest-form">
                  <div className="planet-form-row">
                    <input
                      type="text"
                      placeholder="YOUR NAME / CALLSIGN"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                      className="planet-form-input"
                    />
                    <input
                      type="text"
                      placeholder="CALLSIGN (OPTIONAL, E.G. ORION-4)"
                      value={guestCallsign}
                      onChange={(e) => setGuestCallsign(e.target.value)}
                      className="planet-form-input"
                    />
                  </div>
                  <textarea
                    placeholder="ENTER YOUR DEEP-SPACE TRANSMISSION MESSAGE..."
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    required
                    rows={3}
                    className="planet-form-textarea"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="submit"
                      disabled={isSubmittingGuest}
                      className="planet-submit-btn"
                      style={{
                        borderColor: config.themeColor,
                        background: `rgba(${config.themeColorRgb}, 0.2)`,
                      }}
                    >
                      {isSubmittingGuest ? 'ENCRYPTING & TRANSMITTING...' : '⚡ TRANSMIT MESSAGE TO VAULT'}
                    </button>
                    {guestSubmitSuccess && (
                      <span style={{ color: '#4ade80', fontSize: '12px', fontFamily: 'monospace' }}>
                        ✓ TRANSMISSION RECORDED IN CRYOGENIC LOG
                      </span>
                    )}
                  </div>
                </form>

                {/* Transmissions List */}
                <div className="planet-entries-list">
                  <div className="planet-entries-label">INCOMING TRANSMISSION LOGS ({guestbookEntries.length})</div>
                  {guestbookEntries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '36px 16px', color: 'rgba(255, 255, 255, 0.45)', fontStyle: 'italic', fontSize: '13px' }}>
                      No transmissions recorded yet. Be the first explorer to transmit a log!
                    </div>
                  ) : (
                    guestbookEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="planet-entry-card"
                        style={{ borderLeftColor: config.themeColor }}
                      >
                        <div className="planet-entry-meta">
                          <span className="planet-entry-author">{entry.author}</span>
                          <span className="planet-entry-callsign">[{entry.callsign}]</span>
                          <span className="planet-entry-time">{entry.timestamp}</span>
                        </div>
                        <p className="planet-entry-body">{entry.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : config.isContact ? (
              /* Contact Terminal Full Interactive Mode */
              <div className="planet-contact-modal-content">
                <h2 className="planet-modal-title">DEEP SPACE TRANSMITTER</h2>
                <div className="planet-glass-subtitle" style={{ color: config.themeColor }}>
                  Direct Quantum Frequency Uplink • Open for Collaborations & Roles
                </div>

                <form onSubmit={handleContactSubmit} className="planet-guest-form" style={{ marginTop: '20px' }}>
                  <div className="planet-form-row">
                    <input
                      type="text"
                      placeholder="NAME // CALLSIGN"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      className="planet-form-input"
                    />
                    <input
                      type="email"
                      placeholder="COMM FREQUENCY // EMAIL"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      className="planet-form-input"
                    />
                  </div>
                  <textarea
                    placeholder="TRANSMISSION PAYLOAD // INQUIRY OR MESSAGE..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                    rows={4}
                    className="planet-form-textarea"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="submit"
                      disabled={isTransmitting}
                      className="planet-submit-btn"
                      style={{
                        borderColor: config.themeColor,
                        background: `rgba(${config.themeColorRgb}, 0.25)`,
                      }}
                    >
                      {isTransmitting ? 'DISPATCHING QUANTUM PACKET...' : '⚡ DISPATCH TRANSMISSION'}
                    </button>
                    {contactSuccess && (
                      <span style={{ color: '#4ade80', fontSize: '12px', fontFamily: 'monospace' }}>
                        ✓ SIGNAL RECEIVED • RESPONSE DISPATCHED WITHIN 24H
                      </span>
                    )}
                  </div>
                </form>

                {/* Direct Frequencies Grid */}
                <div className="planet-metrics-grid" style={{ marginTop: '28px' }}>
                  <div className="planet-metric-box">
                    <div className="planet-metric-label">DIRECT EMAIL</div>
                    <div className="planet-metric-val" style={{ fontSize: '13px' }}>
                      tanishdhingra2003@gmail.com
                    </div>
                  </div>
                  <div className="planet-metric-box">
                    <div className="planet-metric-label">PHONE / WHATSAPP</div>
                    <div className="planet-metric-val" style={{ fontSize: '13px', color: '#4ade80' }}>
                      +91 8107016363
                    </div>
                  </div>
                  <div className="planet-metric-box">
                    <div className="planet-metric-label">GITHUB & LINKEDIN</div>
                    <div className="planet-metric-val" style={{ fontSize: '13px', color: config.themeColor }}>
                      @tanish303
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Standard Expanded Portfolio Item */
              <>
                <h2 className="planet-modal-title">{activeItem.title}</h2>
                <div className="planet-glass-subtitle" style={{ color: config.themeColor }}>
                  {activeItem.subtitle}
                </div>

                <p className="planet-modal-desc">{activeItem.description}</p>
                <p className="planet-modal-extended">{activeItem.extendedDetails}</p>

                {/* Telemetry Metrics Grid */}
                {activeItem.metrics && activeItem.metrics.length > 0 && (
                  <div className="planet-metrics-grid">
                    {activeItem.metrics.map((m, idx) => (
                      <div key={idx} className="planet-metric-box">
                        <div className="planet-metric-label">{m.label}</div>
                        <div className="planet-metric-val" style={{ color: config.themeColor }}>
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {activeItem.tags && activeItem.tags.length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <div className="planet-metric-label" style={{ marginBottom: '8px' }}>
                      DOMAIN TECHNOLOGIES & COMPETENCIES
                    </div>
                    <div className="planet-tech-pills">
                      {activeItem.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="planet-tech-pill"
                          style={{
                            padding: '6px 12px',
                            borderColor: `rgba(${config.themeColorRgb}, 0.3)`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Planetary Sensor Readout */}
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div className="planet-metric-label" style={{ marginBottom: '8px' }}>
                    LOCAL OUTPOST TELEMETRY
                  </div>
                  <div className="planet-metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    <div className="planet-metric-box">
                      <div className="planet-metric-label">SURFACE GRAVITY</div>
                      <div className="planet-metric-val" style={{ fontSize: '13px' }}>
                        {config.telemetry.gravity}
                      </div>
                    </div>
                    <div className="planet-metric-box">
                      <div className="planet-metric-label">MEAN TEMP</div>
                      <div className="planet-metric-val" style={{ fontSize: '13px' }}>
                        {config.telemetry.temperature}
                      </div>
                    </div>
                    <div className="planet-metric-box">
                      <div className="planet-metric-label">PRESSURE</div>
                      <div className="planet-metric-val" style={{ fontSize: '13px' }}>
                        {config.telemetry.pressure}
                      </div>
                    </div>
                    <div className="planet-metric-box">
                      <div className="planet-metric-label">ATMOSPHERE</div>
                      <div className="planet-metric-val" style={{ fontSize: '11px' }}>
                        {config.telemetry.atmosphereComp}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
