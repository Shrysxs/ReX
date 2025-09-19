import { useEffect, useState } from 'react';

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
          <span className="text-green-400 mr-2">&gt;</span>
          <span className="text-white">pattern</span>
          <span className="text-gray-500 mx-2">/</span>
          <span className="text-white">flags</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="pattern"
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="\\d+|[a-zA-Z]+"
            className={`flex-1 bg-black text-white font-mono text-lg border-b pb-2 focus:outline-none transition-colors ${
              error ? 'border-red-500 text-red-300' : 'border-gray-700 focus:border-green-400'
            } placeholder-gray-600`}
          />
          {pattern && (
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 text-xs bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 focus:outline-none transition-colors"
              disabled={!regexPreview}
            >
              {copySuccess ? '✓' : 'copy'}
            </button>
          )}
        </div>
        
        {/* Regex Preview */}
        {pattern && (
          <div className="mt-2 flex items-center">
            <span className="text-gray-500 mr-2">→</span>
            <span className="text-green-400 font-mono">
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
          <span className="text-green-400 mr-2">&gt;</span>
          <span className="text-white">flags</span>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={flags.g}
              onChange={() => handleFlagChange('g')}
              className="sr-only"
            />
            <span className={`px-3 py-1 text-sm border transition-colors ${
              flags.g 
                ? 'bg-green-400 text-black border-green-400' 
                : 'bg-black text-gray-400 border-gray-700 hover:border-gray-600'
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
            <span className={`px-3 py-1 text-sm border transition-colors ${
              flags.i 
                ? 'bg-green-400 text-black border-green-400' 
                : 'bg-black text-gray-400 border-gray-700 hover:border-gray-600'
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
            <span className={`px-3 py-1 text-sm border transition-colors ${
              flags.m 
                ? 'bg-green-400 text-black border-green-400' 
                : 'bg-black text-gray-400 border-gray-700 hover:border-gray-600'
            }`}>
              [m] multiline
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}