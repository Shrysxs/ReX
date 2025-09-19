import { useEffect, useState } from 'react';
import ErrorBanner from './ErrorBanner';

interface RegexInputProps {
  pattern: string;
  setPattern: (pattern: string) => void;
  flags: { g: boolean; i: boolean; m: boolean };
  setFlags: (flags: { g: boolean; i: boolean; m: boolean }) => void;
  error?: string | null;
}

export default function RegexInput({ pattern, setPattern, flags, setFlags, error }: RegexInputProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleFlagChange = (flag: keyof typeof flags) => {
    setFlags({
      ...flags,
      [flag]: !flags[flag]
    });
  };

  const flagString = Object.entries(flags)
    .filter(([, enabled]) => enabled)
    .map(([flag]) => flag)
    .join('');

  const regexPreview = pattern ? `/${pattern}/${flagString}` : '';

  const copyToClipboard = async () => {
    if (!regexPreview) return;
    
    try {
      await navigator.clipboard.writeText(regexPreview);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Reset copy success when pattern changes
  useEffect(() => {
    setCopySuccess(false);
  }, [pattern, flags]);

  return (
    <div className="space-y-6">
      {/* Regex Pattern Input */}
      <div>
        <div className="flex items-center mb-2">
          <span className="text-green-400 mr-2">></span>
          <span className="text-cyan-400">pattern</span>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-yellow-300">flags</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="pattern"
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="\\d+|[a-zA-Z]+"
            className={`flex-1 bg-transparent text-white font-mono text-lg border-b-2 pb-2 focus:outline-none transition-colors ${
              error ? 'border-red-500 text-red-300' : 'border-gray-600 focus:border-cyan-400'
            } placeholder-gray-500`}
          />
          {pattern && (
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 text-xs bg-gray-700 text-cyan-400 rounded hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              disabled={!regexPreview}
            >
              {copySuccess ? '✓' : 'copy'}
            </button>
          )}
        </div>
        
        {/* Regex Preview */}
        {pattern && (
          <div className="mt-2 flex items-center">
            <span className="text-gray-400 mr-2">→</span>
            <span className="text-yellow-300 font-mono">
              {regexPreview}
            </span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-2 flex items-center">
            <span className="text-red-500 mr-2">✗</span>
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Regex Flags */}
      <div>
        <div className="flex items-center mb-3">
          <span className="text-green-400 mr-2">></span>
          <span className="text-cyan-400">flags</span>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={flags.g}
              onChange={() => handleFlagChange('g')}
              className="sr-only"
            />
            <span className={`px-3 py-1 text-sm rounded border transition-colors ${
              flags.g 
                ? 'bg-cyan-600 text-white border-cyan-500' 
                : 'bg-gray-700 text-gray-400 border-gray-600 hover:border-gray-500'
            }`}>
              [g] global
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={flags.i}
              onChange={() => handleFlagChange('i')}
              className="sr-only"
            />
            <span className={`px-3 py-1 text-sm rounded border transition-colors ${
              flags.i 
                ? 'bg-cyan-600 text-white border-cyan-500' 
                : 'bg-gray-700 text-gray-400 border-gray-600 hover:border-gray-500'
            }`}>
              [i] ignore case
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={flags.m}
              onChange={() => handleFlagChange('m')}
              className="sr-only"
            />
            <span className={`px-3 py-1 text-sm rounded border transition-colors ${
              flags.m 
                ? 'bg-cyan-600 text-white border-cyan-500' 
                : 'bg-gray-700 text-gray-400 border-gray-600 hover:border-gray-500'
            }`}>
              [m] multiline
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}