'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatPanelProps {
  regex: string;
  flags: string;
  testString: string;
}

export default function AIChatPanel({ regex, flags, testString }: AIChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleExplainClick = async () => {
    // Validate inputs before making API call
    if (!regex || !regex.trim()) {
      setError('Please enter a regex pattern first');
      return;
    }
    
    setIsOpen(true);
    setIsLoading(true);
    setError(null);

    const initialPrompt = `Explain this regex in detail: /${regex}/${flags} applied on test string: '${testString}'`;
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a regex tutor. Always explain regex in clean, professional, plain English. Support markdown formatting for readability. Never be vague. Focus on regex patterns, flags, and matching behavior.'
            },
            {
              role: 'user',
              content: initialPrompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const aiResponse = data.content || 'No explanation available';

      setMessages([
        { role: 'user', content: initialPrompt },
        { role: 'assistant', content: aiResponse }
      ]);
    } catch {
      setError('AI service unavailable, try again later');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a regex tutor. Always explain regex in clean, professional, plain English. Support markdown formatting for readability. Never be vague. Focus on regex patterns, flags, and matching behavior. Keep responses concise and educational.'
            },
            ...newMessages
          ]
        })
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const aiResponse = data.content || 'No response available';

      setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
    } catch {
      setError('AI service unavailable, try again later');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering for code blocks and bold text with terminal colors
    return content
      .replace(/`([^`]+)`/g, '<code class="bg-gray-900 text-green-400 px-1 font-mono text-sm">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div>
      {/* Explain Button */}
      <button
        onClick={handleExplainClick}
        disabled={!regex || isLoading}
        className="inline-flex items-center px-4 py-2 bg-green-400 text-black font-mono text-sm hover:bg-green-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <span className="animate-pulse mr-2">●</span>
            explaining...
          </>
        ) : (
          '$ explain --ai'
        )}
      </button>

      {/* Error Banner */}
      {error && (
        <div className="mt-3 border border-gray-800 text-red-400 px-3 py-2 flex items-center gap-2">
          <span className="text-sm">✗</span>
          <span className="text-sm font-mono">{error}</span>
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="mt-4 transition-all">
          {/* Chat Messages */}
          <div className="max-h-[300px] overflow-y-auto space-y-2 mb-4 bg-black border border-gray-800 p-3">
            {messages.map((message, index) => (
              <div key={index} className="font-mono text-sm">
                <div className="flex items-start gap-2">
                  <span className={message.role === 'user' ? 'text-white' : 'text-green-400'}>
                    {message.role === 'user' ? 'You:' : 'AI:'}
                  </span>
                  <div className="flex-1 text-gray-300">
                    {message.role === 'assistant' ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(message.content)
                        }}
                      />
                    ) : (
                      <div>{message.content}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="font-mono text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-400">AI:</span>
                  <div className="flex items-center gap-1 text-gray-500">
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          {messages.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-mono">&gt;</span>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="ask follow-up question..."
                className="flex-1 bg-black text-white font-mono text-sm border-b border-gray-800 focus:outline-none focus:border-green-400 resize-none placeholder-gray-600 py-1"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="px-3 py-1 bg-green-400 text-black font-mono text-xs hover:bg-green-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                send
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}