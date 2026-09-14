import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RotateCcw } from 'lucide-react';
import { tanishData } from '../../../data/tanish';
import { soundController } from '../../../audio/SoundController';

interface NeptuneAskAIPanelProps {
  uiX?: number;
  uiY?: number;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

function generateLocalReply(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
    return `Hello! I'm Tanish's AI assistant. You can ask me about his projects, skills, education, internships, or how to get in touch!`;
  }

  if (q.includes('who is') || q.includes('about') || q.includes('bio') || q.includes('tell me about')) {
    return `${tanishData.basic.name} is a ${tanishData.basic.title}. ${tanishData.basic.shortBio}`;
  }

  if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language')) {
    return `Tanish is skilled in:\n• Languages: ${tanishData.skills.programmingLanguages.join(', ')}\n• Frontend: ${tanishData.skills.frontend.join(', ')}\n• Backend: ${tanishData.skills.backend.join(', ')}\n• DevOps & Cloud: ${tanishData.skills.devopsCloud.join(', ')}\n• Databases: ${tanishData.skills.databases.join(', ')}`;
  }

  if (q.includes('project') || q.includes('tweniq') || q.includes('copywizz')) {
    return `Tanish has built impressive projects:\n1. TweniQ: Dual-mode platform (social + professional) with separate chat profiles and real-time WebSockets.\n2. CopyWizz: AI desktop companion built with Electron & Gemini API for instant explanations with global hotkeys.`;
  }

  if (q.includes('experience') || q.includes('intern') || q.includes('cloudtechner') || q.includes('work') || q.includes('company')) {
    return `Tanish's experience includes:\n• CloudTechner: DevOps & Backend Engineer (Docker, Kubernetes, Terraform, AWS, FastAPI, Python, CI/CD)\n• Adayptus Consulting: Backend Developer (Node.js, Express, MongoDB, SMTP)\n• Coding Blocks: Full Stack Developer (React, Node.js, Tailwind CSS)`;
  }

  if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('university') || q.includes('school')) {
    return `Tanish is pursuing B.Tech in CSE at BML Munjal University (2022 - 2026, 7.53 CGPA). Prior to that, he attended Children's Academy (81%) and Sunhill Academy (92%).`;
  }

  if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach') || q.includes('phone') || q.includes('linkedin')) {
    return `You can reach Tanish directly at:\n• Email: ${tanishData.contact.email}\n• Phone: ${tanishData.contact.phone}\n• LinkedIn: linkedin.com/in/tanish-dhingraa\n• GitHub: github.com/tanish303`;
  }

  if (q.includes('sih') || q.includes('hackathon') || q.includes('achievement')) {
    return `Tanish secured 4th place at the Smart India Hackathon (SIH) 2023 National Finals!`;
  }

  return `Tanish is a full-stack & DevOps engineer proficient in React, Node.js, Python, FastAPI, Docker, and AWS. Feel free to ask specifically about his projects (TweniQ, CopyWizz), work experience, or contact details!`;
}

export const NeptuneAskAIPanel: React.FC<NeptuneAskAIPanelProps> = ({ uiX = 0, uiY = 0 }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Tanish's AI assistant. I can help you learn more about his work, skills, and experience. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    soundController.playDestinationSelect();

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    let replyText = '';

    if (GROQ_API_KEY) {
      try {
        const systemPrompt = `You are Tanish's personal AI assistant for his portfolio.
Respond in a natural, friendly tone.
Use ONLY the information in the DATA section, written in smooth, helpful language.
Keep responses concise and direct unless the user asks for details.
If asked outside the portfolio topic, reply: "I can only talk about Tanish's work, skills, and experience."

DATA:
${JSON.stringify(tanishData, null, 2)}`;

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: text },
            ],
            max_tokens: 512,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          replyText = data.choices?.[0]?.message?.content || '';
        }
      } catch {
        // Ignore network errors and fall back gracefully
      }
    }

    if (!replyText) {
      replyText = generateLocalReply(text);
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: replyText,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    soundController.playHoverGlass();
    setMessages([
      {
        id: Date.now().toString(),
        text: "Hi! I'm Tanish's AI assistant. I can help you learn more about his work, skills, and experience. What would you like to know?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div
      className="neptune-centered-panel-wrapper"
      style={{
        position: 'fixed',
        left: `calc(50% + ${uiX * 0.25}px)`,
        top: `calc(50% + ${uiY * 0.25}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: 25,
        pointerEvents: 'auto',
      }}
    >
      <div className="neptune-ai-card">
        {/* Header */}
        <div className="neptune-ai-header">
          <div className="neptune-ai-header-left">
            <div className="neptune-ai-bot-avatar">
              <Bot className="h-4 w-4 text-sky-400" />
            </div>
            <div>
              <h3 className="neptune-ai-title">AI Assistant</h3>
              <p className="neptune-ai-subtitle">Ask me about Tanish's work</p>
            </div>
          </div>
          <button
            type="button"
            className="neptune-ai-reset-btn"
            onClick={handleResetChat}
            title="Reset Conversation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="neptune-ai-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`neptune-ai-msg-row ${message.isUser ? 'user-row' : 'bot-row'}`}
            >
              <div className={`neptune-ai-avatar ${message.isUser ? 'user-avatar' : 'bot-avatar'}`}>
                {message.isUser ? (
                  <User className="h-3.5 w-3.5 text-sky-300" />
                ) : (
                  <Bot className="h-3.5 w-3.5 text-sky-400" />
                )}
              </div>
              <div className={`neptune-ai-bubble ${message.isUser ? 'user-bubble' : 'bot-bubble'}`}>
                <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{message.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="neptune-ai-msg-row bot-row">
              <div className="neptune-ai-avatar bot-avatar">
                <Bot className="h-3.5 w-3.5 text-sky-400" />
              </div>
              <div className="neptune-ai-bubble bot-bubble typing-bubble">
                <div className="neptune-typing-dots">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="neptune-ai-footer">
          <div className="neptune-ai-input-wrap">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything about Tanish..."
              className="neptune-ai-input"
              disabled={isTyping}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="neptune-ai-send-btn"
              title="Send Message"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeptuneAskAIPanel;
