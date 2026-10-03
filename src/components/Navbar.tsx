import React from 'react';
import { BookOpen, Plus, Download, Sparkles, MessageSquare, Quote, Network, Clock, BookMarked, ChevronDown, Check } from 'lucide-react';
import { WikiKnowledgeBase } from '../types/wiki';

export type ActiveTab = 'reader' | 'ask' | 'citations' | 'graph' | 'timeline' | 'glossary';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentWiki: WikiKnowledgeBase;
  allWikis: WikiKnowledgeBase[];
  onSelectWiki: (wiki: WikiKnowledgeBase) => void;
  onOpenIngestModal: () => void;
  onExportMarkdown: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  currentWiki,
  allWikis,
  onSelectWiki,
  onOpenIngestModal,
  onExportMarkdown,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'reader', label: 'Wiki Articles', icon: BookOpen },
    { id: 'ask', label: 'Cited Q&A', icon: MessageSquare },
    { id: 'citations', label: 'Evidence Index', icon: Quote },
    { id: 'graph', label: 'Knowledge Graph', icon: Network },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'glossary', label: 'Glossary', icon: BookMarked },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Active Wiki Switcher */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs font-serif font-bold text-base">
                W
              </div>
              <div className="hidden sm:block">
                <span className="font-serif font-bold text-base text-stone-900 tracking-tight">
                  WikiSynth
                </span>
                <span className="text-[10px] text-stone-400 block -mt-1 font-mono uppercase tracking-wider">
                  Multimodal LLM Wiki
                </span>
              </div>
            </div>

            <div className="h-5 w-px bg-stone-200 hidden md:block" />

            {/* Wiki Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-stone-50/80 text-xs font-medium text-stone-800 transition-colors max-w-[200px] sm:max-w-[280px] cursor-pointer"
              >
                <span className="truncate text-left font-serif">{currentWiki.title}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-1 w-80 bg-white border border-stone-200 rounded-xl shadow-xl z-20 p-1.5 space-y-1">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                      Available Wikis ({allWikis.length})
                    </div>
                    {allWikis.map((w) => {
                      const isSelected = w.id === currentWiki.id;
                      return (
                        <button
                          key={w.id}
                          onClick={() => {
                            onSelectWiki(w);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-amber-50 text-amber-950 font-semibold'
                              : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="truncate font-serif">{w.title}</div>
                            <div className="text-[10px] text-stone-400 font-mono capitalize">
                              {w.sourceType} · {w.stats.citationCount} citations
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={onExportMarkdown}
              title="Export Wiki Dossier as Markdown"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dossier</span>
            </button>

            <button
              onClick={onOpenIngestModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Ingest Source</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Zero-pill discipline: quiet functional tab bar with clean active indicators) */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1 -mb-px border-t border-stone-100">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-amber-700 text-stone-950 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-700' : 'text-stone-400'}`} />
                <span>{label}</span>
                {id === 'citations' && (
                  <span className="font-mono text-[10px] text-stone-400 ml-0.5">
                    ({currentWiki.stats.citationCount})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
