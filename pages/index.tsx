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
      <div className="bg-black border-b border-gray-800 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Original ReX Logo */}
            <div className="flex items-center space-x-2">
              <div className="font-mono text-lg flex items-center">
                <span className="text-white">R</span>
                <span className="text-green-400">e</span>
                <span className="text-white">X</span>
                <span className="text-green-400 ml-1 animate-pulse">_</span>
              </div>
              <span className="text-gray-500">–</span>
              <span className="text-gray-400">Regex Playground</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Active Flags */}
            {activeFlagsDisplay && (
              <div className="flex space-x-1">
                {Object.entries(flags).map(([flag, enabled]) => (
                  <span
                    key={flag}
                    className={`px-2 py-1 text-xs ${
                      enabled 
                        ? 'text-green-400' 
                        : 'text-gray-600'
                    }`}
                  >
                    [{flag}]
                  </span>
                ))}
              </div>
            )}
            
            {/* Social Links */}
            <div className="flex items-center space-x-3 text-sm">
              <a
                href="https://x.com/Shysxs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors font-mono"
              >
                @Shysxs
              </a>
              <span className="text-gray-600">|</span>
              <a
                href="https://github.com/Shrysxs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors font-mono"
              >
                github
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Terminal Input Section */}
        <div className="bg-black p-6">
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
              <span className="text-white">testString:</span>
            </div>
            <textarea
              id="testString"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter your test string here..."
              rows={6}
              className="w-full bg-black text-white font-mono border border-gray-800 px-4 py-3 focus:outline-none focus:border-green-400 resize-vertical placeholder-gray-600"
            />
          </div>
        </div>

        {/* Results and AI Chat Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Results Panel */}
          <div className="bg-black border border-gray-800">
            <ResultsPanel
              matches={matches}
              regexError={regexError}
              testString={testString}
              selectedMatchIndex={selectedMatchIndex}
              onMatchSelect={handleMatchSelect}
            />
          </div>

          {/* AI Chat Panel */}
          <div className="bg-black border border-gray-800 p-6">
            <div className="flex items-center mb-4">
              <span className="text-green-400 mr-2">&gt;</span>
              <span className="text-white">AI Assistant</span>
            </div>
            <AIChatPanel
              regex={pattern}
              flags={flagString}
              testString={testString}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-800">
          <div className="flex items-center justify-center space-x-6 text-sm font-mono">
            <span className="text-gray-500">Built by</span>
            <a
              href="https://x.com/Shysxs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
            >
              <span>@Shysxs</span>
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://github.com/Shrysxs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-400 transition-colors flex items-center space-x-1"
            >
              <span>GitHub</span>
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://github.com/Shrysxs/ReX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              Source
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
