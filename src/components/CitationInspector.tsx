import React from 'react';
import { X, ExternalLink, Play, Quote, CheckCircle2, Video, FileText, Music, Clock } from 'lucide-react';
import { Citation, WikiKnowledgeBase } from '../types/wiki';

interface CitationInspectorProps {
  citation: Citation | null;
  wiki: WikiKnowledgeBase;
  onClose: () => void;
  onJumpToMedia?: (seconds: number) => void;
}

export const CitationInspector: React.FC<CitationInspectorProps> = ({
  citation,
  wiki,
  onClose,
  onJumpToMedia,
}) => {
  if (!citation) return null;

  const isVideoOrAudio = citation.sourceType === 'video' || citation.sourceType === 'audio';
  const hasTimestamp = citation.timestampStart != null && !isNaN(citation.timestampStart);

  const formatSeconds = (sec?: number) => {
    if (sec == null) return '';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-white border-l border-stone-200 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
            {citation.id}
          </span>
          <span className="text-xs text-stone-500 font-medium">Citation Evidence Inspector</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          title="Close drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Source metadata card */}
        <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1.5 font-medium text-stone-700">
              {citation.sourceType === 'video' && <Video className="w-3.5 h-3.5 text-amber-600" />}
              {citation.sourceType === 'audio' && <Music className="w-3.5 h-3.5 text-amber-600" />}
              {citation.sourceType === 'pdf' && <FileText className="w-3.5 h-3.5 text-amber-600" />}
              <span className="capitalize">{citation.sourceType} Source</span>
            </span>

            {citation.confidence && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {(citation.confidence * 100).toFixed(0)}% verified
              </span>
            )}
          </div>

          <div className="text-sm font-semibold text-stone-900 leading-snug">
            {citation.sourceTitle || wiki.sourceName}
          </div>

          {/* Reference coordinate */}
          <div className="flex items-center gap-2 pt-1 text-xs text-stone-600 font-mono">
            {citation.timestampLabel && (
              <span className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded text-[11px]">
                <Clock className="w-3 h-3 text-amber-700" />
                {citation.timestampLabel}
              </span>
            )}
            {citation.pageNumber && (
              <span className="bg-stone-200/80 text-stone-800 px-2 py-0.5 rounded text-[11px]">
                Page {citation.pageNumber}
              </span>
            )}
            {citation.sectionHeading && (
              <span className="text-stone-500 text-[11px] truncate max-w-[200px]">
                {citation.sectionHeading}
              </span>
            )}
          </div>

          {/* Jump to media button */}
          {isVideoOrAudio && hasTimestamp && (
            <div className="pt-2">
              <button
                onClick={() => onJumpToMedia && onJumpToMedia(citation.timestampStart!)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-medium rounded-md shadow-sm transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Play & Jump Media to {formatSeconds(citation.timestampStart)}
              </button>
            </div>
          )}
        </div>

        {/* Verbatim quote */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 tracking-wide uppercase mb-2">
            <Quote className="w-3.5 h-3.5 text-amber-600" />
            <span>Verbatim Source Transcript / Excerpt</span>
          </div>
          <div className="relative pl-4 border-l-2 border-amber-600 bg-amber-50/40 py-3 pr-3 rounded-r-md">
            <p className="text-stone-900 font-serif italic text-sm leading-relaxed">
              "{citation.quote}"
            </p>
          </div>
        </div>

        {/* Synthesis & Context */}
        {citation.context && (
          <div>
            <div className="text-xs font-semibold text-stone-500 tracking-wide uppercase mb-1.5">
              Synthesis & Evidence Rationale
            </div>
            <p className="text-stone-700 text-sm leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-200/70">
              {citation.context}
            </p>
          </div>
        )}

        {/* Source Media Quick Player in drawer if video or audio */}
        {isVideoOrAudio && (
          <div>
            <div className="text-xs font-semibold text-stone-500 tracking-wide uppercase mb-2">
              Source Synchronization
            </div>
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-stone-300 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] text-stone-400">Media Stream</span>
                {hasTimestamp && (
                  <span className="font-mono text-amber-400 text-[11px]">
                    Anchor: {formatSeconds(citation.timestampStart)}
                  </span>
                )}
              </div>
              {citation.sourceType === 'video' ? (
                <video
                  src={wiki.sourceMediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                  controls
                  playsInline
                  className="w-full aspect-video rounded-md bg-black"
                  onLoadedMetadata={(e) => {
                    if (hasTimestamp) {
                      e.currentTarget.currentTime = citation.timestampStart!;
                    }
                  }}
                />
              ) : (
                <audio
                  src={wiki.sourceMediaUrl || 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg'}
                  controls
                  className="w-full"
                  onLoadedMetadata={(e) => {
                    if (hasTimestamp) {
                      e.currentTarget.currentTime = citation.timestampStart!;
                    }
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Related Wiki Articles referencing this citation */}
        <div>
          <div className="text-xs font-semibold text-stone-500 tracking-wide uppercase mb-2">
            Referenced in Wiki Articles
          </div>
          <div className="space-y-1.5">
            {wiki.articles
              .filter((art) =>
                art.sections.some((sec) => sec.citationIds?.includes(citation.id))
              )
              .map((art) => (
                <div
                  key={art.id}
                  className="text-xs p-2 rounded border border-stone-200 bg-stone-50/60 flex items-center justify-between"
                >
                  <span className="font-medium text-stone-800">{art.title}</span>
                  <span className="text-stone-400 text-[11px]">{art.category}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
        <span className="font-mono">Reference verification complete</span>
        <button
          onClick={onClose}
          className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded font-medium transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};
