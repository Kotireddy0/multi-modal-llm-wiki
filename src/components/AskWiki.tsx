import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Quote, Play, ExternalLink, RefreshCw, ChevronRight, HelpCircle, CheckCircle } from 'lucide-react';
import { WikiKnowledgeBase, Citation, QnATurn } from '../types/wiki';

interface AskWikiProps {
  wiki: WikiKnowledgeBase;
  onSelectCitation: (citation: Citation) => void;
  onJumpToMedia?: (seconds: number) => void;
  initialQuestion?: string;
  onClearInitialQuestion?: () => void;
}

export const AskWiki: React.FC<AskWikiProps> = ({
  wiki,
  onSelectCitation,
  onJumpToMedia,
  initialQuestion,
  onClearInitialQuestion,
}) => {
  const [question, setQuestion] = useState(initialQuestion || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<QnATurn[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // If initialQuestion changes externally (e.g. from "Ask about this article" button), populate and submit
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      setQuestion(initialQuestion);
      handleAsk(initialQuestion);
      if (onClearInitialQuestion) onClearInitialQuestion();
    }
  }, [initialQuestion]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  const handleAsk = async (queryText?: string) => {
    const q = queryText || question;
    if (!q || !q.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);

    const userTurnId = 'turn-' + Date.now();

    try {
      const response = await fetch('/api/wiki/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          wikiContext: {
            title: wiki.title,
            synopsis: wiki.synopsis,
            sourceType: wiki.sourceType,
            sourceName: wiki.sourceName,
            articles: wiki.articles,
            citations: wiki.citations,
            glossary: wiki.glossary,
          },
          chatHistory: history.map((h) => [
            { role: 'user', content: h.question },
            { role: 'model', content: h.answer },
          ]).flat(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();

      const newTurn: QnATurn = {
        id: userTurnId,
        question: q,
        answer: data.answer || 'No answer generated.',
        citations: data.citations || [],
        keyTakeaways: data.keyTakeaways || [],
        followUpQuestions: data.followUpQuestions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setHistory((prev) => [...prev, newTurn]);
      setQuestion('');
    } catch (err: any) {
      console.error('Q&A error:', err);
      setError(err?.message || 'Failed to retrieve answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to parse inline citation badges in generated answers
  const renderAnswerWithCitations = (answerText: string, turnCitations: Citation[]) => {
    const parts = answerText.split(/(\[cite:[A-Za-z0-9_-]+\])/g);

    return parts.map((part, index) => {
      const match = part.match(/\[cite:([A-Za-z0-9_-]+)\]/);
      if (match) {
        const citationId = match[1];
        // Look in turn citations or overall wiki citations
        const citation =
          turnCitations.find((c) => c.id === citationId) ||
          wiki.citations[citationId] ||
          {
            id: citationId,
            sourceType: wiki.sourceType,
            sourceTitle: wiki.sourceName,
            quote: 'Referenced from primary source material.',
            context: 'Evidence for cited claim.',
          };

        const label = citation.timestampLabel || (citation.pageNumber ? `p. ${citation.pageNumber}` : citationId);

        return (
          <button
            key={index}
            onClick={() => onSelectCitation(citation)}
            title={`Citation ${citationId}: "${citation.quote}"`}
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
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-stone-100 text-stone-700">
              <MessageSquare className="w-4 h-4 text-amber-700" />
            </span>
            <h2 className="text-lg font-semibold text-stone-900">
              Cited Q&A & In-Depth Inquiry
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            Grounding: {wiki.stats.citationCount} source markers
          </span>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed font-serif">
          Ask complex questions about the synthesis, empirical benchmarks, or specific discussions in{' '}
          <strong className="font-semibold text-stone-800">{wiki.title}</strong>. Every response includes direct verifiable citations and jump anchors.
        </p>

        {/* Suggested Queries */}
        {wiki.suggestedQuestions && wiki.suggestedQuestions.length > 0 && (
          <div className="pt-2">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Suggested Inquiries Grounded in Source Material</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {wiki.suggestedQuestions.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuestion(sq);
                    handleAsk(sq);
                  }}
                  className="text-left text-xs bg-stone-50 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 text-stone-700 border border-stone-200 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Conversation Thread */}
      <div className="space-y-6">
        {history.length === 0 && !isLoading && (
          <div className="p-12 text-center bg-white rounded-xl border border-stone-200/80 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 mx-auto flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-base font-semibold text-stone-800">
              Explore this Wiki with Verifiable Evidence
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              Click any of the suggested questions above, or type your own question below. Responses cite exact timestamps and page quotes from the source material.
            </p>
          </div>
        )}

        {history.map((turn) => (
          <div key={turn.id} className="space-y-4">
            {/* User Question */}
            <div className="flex items-start justify-end gap-3">
              <div className="bg-stone-900 text-stone-50 rounded-xl rounded-tr-xs px-5 py-3 max-w-2xl shadow-sm text-sm">
                <p className="font-medium">{turn.question}</p>
                <div className="text-[10px] text-stone-400 mt-1 text-right font-mono">
                  {turn.timestamp}
                </div>
              </div>
            </div>

            {/* AI Synthesized Answer Card */}
            <div className="bg-white rounded-xl p-6 sm:p-7 border border-stone-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3 text-xs text-stone-500">
                <span className="font-medium text-stone-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Synthesized Answer & Citation Dossier
                </span>
                <span className="font-mono text-[11px]">
                  {turn.citations.length} Verifiable Citations
                </span>
              </div>

              {/* Answer Content */}
              <div className="text-stone-800 text-sm sm:text-base leading-relaxed wiki-prose">
                <p className="whitespace-pre-line">
                  {renderAnswerWithCitations(turn.answer, turn.citations)}
                </p>
              </div>

              {/* Key Takeaways */}
              {turn.keyTakeaways && turn.keyTakeaways.length > 0 && (
                <div className="p-4 rounded-lg bg-stone-50 border border-stone-200/80 space-y-2">
                  <div className="text-xs font-semibold text-stone-800 uppercase tracking-wide">
                    Summary Takeaways
                  </div>
                  <ul className="space-y-1.5">
                    {turn.keyTakeaways.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cited Evidence Cards Tray */}
              {turn.citations && turn.citations.length > 0 && (
                <div className="pt-2 border-t border-stone-100 space-y-2.5">
                  <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-amber-600" />
                    <span>Cited Evidence from Source Material ({turn.citations.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {turn.citations.map((c, i) => {
                      const hasTimestamp = c.timestampStart != null && !isNaN(c.timestampStart);
                      return (
                        <div
                          key={i}
                          className="p-3 rounded-lg border border-stone-200 bg-stone-50/70 hover:bg-stone-50 transition-colors flex flex-col justify-between space-y-2"
                        >
                          <div>
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-mono font-semibold text-stone-800 bg-stone-200 px-1.5 py-0.5 rounded">
                                {c.id || `C${i + 1}`}
                              </span>
                              {c.timestampLabel && (
                                <span className="font-mono text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded">
                                  {c.timestampLabel}
                                </span>
                              )}
                              {c.pageNumber && (
                                <span className="font-mono text-stone-700 bg-stone-200/70 px-1.5 py-0.5 rounded">
                                  Page {c.pageNumber}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-800 font-serif italic line-clamp-3">
                              "{c.quote}"
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                            <button
                              onClick={() => onSelectCitation(c)}
                              className="text-[11px] font-medium text-amber-900 hover:text-amber-950 underline cursor-pointer"
                            >
                              Inspect Quote
                            </button>

                            {hasTimestamp && onJumpToMedia && (
                              <button
                                onClick={() => onJumpToMedia(c.timestampStart!)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-900 text-stone-100 hover:bg-stone-800 text-[10px] font-medium transition-colors cursor-pointer"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                Jump Media
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recommended Follow-up Questions */}
              {turn.followUpQuestions && turn.followUpQuestions.length > 0 && (
                <div className="pt-2 border-t border-stone-100">
                  <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide mb-2">
                    Recommended Follow-up Inquiries
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {turn.followUpQuestions.map((fq, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setQuestion(fq);
                          handleAsk(fq);
                        }}
                        className="inline-flex items-center gap-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1 rounded-md transition-colors cursor-pointer"
                      >
                        <span>{fq}</span>
                        <ChevronRight className="w-3 h-3 text-stone-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-3 text-stone-600 text-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-700" />
              <span>Analyzing Wiki knowledge base and verifying source citations...</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-600 rounded-full animate-pulse w-2/3" />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
            {error}
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-4 bg-white/95 backdrop-blur-md rounded-xl p-2.5 border border-stone-300 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about the wiki, specific claims, timestamps, or page numbers..."
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-medium shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask Wiki</span>
          </button>
        </form>
      </div>
    </div>
  );
};
