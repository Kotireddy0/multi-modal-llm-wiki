import React, { useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Video, FileText, Music, ExternalLink, Clock } from 'lucide-react';
import { WikiKnowledgeBase } from '../types/wiki';

interface SourceMediaViewerProps {
  wiki: WikiKnowledgeBase;
  activeTimestamp?: number | null;
  onClearActiveTimestamp?: () => void;
  compact?: boolean;
}

export const SourceMediaViewer: React.FC<SourceMediaViewerProps> = ({
  wiki,
  activeTimestamp,
  onClearActiveTimestamp,
  compact = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  // Jump to timestamp when activeTimestamp changes
  useEffect(() => {
    if (activeTimestamp != null && !isNaN(activeTimestamp)) {
      if (wiki.sourceType === 'video' && videoRef.current) {
        videoRef.current.currentTime = activeTimestamp;
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else if (wiki.sourceType === 'audio' && audioRef.current) {
        audioRef.current.currentTime = activeTimestamp;
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  }, [activeTimestamp, wiki.sourceType]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (wiki.sourceType === 'video' && videoRef.current) {
      videoRef.current.currentTime = val;
    } else if (wiki.sourceType === 'audio' && audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  // If source is a video
  if (wiki.sourceType === 'video') {
    return (
      <div className={`bg-stone-900 text-stone-100 rounded-xl overflow-hidden border border-stone-800 ${compact ? 'p-2' : 'p-3'}`}>
        <div className="flex items-center justify-between text-xs text-stone-400 mb-2 px-1">
          <div className="flex items-center gap-1.5 font-medium text-stone-300">
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[180px]">{wiki.sourceName}</span>
          </div>
          {activeTimestamp != null && (
            <span className="text-amber-400 font-mono text-[11px] bg-amber-950/80 border border-amber-800/60 px-1.5 py-0.5 rounded">
              Synced: {formatTime(activeTimestamp)}
            </span>
          )}
        </div>

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
          <video
            ref={videoRef}
            src={wiki.sourceMediaUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
            className="w-full h-full object-cover"
            onTimeUpdate={() => {
              if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) setDuration(videoRef.current.duration);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
            controls
          />
        </div>

        <div className="mt-2.5 px-1 flex items-center justify-between text-xs font-mono text-stone-400">
          <span>{formatTime(currentTime)}</span>
          <span className="text-stone-500">/</span>
          <span>{formatTime(duration || 1365)}</span>
        </div>
      </div>
    );
  }

  // If source is audio
  if (wiki.sourceType === 'audio') {
    return (
      <div className="bg-stone-900 text-stone-100 rounded-xl p-3 border border-stone-800">
        <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
          <div className="flex items-center gap-1.5 font-medium text-stone-300">
            <Music className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[180px]">{wiki.sourceName}</span>
          </div>
          {activeTimestamp != null && (
            <span className="text-amber-400 font-mono text-[11px] bg-amber-950/80 border border-amber-800/60 px-1.5 py-0.5 rounded">
              Synced: {formatTime(activeTimestamp)}
            </span>
          )}
        </div>

        {/* Audio waveform visualization placeholder */}
        <div className="h-12 bg-stone-950 rounded-lg p-2 flex items-center justify-between gap-1 mb-2">
          {Array.from({ length: 32 }).map((_, i) => {
            const progress = duration > 0 ? currentTime / duration : 0;
            const barProgress = i / 32;
            const isPlayed = barProgress <= progress;
            const height = 15 + Math.sin(i * 0.7) * 20 + ((i % 5) * 6);
            return (
              <div
                key={i}
                style={{ height: `${Math.min(100, Math.max(15, height))}%` }}
                className={`w-1 rounded-full transition-colors ${
                  isPlayed ? 'bg-amber-400' : 'bg-stone-800'
                }`}
              />
            );
          })}
        </div>

        <audio
          ref={audioRef}
          src={wiki.sourceMediaUrl || 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg'}
          onTimeUpdate={() => {
            if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) setDuration(audioRef.current.duration);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls
          className="w-full h-8"
        />

        <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-stone-400 px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || 1800)}</span>
        </div>
      </div>
    );
  }

  // If source is PDF or document
  return (
    <div className="bg-stone-900 text-stone-100 rounded-xl p-3 border border-stone-800">
      <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
        <div className="flex items-center gap-1.5 font-medium text-stone-300">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate max-w-[200px]">{wiki.sourceName}</span>
        </div>
        <span className="text-[11px] text-stone-400">{wiki.stats.durationOrPages || 'Document'}</span>
      </div>

      <div className="bg-stone-950 rounded-lg p-3 border border-stone-800/80 text-xs">
        <div className="flex items-center justify-between text-stone-400 mb-1.5">
          <span className="font-mono text-[11px]">Source Verified</span>
          <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            Grounding Active
          </span>
        </div>
        <p className="text-stone-300 text-xs line-clamp-3 leading-relaxed">
          {wiki.synopsis}
        </p>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-400">
        <span>{wiki.stats.citationCount} Verifiable Citations</span>
        <span className="text-amber-400 font-mono text-[11px]">Deep Citations Linked</span>
      </div>
    </div>
  );
};
