import React, { useState } from 'react';
import { SAMPLE_WIKIS } from './data/sampleWikis';
import { WikiKnowledgeBase, Citation } from './types/wiki';
import { Navbar, ActiveTab } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { WikiReader } from './components/WikiReader';
import { AskWiki } from './components/AskWiki';
import { CitationIndexView } from './components/CitationIndexView';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { TimelineView } from './components/TimelineView';
import { GlossaryView } from './components/GlossaryView';
import { CitationInspector } from './components/CitationInspector';
import { IngestModal } from './components/IngestModal';

export default function App() {
  const [wikis, setWikis] = useState<WikiKnowledgeBase[]>(SAMPLE_WIKIS);
  const [activeWikiId, setActiveWikiId] = useState<string>(SAMPLE_WIKIS[0].id);
  const [activeTab, setActiveTab] = useState<ActiveTab>('reader');
  const [selectedArticleId, setSelectedArticleId] = useState<string | undefined>(
    SAMPLE_WIKIS[0].articles[0]?.id
  );
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [activeMediaTimestamp, setActiveMediaTimestamp] = useState<number | null>(null);
  const [initialAskQuestion, setInitialAskQuestion] = useState<string | undefined>();
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);

  // Active Wiki instance
  const currentWiki = wikis.find((w) => w.id === activeWikiId) || wikis[0];

  const handleSelectWiki = (wiki: WikiKnowledgeBase) => {
    setActiveWikiId(wiki.id);
    setSelectedArticleId(wiki.articles[0]?.id);
    setSelectedCitation(null);
    setActiveMediaTimestamp(null);
  };

  const handleWikiCreated = (newWiki: WikiKnowledgeBase) => {
    setWikis((prev) => [newWiki, ...prev]);
    setActiveWikiId(newWiki.id);
    setSelectedArticleId(newWiki.articles[0]?.id);
    setActiveTab('reader');
  };

  const handleLoadSample = (sampleWiki: WikiKnowledgeBase) => {
    const exists = wikis.find((w) => w.id === sampleWiki.id);
    if (!exists) {
      setWikis((prev) => [sampleWiki, ...prev]);
    }
    setActiveWikiId(sampleWiki.id);
    setSelectedArticleId(sampleWiki.articles[0]?.id);
    setActiveTab('reader');
  };

  const handleSelectCitation = (citation: Citation) => {
    setSelectedCitation(citation);
    if (citation.timestampStart != null && !isNaN(citation.timestampStart)) {
      setActiveMediaTimestamp(citation.timestampStart);
    }
  };

  const handleJumpToMedia = (seconds: number) => {
    setActiveMediaTimestamp(seconds);
  };

  const handleAskQuestionFromContext = (prompt: string) => {
    setInitialAskQuestion(prompt);
    setActiveTab('ask');
  };

  // Export Wiki as a comprehensive Markdown dossier
  const handleExportMarkdown = () => {
    const lines: string[] = [];
    lines.push(`# ${currentWiki.title}`);
    lines.push(`\n**Source Material:** ${currentWiki.sourceName} (${currentWiki.sourceType})`);
    lines.push(`**Generated At:** ${currentWiki.createdAt}`);
    lines.push(`\n## Executive Synopsis\n${currentWiki.synopsis}`);

    if (currentWiki.overviewTakeaways.length > 0) {
      lines.push('\n### Key Takeaways');
      currentWiki.overviewTakeaways.forEach((t) => lines.push(`- ${t}`));
    }

    lines.push('\n---\n\n## Synthesized Wiki Articles\n');
    currentWiki.articles.forEach((art) => {
      lines.push(`\n### ${art.title}`);
      lines.push(`*${art.subtitle}* (Category: ${art.category} | ${art.readingTimeMinutes} min read)`);
      lines.push(`\n**Abstract:** ${art.summary}\n`);
      art.sections.forEach((sec) => {
        lines.push(`\n#### ${sec.heading}\n${sec.content}`);
      });
      if (art.keyTakeaways?.length > 0) {
        lines.push('\n**Deductions:**');
        art.keyTakeaways.forEach((k) => lines.push(`- ${k}`));
      }
    });

    lines.push('\n---\n\n## Verifiable Citation Registry\n');
    Object.values(currentWiki.citations).forEach((c) => {
      lines.push(`\n### Citation [${c.id}] - ${c.timestampLabel || (c.pageNumber ? `Page ${c.pageNumber}` : '')}`);
      lines.push(`> "${c.quote}"`);
      lines.push(`\n*Context:* ${c.context}\n`);
    });

    lines.push('\n---\n\n## Terminology Glossary\n');
    currentWiki.glossary.forEach((g) => {
      lines.push(`- **${g.term}**: ${g.definition}`);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentWiki.title.replace(/[^a-zA-Z0-9]/g, '_')}_Wiki_Dossier.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentWiki={currentWiki}
        allWikis={wikis}
        onSelectWiki={handleSelectWiki}
        onOpenIngestModal={() => setIsIngestModalOpen(true)}
        onExportMarkdown={handleExportMarkdown}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Navigation & Source Anchor Sidebar */}
          <Sidebar
            wiki={currentWiki}
            selectedArticleId={selectedArticleId}
            onSelectArticle={(articleId) => {
              setSelectedArticleId(articleId);
              setActiveTab('reader');
            }}
            onAskQuestion={() => setActiveTab('ask')}
            activeTimestamp={activeMediaTimestamp}
            onClearActiveTimestamp={() => setActiveMediaTimestamp(null)}
          />

          {/* Central Workspace Tab Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'reader' && (
              <WikiReader
                wiki={currentWiki}
                selectedArticleId={selectedArticleId}
                onSelectArticle={setSelectedArticleId}
                onSelectCitation={handleSelectCitation}
                onAskQuestion={handleAskQuestionFromContext}
              />
            )}

            {activeTab === 'ask' && (
              <AskWiki
                wiki={currentWiki}
                onSelectCitation={handleSelectCitation}
                onJumpToMedia={handleJumpToMedia}
                initialQuestion={initialAskQuestion}
                onClearInitialQuestion={() => setInitialAskQuestion(undefined)}
              />
            )}

            {activeTab === 'citations' && (
              <CitationIndexView
                wiki={currentWiki}
                onSelectCitation={handleSelectCitation}
                onJumpToMedia={handleJumpToMedia}
              />
            )}

            {activeTab === 'graph' && (
              <KnowledgeGraphView
                wiki={currentWiki}
                onAskAboutEntity={handleAskQuestionFromContext}
              />
            )}

            {activeTab === 'timeline' && (
              <TimelineView
                wiki={currentWiki}
                onSelectCitation={handleSelectCitation}
                onJumpToMedia={handleJumpToMedia}
              />
            )}

            {activeTab === 'glossary' && (
              <GlossaryView
                wiki={currentWiki}
                onSelectCitation={handleSelectCitation}
              />
            )}
          </div>
        </div>
      </main>

      {/* Deep Citation Inspector Sliding Drawer */}
      <CitationInspector
        citation={selectedCitation}
        wiki={currentWiki}
        onClose={() => setSelectedCitation(null)}
        onJumpToMedia={handleJumpToMedia}
      />

      {/* Multimodal Ingest Source Dialog Modal */}
      <IngestModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        onWikiCreated={handleWikiCreated}
        onLoadSample={handleLoadSample}
      />
    </div>
  );
}
