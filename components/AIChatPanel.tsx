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
    if (!regex) return;
    
    setIsOpen(true);
    setIsLoading(true);
    setError(null);

    const initialPrompt = `Explain this regex in detail: /${regex}/${flags} applied on test string: '${testString}'`;
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3-70b-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are a regex tutor. Always explain regex in clean, professional, plain English. Support markdown formatting for readability. Never be vague. Focus on regex patterns, flags, and matching behavior.'
            },
            {
              role: 'user',
              content: initialPrompt
            }
          ],
          stream: false,
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'No explanation available';

      setMessages([
        { role: 'user', content: initialPrompt },
        { role: 'assistant', content: aiResponse }
      ]);
    } catch (err) {
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
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3-70b-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are a regex tutor. Always explain regex in clean, professional, plain English. Support markdown formatting for readability. Never be vague. Focus on regex patterns, flags, and matching behavior. Keep responses concise and educational.'
            },
            ...newMessages
          ],
          stream: false,
          temperature: 0.3,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'No response available';

      setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
    } catch (err) {
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
    // Simple markdown rendering for code blocks and bold text
    return content
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded font-mono text-sm">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="mt-6">
      {/* Explain Button */}
      <button
        onClick={handleExplainClick}
        disabled={!regex || isLoading}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Explaining...
          </>
        ) : (
          'Explain with AI'
        )}
      </button>

      {/* Error Banner */}
      {error && (
        <div className="mt-3 bg-red-600 text-white px-3 py-2 rounded-md flex items-center gap-2">
          <span className="text-sm">⚠️</span>
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="mt-4 bg-gray-50 rounded-lg shadow-md p-4 transition-all">
          {/* Chat Messages */}
          <div className="max-h-96 overflow-y-auto space-y-3 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-indigo-100 text-indigo-900'
                      : 'bg-white border shadow-sm'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(message.content)
                      }}
                    />
                  ) : (
                    <div className="font-mono">{message.content}</div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm px-3 py-2 rounded-lg text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          {messages.length > 0 && (
            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a follow-up question..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-none"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}