import React, { useState } from 'react';
import { BookOpen, Clock, ChevronRight, MessageSquare, ExternalLink, Quote, Sparkles, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { WikiKnowledgeBase, WikiArticle, Citation } from '../types/wiki';

interface WikiReaderProps {
  wiki: WikiKnowledgeBase;
  onSelectCitation: (citation: Citation) => void;
  onAskQuestion: (initialQuestion: string) => void;
  selectedArticleId?: string;
  onSelectArticle?: (articleId: string) => void;
}

export const WikiReader: React.FC<WikiReaderProps> = ({
  wiki,
  onSelectCitation,
  onAskQuestion,
  selectedArticleId,
  onSelectArticle,
}) => {
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);

  // If a specific article is selected externally, sync with index
  const activeArticle =
    (selectedArticleId ? wiki.articles.find((a) => a.id === selectedArticleId) : null) ||
    wiki.articles[activeArticleIndex] ||
    wiki.articles[0];

  const handleNextArticle = () => {
    const currentIndex = wiki.articles.findIndex((a) => a.id === activeArticle.id);
    if (currentIndex < wiki.articles.length - 1) {
      const nextArticle = wiki.articles[currentIndex + 1];
      setActiveArticleIndex(currentIndex + 1);
      if (onSelectArticle) onSelectArticle(nextArticle.id);
    }
  };

  const handlePrevArticle = () => {
    const currentIndex = wiki.articles.findIndex((a) => a.id === activeArticle.id);
    if (currentIndex > 0) {
      const prevArticle = wiki.articles[currentIndex - 1];
      setActiveArticleIndex(currentIndex - 1);
      if (onSelectArticle) onSelectArticle(prevArticle.id);
    }
  };

  // Helper to parse inline citation tokens like [cite:C1] or [cite:C12]
  const renderContentWithCitations = (content: string) => {
    const parts = content.split(/(\[cite:[A-Za-z0-9_-]+\])/g);

    return parts.map((part, index) => {
      const match = part.match(/\[cite:([A-Za-z0-9_-]+)\]/);
      if (match) {
        const citationId = match[1];
        const citation = wiki.citations[citationId];

        if (!citation) {
          return (
            <span
              key={index}
              className="inline-flex items-center text-xs font-mono text-amber-700 bg-amber-50 px-1 py-0.5 rounded cursor-default"
            >
              [{citationId}]
            </span>
          );
        }

        const label = citation.timestampLabel || (citation.pageNumber ? `p. ${citation.pageNumber}` : citationId);

        return (
          <button
            key={index}
            onClick={() => onSelectCitation(citation)}
            title={`Citation ${citationId}: "${citation.quote}" (Click to inspect source & jump media)`}
            className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 text-[11px] font-mono font-medium rounded bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300/80 transition-all hover:scale-105 active:scale-95 shadow-2xs group cursor-pointer"
          >
            <span className="font-semibold text-amber-950">[{citationId}</span>
            <span className="text-amber-700 font-normal">· {label}]</span>
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Wiki Knowledge Base Overview & Abstract */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
        <div>
          {/* Metadata line without pills (zero-pill rule) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-2.5">
            <span className="font-medium text-amber-800 uppercase tracking-wider text-[11px]">
              LLM Encyclopedic Wiki
            </span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{wiki.sourceType} Ingestion</span>
            <span aria-hidden="true">·</span>
            <span>{wiki.stats.articleCount} Thematic Articles</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{wiki.stats.citationCount} Verifiable Citations</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900 tracking-tight leading-tight">
            {wiki.title}
          </h1>

          <p className="mt-3 text-stone-600 text-base leading-relaxed font-serif">
            {wiki.synopsis}
          </p>
        </div>

        {/* Executive Takeaways */}
        {wiki.overviewTakeaways && wiki.overviewTakeaways.length > 0 && (
          <div className="p-4 sm:p-5 rounded-lg bg-stone-50 border border-stone-200/90 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Core Executive Findings</span>
            </div>
            <ul className="space-y-2">
              {wiki.overviewTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Table of Contents Tabs */}
        <div>
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2.5">
            Articles in this Knowledge Base
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {wiki.articles.map((article, idx) => {
              const isActive = activeArticle?.id === article.id;
              return (
                <button
                  key={article.id}
                  onClick={() => {
                    setActiveArticleIndex(idx);
                    if (onSelectArticle) onSelectArticle(article.id);
                  }}
                  className={`text-left p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-amber-50/70 border-amber-400/80 shadow-2xs'
                      : 'bg-stone-50/60 hover:bg-stone-100 border-stone-200 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-stone-900 truncate">
                      {article.title}
                    </span>
                    <span className="text-[11px] text-stone-500 shrink-0">
                      {article.readingTimeMinutes}m read
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1">
                    {article.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Active Article */}
      {activeArticle && (
        <article className="bg-white rounded-xl p-6 sm:p-10 border border-stone-200 shadow-2xs space-y-8">
          {/* Article Header */}
          <div className="border-b border-stone-200 pb-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <span className="text-amber-800 font-medium">{activeArticle.category}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {activeArticle.readingTimeMinutes} min read
              </span>
              <span aria-hidden="true">·</span>
              <span>{activeArticle.sections.length} Sub-Sections</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              {activeArticle.title}
            </h2>

            <p className="text-base text-stone-600 font-serif italic">
              {activeArticle.subtitle}
            </p>

            {/* Article Summary Box */}
            <div className="p-4 rounded-lg bg-stone-50 border-l-2 border-stone-400 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <span className="font-semibold text-stone-900 mr-1.5">Abstract:</span>
              {activeArticle.summary}
            </div>
          </div>

          {/* Article Sections */}
          <div className="space-y-8">
            {activeArticle.sections.map((section) => (
              <section key={section.id} className="space-y-3">
                <h3 className="text-lg sm:text-xl font-semibold text-stone-900 tracking-tight flex items-center justify-between">
                  <span>{section.heading}</span>
                </h3>
                <div className="text-stone-800 text-sm sm:text-base leading-relaxed wiki-prose">
                  <p>{renderContentWithCitations(section.content)}</p>
                </div>
              </section>
            ))}
          </div>

          {/* Section Key Takeaways */}
          {activeArticle.keyTakeaways && activeArticle.keyTakeaways.length > 0 && (
            <div className="pt-6 border-t border-stone-200">
              <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200/60 space-y-2">
                <div className="text-xs font-semibold text-amber-900 uppercase tracking-wide">
                  Key Deductions from this Article
                </div>
                <ul className="space-y-1.5">
                  {activeArticle.keyTakeaways.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Action Footer: Ask & Article Pagination */}
          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => onAskQuestion(`Explain the key arguments in "${activeArticle.title}" and highlight specific evidence`)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Ask questions about this article
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handlePrevArticle}
                disabled={wiki.articles.findIndex((a) => a.id === activeArticle.id) === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                Previous Article
              </button>
              <button
                onClick={handleNextArticle}
                disabled={wiki.articles.findIndex((a) => a.id === activeArticle.id) === wiki.articles.length - 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next Article
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </article>
      )}
    </div>
  );
};
