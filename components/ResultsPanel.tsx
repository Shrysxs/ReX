import { JSX } from 'react/jsx-runtime';

interface Match {
  text: string;
  index: number;
  groups: string[];
}

interface ResultsPanelProps {
  matches: Match[];
  regexError: string | null;
  testString: string;
  selectedMatchIndex: number | null;
  onMatchSelect: (index: number) => void;
}

export default function ResultsPanel({ 
  matches, 
  regexError, 
  testString, 
  selectedMatchIndex, 
  onMatchSelect 
}: ResultsPanelProps) {
  // Generate highlighted preview
  const generateHighlighted = (): JSX.Element[] => {
    if (!testString || regexError || matches.length === 0) {
      return [];
    }

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
      
      // Add highlighted match with selection state
      const isSelected = selectedMatchIndex === i;
      highlighted.push(
        <span 
          key={`match-${i}`}
          data-match-index={i}
          className={`font-bold rounded px-1 cursor-pointer transition-colors ${
            isSelected 
              ? 'bg-yellow-400 ring-2 ring-indigo-400' 
              : 'bg-yellow-300 hover:bg-yellow-400'
          }`}
          onClick={() => onMatchSelect(i)}
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

    return highlighted;
  };

  const highlighted = generateHighlighted();
  const isLargeInput = testString.length > 200000;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Matches</h3>
        {!regexError && matches.length > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            Matches: {matches.length}
          </span>
        )}
      </div>
      
      {/* Large input warning */}
      {isLargeInput && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            ⚠️ Large input — highlighting may be slow
          </p>
        </div>
      )}

      {/* Highlighted Text Preview */}
      <div className="bg-gray-50 rounded-md p-4 min-h-[120px] font-mono whitespace-pre-wrap">
        {regexError ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 italic">Matches hidden due to invalid regex</p>
          </div>
        ) : !testString ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 italic">Enter test string to see matches</p>
          </div>
        ) : highlighted.length > 0 ? (
          highlighted
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 italic">No matches found</p>
          </div>
        )}
      </div>

      {/* Match List */}
      {!regexError && matches.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Match Details</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {matches.map((match, index) => (
              <button
                key={index}
                onClick={() => onMatchSelect(index)}
                className={`w-full text-left p-3 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  selectedMatchIndex === index
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xs font-medium text-gray-500 mt-1">
                    Match #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm bg-white border rounded px-2 py-1">
                        {match.text}
                      </span>
                      <span className="text-xs text-gray-600">
                        at index {match.index}
                      </span>
                    </div>
                    {match.groups.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500 block mb-1">Capture Groups:</span>
                        <div className="flex flex-wrap gap-1">
                          {match.groups.map((group, groupIndex) => (
                            <span 
                              key={groupIndex}
                              className="inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-gray-100 text-gray-700 rounded"
                            >
                              {groupIndex + 1}: "{group}"
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Invalid pattern message */}
      {regexError && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 italic text-center">
            Invalid pattern — fix the regex to see matches
          </p>
        </div>
      )}
    </div>
  );
}