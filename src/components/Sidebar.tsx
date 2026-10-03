import React from 'react';
import { BookOpen, Video, Music, FileText, Sparkles, MessageSquare, Quote, Clock, ChevronRight } from 'lucide-react';
import { WikiKnowledgeBase, Citation } from '../types/wiki';
import { SourceMediaViewer } from './SourceMediaViewer';

interface SidebarProps {
  wiki: WikiKnowledgeBase;
  selectedArticleId?: string;
  onSelectArticle: (articleId: string) => void;
  onAskQuestion: () => void;
  activeTimestamp?: number | null;
  onClearActiveTimestamp?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  wiki,
  selectedArticleId,
  onSelectArticle,
  onAskQuestion,
  activeTimestamp,
  onClearActiveTimestamp,
}) => {
  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6">
      {/* Source Media Player & Grounding Status */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider px-1">
          Primary Source Anchor
        </div>
        <SourceMediaViewer
          wiki={wiki}
          activeTimestamp={activeTimestamp}
          onClearActiveTimestamp={onClearActiveTimestamp}
        />
      </div>

      {/* Table of Contents / Articles in this Wiki */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-wider font-semibold px-1">
          <span>Table of Contents</span>
          <span className="font-mono text-[10px]">{wiki.articles.length} Articles</span>
        </div>

        <div className="space-y-1">
          {wiki.articles.map((art, idx) => {
            const isSelected = selectedArticleId ? selectedArticleId === art.id : idx === 0;
            return (
              <button
                key={art.id}
                onClick={() => onSelectArticle(art.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-amber-50 text-amber-950 font-semibold border border-amber-200/80 shadow-2xs'
                    : 'hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="truncate pr-2">
                  <div className="truncate">{art.title}</div>
                  <div className="text-[10px] text-stone-400 font-normal">
                    {art.category} · {art.readingTimeMinutes}m
                  </div>
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    isSelected ? 'text-amber-700 translate-x-0.5' : 'text-stone-300 group-hover:text-stone-500'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Inquire Shortcut */}
      <div className="p-4 rounded-xl bg-stone-900 text-stone-100 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wide">
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
          <span>Cited Interrogation</span>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed font-serif">
          Query this knowledge base for specific citations, counter-arguments, and verbatim quotes.
        </p>
        <button
          onClick={onAskQuestion}
          className="w-full mt-1 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-stone-50 text-xs font-medium transition-colors cursor-pointer text-center"
        >
          Open Q&A Workspace
        </button>
      </div>

      {/* Knowledge Base Meta stats */}
      <div className="px-2 text-xs text-stone-400 space-y-1 font-mono text-[11px]">
        <div>Source: {wiki.sourceName}</div>
        <div>Indexed: {new Date(wiki.createdAt).toLocaleDateString()}</div>
        <div>Citations: {wiki.stats.citationCount} verified anchors</div>
      </div>
    </aside>
  );
};
