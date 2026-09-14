import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RotateCcw, RefreshCw, Sparkles } from 'lucide-react';
import { soundController } from '../../../audio/SoundController';
import { MarkdownRenderer } from './MarkdownRenderer';

interface NeptuneAskAIPanelProps {
  uiX?: number;
  uiY?: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
  isError?: boolean;
}

const SUGGESTED_QUESTIONS = [
  'Who is Tanish?',
  'What projects has Tanish built?',
  'What are his strongest technical skills?',
  'Tell me about his experience.',
  'Which project should I check out?',
  'Why should I hire Tanish?',
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-1',
  text: "Hi! I'm Tanish's personal AI assistant. I have full context on his projects, technical stack, internships, and education. What would you like to know about him?",
  isUser: false,
  timestamp: new Date(),
};

export const NeptuneAskAIPanel: React.FC<NeptuneAskAIPanelProps> = ({ uiX = 0, uiY = 0 }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (queryText: string) => {
    const text = queryText.trim();
    if (!text || isTyping) return;

    soundController.playDestinationSelect();
    setLastFailedQuery(null);

    const userMessageId = `user-${Date.now()}`;
    const botMessageId = `bot-${Date.now() + 1}`;

    const userMsg: ChatMessage = {
      id: userMessageId,
      text,
      isUser: true,
      timestamp: new Date(),
    };

    // Placeholder bot message for streaming
    const botPlaceholder: ChatMessage = {
      id: botMessageId,
      text: '',
      isUser: false,
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, botPlaceholder]);
    setInputValue('');
    setIsTyping(true);

    // Prepare session history for RAG backend (only completed non-error messages)
    const historyPayload = messages
      .filter((m) => !m.isError && m.text.trim())
      .slice(-6)
      .map((m) => ({
        role: (m.isUser ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.text,
      }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server returned ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const payload = trimmed.replace(/^data:\s*/, '');

          if (payload === '[DONE]') {
            continue;
          }

          try {
            const parsed = JSON.parse(payload);
            if (parsed.delta) {
              accumulatedText += parsed.delta;

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMessageId
                    ? { ...msg, text: accumulatedText, isStreaming: true }
                    : msg
                )
              );
            }
          } catch {
            // Partial chunk
          }
        }
      }

      // Finalize bot message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                text:
                  accumulatedText ||
                  "I'm specifically designed to answer questions about Tanish Dhingra, his work, skills, and experience.",
                isStreaming: false,
              }
            : msg
        )
      );
    } catch (err) {
      console.error('Chat error:', err);
      setLastFailedQuery(text);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                text: "I ran into a temporary connection issue while reaching Tanish's knowledge base. Please click Retry below to try again.",
                isStreaming: false,
                isError: true,
              }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRetry = () => {
    if (lastFailedQuery) {
      // Remove the failed bot message
      setMessages((prev) => prev.filter((m) => !m.isError));
      sendMessage(lastFailedQuery);
    }
  };

  const handleResetChat = () => {
    soundController.playHoverGlass();
    setMessages([INITIAL_MESSAGE]);
    setLastFailedQuery(null);
    setInputValue('');
  };

  const handleSelectPill = (q: string) => {
    sendMessage(q);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div
      className="neptune-centered-panel-wrapper"
      style={{
        position: 'fixed',
        left: `calc(50% + ${uiX * 0.25}px)`,
        top: `calc(43% + ${uiY * 0.25}px)`,
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
            <div className="neptune-ai-title-row">
              <h3 className="neptune-ai-title">Tanish's Personal AI</h3>
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

              <div
                className={`neptune-ai-bubble ${
                  message.isUser ? 'user-bubble' : 'bot-bubble'
                } ${message.isError ? 'error-bubble' : ''}`}
              >
                {message.isUser ? (
                  <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{message.text}</p>
                ) : message.isStreaming && !message.text ? (
                  <div className="neptune-typing-dots">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                ) : (
                  <MarkdownRenderer
                    content={message.text}
                    isStreaming={message.isStreaming}
                  />
                )}

                {message.isError && (
                  <div className="neptune-error-action-row">
                    <button
                      type="button"
                      className="neptune-retry-btn"
                      onClick={handleRetry}
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Retry</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Suggested Question Pills (Shown when conversation is fresh) */}
          {showSuggestions && (
            <div className="neptune-suggestions-wrapper">
              <div className="neptune-suggestions-header">
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                <span>Suggested Questions</span>
              </div>
              <div className="neptune-suggestions-grid">
                {SUGGESTED_QUESTIONS.map((question, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="neptune-suggestion-pill"
                    onClick={() => handleSelectPill(question)}
                    disabled={isTyping}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="neptune-ai-footer">
          <div className="neptune-ai-input-wrap">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything about Tanish..."
              className="neptune-ai-input"
              disabled={isTyping}
              maxLength={1000}
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
