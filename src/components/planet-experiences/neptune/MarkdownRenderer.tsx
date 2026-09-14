import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isStreaming }) => {
  // Split into code blocks vs regular text blocks
  const parts: React.ReactNode[] = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Text before the code block
    if (match.index > lastIndex) {
      const textChunk = content.slice(lastIndex, match.index);
      parts.push(renderTextChunk(textChunk, `txt-${lastIndex}`));
    }

    const language = match[1] || 'text';
    const code = match[2].trim();
    parts.push(
      <CodeBlock key={`code-${match.index}`} code={code} language={language} />
    );

    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < content.length) {
    const textChunk = content.slice(lastIndex);
    parts.push(renderTextChunk(textChunk, `txt-${lastIndex}`));
  }

  return (
    <div className="neptune-markdown-body">
      {parts}
      {isStreaming && <span className="neptune-streaming-cursor" />}
    </div>
  );
};

function renderTextChunk(text: string, keyPrefix: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="neptune-md-list">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check for headings
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`${keyPrefix}-h3-${index}`} className="neptune-md-h3">
          {formatInline(trimmed.slice(4))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`${keyPrefix}-h2-${index}`} className="neptune-md-h2">
          {formatInline(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    // Check for horizontal divider
    if (trimmed === '---' || trimmed === '***') {
      flushList();
      elements.push(<hr key={`${keyPrefix}-hr-${index}`} className="neptune-md-hr" />);
      return;
    }

    // Check for bullet lists (* or -)
    if (/^[-*]\s+/.test(trimmed)) {
      inList = true;
      const itemText = trimmed.replace(/^[-*]\s+/, '');
      listItems.push(
        <li key={`${keyPrefix}-li-${index}`} className="neptune-md-li">
          {formatInline(itemText)}
        </li>
      );
      return;
    }

    // Check for numbered lists (1. , 2. )
    if (/^\d+\.\s+/.test(trimmed)) {
      flushList();
      const numMatch = trimmed.match(/^(\d+\.)\s+(.*)/);
      if (numMatch) {
        elements.push(
          <div key={`${keyPrefix}-num-${index}`} className="neptune-md-num-item">
            <span className="neptune-md-num-badge">{numMatch[1]}</span>
            <span>{formatInline(numMatch[2])}</span>
          </div>
        );
        return;
      }
    }

    // Regular line / paragraph
    flushList();
    if (trimmed) {
      elements.push(
        <p key={`${keyPrefix}-p-${index}`} className="neptune-md-p">
          {formatInline(line)}
        </p>
      );
    }
  });

  flushList();

  return <React.Fragment key={keyPrefix}>{elements}</React.Fragment>;
}

function formatInline(text: string): React.ReactNode[] {
  // Parse inline code: `code`
  // Parse bold: **text**
  // Parse italic: *text*
  const nodes: React.ReactNode[] = [];
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      nodes.push(
        <code key={`code-${match.index}`} className="neptune-inline-code">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      nodes.push(
        <strong key={`bold-${match.index}`} className="neptune-bold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      nodes.push(
        <em key={`em-${match.index}`} className="neptune-italic">
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.substring(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="neptune-code-container">
      <div className="neptune-code-header">
        <span className="neptune-code-lang">{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="neptune-code-copy-btn"
          title="Copy Code"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="neptune-code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
};
