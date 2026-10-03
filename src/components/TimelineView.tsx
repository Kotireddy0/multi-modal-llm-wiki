import React from 'react';
import { Clock, Play, Quote, CheckCircle2 } from 'lucide-react';
import { WikiKnowledgeBase, Citation } from '../types/wiki';

interface TimelineViewProps {
  wiki: WikiKnowledgeBase;
  onSelectCitation: (citation: Citation) => void;
  onJumpToMedia?: (seconds: number) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  wiki,
  onSelectCitation,
  onJumpToMedia,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-stone-100 text-stone-700">
              <Clock className="w-4 h-4 text-amber-700" />
            </span>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Sequential Source Timeline & Chapter Breakdown
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            {wiki.timeline.length} Structural Milestones
          </span>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-serif">
          Chronological breakdown of key thematic arguments, technical derivations, and empirical demonstrations as they unfold in the source material.
        </p>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-stone-200 ml-4 space-y-8 my-6">
        {wiki.timeline.map((event, idx) => {
          const citation = event.citationId ? wiki.citations[event.citationId] : undefined;
          const hasSeconds = event.seconds != null && !isNaN(event.seconds);

          return (
            <div key={event.id || idx} className="relative group">
              {/* Bullet node on timeline */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-amber-600 group-hover:scale-125 transition-transform" />

              <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-2xs space-y-3 hover:border-amber-300 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                    {event.timestamp || `Phase ${idx + 1}`}
                  </span>
                  {citation && (
                    <button
                      onClick={() => onSelectCitation(citation)}
                      className="text-[11px] font-mono text-stone-500 hover:text-stone-900 underline"
                    >
                      Cite: {citation.id}
                    </button>
                  )}
                </div>

                <h3 className="text-base font-semibold text-stone-900">
                  {event.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-serif">
                  {event.description}
                </p>

                {/* Citation snippet if linked */}
                {citation && (
                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 text-xs">
                    <span className="font-serif italic text-stone-700">"{citation.quote}"</span>
                  </div>
                )}

                {/* Jump to media button */}
                {hasSeconds && onJumpToMedia && (
                  <div className="pt-1">
                    <button
                      onClick={() => onJumpToMedia(event.seconds!)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Play Source at {event.timestamp}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
