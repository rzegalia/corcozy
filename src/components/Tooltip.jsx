import { useState } from 'react';
import { cookingTerms } from '../data/tooltips';

// Terms to look for in text
const termPatterns = Object.keys(cookingTerms).map(term => ({
  term,
  pattern: new RegExp(`\\b(${term.replace(/\s+/g, '\\s+')})\\b`, 'gi'),
  definition: cookingTerms[term]
}));

function Tooltip({ text }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Find all terms in the text and their positions
  const parts = [];
  let lastIndex = 0;
  const matches = [];

  termPatterns.forEach(({ term, pattern, definition }) => {
    let match;
    const regex = new RegExp(pattern.source, 'gi');
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        definition
      });
    }
  });

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start);

  // Remove overlapping matches (keep first)
  const filteredMatches = [];
  matches.forEach(match => {
    const overlaps = filteredMatches.some(
      m => (match.start >= m.start && match.start < m.end) ||
           (match.end > m.start && match.end <= m.end)
    );
    if (!overlaps) {
      filteredMatches.push(match);
    }
  });

  // Build parts array
  filteredMatches.forEach((match, idx) => {
    // Add text before this match
    if (match.start > lastIndex) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, match.start)
      });
    }
    // Add the matched term
    parts.push({
      type: 'term',
      content: match.text,
      definition: match.definition,
      id: idx
    });
    lastIndex = match.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex)
    });
  }

  // If no terms found, just return the text
  if (parts.length === 0) {
    return <span>{text}</span>;
  }

  return (
    <span>
      {parts.map((part, idx) => {
        if (part.type === 'text') {
          return <span key={idx}>{part.content}</span>;
        }

        return (
          <span key={idx} className="relative inline-block">
            <span
              className="text-accent-amber border-b border-dotted border-accent-amber cursor-help"
              onMouseEnter={() => setActiveTooltip(part.id)}
              onMouseLeave={() => setActiveTooltip(null)}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTooltip(activeTooltip === part.id ? null : part.id);
              }}
            >
              {part.content}
            </span>

            {activeTooltip === part.id && (
              <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 max-w-[90vw]">
                <div className="bg-bg-secondary border border-accent-amber/50 rounded-lg p-3 shadow-lg text-sm animate-fade-in">
                  <div className="font-bold text-accent-gold mb-1">
                    {part.definition.term}
                  </div>
                  <div className="text-text-primary text-xs leading-relaxed">
                    {part.definition.definition}
                  </div>
                  {part.definition.example && (
                    <div className="text-text-muted text-xs mt-2 italic">
                      e.g., "{part.definition.example}"
                    </div>
                  )}
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-bg-secondary" />
              </div>
            )}
          </span>
        );
      })}
    </span>
  );
}

export default Tooltip;
