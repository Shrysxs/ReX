import { useState, useMemo } from 'react';
import { JSX } from 'react/jsx-runtime';

interface Match {
  text: string;
  index: number;
  groups: string[];
}

export default function Home() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({
    g: false,
    i: false,
    m: false
  });

  const handleFlagChange = (flag: keyof typeof flags) => {
    setFlags(prev => ({
      ...prev,
      [flag]: !prev[flag]
    }));
  };

  // Process regex and matches
  const regexResult = useMemo(() => {
    if (!pattern || !testString) {
      return { regex: null, matches: [], error: null, highlighted: null };
    }

    try {
      const flagString = Object.entries(flags)
        .filter(([, enabled]) => enabled)
        .map(([flag]) => flag)
        .join('');
      
      const regex = new RegExp(pattern, flagString);
      const matches: Match[] = [];
      
      // Use matchAll to get all matches with positions
      const matchIterator = testString.matchAll(regex);
      for (const match of matchIterator) {
        matches.push({
          text: match[0],
          index: match.index!,
          groups: match.slice(1)
        });
      }

      // Create highlighted version
      const highlighted: JSX.Element[] = [];
      let lastIndex = 0;

      matches.forEach((match, i) => {
        // Add text before match
        if (match.index > lastIndex) {
          highlighted.push(
            <span key={`text-${i}`}>
              {testString.slice(lastIndex, match.index)}
            </span>
          );
        }
        
        // Add highlighted match
        highlighted.push(
          <span 
            key={`match-${i}`} 
            className="bg-yellow-300 font-bold rounded px-1"
          >
            {match.text}
          </span>
        );
        
        lastIndex = match.index + match.text.length;
      });

      // Add remaining text
      if (lastIndex < testString.length) {
        highlighted.push(
          <span key="text-end">
            {testString.slice(lastIndex)}
          </span>
        );
      }

      return { regex, matches, error: null, highlighted };
    } catch (error) {
      return { 
        regex: null, 
        matches: [], 
        error: error instanceof Error ? error.message : 'Invalid regex pattern',
        highlighted: null 
      };
    }
  }, [pattern, testString, flags]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">ReX</h1>
          <p className="text-gray-600">Regular Expression Playground</p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
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
                regexResult.error ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {regexResult.error && (
              <p className="mt-2 text-sm text-red-600">
                Error: {regexResult.error}
              </p>
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

          {/* Test String Input */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <label htmlFor="testString" className="block text-sm font-medium text-gray-700 mb-2">
              Test String
            </label>
            <textarea
              id="testString"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter your test string here..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono resize-vertical"
            />
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Matches</h3>
            
            {/* Highlighted Text */}
            <div className="bg-gray-50 rounded-md p-4 min-h-[120px] font-mono whitespace-pre-wrap">
              {!pattern || !testString ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 italic">Matches will appear here</p>
                </div>
              ) : regexResult.error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500 italic">Fix the regex pattern to see matches</p>
                </div>
              ) : regexResult.highlighted && regexResult.highlighted.length > 0 ? (
                regexResult.highlighted
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 italic">No matches found</p>
                </div>
              )}
            </div>

            {/* Match Summary */}
            {regexResult.matches.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  {regexResult.matches.length} match{regexResult.matches.length !== 1 ? 'es' : ''} found
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {regexResult.matches.map((match, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <span className="bg-yellow-100 border border-yellow-300 rounded px-2 py-1 font-mono">
                        {match.text}
                      </span>
                      <span className="text-gray-600">
                        at index {match.index}
                      </span>
                      {match.groups.length > 0 && (
                        <span className="text-gray-500">
                          groups: [{match.groups.map(g => `"${g}"`).join(', ')}]
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
