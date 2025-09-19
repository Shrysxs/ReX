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
          {/* Regex Input Component */}
          <RegexInput
            pattern={pattern}
            setPattern={setPattern}
            flags={flags}
            setFlags={setFlags}
            error={regexError}
          />

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

          {/* Results Panel Component */}
          <ResultsPanel
            matches={matches}
            regexError={regexError}
            testString={testString}
            selectedMatchIndex={selectedMatchIndex}
            onMatchSelect={handleMatchSelect}
          />

          {/* AI Chat Panel Component */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">AI Assistant</h3>
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
