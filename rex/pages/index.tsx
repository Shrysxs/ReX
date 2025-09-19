import { useState } from 'react';

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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg"
            />
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
            <div className="bg-gray-50 rounded-md p-4 min-h-[120px] flex items-center justify-center">
              <p className="text-gray-500 italic">Matches will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
