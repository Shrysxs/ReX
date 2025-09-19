import { useEffect, useState } from 'react';
import ErrorBanner from './ErrorBanner';

interface RegexInputProps {
  pattern: string;
  setPattern: (pattern: string) => void;
  flags: { g: boolean; i: boolean; m: boolean };
  setFlags: (flags: { g: boolean; i: boolean; m: boolean }) => void;
  error?: string;
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
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <label htmlFor="pattern" className="block text-sm font-medium text-gray-700 mb-2">
          Regular Expression Pattern
        </label>
        <input
          id="pattern"
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Enter your regex pattern..."
          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        />
        
        {/* Regex Preview */}
        {pattern && (
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 text-xs font-mono bg-gray-100 text-gray-700 rounded-full">
              {regexPreview}
            </span>
            <button
              onClick={copyToClipboard}
              className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!regexPreview}
            >
              {copySuccess ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mt-3">
            <ErrorBanner message={error} />
          </div>
        )}
      </div>

      {/* Regex Flags */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Flags</h3>
        <div className="flex gap-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={flags.g}
              onChange={() => handleFlagChange('g')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              <code className="font-mono bg-gray-100 px-1 rounded">g</code> Global
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={flags.i}
              onChange={() => handleFlagChange('i')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              <code className="font-mono bg-gray-100 px-1 rounded">i</code> Case Insensitive
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={flags.m}
              onChange={() => handleFlagChange('m')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              <code className="font-mono bg-gray-100 px-1 rounded">m</code> Multiline
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}