import React, { useState } from 'react';
import { soundController } from '../../../audio/SoundController';

interface SaturnGuestbookPanelProps {
  uiX?: number;
  uiY?: number;
}

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

const INITIAL_MESSAGES: GuestbookEntry[] = [];
const STORAGE_KEY = 'tanish_guestbook_entries_v2';

export const SaturnGuestbookPanel: React.FC<SaturnGuestbookPanelProps> = ({
  uiX = 0,
  uiY = 0,
}) => {
  const [entries, setEntries] = useState<GuestbookEntry[]>(() => {
    try {
      // Clear legacy mock data if present
      localStorage.removeItem('tanish_guestbook_entries');
      localStorage.removeItem('guestbook_transmissions');

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_MESSAGES;
  });

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3 || message.trim().length < 10) return;

    setIsSubmitting(true);
    soundController.playDestinationSelect();

    setTimeout(() => {
      const newEntry: GuestbookEntry = {
        id: `msg-${Date.now()}`,
        name: name.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
      };

      const updated = [newEntry, ...entries];
      setEntries(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }

      setName('');
      setMessage('');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div
      className="saturn-centered-panel-wrapper"
      style={{
        position: 'fixed',
        left: `calc(50% + ${uiX * 0.25}px)`,
        top: `calc(50% + ${uiY * 0.25}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: 25,
        pointerEvents: 'auto',
        width: 'min(960px, 94vw)',
      }}
    >
      {/* Centered Glass Container */}
      <div className="saturn-guestbook-card">
        {/* Simple Clean Header */}
        <div className="saturn-guestbook-header">
          <h2 className="saturn-guestbook-title">Guestbook & Messages</h2>
          <p className="saturn-guestbook-sub">
            Leave a message and see what others are saying about my work
          </p>
        </div>

        {/* 2-Column Layout: Form (Left) & Messages (Right) */}
        <div className="saturn-guestbook-grid">
          {/* Left: Form */}
          <div className="saturn-guestbook-form-col">
            <h3 className="saturn-col-heading">Leave a Message</h3>
            <form onSubmit={handleSubmit} className="saturn-form">
              <input
                type="text"
                placeholder="Your name (min 3 characters)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={3}
                required
                className="saturn-input"
              />
              <textarea
                placeholder="Your message (min 10 characters)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                minLength={10}
                rows={4}
                required
                className="saturn-textarea"
              />
              <button
                type="submit"
                disabled={isSubmitting || name.trim().length < 3 || message.trim().length < 10}
                className="saturn-submit-btn"
              >
                {isSubmitting ? 'Posting...' : '✉ Post Message'}
              </button>
            </form>
          </div>

          {/* Right: Messages Feed */}
          <div className="saturn-guestbook-list-col">
            <h3 className="saturn-col-heading">Recent Messages</h3>
            <div className="saturn-messages-scroll">
              {entries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 16px', color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  No messages yet.<br />Be the first to leave a message on Saturn!
                </div>
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="saturn-msg-item">
                    <div className="saturn-msg-top">
                      <div className="saturn-msg-avatar">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="saturn-msg-author">{entry.name}</div>
                        <div className="saturn-msg-date">{entry.createdAt}</div>
                      </div>
                    </div>
                    <p className="saturn-msg-body">{entry.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaturnGuestbookPanel;
