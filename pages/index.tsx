import { useState, useMemo } from 'react';
import RegexInput from '../components/RegexInput';
import ResultsPanel from '../components/ResultsPanel';
import AIChatPanel from '../components/AIChatPanel';

export default function Home() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({
    g: false,
    i: false,
    m: false
  });
  const [regexError, setRegexError] = useState<string | null>(null);
  const [selectedMatchIndex, setSelectedMatchIndex] = useState<number | null>(null);

  // Process regex and matches
  const matches = useMemo(() => {
    if (!pattern) {
      setRegexError(null);
      return [];
    }

    try {
      const flagString = Object.entries(flags)
        .filter(([, enabled]) => enabled)
        .map(([flag]) => flag)
        .join('');
      
      const regex = new RegExp(pattern, flagString);
      setRegexError(null);
      
      if (!testString) {
        return [];
      }
      
      // Use Array.from with matchAll to get all matches
      const matchResults = Array.from(testString.matchAll(regex));
      return matchResults.map(match => ({
        text: match[0],
        index: match.index!,
        groups: match.slice(1)
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid regex pattern';
      setRegexError(errorMessage);
      return [];
    }
  }, [pattern, testString, flags]);

  const handleMatchSelect = (index: number) => {
    setSelectedMatchIndex(selectedMatchIndex === index ? null : index);
  };

  // Generate flag string for AI chat
  const flagString = Object.entries(flags)
    .filter(([, enabled]) => enabled)
    .map(([flag]) => flag)
    .join('');

  // Generate active flags display
  const activeFlagsDisplay = Object.entries(flags)
    .filter(([, enabled]) => enabled)
    .map(([flag]) => `[${flag}]`)
    .join('');

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Terminal Header */}
      <div className="bg-gray-900 shadow-sm border-b border-gray-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-green-400 text-xl font-bold">ReX</span>
            <span className="text-gray-400">–</span>
            <span className="text-gray-300">Regex Playground</span>
          </div>
          <div className="flex items-center space-x-2">
            {activeFlagsDisplay && (
              <div className="flex space-x-1">
                {Object.entries(flags).map(([flag, enabled]) => (
                  <span
                    key={flag}
                    className={`px-2 py-1 text-xs rounded ${
                      enabled 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    [{flag}]
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Terminal Input Section */}
        <div className="bg-gray-900 rounded-md shadow-sm p-6 border border-gray-700">
          <RegexInput
            pattern={pattern}
            setPattern={setPattern}
            flags={flags}
            setFlags={setFlags}
            error={regexError}
          />
          
          {/* Test String Input */}
          <div className="mt-6">
            <div className="flex items-center mb-2">
              <span className="text-green-400 mr-2">&gt;</span>
              <span className="text-cyan-400">testString:</span>
            </div>
            <textarea
              id="testString"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter your test string here..."
              rows={6}
              className="w-full bg-transparent text-white font-mono border border-gray-600 rounded-md px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-vertical placeholder-gray-500"
            />
          </div>
        </div>

        {/* Results and AI Chat Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Results Panel */}
          <div className="bg-gray-800 rounded-md shadow-sm border border-gray-700">
            <ResultsPanel
              matches={matches}
              regexError={regexError}
              testString={testString}
              selectedMatchIndex={selectedMatchIndex}
              onMatchSelect={handleMatchSelect}
            />
          </div>

          {/* AI Chat Panel */}
          <div className="bg-gray-900 rounded-md shadow-sm border border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <span className="text-green-400 mr-2">&gt;</span>
              <span className="text-cyan-400">AI Assistant</span>
            </div>
            <AIChatPanel
              regex={pattern}
              flags={flagString}
              testString={testString}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
