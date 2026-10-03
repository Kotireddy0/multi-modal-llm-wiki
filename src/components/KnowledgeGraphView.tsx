import React, { useState } from 'react';
import { Network, Sparkles, ArrowRight, Share2, Tag } from 'lucide-react';
import { WikiKnowledgeBase, EntityNode } from '../types/wiki';

interface KnowledgeGraphViewProps {
  wiki: WikiKnowledgeBase;
  onAskAboutEntity: (entityName: string) => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  wiki,
  onAskAboutEntity,
}) => {
  const [selectedEntity, setSelectedEntity] = useState<EntityNode | null>(
    wiki.entityGraph[0] || null
  );

  const entityTypeColors: Record<string, { bg: string; text: string; border: string }> = {
    concept: { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-200' },
    technology: { bg: 'bg-sky-50', text: 'text-sky-900', border: 'border-sky-200' },
    metric: { bg: 'bg-emerald-50', text: 'text-emerald-900', border: 'border-emerald-200' },
    person: { bg: 'bg-purple-50', text: 'text-purple-900', border: 'border-purple-200' },
    organization: { bg: 'bg-rose-50', text: 'text-rose-900', border: 'border-rose-200' },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-stone-100 text-stone-700">
              <Network className="w-4 h-4 text-amber-700" />
            </span>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Conceptual Knowledge Graph & Entity Network
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            {wiki.entityGraph.length} Extracted Core Entities
          </span>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-serif">
          Structural topology of key theoretical concepts, computational metrics, and algorithmic methodologies synthesized across this wiki. Click any entity to inspect its structural connections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Entities Directory List */}
        <div className="md:col-span-1 space-y-2">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
            Entities & Mechanisms
          </div>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {wiki.entityGraph.map((entity) => {
              const isSelected = selectedEntity?.id === entity.id;
              const style = entityTypeColors[entity.type] || entityTypeColors.concept;
              return (
                <button
                  key={entity.id}
                  onClick={() => setSelectedEntity(entity)}
                  className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-xs'
                      : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-semibold truncate">{entity.name}</span>
                    <span
                      className={`text-[10px] font-mono capitalize px-1.5 py-0.2 rounded ${
                        isSelected
                          ? 'bg-stone-800 text-stone-300'
                          : `${style.bg} ${style.text} border ${style.border}`
                      }`}
                    >
                      {entity.type}
                    </span>
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isSelected ? 'text-stone-400' : 'text-stone-500'
                    }`}
                  >
                    {entity.connections.length} relational links
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Entity Detail Card */}
        <div className="md:col-span-2 space-y-4">
          {selectedEntity ? (
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-2xs space-y-6">
              <div className="space-y-2 border-b border-stone-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                    Entity Profile
                  </span>
                  <span className="text-xs font-mono capitalize px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    Type: {selectedEntity.type}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-900">
                  {selectedEntity.name}
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed font-serif">
                  {selectedEntity.description}
                </p>
              </div>

              {/* Connected Entities */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-stone-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Direct Graph Connections ({selectedEntity.connections.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedEntity.connections.map((connName, i) => {
                    const targetEntity = wiki.entityGraph.find((e) => e.name === connName);
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          if (targetEntity) setSelectedEntity(targetEntity);
                        }}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          targetEntity
                            ? 'bg-stone-50 hover:bg-amber-50/70 border-stone-200 hover:border-amber-300 cursor-pointer'
                            : 'bg-stone-50/50 border-stone-200/60'
                        }`}
                      >
                        <div className="text-xs font-semibold text-stone-900 flex items-center justify-between">
                          <span>{connName}</span>
                          {targetEntity && <ArrowRight className="w-3 h-3 text-stone-400" />}
                        </div>
                        {targetEntity && (
                          <div className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                            {targetEntity.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-stone-100">
                <button
                  onClick={() => onAskAboutEntity(`How does ${selectedEntity.name} interact with related concepts in this wiki?`)}
                  className="w-full py-2 px-4 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-medium transition-colors cursor-pointer"
                >
                  Ask Wiki about {selectedEntity.name}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-stone-200 text-stone-400 text-xs">
              Select an entity to explore its relational graph.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
