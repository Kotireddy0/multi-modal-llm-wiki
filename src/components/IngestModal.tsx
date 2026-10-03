import React, { useState } from 'react';
import { X, Upload, Video, Music, FileText, AlignLeft, Sparkles, CheckCircle, AlertCircle, RefreshCw, FileCode } from 'lucide-react';
import { WikiKnowledgeBase, SourceType } from '../types/wiki';
import { SAMPLE_WIKIS } from '../data/sampleWikis';

interface IngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWikiCreated: (newWiki: WikiKnowledgeBase) => void;
  onLoadSample: (sampleWiki: WikiKnowledgeBase) => void;
}

export const IngestModal: React.FC<IngestModalProps> = ({
  isOpen,
  onClose,
  onWikiCreated,
  onLoadSample,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<SourceType>('video');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!sourceTitle) {
        setSourceTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleSynthesize = async () => {
    setErrorMessage(null);

    if (activeTab === 'text' && !textInput.trim()) {
      setErrorMessage('Please paste or write source text content.');
      return;
    }

    if (activeTab !== 'text' && !selectedFile) {
      setErrorMessage(`Please select a ${activeTab.toUpperCase()} file to upload.`);
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Reading and packaging source data...');

    try {
      let sourceData = '';
      let mimeType = '';
      let mediaBlobUrl = '';

      if (activeTab === 'text') {
        sourceData = textInput;
        mimeType = 'text/plain';
      } else if (selectedFile) {
        // Create local object URL for preview and timestamp playback!
        mediaBlobUrl = URL.createObjectURL(selectedFile);
        mimeType = selectedFile.type || (activeTab === 'video' ? 'video/mp4' : activeTab === 'audio' ? 'audio/mp3' : 'application/pdf');
        setProcessingStep(`Encoding ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(1)} MB)...`);
        sourceData = await readFileAsBase64(selectedFile);
      }

      setProcessingStep('Sending to Gemini 3.8 Flash for multimodal synthesis and deep citation verification...');

      const response = await fetch('/api/wiki/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceType: activeTab,
          sourceName: sourceTitle || selectedFile?.name || 'Uploaded Source Material',
          sourceData,
          mimeType,
          userNotes,
        }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Server responded with status ${response.status}`);
      }

      setProcessingStep('Structuring encyclopedic articles, knowledge graph, and citation index...');
      const wikiResult: WikiKnowledgeBase = await response.json();

      // Attach local media URL for playback if available
      if (mediaBlobUrl) {
        wikiResult.sourceMediaUrl = mediaBlobUrl;
      }

      onWikiCreated(wikiResult);
      onClose();
    } catch (err: any) {
      console.error('Synthesis error:', err);
      setErrorMessage(err?.message || 'Failed to synthesize wiki from source. Please check the file and try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Ingest Source to Prepare LLM Wiki
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Upload video, audio, PDF, or text. Gemini 3.8 Flash decomposes it into cited articles, a knowledge graph, and interactive Q&A.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Quick Preloaded Samples Section */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-900 font-semibold uppercase tracking-wide">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Quick-Start with Preloaded Verified Samples
              </span>
              <span className="text-[11px] font-mono text-amber-800">1-Click Load</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_WIKIS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    onLoadSample(sample);
                    onClose();
                  }}
                  disabled={isProcessing}
                  className="p-2.5 rounded-lg bg-white hover:bg-amber-100/60 text-left border border-amber-200/90 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900 mb-0.5">
                    {sample.sourceType === 'video' && <Video className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                    {sample.sourceType === 'pdf' && <FileText className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
                    <span className="truncate">{sample.title}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 line-clamp-1">
                    {sample.stats.durationOrPages} · {sample.stats.citationCount} Citations
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-4 text-xs font-mono uppercase text-stone-400">Or Ingest Custom Material</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Media Format Selector (Functional tabs) */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Select Source Media Type
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { type: 'video' as SourceType, label: 'Video', icon: Video, desc: 'MP4, WebM, MOV' },
                { type: 'audio' as SourceType, label: 'Audio', icon: Music, desc: 'MP3, WAV, M4A' },
                { type: 'pdf' as SourceType, label: 'PDF Document', icon: FileText, desc: 'Papers, Reports' },
                { type: 'text' as SourceType, label: 'Text / Transcript', icon: AlignLeft, desc: 'Raw Notes, Transcripts' },
              ].map(({ type, label, icon: Icon, desc }) => {
                const isActive = activeTab === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setActiveTab(type);
                      setSelectedFile(null);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isActive
                        ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-sm'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-0.5" />
                    <span className="text-xs font-semibold">{label}</span>
                    <span className={`text-[10px] ${isActive ? 'text-stone-300' : 'text-stone-400'}`}>
                      {desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">
              Source Title / Project Name
            </label>
            <input
              type="text"
              value={sourceTitle}
              onChange={(e) => setSourceTitle(e.target.value)}
              placeholder="e.g. Stanford CS229 Lecture 12: Support Vector Machines"
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* File Upload Zone or Text Area */}
          {activeTab !== 'text' ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700">
                Upload {activeTab.toUpperCase()} File
              </label>
              <div className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center hover:border-amber-400 hover:bg-stone-50 transition-colors relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={
                    activeTab === 'video'
                      ? 'video/*'
                      : activeTab === 'audio'
                      ? 'audio/*'
                      : 'application/pdf'
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                    <Upload className="w-5 h-5 text-amber-700" />
                  </div>
                  {selectedFile ? (
                    <div>
                      <div className="text-xs font-semibold text-stone-900">{selectedFile.name}</div>
                      <div className="text-[11px] text-stone-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Ready for Ingestion
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs font-medium text-stone-700">
                        Click or drag a {activeTab} file here
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {activeTab === 'video' && 'Supports MP4, WebM, MOV'}
                        {activeTab === 'audio' && 'Supports MP3, WAV, M4A, OGG'}
                        {activeTab === 'pdf' && 'Supports PDF research papers and technical docs'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700">
                Paste Transcript or Text Content
              </label>
              <textarea
                rows={6}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste verbatim transcript, meeting notes, speech text, or document excerpt with timestamps (e.g. [01:23] speaker: ...)"
                className="w-full p-3 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>
          )}

          {/* Research Focus / User Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">
              Synthesis Focus or Guiding Themes (Optional)
            </label>
            <input
              type="text"
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="e.g. Focus on hardware latency, empirical scaling laws, and mathematical equations"
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="p-4 rounded-xl bg-stone-900 text-stone-100 space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-amber-300 font-medium">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>{processingStep}</span>
              </div>
              <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full animate-pulse w-3/4" />
              </div>
              <p className="text-[11px] text-stone-400 font-mono">
                Extracting verbatim evidence quotes, timestamps, entities, and thematic articles...
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSynthesize}
            disabled={isProcessing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-medium shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Generate LLM Wiki with Citations</span>
          </button>
        </div>
      </div>
    </div>
  );
};
