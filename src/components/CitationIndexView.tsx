import React, { useState } from 'react';
import { Search, Quote, Play, ExternalLink, Filter, CheckCircle2, Clock, FileText, Video, Music } from 'lucide-react';
import { WikiKnowledgeBase, Citation } from '../types/wiki';

interface CitationIndexViewProps {
  wiki: WikiKnowledgeBase;
  onSelectCitation: (citation: Citation) => void;
  onJumpToMedia?: (seconds: number) => void;
}

export const CitationIndexView: React.FC<CitationIndexViewProps> = ({
  wiki,
  onSelectCitation,
  onJumpToMedia,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'audio' | 'pdf' | 'text'>('all');

  const allCitations = Object.values(wiki.citations);

  const filteredCitations = allCitations.filter((c) => {
    const matchesSearch =
      c.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.context.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.sectionHeading && c.sectionHeading.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'all' || c.sourceType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
              Verifiable Citation Registry
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Index of all verbatim source excerpts, audio-visual timestamps, and page anchors extracted from{' '}
              <span className="font-medium text-stone-700">{wiki.sourceName}</span>.
            </p>
          </div>
          <div className="font-mono text-xs bg-stone-100 text-stone-700 px-3 py-1.5 rounded-md border border-stone-200 self-start sm:self-auto">
            {allCitations.length} Total Verified Citations
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search quotes, terms, or section headings..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Segmented filter control (zero-pill rule: functional button group with active state) */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg self-stretch sm:self-auto">
            {(['all', 'video', 'audio', 'pdf', 'text'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize cursor-pointer ${
                  typeFilter === t
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Citations List */}
      <div className="space-y-4">
        {filteredCitations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-stone-200 text-stone-500 text-xs">
            No citations found matching your criteria.
          </div>
        ) : (
          filteredCitations.map((citation) => {
            const hasTimestamp = citation.timestampStart != null && !isNaN(citation.timestampStart);

            return (
              <div
                key={citation.id}
                className="bg-white rounded-xl p-5 sm:p-6 border border-stone-200 shadow-2xs hover:border-amber-300/80 transition-all space-y-4 group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                      {citation.id}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-stone-600 font-medium">
                      {citation.sourceType === 'video' && <Video className="w-3.5 h-3.5 text-amber-600" />}
                      {citation.sourceType === 'audio' && <Music className="w-3.5 h-3.5 text-amber-600" />}
                      {citation.sourceType === 'pdf' && <FileText className="w-3.5 h-3.5 text-amber-600" />}
                      <span className="capitalize">{citation.sourceType}</span>
                    </span>
                    {citation.sectionHeading && (
                      <span className="text-stone-400 text-xs truncate max-w-[240px]">
                        · {citation.sectionHeading}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {citation.timestampLabel && (
                      <span className="font-mono text-xs text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" />
                        {citation.timestampLabel}
                      </span>
                    )}
                    {citation.pageNumber && (
                      <span className="font-mono text-xs text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                        Page {citation.pageNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Verbatim quote */}
                <div className="relative pl-4 border-l-2 border-amber-600 bg-stone-50/70 p-3 rounded-r-lg">
                  <p className="text-stone-900 font-serif italic text-sm leading-relaxed">
                    "{citation.quote}"
                  </p>
                </div>

                {/* Evidence context */}
                {citation.context && (
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    <span className="font-semibold text-stone-800 mr-1.5">Context & Synthesis:</span>
                    {citation.context}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <button
                    onClick={() => onSelectCitation(citation)}
                    className="font-medium text-amber-900 hover:text-amber-950 underline cursor-pointer"
                  >
                    Open Deep Inspector
                  </button>

                  {hasTimestamp && onJumpToMedia && (
                    <button
                      onClick={() => onJumpToMedia(citation.timestampStart!)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-stone-50 font-medium transition-colors cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Play at {citation.timestampLabel}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
