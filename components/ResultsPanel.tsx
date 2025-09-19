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
          className={`font-bold cursor-pointer transition-colors ${
            isSelected 
              ? 'text-black bg-green-400' 
              : 'text-green-400 hover:text-green-300'
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-green-400 mr-2">&gt;</span>
          <span className="text-white">matches</span>
        </div>
        {!regexError && matches.length > 0 && (
          <span className="px-2 py-1 text-xs text-green-400">
            {matches.length}
          </span>
        )}
      </div>
      
      {/* Large input warning */}
      {isLargeInput && (
        <div className="mb-4 p-3 border border-gray-800">
          <p className="text-sm text-yellow-500">
            ⚠️ Large input — highlighting may be slow
          </p>
        </div>
      )}

      {/* Highlighted Text Preview */}
      <div className="bg-black border border-gray-800 p-4 min-h-[120px] font-mono whitespace-pre-wrap text-sm max-h-[300px] overflow-y-auto">
        {regexError ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-400 italic">✗ Invalid regex pattern</p>
          </div>
        ) : !testString ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600 italic">$ echo &quot;test string&quot; | grep pattern</p>
          </div>
        ) : highlighted.length > 0 ? (
          highlighted
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600 italic">$ no matches found</p>
          </div>
        )}
      </div>

      {/* Terminal-style Match List */}
      {!regexError && matches.length > 0 && (
        <div className="mt-4">
          <div className="text-white text-sm mb-2">Matches ({matches.length}):</div>
          <div className="space-y-1 max-h-60 overflow-y-auto bg-black border border-gray-800 p-3">
            {matches.map((match, index) => (
              <button
                key={index}
                onClick={() => onMatchSelect(index)}
                className={`w-full text-left font-mono text-sm transition-colors focus:outline-none ${
                  selectedMatchIndex === index
                    ? 'text-green-400 bg-gray-900'
                    : 'text-gray-300 hover:text-white hover:bg-gray-900'
                } p-2`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-green-400 min-w-0">
                    {index}:
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-white">
                      &quot;{match.text}&quot;
                    </span>
                    <span className="text-gray-500 ml-2">
                      at index {match.index}
                    </span>
                    {match.groups.length > 0 && (
                      <div className="mt-1 text-xs">
                        <span className="text-white">groups: </span>
                        {match.groups.map((group, groupIndex) => (
                          <span key={groupIndex} className="text-gray-500 mr-2">
                            [{groupIndex + 1}] &quot;{group}&quot;
                          </span>
                        ))}
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
        <div className="mt-4 p-3 border border-gray-800">
          <p className="text-red-400 text-sm">
            ✗ {regexError}
          </p>
        </div>
      )}
    </div>
  );
}