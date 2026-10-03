import React, { useState } from 'react';
import { BookMarked, Search, Quote } from 'lucide-react';
import { WikiKnowledgeBase, Citation } from '../types/wiki';

interface GlossaryViewProps {
  wiki: WikiKnowledgeBase;
  onSelectCitation: (citation: Citation) => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({
  wiki,
  onSelectCitation,
}) => {
  const [search, setSearch] = useState('');

  const filteredTerms = wiki.glossary.filter(
    (g) =>
      g.term.toLowerCase().includes(search.toLowerCase()) ||
      g.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
              Terminology Index & Conceptual Glossary
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Rigorous definitions for domain-specific vocabulary and technical constructs grounded in this knowledge base.
            </p>
          </div>
          <span className="font-mono text-xs bg-stone-100 text-stone-700 px-3 py-1.5 rounded-md border border-stone-200 self-start sm:self-auto">
            {wiki.glossary.length} Defined Terms
          </span>
        </div>

        <div className="relative pt-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search glossary terms or concepts..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTerms.map((term, i) => {
          const citation = term.citationId ? wiki.citations[term.citationId] : undefined;
          return (
            <div
              key={i}
              className="bg-white rounded-xl p-5 border border-stone-200 shadow-2xs space-y-2 hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="font-semibold text-stone-900 text-sm">
                    {term.term}
                  </h3>
                  {citation && (
                    <button
                      onClick={() => onSelectCitation(citation)}
                      className="font-mono text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded hover:bg-amber-100"
                    >
                      Cite: {citation.id}
                    </button>
                  )}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-serif">
                  {term.definition}
                </p>
              </div>

              {citation && (
                <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                  <span className="italic font-serif line-clamp-1">"{citation.quote}"</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
